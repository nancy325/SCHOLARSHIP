<?php

namespace App\Services;

use App\Models\Scholarship;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class ScholarshipService
{
    /**
     * Get scholarships with filters and role-based scoping
     *
     * @param array $filters
     * @param User|null $user
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getScholarships(array $filters, ?User $user = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Scholarship::query()->with(['university:id,name', 'institute:id,name', 'creator:id,name']);

        // Filter by RecStatus='active' by default (soft delete)
        if (empty($filters['include_inactive']) || $filters['include_inactive'] !== 'true') {
            $query->where('RecStatus', 'active');
        }

        // Apply filters
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }
        if (!empty($filters['university_id'])) {
            $query->where('university_id', (int) $filters['university_id']);
        }
        if (!empty($filters['institute_id'])) {
            $query->where('institute_id', (int) $filters['institute_id']);
        }
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['search']}%")
                  ->orWhere('description', 'like', "%{$filters['search']}%");
            });
        }

        // Apply role-based scoping
        $this->applyRoleScoping($query, $user);

        return $query->orderByDesc('id')->paginate($perPage);
    }

    /**
     * Get a single scholarship by ID
     *
     * @param int $id
     * @return Scholarship
     */
    public function getScholarshipById(int $id): Scholarship
    {
        return Scholarship::with(['university:id,name', 'institute:id,name', 'creator:id,name'])
            ->where('RecStatus', 'active')
            ->findOrFail($id);
    }

    /**
     * Create a new scholarship
     *
     * @param array $data
     * @param User $user
     * @return Scholarship
     * @throws \Exception
     */
    public function createScholarship(array $data, User $user): Scholarship
    {
        // Validate role constraints
        $this->validateRoleConstraints($user, $data, 'create');

        // Apply role-based defaults
        $data = $this->applyRoleDefaults($user, $data);

        // Add creator and set RecStatus
        $data['created_by'] = $user->id;
        $data['RecStatus'] = $data['RecStatus'] ?? 'active';

        return Scholarship::create($data);
    }

    /**
     * Update an existing scholarship
     *
     * @param int $id
     * @param array $data
     * @param User $user
     * @return Scholarship
     * @throws \Exception
     */
    public function updateScholarship(int $id, array $data, User $user): Scholarship
    {
        $scholarship = Scholarship::findOrFail($id);

        // Check if user can update this scholarship
        $this->checkUpdatePermission($user, $scholarship);

        // Validate role constraints for updates
        $this->validateRoleConstraints($user, $data, 'update', $scholarship);

        $scholarship->update($data);

        return $scholarship->fresh(['university:id,name', 'institute:id,name', 'creator:id,name']);
    }

    /**
     * Delete a scholarship
     *
     * @param int $id
     * @param User $user
     * @return bool
     * @throws \Exception
     */
    public function deleteScholarship(int $id, User $user): bool
    {
        $scholarship = Scholarship::findOrFail($id);

        // Check if user can delete this scholarship
        $this->checkDeletePermission($user, $scholarship);

        // Soft delete: set RecStatus to 'inactive' instead of actually deleting
        $scholarship->update(['RecStatus' => 'inactive']);

        return true;
    }

    /**
     * Apply role-based scoping to query
     *
     * @param Builder $query
     * @param User|null $user
     * @return void
     */
    private function applyRoleScoping(Builder $query, ?User $user): void
    {
        if (!$user) {
            // Public: only government and private scholarships
            $query->whereIn('type', ['government', 'private']);
            return;
        }

        switch ($user->role) {
            case 'super_admin':
            case 'admin':
                // No restrictions - see all scholarships
                break;

            case 'university_admin':
                $allowedUniversityId = $this->getUserUniversityId($user);
                $query->where(function ($q) use ($allowedUniversityId) {
                    $q->where(function ($uq) use ($allowedUniversityId) {
                        $uq->where('type', 'university')
                           ->where('university_id', $allowedUniversityId);
                    })
                    ->orWhere(function ($iq) use ($allowedUniversityId) {
                        $iq->where('type', 'institute')
                           ->whereIn('institute_id', function ($sub) use ($allowedUniversityId) {
                               $sub->from('institutes')
                                   ->select('id')
                                   ->where('university_id', $allowedUniversityId);
                           });
                    });
                });
                break;

            case 'institute_admin':
                $query->where('institute_id', $user->institute_id ?? 0);
                break;

            case 'student':
            default:
                // Students see public scholarships + their university/institute scholarships
                $query->where(function ($q) use ($user) {
                    $q->whereIn('type', ['government', 'private'])
                      ->orWhere(function ($q2) use ($user) {
                          $q2->where('type', 'university')
                             ->where('university_id', $user->university_id ?? 0);
                      })
                      ->orWhere(function ($q3) use ($user) {
                          $q3->where('type', 'institute')
                             ->where('institute_id', $user->institute_id ?? 0);
                      });
                });
                break;
        }
    }

    /**
     * Validate role-based constraints
     *
     * @param User $user
     * @param array $data
     * @param string $action
     * @param Scholarship|null $scholarship
     * @return void
     * @throws \Exception
     */
    private function validateRoleConstraints(User $user, array $data, string $action, ?Scholarship $scholarship = null): void
    {
        if ($user->role === 'university_admin') {
            $allowedUniversityId = $this->getUserUniversityId($user);

            if (!$allowedUniversityId) {
                throw new \Exception('User is not associated with a university');
            }

            // University admins can only create/update university scholarships
            if (isset($data['type']) && $data['type'] !== 'university') {
                throw new \Exception('University admins can only manage university scholarships');
            }

            // Ensure university_id matches their university
            if (isset($data['university_id']) && (int) $data['university_id'] !== (int) $allowedUniversityId) {
                throw new \Exception('You can only manage scholarships for your university');
            }
        }

        if ($user->role === 'institute_admin') {
            $allowedInstituteId = $user->institute_id ?? 0;

            if (!$allowedInstituteId) {
                throw new \Exception('User is not associated with an institute');
            }

            // Institute admins can only create/update institute scholarships
            if (isset($data['type']) && $data['type'] !== 'institute') {
                throw new \Exception('Institute admins can only manage institute scholarships');
            }

            // Ensure institute_id matches their institute
            if (isset($data['institute_id']) && (int) $data['institute_id'] !== (int) $allowedInstituteId) {
                throw new \Exception('You can only manage scholarships for your institute');
            }
        }
    }

    /**
     * Apply role-based defaults to data
     *
     * @param User $user
     * @param array $data
     * @return array
     */
    private function applyRoleDefaults(User $user, array $data): array
    {
        if ($user->role === 'university_admin') {
            $allowedUniversityId = $this->getUserUniversityId($user);
            
            if (!isset($data['university_id'])) {
                $data['university_id'] = $allowedUniversityId;
            }
            
            if (!isset($data['type'])) {
                $data['type'] = 'university';
            }
        }

        if ($user->role === 'institute_admin') {
            if (!isset($data['institute_id'])) {
                $data['institute_id'] = $user->institute_id;
            }
            
            if (!isset($data['type'])) {
                $data['type'] = 'institute';
            }
        }

        return $data;
    }

    /**
     * Check if user can update the scholarship
     *
     * @param User $user
     * @param Scholarship $scholarship
     * @return void
     * @throws \Exception
     */
    private function checkUpdatePermission(User $user, Scholarship $scholarship): void
    {
        if (in_array($user->role, ['super_admin', 'admin'])) {
            return; // Super admin and admin can update any scholarship
        }

        if ($user->role === 'university_admin') {
            $allowedUniversityId = $this->getUserUniversityId($user);
            if ($scholarship->university_id !== $allowedUniversityId) {
                throw new \Exception('You do not have permission to update this scholarship');
            }
        }

        if ($user->role === 'institute_admin') {
            if ($scholarship->institute_id !== ($user->institute_id ?? 0)) {
                throw new \Exception('You do not have permission to update this scholarship');
            }
        }
    }

    /**
     * Check if user can delete the scholarship
     *
     * @param User $user
     * @param Scholarship $scholarship
     * @return void
     * @throws \Exception
     */
    private function checkDeletePermission(User $user, Scholarship $scholarship): void
    {
        // Same permissions as update
        $this->checkUpdatePermission($user, $scholarship);
    }

    /**
     * Get the university ID for a user
     *
     * @param User $user
     * @return int|null
     */
    private function getUserUniversityId(User $user): ?int
    {
        if ($user->university_id) {
            return $user->university_id;
        }

        // If user has institute_id, get university from that institute
        if ($user->institute_id) {
            return \DB::table('institutes')
                ->where('id', $user->institute_id)
                ->value('university_id');
        }

        return null;
    }
}

