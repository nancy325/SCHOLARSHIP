<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreScholarshipRequest;
use App\Http\Requests\UpdateScholarshipRequest;
use App\Http\Resources\ScholarshipResource;
use App\Services\ScholarshipService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScholarshipController extends Controller
{
    public function __construct(
        private ScholarshipService $scholarshipService
    ) {}

    /**
     * Get all scholarships with filters and pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = [
                'type' => $request->input('type'),
                'university_id' => $request->input('university_id'),
                'institute_id' => $request->input('institute_id'),
                'search' => $request->input('search'),
            ];

            $perPage = $request->integer('per_page', 15);
            $user = $request->user();

            $scholarships = $this->scholarshipService->getScholarships($filters, $user, $perPage);

            return response()->json([
                'success' => true,
                'data' => ScholarshipResource::collection($scholarships),
                'meta' => [
                    'current_page' => $scholarships->currentPage(),
                    'last_page' => $scholarships->lastPage(),
                    'per_page' => $scholarships->perPage(),
                    'total' => $scholarships->total(),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve scholarships',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a single scholarship by ID
     */
    public function show(Request $request, int $id): JsonResponse
    {
        try {
            $scholarship = $this->scholarshipService->getScholarshipById($id);

            return response()->json([
                'success' => true,
                'data' => new ScholarshipResource($scholarship)
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Scholarship not found'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve scholarship',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new scholarship
     */
    public function store(StoreScholarshipRequest $request): JsonResponse
    {
        try {
            $user = $request->user();

            // Check if user has permission to create scholarships
            if (!$user || !in_array($user->role, ['super_admin', 'admin', 'university_admin', 'institute_admin'], true)) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to create scholarships'
                ], 403);
            }

            $scholarship = $this->scholarshipService->createScholarship(
                $request->validated(),
                $user
            );

            return response()->json([
                'success' => true,
                'message' => 'Scholarship created successfully',
                'data' => new ScholarshipResource($scholarship)
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create scholarship',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Update an existing scholarship
     */
    public function update(UpdateScholarshipRequest $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();

            // Check if user has permission to update scholarships
            if (!$user || !in_array($user->role, ['super_admin', 'admin', 'university_admin', 'institute_admin'], true)) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to update scholarships'
                ], 403);
            }

            $scholarship = $this->scholarshipService->updateScholarship(
                $id,
                $request->validated(),
                $user
            );

            return response()->json([
                'success' => true,
                'message' => 'Scholarship updated successfully',
                'data' => new ScholarshipResource($scholarship)
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Scholarship not found'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update scholarship',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Delete a scholarship
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();

            // Check if user has permission to delete scholarships
            if (!$user || !in_array($user->role, ['super_admin', 'admin', 'university_admin', 'institute_admin'], true)) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to delete scholarships'
                ], 403);
            }

            $this->scholarshipService->deleteScholarship($id, $user);

            return response()->json([
                'success' => true,
                'message' => 'Scholarship deleted successfully'
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Scholarship not found'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete scholarship',
                'error' => $e->getMessage()
            ], 400);
        }
    }
}
