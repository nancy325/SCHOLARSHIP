<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ApplicationResource;
use App\Services\ApplicationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function __construct(
        private ApplicationService $applicationService
    ) {}

    /**
     * Get user's application history
     */
    public function myApplications(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }

            $perPage = $request->integer('per_page', 15);

            $applications = $this->applicationService->getUserApplications($user, $perPage);

            return response()->json([
                'success' => true,
                'data' => ApplicationResource::collection($applications),
                'meta' => [
                    'current_page' => $applications->currentPage(),
                    'last_page' => $applications->lastPage(),
                    'per_page' => $applications->perPage(),
                    'total' => $applications->total(),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve your applications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a single application by ID
     */
    public function show(Request $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }

            $application = $this->applicationService->getApplicationById($id, $user);

            return response()->json([
                'success' => true,
                'data' => new ApplicationResource($application)
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve application',
                'error' => $e->getMessage()
            ], 403);
        }
    }

    /**
     * Record that user applied to a scholarship
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }

            $request->validate([
                'scholarship_id' => 'required|integer|exists:scholarships,id',
            ]);

            $application = $this->applicationService->recordApplication(
                $request->scholarship_id,
                $user
            );

            return response()->json([
                'success' => true,
                'message' => 'Application recorded successfully',
                'data' => new ApplicationResource($application)
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to record application',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Delete an application record
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }

            $this->applicationService->deleteApplication($id, $user);

            return response()->json([
                'success' => true,
                'message' => 'Application record deleted successfully'
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete application',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Get user's application statistics
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }

            $stats = $this->applicationService->getUserApplicationStats($user);

            return response()->json([
                'success' => true,
                'data' => $stats
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve application statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}