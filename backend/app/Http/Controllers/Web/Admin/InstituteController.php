<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Institute;
use App\Models\University;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class InstituteController extends Controller
{
    public const TYPES = [
        'engineering' => 'Engineering',
        'medical' => 'Medical',
        'management' => 'Management',
        'arts_science' => 'Arts & Science',
        'pharmacy' => 'Pharmacy',
        'law' => 'Law',
        'technical_institute' => 'Technical Institute',
        'community_college' => 'Community College',
        'other' => 'Other',
    ];

    public function index(Request $request)
    {
        $query = Institute::query()->with('university:id,name');

        $rec = $request->query('rec', 'active');
        if ($rec !== 'all') {
            $query->where('RecStatus', $rec === 'inactive' ? 'inactive' : 'active');
        }
        if ($search = $request->query('search')) {
            $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
        }
        if ($universityId = $request->integer('university')) {
            $query->where('university_id', $universityId);
        }

        return view('admin.institutes.index', [
            'institutes' => $query->orderBy('name')->paginate(15)->withQueryString(),
            'universities' => University::orderBy('name')->get(['id', 'name']),
            'types' => self::TYPES,
        ]);
    }

    public function create()
    {
        return view('admin.institutes.form', $this->formData(new Institute(['status' => 'verified'])));
    }

    public function store(Request $request)
    {
        $institute = new Institute($this->validated($request));
        $institute->forceFill(['created_by' => $request->user()->id, 'RecStatus' => 'active'])->save();

        return redirect()->route('admin.institutes.index')->with('success', 'Institute "' . $institute->name . '" created.');
    }

    public function edit(Institute $institute)
    {
        return view('admin.institutes.form', $this->formData($institute));
    }

    public function update(Request $request, Institute $institute)
    {
        $institute->update($this->validated($request, $institute));

        return redirect()->route('admin.institutes.index')->with('success', 'Institute updated.');
    }

    public function destroy(Institute $institute)
    {
        $institute->update(['RecStatus' => 'inactive']);

        return redirect()->route('admin.institutes.index')->with('success', 'Institute deactivated.');
    }

    private function formData(Institute $institute): array
    {
        return [
            'institute' => $institute,
            'universities' => University::where('RecStatus', 'active')->orderBy('name')->get(['id', 'name']),
            'types' => self::TYPES,
            'statuses' => UniversityController::STATUSES,
        ];
    }

    private function validated(Request $request, ?Institute $institute = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'university_id' => ['required', 'exists:universities,id'],
            'type' => ['required', 'string', 'max:50'],
            'status' => ['required', Rule::in(UniversityController::STATUSES)],
            'email' => ['required', 'email', Rule::unique('institutes', 'email')->ignore($institute?->id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'website' => ['nullable', 'url'],
            'address' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'established' => ['nullable', 'string', 'max:10'],
            'accreditation' => ['nullable', 'string', 'max:50'],
            'students' => ['nullable', 'integer', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:20'],
        ] + ($institute ? ['RecStatus' => ['required', Rule::in(['active', 'inactive'])]] : []));
    }
}
