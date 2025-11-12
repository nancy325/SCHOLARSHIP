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
     * Get all scholarships with filters and pagination, or get a single scholarship by ID
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Check if ID is provided in query parameter
            $scholarshipId = $request->query('id');
            
            if ($scholarshipId) {
                // Get single scholarship by ID
                $scholarship = $this->scholarshipService->getScholarshipById($scholarshipId);
                
                return response()->json([
                    'success' => true,
                    'data' => new ScholarshipResource($scholarship)
                ], 200);
            }
            
            // Get all scholarships with pagination
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
                'data' => [
                    'data' => ScholarshipResource::collection($scholarships),
                    'current_page' => $scholarships->currentPage(),
                    'last_page' => $scholarships->lastPage(),
                    'per_page' => $scholarships->perPage(),
                    'total' => $scholarships->total(),
                ]
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Scholarship not found'
            ], 404);

        } catch (\Exception $e) {
            \Log::error('ScholarshipController index error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve scholarships',
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
    public function update(UpdateScholarshipRequest $request): JsonResponse
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

            // Always get scholarship ID from request body
            $scholarshipId = $request->input('id');

            if (!$scholarshipId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Scholarship ID is required in request body'
                ], 400);
            }

            $validated = $request->validated();
            // Remove id from validated data as it's not a field to update
            unset($validated['id']);

            $scholarship = $this->scholarshipService->updateScholarship(
                $scholarshipId,
                $validated,
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
    public function destroy(Request $request): JsonResponse
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

            // Ensure request is JSON
            if (!$request->isJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Request must be JSON'
                ], 415);
            }

            // Get scholarship ID from JSON request body
            $data = $request->json()->all();
            $scholarshipId = $data['id'] ?? null;

            if (!$scholarshipId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Scholarship ID is required in request body'
                ], 400);
            }

            $this->scholarshipService->deleteScholarship($scholarshipId, $user);

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

    /**
     * Get statistics for scholarships
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $totalScholarships = \App\Models\Scholarship::where('RecStatus', 'active')->count();
            $activeScholarships = \App\Models\Scholarship::where('RecStatus', 'active')->where('deadline', '>=', now())->count();
            $governmentScholarships = \App\Models\Scholarship::where('RecStatus', 'active')->where('type', 'government')->count();
            $privateScholarships = \App\Models\Scholarship::where('RecStatus', 'active')->where('type', 'private')->count();
            $universityScholarships = \App\Models\Scholarship::where('RecStatus', 'active')->where('type', 'university')->count();
            $instituteScholarships = \App\Models\Scholarship::where('RecStatus', 'active')->where('type', 'institute')->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total_scholarships' => $totalScholarships,
                    'active_scholarships' => $activeScholarships,
                    'by_type' => [
                        'government' => $governmentScholarships,
                        'private' => $privateScholarships,
                        'university' => $universityScholarships,
                        'institute' => $instituteScholarships
                    ]
                ],
                'message' => 'Statistics retrieved successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search scholarships with filters
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = $request->get('q', '');
            $type = $request->get('type');
            $universityId = $request->get('university_id');
            $instituteId = $request->get('institute_id');
            $perPage = $request->get('per_page', 15);

            $scholarships = \App\Models\Scholarship::with(['university:id,name', 'institute:id,name'])
                ->where('RecStatus', 'active') // Only show active records
                ->when($query, function ($q) use ($query) {
                    $q->where(function ($subQ) use ($query) {
                        $subQ->where('title', 'like', "%{$query}%")
                             ->orWhere('description', 'like', "%{$query}%");
                    });
                })
                ->when($type, function ($q) use ($type) {
                    $q->where('type', $type);
                })
                ->when($universityId, function ($q) use ($universityId) {
                    $q->where('university_id', $universityId);
                })
                ->when($instituteId, function ($q) use ($instituteId) {
                    $q->where('institute_id', $instituteId);
                })
                ->where('deadline', '>=', now())
                ->orderBy('deadline', 'asc')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $scholarships,
                'message' => 'Search completed successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Search failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
