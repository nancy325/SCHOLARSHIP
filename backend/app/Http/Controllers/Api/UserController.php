<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Get all users with filters and pagination, or get a single user by ID
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Check if ID is provided in query parameter
            $userId = $request->query('id');
            
            if ($userId) {
                // Get single user by ID
                $user = User::with(['institute:id,name,address', 'university:id,name'])->findOrFail($userId);
                
                return response()->json([
                    'success' => true,
                    'data' => $user
                ], 200);
            }
            
            // Get all users with pagination
            $perPage = $request->integer('per_page', 15);
            $users = User::with(['institute:id,name,address', 'university:id,name'])
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $users->items(),
                'pagination' => [
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total(),
                ]
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve users',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Create a new user
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
                'category' => 'required|string|in:high-school,diploma,undergraduate,postgraduate,graduate,other',
                'role' => 'nullable|string|in:student,institute_admin,university_admin,admin',
                'institute_id' => 'nullable|exists:institutes,id',
                'university_id' => 'nullable|exists:universities,id',
            ]);

            $validated['password'] = Hash::make($validated['password']);
            $validated['role'] = $validated['role'] ?? 'student';

            $user = User::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Update an existing user
     */
    public function update(Request $request): JsonResponse
    {
        try {
            // Always get user ID from request body
            $userId = $request->input('id');

            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'User ID is required in request body'
                ], 400);
            }

            $user = User::findOrFail($userId);

            $validated = $request->validate([
                'id' => 'required|integer|exists:users,id',
                'name' => 'sometimes|required|string|max:255',
                'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($userId)],
                'password' => 'nullable|string|min:8',
                'category' => 'sometimes|required|string|in:high-school,diploma,undergraduate,postgraduate,graduate,other',
                'role' => 'nullable|string|in:student,institute_admin,university_admin,admin',
                'institute_id' => 'nullable|exists:institutes,id',
                'university_id' => 'nullable|exists:universities,id',
            ]);

            // Remove id from validated data as it's not a field to update
            unset($validated['id']);

            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            } else {
                unset($validated['password']);
            }

            $user->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Delete a user
     */
    public function destroy(Request $request): JsonResponse
    {
        try {
            // Ensure request is JSON
            if (!$request->isJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Request must be JSON'
                ], 415);
            }

            // Get user ID from JSON request body
            $data = $request->json()->all();
            $userId = $data['id'] ?? null;

            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'User ID is required in request body'
                ], 400);
            }

            $user = User::findOrFail($userId);

            // Prevent deleting super admin or current user
            if ($user->role === 'super_admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete super admin user'
                ], 403);
            }

            if ($request->user() && $request->user()->id == $userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete your own account'
                ], 403);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], 400);
        }
    }
}
