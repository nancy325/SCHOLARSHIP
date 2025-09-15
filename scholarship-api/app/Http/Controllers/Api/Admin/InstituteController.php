<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Institute;
use App\Models\University;
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

            // Role scoping
            $user = $request->user();
            if (($user->role ?? null) === 'university_admin') {
                // University admin should see all institutes under their university
                $allowedUniversityId = $user->university_id
                    ?? (function() use ($user) {
                        $adminInstituteId = $user->institute_id ?? 0;
                        return \DB::table('institutes')->where('id', $adminInstituteId)->value('university_id') ?? 0;
                    })();
                if ($allowedUniversityId) {
                    $query->where('university_id', $allowedUniversityId);
                } else {
                    // if no scoping info, prevent leakage by returning empty
                    $query->whereRaw('1 = 0');
                }
            } elseif (($user->role ?? null) === 'institute_admin') {
                // Institute admin sees only their institute
                $query->where('id', $user->institute_id ?? 0);
            }

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
            // Only super_admin and admin can create globally.
            // university_admin can create but only within their own university scope.
            $user = $request->user();
            if (!in_array($user->role ?? 'student', ['super_admin', 'admin', 'university_admin'], true)) {
                return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
            }
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
                // Linking to a university
                'university_id' => 'nullable|exists:universities,id',
                // Optional inline creation of a university
                'university' => 'nullable|array',
                'university.name' => 'required_with:university|string|max:255',
                'university.email' => 'required_with:university|email|max:255|unique:universities,email',
                'university.phone' => 'nullable|string|max:20',
                'university.website' => 'nullable|url',
                'university.address' => 'nullable|string',
                'university.description' => 'nullable|string',
                'university.established' => 'nullable|string',
                'university.accreditation' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // If 'university' payload provided, create it and use its id
            $payload = $request->only([
                'name','type','email','phone','website','address','description','established','accreditation','students','rating','contact_person','contact_phone','status'
            ]);

            if ($request->filled('university')) {
                $u = $request->input('university');
                $university = University::create([
                    'name' => $u['name'],
                    'email' => $u['email'],
                    'phone' => $u['phone'] ?? null,
                    'website' => $u['website'] ?? null,
                    'address' => $u['address'] ?? null,
                    'description' => $u['description'] ?? null,
                    'established' => $u['established'] ?? null,
                    'accreditation' => $u['accreditation'] ?? null,
                    'status' => 'verified',
                    'students' => 0,
                    'rating' => 0,
                ]);
                $payload['university_id'] = $university->id;
            } elseif ($request->filled('university_id')) {
                $payload['university_id'] = (int) $request->input('university_id');
            }

            // Enforce scoping for university_admin: force university_id to their allowed university
            if (($user->role ?? null) === 'university_admin') {
                $allowedUniversityId = $user->university_id
                    ?? (function() use ($user) {
                        $adminInstituteId = $user->institute_id ?? 0;
                        return \DB::table('institutes')->where('id', $adminInstituteId)->value('university_id') ?? 0;
                    })();
                if (!$allowedUniversityId) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Forbidden: missing university scope'
                    ], 403);
                }
                $payload['university_id'] = $allowedUniversityId;
            }

            $institute = Institute::create($payload);

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

            // Role scoping: super_admin/admin can update any, university_admin can update within their university, institute_admin can update their own
            $user = $request->user();
            if (!in_array($user->role ?? 'student', ['super_admin', 'admin'], true)) {
                if (($user->role ?? null) === 'university_admin') {
                    $allowedUniversityId = $user->university_id
                        ?? (function() use ($user) {
                            $adminInstituteId = $user->institute_id ?? 0;
                            return \DB::table('institutes')->where('id', $adminInstituteId)->value('university_id') ?? 0;
                        })();
                    if (!$allowedUniversityId || (int)$institute->university_id !== (int)$allowedUniversityId) {
                        return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
                    }
                } elseif (($user->role ?? null) === 'institute_admin') {
                    if ((int)$user->institute_id !== (int)$institute->id) {
                        return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
                    }
                } else {
                    return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
                }
            }

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

            // Deletion permissions
            $user = request()->user();
            if (!in_array($user->role ?? 'student', ['super_admin', 'admin'], true)) {
                if (($user->role ?? null) === 'university_admin') {
                    $allowedUniversityId = $user->university_id
                        ?? (function() use ($user) {
                            $adminInstituteId = $user->institute_id ?? 0;
                            return \DB::table('institutes')->where('id', $adminInstituteId)->value('university_id') ?? 0;
                        })();
                    if (!$allowedUniversityId || (int)$institute->university_id !== (int)$allowedUniversityId) {
                        return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
                    }
                } elseif (($user->role ?? null) === 'institute_admin') {
                    if ((int)$user->institute_id !== (int)$institute->id) {
                        return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
                    }
                } else {
                    return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
                }
            }
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