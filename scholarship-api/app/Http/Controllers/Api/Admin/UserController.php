<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Get all users with pagination
     */
    public function index(Request $request)
    {
        try {
            $query = User::with('institute');

            // Search functionality
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Filter by status (using category as status for now)
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('category', $request->status);
            }

            // Filter by role
            if ($request->has('role') && $request->role !== 'all') {
                $query->where('role', $request->role);
            }

            // Role scoping: non super_admin cannot view super_admins
            $current = $request->user();
            if (($current->role ?? null) !== 'super_admin') {
                $query->where('role', '!=', 'super_admin');
            }

            $users = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $users
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific user
     */
    public function show($id)
    {
        try {
            $user = User::with(['institute', 'applications.scholarship'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $user
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Create a new user
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'category' => 'required|string|in:high-school,diploma,undergraduate,postgraduate,other',
                'role' => 'required|string|in:super_admin,admin,university_admin,institute_admin,student',
                'institute_id' => 'nullable|exists:institutes,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'category' => $request->category,
                'role' => $request->role,
                'institute_id' => $request->institute_id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a user
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
                'password' => 'sometimes|required|string|min:8',
                'category' => 'sometimes|required|string|in:high-school,diploma,undergraduate,postgraduate,other',
                'role' => 'sometimes|required|string|in:super_admin,admin,university_admin,institute_admin,student',
                'institute_id' => 'nullable|exists:institutes,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $updateData = $request->only(['name', 'email', 'category', 'role', 'institute_id']);
            
            if ($request->has('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user->fresh()
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a user
     */
    public function destroy(Request $request, $id)
    {
        try {
            $currentUser = $request->user();
            
            // Prevent user from deleting themselves
            if ($currentUser->id == $id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot delete your own account'
                ], 403);
            }
            
            $user = User::findOrFail($id);
            
            // Prevent deletion of the last super admin
            if ($user->role === 'super_admin') {
                $adminCount = User::where('role', 'super_admin')->count();
                if ($adminCount <= 1) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Cannot delete the last super admin. At least one super admin must remain.'
                    ], 403);
                }
            }
            
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user statistics
     */
    public function getStats()
    {
        try {
            $stats = [
                'total_users' => User::count(),
                'admin_users' => User::where('is_admin', true)->count(),
                'regular_users' => User::where('is_admin', false)->count(),
                'users_by_category' => User::selectRaw('category, count(*) as count')
                    ->groupBy('category')
                    ->get(),
                'recent_users' => User::where('created_at', '>=', now()->subDays(30))->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}