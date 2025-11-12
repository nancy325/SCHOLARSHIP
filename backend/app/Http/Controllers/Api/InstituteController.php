<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Institute;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class InstituteController extends Controller
{
    /**
     * Get all institutes with pagination and filters
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->integer('per_page', 15);
            $page = $request->integer('page', 1);
            
            $query = Institute::with('university:id,name');
            
            // Filter by RecStatus='active' by default (soft delete)
            if (!$request->has('include_inactive') || $request->input('include_inactive') !== 'true') {
                $query->where('RecStatus', 'active');
            }
            
            // Apply search filter
            if ($request->has('search') && $request->input('search')) {
                $search = $request->input('search');
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }
            
            // Apply status filter
            if ($request->has('status') && $request->input('status') !== 'all') {
                $query->where('status', $request->input('status'));
            }
            
            // Apply university filter
            if ($request->has('university_id') && $request->input('university_id')) {
                $query->where('university_id', $request->input('university_id'));
            }
            
            $institutes = $query->orderBy('name')->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => $institutes->items(),
                'pagination' => [
                    'current_page' => $institutes->currentPage(),
                    'last_page' => $institutes->lastPage(),
                    'per_page' => $institutes->perPage(),
                    'total' => $institutes->total(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve institutes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a single institute by ID
     */
    public function show(int $id): JsonResponse
    {
        try {
            $institute = Institute::with('university:id,name')
                ->where('RecStatus', 'active')
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $institute
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Institute not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve institute',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new institute
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'type' => 'required|string|max:50',
                'status' => 'required|string|max:20',
                'email' => 'required|email|unique:institutes,email',
                'phone' => 'nullable|string|max:20',
                'website' => 'nullable|url',
                'address' => 'nullable|string',
                'description' => 'nullable|string',
                'established' => 'nullable|string|max:10',
                'accreditation' => 'nullable|string|max:50',
                'students' => 'nullable|integer',
                'rating' => 'nullable|numeric|min:0|max:5',
                'contact_person' => 'nullable|string|max:255',
                'contact_phone' => 'nullable|string|max:20',
                'university_id' => 'required|exists:universities,id',
            ]);

            $validated['created_by'] = $request->user()->id;
            $validated['RecStatus'] = $validated['RecStatus'] ?? 'active';
            $institute = Institute::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Institute created successfully',
                'data' => $institute->load('university:id,name')
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create institute',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing institute
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $institute = Institute::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'type' => 'sometimes|required|string|max:50',
                'status' => 'sometimes|required|string|max:20',
                'email' => 'sometimes|required|email|unique:institutes,email,' . $id,
                'phone' => 'nullable|string|max:20',
                'website' => 'nullable|url',
                'address' => 'nullable|string',
                'description' => 'nullable|string',
                'established' => 'nullable|string|max:10',
                'accreditation' => 'nullable|string|max:50',
                'students' => 'nullable|integer',
                'rating' => 'nullable|numeric|min:0|max:5',
                'contact_person' => 'nullable|string|max:255',
                'contact_phone' => 'nullable|string|max:20',
                'university_id' => 'sometimes|required|exists:universities,id',
            ]);

            $institute->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Institute updated successfully',
                'data' => $institute->fresh()->load('university:id,name')
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Institute not found'
            ], 404);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update institute',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete an institute
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $institute = Institute::findOrFail($id);
            // Soft delete: set RecStatus to 'inactive' instead of actually deleting
            $institute->update(['RecStatus' => 'inactive']);

            return response()->json([
                'success' => true,
                'message' => 'Institute deleted successfully'
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Institute not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete institute',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
