<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\University;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UniversityController extends Controller
{
    /**
     * Get all universities with pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->integer('per_page', 15);
            $universities = University::paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $universities->items(),
                'pagination' => [
                    'current_page' => $universities->currentPage(),
                    'last_page' => $universities->lastPage(),
                    'per_page' => $universities->perPage(),
                    'total' => $universities->total(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve universities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a single university by ID
     */
    public function show(int $id): JsonResponse
    {
        try {
            $university = University::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $university
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'University not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve university',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new university
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'status' => 'required|string|max:20',
                'email' => 'required|email|unique:universities,email',
                'phone' => 'nullable|string|max:20',
                'website' => 'nullable|url',
                'address' => 'nullable|string',
                'description' => 'nullable|string',
                'established' => 'nullable|string|max:10',
                'accreditation' => 'nullable|string|max:50',
                'students' => 'nullable|integer',
                'rating' => 'nullable|numeric|min:0|max:5',
            ]);

            $validated['created_by'] = $request->user()->id;
            $university = University::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'University created successfully',
                'data' => $university
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
                'message' => 'Failed to create university',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing university
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $university = University::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'status' => 'sometimes|required|string|max:20',
                'email' => 'sometimes|required|email|unique:universities,email,' . $id,
                'phone' => 'nullable|string|max:20',
                'website' => 'nullable|url',
                'address' => 'nullable|string',
                'description' => 'nullable|string',
                'established' => 'nullable|string|max:10',
                'accreditation' => 'nullable|string|max:50',
                'students' => 'nullable|integer',
                'rating' => 'nullable|numeric|min:0|max:5',
            ]);

            $university->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'University updated successfully',
                'data' => $university->fresh()
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'University not found'
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
                'message' => 'Failed to update university',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a university
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $university = University::findOrFail($id);
            $university->delete();

            return response()->json([
                'success' => true,
                'message' => 'University deleted successfully'
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'University not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete university',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
