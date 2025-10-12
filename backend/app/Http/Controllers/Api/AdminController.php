<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Institute;
use App\Models\Scholarship;
use App\Models\University;

class AdminController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $totalUsers = User::count();
            $totalInstitutes = Institute::count();
            $totalUniversities = University::count();
            $activeScholarships = Scholarship::where('deadline', '>=', now())->count();
            $totalScholarships = Scholarship::count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total_users' => $totalUsers,
                    'total_institutes' => $totalInstitutes,
                    'total_universities' => $totalUniversities,
                    'active_scholarships' => $activeScholarships,
                    'total_scholarships' => $totalScholarships,
                ],
                'message' => 'Dashboard statistics retrieved successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve dashboard statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent activity
     */
    public function recentActivity(Request $request): JsonResponse
    {
        try {
            $activities = [];

            // Recent user registrations
            $recentUsers = User::orderBy('created_at', 'desc')->limit(5)->get();
            foreach ($recentUsers as $user) {
                $activities[] = [
                    'type' => 'user',
                    'action' => "New user registered: {$user->name}",
                    'time' => $user->created_at->diffForHumans(),
                    'created_at' => $user->created_at->toISOString(),
                ];
            }

            // Recent scholarships created
            $recentScholarships = Scholarship::with('university:id,name', 'institute:id,name')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();
            foreach ($recentScholarships as $scholarship) {
                $activities[] = [
                    'type' => 'scholarship',
                    'action' => "New scholarship created: {$scholarship->title}",
                    'time' => $scholarship->created_at->diffForHumans(),
                    'created_at' => $scholarship->created_at->toISOString(),
                ];
            }

            // Recent institutes created
            $recentInstitutes = Institute::orderBy('created_at', 'desc')->limit(5)->get();
            foreach ($recentInstitutes as $institute) {
                $activities[] = [
                    'type' => 'institute',
                    'action' => "New institute registered: {$institute->name}",
                    'time' => $institute->created_at->diffForHumans(),
                    'created_at' => $institute->created_at->toISOString(),
                ];
            }

            // Sort activities by created_at descending
            usort($activities, function ($a, $b) {
                return strtotime($b['created_at']) - strtotime($a['created_at']);
            });

            // Take top 10
            $activities = array_slice($activities, 0, 10);

            return response()->json([
                'success' => true,
                'data' => $activities,
                'message' => 'Recent activity retrieved successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve recent activity',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
