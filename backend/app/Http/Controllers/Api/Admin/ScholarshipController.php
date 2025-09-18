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
            $user = $request->user();

            $query = Scholarship::query()
                ->with(['institute:id,name', 'university:id,name', 'creator:id,name'])
                ->withCount('applications');

            // Role-based visibility (Admin area)
            if (($user->role ?? 'student') === 'super_admin') {
                // full visibility
            } elseif (($user->role ?? 'student') === 'admin') {
                // Admin: full visibility as per current requirement
            } elseif (($user->role ?? 'student') === 'university_admin') {
                // University Admin: their university scholarships + their institutes under that university
                $allowedUniversityId = $user->university_id
                    ?? (function() use ($user) {
                        $adminInstituteId = $user->institute_id ?? 0;
                        return \DB::table('institutes')->where('id', $adminInstituteId)->value('university_id') ?? 0;
                    })();
                $query->where(function ($q) use ($allowedUniversityId) {
                    $q->where(function ($uq) use ($allowedUniversityId) {
                        $uq->where('type', 'university')->where('university_id', $allowedUniversityId);
                    })->orWhere(function ($iq) use ($allowedUniversityId) {
                        $iq->where('type', 'institute')
                           ->whereIn('institute_id', function ($sub) use ($allowedUniversityId) {
                               $sub->from('institutes')->select('id')->where('university_id', $allowedUniversityId);
                           });
                    });
                });
            } elseif (($user->role ?? 'student') === 'institute_admin') {
                // Institute Admin: only their institute
                $query->where('type', 'institute')->where('institute_id', $user->institute_id ?? 0);
            }

            // Filters
            if ($request->filled('type')) {
                $query->where('type', $request->string('type'));
            }
            if ($request->filled('university_id')) {
                $query->where('university_id', (int) $request->university_id);
            }
            if ($request->filled('institute_id')) {
                $query->where('institute_id', (int) $request->institute_id);
            }
            if ($request->filled('search')) {
                $search = $request->string('search');
                $query->where('title', 'like', "%{$search}%");
            }

            $scholarships = $query->orderByDesc('id')->paginate($request->integer('per_page', 15));

            return response()->json(['success' => true, 'data' => $scholarships]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to fetch scholarships', 'error' => $e->getMessage()], 500);
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
            // Only super_admin, admin, university_admin, institute_admin
            $user = $request->user();
            if (!in_array($user->role ?? 'student', ['super_admin', 'admin', 'university_admin', 'institute_admin'], true)) {
                return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
            }
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:150',
                'description' => 'required|string',
                'type' => 'required|in:government,private,university,institute',
                'university_id' => 'nullable|exists:universities,id',
                'institute_id' => 'nullable|exists:institutes,id',
                'eligibility' => 'nullable|string',
                'start_date' => 'nullable|date',
                'deadline' => 'required|date',
                'apply_link' => 'required|url|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Role constraints for creation
            if ($user->role === 'university_admin') {
                $adminInstituteId = $user->institute_id ?? 0;
                $allowedUniversityId = \DB::table('institutes')->where('id', $adminInstituteId)->value('university_id') ?? 0;
                if ($request->type !== 'university' || (int) $request->university_id !== (int) $allowedUniversityId) {
                    return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
                }
            }
            if ($user->role === 'institute_admin') {
                if ($request->type !== 'institute' || (int) $request->institute_id !== (int) ($user->institute_id ?? 0)) {
                    return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
                }
            }

            $payload = $request->only(['title','description','type','university_id','institute_id','eligibility','start_date','deadline','apply_link']);
            $payload['created_by'] = $user->id;

            $scholarship = Scholarship::create($payload);

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
            if (($user->role ?? null) === 'university_admin') {
                $adminInstituteId = $user->institute_id ?? 0;
                $allowedUniversityId = \DB::table('institutes')->where('id', $adminInstituteId)->value('university_id') ?? 0;
                if ($scholarship->university_id !== $allowedUniversityId) {
                    return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
                }
            }

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|required|string|max:150',
                'description' => 'sometimes|required|string',
                'type' => 'sometimes|required|in:government,private,university,institute',
                'university_id' => 'nullable|exists:universities,id',
                'institute_id' => 'nullable|exists:institutes,id',
                'eligibility' => 'nullable|string',
                'start_date' => 'nullable|date',
                'deadline' => 'sometimes|required|date',
                'apply_link' => 'sometimes|required|url|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Additional role constraints for updates
            if ($user->role === 'university_admin') {
                if ($request->has('type') && $request->type !== 'university') {
                    return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
                }
                if ($request->has('university_id')) {
                    $adminInstituteId = $user->institute_id ?? 0;
                    $allowedUniversityId = \DB::table('institutes')->where('id', $adminInstituteId)->value('university_id') ?? 0;
                    if ((int) $request->university_id !== (int) $allowedUniversityId) {
                        return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
                    }
                }
            }
            if ($user->role === 'institute_admin') {
                if ($request->has('type') && $request->type !== 'institute') {
                    return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
                }
                if ($request->has('institute_id') && (int) $request->institute_id !== (int) ($user->institute_id ?? 0)) {
                    return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
                }
            }

            $scholarship->update($request->only(['title','description','type','university_id','institute_id','eligibility','start_date','deadline','apply_link']));

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
            if (($user->role ?? null) === 'university_admin') {
                $adminInstituteId = $user->institute_id ?? 0;
                $allowedUniversityId = \DB::table('institutes')->where('id', $adminInstituteId)->value('university_id') ?? 0;
                if ($scholarship->university_id !== $allowedUniversityId) {
                    return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
                }
            }

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