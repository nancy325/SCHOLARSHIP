<?php

namespace App\Http\Controllers\Web\Student;

use App\Http\Controllers\Controller;
use App\Models\ScholarshipApplication;
use App\Http\Controllers\Web\ScholarshipController;
use App\Services\EligibilityService;
use App\Services\ProfileService;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function __construct(
        private EligibilityService $eligibility,
        private ProfileService $profiles,
    ) {
    }

    public function index(Request $request)
    {
        $status = $request->query('status');
        $query = $request->user()->applications()
            ->with(['scholarship.university:id,name', 'scholarship.institute:id,name'])
            ->latest('application_date');

        if (in_array($status, ScholarshipApplication::STATUSES, true)) {
            $query->where('application_status', $status);
        }

        return view('student.applications.index', [
            'applications' => $query->paginate(10)->withQueryString(),
            'status' => $status,
        ]);
    }

    public function create(Request $request, int $scholarship)
    {
        $user = $request->user();
        $item = ScholarshipController::baseQuery()->findOrFail($scholarship);

        if ($redirect = $this->guardApply($user, $item)) {
            return $redirect;
        }

        return view('student.applications.create', [
            'scholarship' => $item,
            'check' => $this->eligibility->check($item, $user),
            'profile' => $this->profiles->getProfile($user),
        ]);
    }

    public function store(Request $request, int $scholarship)
    {
        $user = $request->user();
        $item = ScholarshipController::baseQuery()->findOrFail($scholarship);

        if ($redirect = $this->guardApply($user, $item)) {
            return $redirect;
        }

        $data = $request->validate([
            'notes' => ['required', 'string', 'min:30', 'max:3000'],
            'confirm' => ['accepted'],
        ], [
            'notes.required' => 'Please write a short statement for your application.',
            'notes.min' => 'Your statement should be at least 30 characters.',
            'confirm.accepted' => 'Please confirm that the information you provided is correct.',
        ]);

        // Re-use a previously withdrawn application (unique user + scholarship)
        ScholarshipApplication::updateOrCreate(
            ['user_id' => $user->id, 'scholarship_id' => $item->id],
            [
                'application_status' => 'pending',
                'application_date' => now(),
                'status_updated_at' => now(),
                'notes' => $data['notes'],
                'admin_remarks' => null,
                'reviewed_by' => null,
            ]
        );

        return redirect()->route('student.applications.index')
            ->with('success', 'Your application for "' . $item->title . '" has been submitted.');
    }

    public function withdraw(Request $request, ScholarshipApplication $application)
    {
        abort_unless($application->user_id === $request->user()->id, 404);

        if (!$application->isPending()) {
            return back()->with('error', 'Only pending applications can be withdrawn.');
        }

        $application->update([
            'application_status' => 'withdrawn',
            'status_updated_at' => now(),
        ]);

        return back()->with('success', 'Your application has been withdrawn.');
    }

    private function guardApply($user, $scholarship)
    {
        $existing = $user->applications()->where('scholarship_id', $scholarship->id)->first();

        if ($existing && $existing->application_status !== 'withdrawn') {
            return redirect()->route('scholarships.show', $scholarship)
                ->with('error', 'You have already applied for this scholarship.');
        }

        if (!$scholarship->isOpen()) {
            return redirect()->route('scholarships.show', $scholarship)
                ->with('error', 'Applications for this scholarship are closed.');
        }

        if (!$this->eligibility->check($scholarship, $user)['eligible']) {
            return redirect()->route('scholarships.show', $scholarship)
                ->with('error', 'You do not meet the eligibility criteria for this scholarship.');
        }

        return null;
    }
}
