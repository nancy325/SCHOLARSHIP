<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Web\ScholarshipController as PublicScholarshipController;
use App\Models\Institute;
use App\Models\Scholarship;
use App\Models\University;
use App\Services\ScholarshipService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Support\Options;

class ScholarshipController extends Controller
{
    public function __construct(private ScholarshipService $service)
    {
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $query = Scholarship::query()
            ->with(['university:id,name', 'institute:id,name'])
            ->withCount([
                'applications as applications_count' => fn ($q) => $q->where('application_status', '!=', 'withdrawn'),
                'applications as pending_count' => fn ($q) => $q->where('application_status', 'pending'),
            ]);

        $status = $request->query('status', 'active');
        if ($status !== 'all') {
            $query->where('RecStatus', $status === 'inactive' ? 'inactive' : 'active');
        }
        $this->service->applyRoleScoping($query, $user);

        if ($search = $request->query('search')) {
            $query->where('title', 'like', "%{$search}%");
        }
        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        return view('admin.scholarships.index', [
            'scholarships' => $query->orderByDesc('id')->paginate(15)->withQueryString(),
            'types' => PublicScholarshipController::TYPES,
        ]);
    }

    public function create(Request $request)
    {
        $type = $this->defaultType($request);

        return view('admin.scholarships.form', $this->formData($request, new Scholarship([
            'type' => $type,
            'start_date' => today(),
            'gender' => 'any',
            'award_frequency' => 'per_year',
            'own_students_only' => in_array($type, ['university', 'institute'], true),
        ])));
    }

    public function store(Request $request)
    {
        $data = $this->validated($request, true);

        try {
            $scholarship = $this->service->createScholarship($data, $request->user());
        } catch (\Throwable $e) {
            return back()->withInput()->with('error', $e->getMessage());
        }

        return redirect()->route('admin.scholarships.index')
            ->with('success', 'Scholarship "' . $scholarship->title . '" created.');
    }

    public function edit(Request $request, Scholarship $scholarship)
    {
        $this->authorizeScholarship($request, $scholarship);

        return view('admin.scholarships.form', $this->formData($request, $scholarship));
    }

    public function update(Request $request, Scholarship $scholarship)
    {
        $this->authorizeScholarship($request, $scholarship);
        $data = $this->validated($request, false);

        try {
            $this->service->updateScholarship($scholarship->id, $data, $request->user());
        } catch (\Throwable $e) {
            return back()->withInput()->with('error', $e->getMessage());
        }

        return redirect()->route('admin.scholarships.index')->with('success', 'Scholarship updated.');
    }

    public function destroy(Request $request, Scholarship $scholarship)
    {
        $this->authorizeScholarship($request, $scholarship);

        try {
            $this->service->deleteScholarship($scholarship->id, $request->user());
        } catch (\Throwable $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()->route('admin.scholarships.index')->with('success', 'Scholarship deactivated.');
    }

    private function validated(Request $request, bool $creating): array
    {
        $user = $request->user();
        $rules = [
            'title' => ['required', 'string', 'max:150'],
            'description' => ['required', 'string'],
            'eligibility' => ['nullable', 'string'],
            'start_date' => ['nullable', 'date'],
            'deadline' => array_merge(['required', 'date', 'after_or_equal:start_date'], $creating ? ['after_or_equal:today'] : []),
            'apply_link' => ['nullable', 'url', 'max:255'],
            'provider' => ['nullable', 'string', 'max:255'],
            'award_amount' => ['nullable', 'integer', 'min:0', 'max:100000000'],
            'award_frequency' => ['nullable', 'required_with:award_amount', Rule::in(array_keys(Options::AWARD_FREQUENCIES))],
            'benefits' => ['nullable', 'string', 'max:5000'],
            'education_levels' => ['nullable', 'array'],
            'education_levels.*' => [Rule::in(array_keys(Options::EDUCATION_LEVELS))],
            'max_family_income' => ['nullable', 'integer', 'min:0', 'max:100000000'],
            'min_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'gender' => ['nullable', Rule::in(['any', 'female', 'male'])],
            'social_categories' => ['nullable', 'array'],
            'social_categories.*' => [Rule::in(array_keys(Options::SOCIAL_CATEGORIES))],
            'state' => ['nullable', Rule::in(Options::STATES)],
            'own_students_only' => ['nullable', 'boolean'],
            'documents_required' => ['nullable', 'string', 'max:5000'],
        ];

        if ($user->isPlatformAdmin()) {
            $rules += [
                'type' => ['required', Rule::in(array_keys(PublicScholarshipController::TYPES))],
                'university_id' => ['nullable', 'required_if:type,university', 'integer', 'exists:universities,id'],
                'institute_id' => ['nullable', 'required_if:type,institute', 'integer', 'exists:institutes,id'],
            ];
        }
        if (!$creating) {
            $rules['RecStatus'] = ['required', Rule::in(['active', 'inactive'])];
        }

        // "2,50,000" -> 250000
        foreach (['award_amount', 'max_family_income'] as $money) {
            if (is_string($request->input($money))) {
                $digits = preg_replace('/[^\d]/', '', $request->input($money));
                $request->merge([$money => $digits === '' ? null : $digits]);
            }
        }

        $data = $request->validate($rules);
        $data['education_levels'] = $data['education_levels'] ?? [];
        $data['social_categories'] = $data['social_categories'] ?? [];
        $data['own_students_only'] = $request->boolean('own_students_only');
        $data['gender'] = $data['gender'] ?? 'any';

        // `eligibility` is NOT NULL in the scholarships table
        $data['eligibility'] = $data['eligibility'] ?? '';

        // Keep the link fields consistent with the chosen type
        if ($user->isPlatformAdmin()) {
            if (in_array($data['type'], ['government', 'private'], true)) {
                $data['university_id'] = null;
                $data['institute_id'] = null;
            } elseif ($data['type'] === 'university') {
                $data['institute_id'] = null;
            } elseif ($data['type'] === 'institute' && !empty($data['institute_id'])) {
                $data['university_id'] = Institute::whereKey($data['institute_id'])->value('university_id');
            }
        }

        return $data;
    }

    private function formData(Request $request, Scholarship $scholarship): array
    {
        return [
            'scholarship' => $scholarship,
            'types' => PublicScholarshipController::TYPES,
            'universities' => University::where('RecStatus', 'active')->orderBy('name')->get(['id', 'name']),
            'institutes' => Institute::where('RecStatus', 'active')->orderBy('name')->get(['id', 'name', 'university_id']),
            'canChooseType' => $request->user()->isPlatformAdmin(),
            'levels' => Options::EDUCATION_LEVELS,
            'socialCategories' => Options::SOCIAL_CATEGORIES,
            'states' => Options::STATES,
            'frequencies' => Options::AWARD_FREQUENCIES,
        ];
    }

    private function defaultType(Request $request): string
    {
        return match ($request->user()->role) {
            'university_admin' => 'university',
            'institute_admin' => 'institute',
            default => 'government',
        };
    }

    private function authorizeScholarship(Request $request, Scholarship $scholarship): void
    {
        $query = Scholarship::whereKey($scholarship->id);
        $this->service->applyRoleScoping($query, $request->user());
        abort_unless($query->exists(), 403, 'You cannot manage this scholarship.');
    }
}
