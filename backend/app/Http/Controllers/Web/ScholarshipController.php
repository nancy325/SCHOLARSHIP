<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Scholarship;
use App\Services\EligibilityService;
use App\Support\Options;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ScholarshipController extends Controller
{
    public const TYPES = [
        'government' => 'Government',
        'private' => 'Private',
        'university' => 'University',
        'institute' => 'Institute',
    ];

    public function __construct(private EligibilityService $eligibility)
    {
    }

    /** All active scholarships, straight from the database */
    public static function baseQuery(): Builder
    {
        return Scholarship::query()
            ->with(['university:id,name', 'institute:id,name,university_id'])
            ->where('RecStatus', 'active');
    }

    /**
     * Shared by the home page and the scholarships page:
     * filters + (for students) eligibility.
     */
    public function listing(Request $request, bool $defaultEligible): array
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'type' => ['nullable', 'in:' . implode(',', array_keys(self::TYPES))],
            'level' => ['nullable', 'in:' . implode(',', array_keys(Options::EDUCATION_LEVELS))],
            'status' => ['nullable', 'in:open,all'],
            'sort' => ['nullable', 'in:deadline,newest,amount'],
            'show' => ['nullable', 'in:eligible,all'],
        ]);

        $user = $request->user();
        $isStudent = $user && !$user->isAdmin();
        $show = $isStudent ? ($filters['show'] ?? ($defaultEligible ? 'eligible' : 'all')) : 'all';

        $query = self::baseQuery();

        if (!empty($filters['search'])) {
            $term = $filters['search'];
            $query->where(fn ($q) => $q->where('title', 'like', "%{$term}%")
                ->orWhere('provider', 'like', "%{$term}%")
                ->orWhere('description', 'like', "%{$term}%")
                ->orWhere('eligibility', 'like', "%{$term}%"));
        }
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }
        if (!empty($filters['level'])) {
            $query->where(fn ($q) => $q->whereNull('education_levels')->orWhere('education_levels', 'like', '%,' . $filters['level'] . ',%'));
        }
        if (($filters['status'] ?? 'open') === 'open') {
            $query->whereDate('deadline', '>=', today());
        }

        $eligibleIds = [];
        $eligibleCount = 0;
        if ($isStudent) {
            $eligibleIds = $this->eligibility->applyScope(self::baseQuery(), $user)->pluck('id')->all();
            $eligibleCount = ($filters['status'] ?? 'open') === 'open'
                ? self::baseQuery()->whereIn('id', $eligibleIds ?: [0])->whereDate('deadline', '>=', today())->count()
                : count($eligibleIds);
            if ($show === 'eligible') {
                $query->whereIn('id', $eligibleIds ?: [0]);
            }
        }

        match ($filters['sort'] ?? 'deadline') {
            'newest' => $query->orderByDesc('id'),
            'amount' => $query->orderByDesc('award_amount'),
            default => $query->orderBy('deadline'),
        };

        return [
            'scholarships' => $query->paginate(12)->withQueryString(),
            'filters' => $filters,
            'show' => $show,
            'isStudent' => $isStudent,
            'eligibleIds' => $eligibleIds,
            'eligibleCount' => $eligibleCount,
            'appliedIds' => $user
                ? $user->applications()->where('application_status', '!=', 'withdrawn')->pluck('scholarship_id')->all()
                : [],
            'missingFacts' => $isStudent ? $this->eligibility->missingFacts($user) : [],
            'types' => self::TYPES,
            'levels' => Options::EDUCATION_LEVELS,
        ];
    }

    public function index(Request $request)
    {
        return view('scholarships.index', $this->listing($request, true));
    }

    public function show(Request $request, int $scholarship)
    {
        $user = $request->user();
        $item = self::baseQuery()->findOrFail($scholarship);

        $application = $user ? $user->applications()->where('scholarship_id', $item->id)->first() : null;
        $check = $user && !$user->isAdmin() ? $this->eligibility->check($item, $user) : null;

        $related = self::baseQuery()
            ->where('id', '!=', $item->id)
            ->where('type', $item->type)
            ->whereDate('deadline', '>=', today())
            ->orderBy('deadline')
            ->limit(3)
            ->get();

        return view('scholarships.show', [
            'scholarship' => $item,
            'application' => $application,
            'check' => $check,
            'related' => $related,
            'types' => self::TYPES,
        ]);
    }
}
