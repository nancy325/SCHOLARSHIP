<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Institute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InstituteController extends Controller
{
    /**
     * Get all institutes with pagination
     */
    public function index(Request $request)
    {
        try {
            $query = Institute::withCount('scholarships');

            // Search functionality
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('address', 'like', "%{$search}%");
                });
            }

            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Filter by type
            if ($request->has('type') && $request->type !== 'all') {
                $query->where('type', $request->type);
            }

            $institutes = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $institutes
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch institutes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific institute
     */
    public function show($id)
    {
        try {
            $institute = Institute::with(['scholarships', 'users'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $institute
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Institute not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Create a new institute
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'type' => 'required|string|in:university,community_college,technical_institute,liberal_arts',
                'email' => 'required|string|email|max:255|unique:institutes',
                'phone' => 'nullable|string|max:20',
                'website' => 'nullable|url',
                'address' => 'nullable|string',
                'description' => 'nullable|string',
                'established' => 'nullable|string',
                'accreditation' => 'nullable|string',
                'students' => 'nullable|integer|min:0',
                'rating' => 'nullable|numeric|min:0|max:5',
                'contact_person' => 'nullable|string|max:255',
                'contact_phone' => 'nullable|string|max:20',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $institute = Institute::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Institute created successfully',
                'data' => $institute
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create institute',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an institute
     */
    public function update(Request $request, $id)
    {
        try {
            $institute = Institute::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'type' => 'sometimes|required|string|in:university,community_college,technical_institute,liberal_arts',
                'email' => 'sometimes|required|string|email|max:255|unique:institutes,email,' . $id,
                'phone' => 'nullable|string|max:20',
                'website' => 'nullable|url',
                'address' => 'nullable|string',
                'description' => 'nullable|string',
                'established' => 'nullable|string',
                'accreditation' => 'nullable|string',
                'students' => 'nullable|integer|min:0',
                'rating' => 'nullable|numeric|min:0|max:5',
                'contact_person' => 'nullable|string|max:255',
                'contact_phone' => 'nullable|string|max:20',
                'status' => 'sometimes|required|string|in:verified,pending,suspended,rejected',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $institute->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Institute updated successfully',
                'data' => $institute->fresh()
            ], 200);

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
    public function destroy($id)
    {
        try {
            $institute = Institute::findOrFail($id);
            $institute->delete();

            return response()->json([
                'success' => true,
                'message' => 'Institute deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete institute',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get institute statistics
     */
    public function getStats()
    {
        try {
            $stats = [
                'total_institutes' => Institute::count(),
                'verified_institutes' => Institute::where('status', 'verified')->count(),
                'pending_institutes' => Institute::where('status', 'pending')->count(),
                'suspended_institutes' => Institute::where('status', 'suspended')->count(),
                'institutes_by_type' => Institute::selectRaw('type, count(*) as count')
                    ->groupBy('type')
                    ->get(),
                'total_students' => Institute::sum('students'),
                'average_rating' => Institute::avg('rating'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch institute statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}