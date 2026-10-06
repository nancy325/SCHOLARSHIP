<?php

namespace App\Http\Controllers\Web\Student;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Web\ScholarshipController;
use App\Services\EligibilityService;
use App\Services\ProfileService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private EligibilityService $eligibility,
        private ProfileService $profiles,
    ) {
    }

    public function index(Request $request)
    {
        $user = $request->user();

        $applications = $user->applications()->with('scholarship')->latest('application_date')->get();
        $counts = [
            'total' => $applications->where('application_status', '!=', 'withdrawn')->count(),
            'pending' => $applications->where('application_status', 'pending')->count(),
            'approved' => $applications->where('application_status', 'approved')->count(),
            'rejected' => $applications->where('application_status', 'rejected')->count(),
        ];
        $appliedIds = $applications->where('application_status', '!=', 'withdrawn')->pluck('scholarship_id')->all();

        $eligibleOpen = $this->eligibility->applyScope(ScholarshipController::baseQuery(), $user)
            ->whereDate('deadline', '>=', today());

        $eligibleCount = (clone $eligibleOpen)->count();
        $eligible = (clone $eligibleOpen)->whereNotIn('id', $appliedIds ?: [0])->orderBy('deadline')->limit(6)->get();
        $closingSoon = (clone $eligibleOpen)->whereNotIn('id', $appliedIds ?: [0])
            ->whereDate('deadline', '<=', today()->addDays(14))->count();

        return view('student.dashboard', [
            'user' => $user,
            'recentApplications' => $applications->take(5),
            'counts' => $counts,
            'eligible' => $eligible,
            'eligibleCount' => $eligibleCount,
            'eligibleIds' => $eligible->pluck('id')->all(),
            'closingSoon' => $closingSoon,
            'completion' => $this->profiles->completion($user),
            'missingFacts' => $this->eligibility->missingFacts($user),
            'facts' => $this->eligibility->facts($user),
        ]);
    }
}
