<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Institute;
use App\Models\Scholarship;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function getDashboardStats()
    {
        try {
            $stats = [
                'total_users' => User::count(),
                'total_institutes' => Institute::count(),
                'total_scholarships' => Scholarship::count(),
                'total_applications' => Application::count(),
                // Spec-aligned schema has no status; treat all as active for now
                'active_scholarships' => Scholarship::count(),
                'pending_applications' => Application::where('status', 'pending')->count(),
                'verified_institutes' => Institute::where('status', 'verified')->count(),
                'recent_users' => User::where('created_at', '>=', now()->subDays(30))->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent activity
     */
    public function getRecentActivity()
    {
        try {
            $activities = [];

            // Recent users
            $recentUsers = User::latest()->take(5)->get();
            foreach ($recentUsers as $user) {
                $activities[] = [
                    'type' => 'user',
                    'action' => 'New user registered',
                    'description' => $user->name . ' registered',
                    'time' => $user->created_at->diffForHumans(),
                    'created_at' => $user->created_at
                ];
            }

            // Recent institutes
            $recentInstitutes = Institute::latest()->take(5)->get();
            foreach ($recentInstitutes as $institute) {
                $activities[] = [
                    'type' => 'institute',
                    'action' => 'Institute profile updated',
                    'description' => $institute->name . ' profile updated',
                    'time' => $institute->updated_at->diffForHumans(),
                    'created_at' => $institute->updated_at
                ];
            }

            // Recent scholarships
            $recentScholarships = Scholarship::latest()->take(5)->get();
            foreach ($recentScholarships as $scholarship) {
                $activities[] = [
                    'type' => 'scholarship',
                    'action' => 'New scholarship added',
                    'description' => $scholarship->title . ' added',
                    'time' => $scholarship->created_at->diffForHumans(),
                    'created_at' => $scholarship->created_at
                ];
            }

            // Recent applications
            $recentApplications = Application::latest()->take(5)->get();
            foreach ($recentApplications as $application) {
                $activities[] = [
                    'type' => 'application',
                    'action' => 'Application submitted',
                    'description' => 'Application for ' . $application->scholarship->title,
                    'time' => $application->created_at->diffForHumans(),
                    'created_at' => $application->created_at
                ];
            }

            // Sort by created_at desc
            usort($activities, function($a, $b) {
                return $b['created_at'] <=> $a['created_at'];
            });

            return response()->json([
                'success' => true,
                'data' => array_slice($activities, 0, 10) // Return top 10
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recent activity',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get analytics data
     */
    public function getAnalytics()
    {
        try {
            $analytics = [
                'user_growth' => $this->getUserGrowthData(),
                'application_trends' => $this->getApplicationTrends(),
                'scholarship_distribution' => $this->getScholarshipDistribution(),
                'institute_performance' => $this->getInstitutePerformance(),
                'top_fields' => $this->getTopFields(),
            ];

            return response()->json([
                'success' => true,
                'data' => $analytics
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch analytics data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function getUserGrowthData()
    {
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $months[] = [
                'month' => $date->format('M'),
                'users' => User::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'institutes' => Institute::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'scholarships' => Scholarship::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
            ];
        }
        return $months;
    }

    private function getApplicationTrends()
    {
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $months[] = [
                'month' => $date->format('M'),
                'applications' => Application::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'approved' => Application::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->where('status', 'approved')
                    ->count(),
                'rejected' => Application::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->where('status', 'rejected')
                    ->count(),
                'pending' => Application::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->where('status', 'pending')
                    ->count(),
            ];
        }
        return $months;
    }

    private function getScholarshipDistribution()
    {
        $distribution = Scholarship::select('type', DB::raw('count(*) as count'))
            ->groupBy('type')
            ->get()
            ->map(function ($item) {
                $colors = [
                    'merit_based' => '#3B82F6',
                    'need_based' => '#10B981',
                    'project_based' => '#8B5CF6',
                    'athletic' => '#F59E0B'
                ];
                
                return [
                    'name' => ucfirst(str_replace('_', ' ', $item->type)),
                    'value' => $item->count,
                    'color' => $colors[$item->type] ?? '#6B7280'
                ];
            });

        return $distribution;
    }

    private function getInstitutePerformance()
    {
        return Institute::withCount('scholarships')
            ->orderBy('scholarships_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($institute) {
                return [
                    'name' => $institute->name,
                    'students' => $institute->students,
                    'scholarships' => $institute->scholarships_count,
                    'rating' => $institute->rating,
                ];
            });
    }

    private function getTopFields()
    {
        return Scholarship::select('field', DB::raw('count(*) as applications'))
            ->withCount('applications')
            ->groupBy('field')
            ->orderBy('applications_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($scholarship) {
                return [
                    'field' => $scholarship->field,
                    'applications' => $scholarship->applications_count,
                    'successRate' => rand(65, 85), // Mock success rate for now
                ];
            });
    }
}