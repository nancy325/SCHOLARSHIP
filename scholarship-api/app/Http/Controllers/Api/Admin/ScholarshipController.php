<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Scholarship;
use App\Models\Institute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ScholarshipController extends Controller
{
    /**
     * Get all scholarships with pagination
     */
    public function index(Request $request)
    {
        try {
            $query = Scholarship::with(['institute'])->withCount('applications');

            // Role scoping
            $user = $request->user();
            if (($user->role ?? null) === 'institute_admin') {
                $query->where('institute_id', $user->institute_id ?? 0);
            }

            // Search functionality
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('field', 'like', "%{$search}%")
                      ->orWhereHas('institute', function ($instituteQuery) use ($search) {
                          $instituteQuery->where('name', 'like', "%{$search}%");
                      });
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

            // Filter by level
            if ($request->has('level') && $request->level !== 'all') {
                $query->where('level', $request->level);
            }

            // Filter by institute
            if ($request->has('institute_id') && $request->institute_id !== 'all') {
                $query->where('institute_id', $request->institute_id);
            }

            $scholarships = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $scholarships
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch scholarships',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific scholarship
     */
    public function show($id)
    {
        try {
            $scholarship = Scholarship::with(['institute', 'applications.user'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $scholarship
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Scholarship not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Create a new scholarship
     */
    public function store(Request $request)
    {
        try {
            // Only super_admin/admin and institute_admin (for their own institute)
            $user = $request->user();
            if (!in_array($user->role ?? 'student', ['super_admin', 'admin', 'institute_admin'], true)) {
                return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
            }
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'institute_id' => 'required|exists:institutes,id',
                'type' => 'required|string|in:merit_based,need_based,project_based,athletic',
                'amount' => 'required|numeric|min:0',
                'currency' => 'required|string|size:3',
                'deadline' => 'required|date|after:today',
                'max_applications' => 'required|integer|min:1',
                'field' => 'required|string|max:255',
                'level' => 'required|string|in:undergraduate,graduate,phd',
                'description' => 'required|string',
                'requirements' => 'required|string',
                'eligibility' => 'required|string',
                'documents' => 'required|string',
                'apply_link' => 'required|url',
                'status' => 'sometimes|string|in:active,pending,expired,suspended',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            if (($user->role ?? null) === 'institute_admin') {
                if (($user->institute_id ?? null) !== (int) $request->institute_id) {
                    return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
                }
            }

            $scholarship = Scholarship::create($request->all());

            // Update institute scholarships count
            $institute = Institute::find($request->institute_id);
            $institute->increment('scholarships_count');

            return response()->json([
                'success' => true,
                'message' => 'Scholarship created successfully',
                'data' => $scholarship->load('institute')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create scholarship',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a scholarship
     */
    public function update(Request $request, $id)
    {
        try {
            $scholarship = Scholarship::findOrFail($id);

            // Role scoping
            $user = $request->user();
            if (($user->role ?? null) === 'institute_admin' && $scholarship->institute_id !== ($user->institute_id ?? 0)) {
                return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|required|string|max:255',
                'institute_id' => 'sometimes|required|exists:institutes,id',
                'type' => 'sometimes|required|string|in:merit_based,need_based,project_based,athletic',
                'amount' => 'sometimes|required|numeric|min:0',
                'currency' => 'sometimes|required|string|size:3',
                'deadline' => 'sometimes|required|date',
                'max_applications' => 'sometimes|required|integer|min:1',
                'field' => 'sometimes|required|string|max:255',
                'level' => 'sometimes|required|string|in:undergraduate,graduate,phd',
                'description' => 'sometimes|required|string',
                'requirements' => 'sometimes|required|string',
                'eligibility' => 'sometimes|required|string',
                'documents' => 'sometimes|required|string',
                'apply_link' => 'sometimes|required|url',
                'status' => 'sometimes|required|string|in:active,pending,expired,suspended',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $scholarship->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Scholarship updated successfully',
                'data' => $scholarship->fresh()->load('institute')
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update scholarship',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a scholarship
     */
    public function destroy($id)
    {
        try {
            $scholarship = Scholarship::findOrFail($id);
            $user = request()->user();
            if (($user->role ?? null) === 'institute_admin' && $scholarship->institute_id !== ($user->institute_id ?? 0)) {
                return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
            }
            
            // Update institute scholarships count
            $institute = $scholarship->institute;
            $institute->decrement('scholarships_count');
            
            $scholarship->delete();

            return response()->json([
                'success' => true,
                'message' => 'Scholarship deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete scholarship',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get scholarship statistics
     */
    public function getStats()
    {
        try {
            $stats = [
                'total_scholarships' => Scholarship::count(),
                'active_scholarships' => Scholarship::where('status', 'active')->count(),
                'pending_scholarships' => Scholarship::where('status', 'pending')->count(),
                'expired_scholarships' => Scholarship::where('status', 'expired')->count(),
                'scholarships_by_type' => Scholarship::selectRaw('type, count(*) as count')
                    ->groupBy('type')
                    ->get(),
                'scholarships_by_level' => Scholarship::selectRaw('level, count(*) as count')
                    ->groupBy('level')
                    ->get(),
                'total_amount' => Scholarship::sum('amount'),
                'average_amount' => Scholarship::avg('amount'),
                'total_applications' => Scholarship::withCount('applications')->get()->sum('applications_count'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch scholarship statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get institutes for dropdown
     */
    public function getInstitutes()
    {
        try {
            $institutes = Institute::select('id', 'name')->get();

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
}