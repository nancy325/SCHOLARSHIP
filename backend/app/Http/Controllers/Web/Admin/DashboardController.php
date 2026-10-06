<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\Institute;
use App\Models\Scholarship;
use App\Models\University;
use App\Models\User;
use App\Services\ScholarshipService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use Concerns;

    public function index(Request $request, ScholarshipService $service)
    {
        $user = $request->user();

        $scholarships = Scholarship::query()->where('RecStatus', 'active');
        $service->applyRoleScoping($scholarships, $user);

        $applications = $this->applicationsFor($user);

        $stats = [
            'scholarships' => (clone $scholarships)->count(),
            'open_scholarships' => (clone $scholarships)->whereDate('deadline', '>=', today())->count(),
            'applications' => (clone $applications)->where('application_status', '!=', 'withdrawn')->count(),
            'pending' => (clone $applications)->where('application_status', 'pending')->count(),
            'approved' => (clone $applications)->where('application_status', 'approved')->count(),
            'rejected' => (clone $applications)->where('application_status', 'rejected')->count(),
        ];

        if ($user->isPlatformAdmin()) {
            $stats += [
                'students' => User::where('role', 'student')->where('RecStatus', 'active')->count(),
                'universities' => University::where('RecStatus', 'active')->count(),
                'institutes' => Institute::where('RecStatus', 'active')->count(),
                'feedback' => Feedback::count(),
            ];
        }

        $recentApplications = (clone $applications)
            ->with(['user:id,name,email', 'scholarship:id,title'])
            ->latest('application_date')
            ->limit(6)
            ->get();

        $closingSoon = (clone $scholarships)
            ->withCount(['applications as pending_count' => fn ($q) => $q->where('application_status', 'pending')])
            ->whereBetween('deadline', [today(), today()->addDays(30)])
            ->orderBy('deadline')
            ->limit(5)
            ->get();

        return view('admin.dashboard', compact('stats', 'recentApplications', 'closingSoon'));
    }

    /** Pending-application count for the sidebar badge. */
    public function pendingCountFor(User $user): int
    {
        return $this->applicationsFor($user)->where('application_status', 'pending')->count();
    }
}
