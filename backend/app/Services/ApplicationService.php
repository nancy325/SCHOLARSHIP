<?php

namespace App\Services;

use App\Models\Application;
use App\Models\Scholarship;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class ApplicationService
{
    /**
     * Get user's application history
     *
     * @param User $user
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getUserApplications(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return Application::where('user_id', $user->id)
            ->with(['scholarship:id,title,type,deadline,apply_link'])
            ->orderByDesc('applied_at')
            ->paginate($perPage);
    }

    /**
     * Get a single application by ID
     *
     * @param int $id
     * @param User $user
     * @return Application
     * @throws \Exception
     */
    public function getApplicationById(int $id, User $user): Application
    {
        $application = Application::with(['scholarship:id,title,type,deadline,apply_link'])->findOrFail($id);

        // Check if user can view this application (only their own)
        if ($application->user_id !== $user->id) {
            throw new \Exception('You do not have permission to view this application');
        }

        return $application;
    }

    /**
     * Record that a user applied to a scholarship
     *
     * @param int $scholarshipId
     * @param User $user
     * @return Application
     * @throws \Exception
     */
    public function recordApplication(int $scholarshipId, User $user): Application
    {
        // Check if scholarship exists and is still accepting applications
        $scholarship = Scholarship::findOrFail($scholarshipId);

        if ($scholarship->deadline && $scholarship->deadline->isPast()) {
            throw new \Exception('This scholarship is no longer accepting applications');
        }

        // Check if user already applied to this scholarship
        $existingApplication = Application::where('user_id', $user->id)
            ->where('scholarship_id', $scholarshipId)
            ->first();

        if ($existingApplication) {
            throw new \Exception('You have already applied to this scholarship');
        }

        // Record the application
        return Application::create([
            'user_id' => $user->id,
            'scholarship_id' => $scholarshipId,
            'applied_at' => now(),
        ]);
    }

    /**
     * Delete an application record
     *
     * @param int $id
     * @param User $user
     * @return bool
     * @throws \Exception
     */
    public function deleteApplication(int $id, User $user): bool
    {
        $application = Application::findOrFail($id);

        // Check if user can delete this application (only their own)
        if ($application->user_id !== $user->id) {
            throw new \Exception('You do not have permission to delete this application');
        }

        return $application->delete();
    }

    /**
     * Get application statistics for a user
     *
     * @param User $user
     * @return array
     */
    public function getUserApplicationStats(User $user): array
    {
        $totalApplications = Application::where('user_id', $user->id)->count();
        
        $recentApplications = Application::where('user_id', $user->id)
            ->where('applied_at', '>=', now()->subDays(30))
            ->count();

        $applicationsByType = Application::where('user_id', $user->id)
            ->join('scholarships', 'applications.scholarship_id', '=', 'scholarships.id')
            ->selectRaw('scholarships.type, COUNT(*) as count')
            ->groupBy('scholarships.type')
            ->pluck('count', 'type')
            ->toArray();

        return [
            'total_applications' => $totalApplications,
            'recent_applications' => $recentApplications,
            'applications_by_type' => $applicationsByType,
        ];
    }
}