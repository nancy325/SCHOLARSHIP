<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Scholarship;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    /**
     * Return aggregated data for the student dashboard
     */
    public function show(Request $request)
    {
        try {
            $user = $request->user();

            // Base visibility for a student mirrors public + institute/university scoped items
            $visibleQuery = Scholarship::query()
                ->with(['university:id,name', 'institute:id,name'])
                ->where(function ($q) use ($user) {
                    $q->whereIn('type', ['government', 'private'])
                      ->orWhere(function ($q2) use ($user) {
                          $q2->where('type', 'university')
                             ->where('university_id', $user->institute_id ?? 0);
                      })
                      ->orWhere(function ($q3) use ($user) {
                          $q3->where('type', 'institute')
                             ->where('institute_id', $user->institute_id ?? 0);
                      });
                });

            $now = now();
            $inSevenDays = $now->copy()->addDays(7);

            $totalVisible = (clone $visibleQuery)->count();

            $deadlinesThisWeek = (clone $visibleQuery)
                ->whereNotNull('deadline')
                ->whereBetween('deadline', [$now->toDateString(), $inSevenDays->toDateString()])
                ->count();

            $nextDeadline = (clone $visibleQuery)
                ->whereNotNull('deadline')
                ->where('deadline', '>=', $now->toDateString())
                ->orderBy('deadline', 'asc')
                ->first();

            $upcomingDeadlines = (clone $visibleQuery)
                ->whereNotNull('deadline')
                ->where('deadline', '>=', $now->toDateString())
                ->orderBy('deadline', 'asc')
                ->take(5)
                ->get(['id', 'title', 'deadline']);

            $recentScholarships = (clone $visibleQuery)
                ->orderByDesc('id')
                ->take(5)
                ->get(['id', 'title', 'type', 'deadline', 'university_id', 'institute_id', 'created_at']);

            // Applications summary for the student
            $myApplicationsQuery = Application::query()->with(['scholarship:id,title,deadline'])->where('user_id', $user->id);

            $applications = [
                'total' => (clone $myApplicationsQuery)->count(),
                'pending' => (clone $myApplicationsQuery)->where('status', 'pending')->count(),
                'approved' => (clone $myApplicationsQuery)->where('status', 'approved')->count(),
                'rejected' => (clone $myApplicationsQuery)->where('status', 'rejected')->count(),
                'recent' => (clone $myApplicationsQuery)->latest()->take(5)->get([
                    'id', 'scholarship_id', 'status', 'submitted_at', 'created_at'
                ]),
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'stats' => [
                        'total_visible_scholarships' => $totalVisible,
                        'deadlines_this_week' => $deadlinesThisWeek,
                    ],
                    'next_deadline' => $nextDeadline,
                    'upcoming_deadlines' => $upcomingDeadlines,
                    'recent_scholarships' => $recentScholarships,
                    'applications' => $applications,
                ],
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load student dashboard',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}


