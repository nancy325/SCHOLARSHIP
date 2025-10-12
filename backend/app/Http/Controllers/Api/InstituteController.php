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
     * Get all institutes with pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->integer('per_page', 15);
            $institutes = Institute::with('university:id,name')->paginate($perPage);

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
            $institute = Institute::with('university:id,name')->findOrFail($id);

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
            $institute->delete();

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
