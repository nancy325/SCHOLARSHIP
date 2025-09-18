<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Scholarship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ScholarshipController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Scholarship::query()->with(['university:id,name', 'institute:id,name', 'creator:id,name']);

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

        // Role-based scoping
        if ($user) {
            switch ($user->role) {
                case 'super_admin':
                    // no restriction
                    break;
                case 'admin':
                    // Admin: full visibility as per current requirement
                    break;
                case 'university_admin':
                    $allowedUniversityId = $user->university_id
                        ?? (function() use ($user) {
                            $adminInstituteId = $user->institute_id ?? 0;
                            return \DB::table('institutes')->where('id', $adminInstituteId)->value('university_id') ?? 0;
                        })();
                    $query->where(function ($q) use ($allowedUniversityId) {
                        $q->where(function ($uq) use ($allowedUniversityId) {
                            $uq->where('type', 'university')
                               ->where('university_id', $allowedUniversityId);
                        })
                        ->orWhere(function ($iq) use ($allowedUniversityId) {
                            $iq->where('type', 'institute')
                               ->whereIn('institute_id', function ($sub) use ($allowedUniversityId) {
                                   $sub->from('institutes')->select('id')->where('university_id', $allowedUniversityId);
                               });
                        });
                    });
                    break;
                case 'institute_admin':
                    $query->where('institute_id', $user->institute_id ?? 0);
                    break;
                case 'student':
                default:
                    $query->where(function ($q) use ($user) {
                        $q->whereIn('type', ['government', 'private'])
                          ->orWhere(function ($q2) use ($user) {
                              $q2->where('type', 'university')
                                 ->where('university_id', $user->institute_id ?? 0);
                          })
                          ->orWhere(function ($q3) use ($user) {
                              $q3->where('type', 'institute')
                                 ->where('institute_id', $user->institute_id ?? 0);
                          });
                    });
                    break;
            }
        } else {
            // Public
            $query->whereIn('type', ['government', 'private']);
        }

        $scholarships = $query->orderByDesc('id')->paginate($request->integer('per_page', 15));

        return response()->json(['success' => true, 'data' => $scholarships]);
    }

    public function show(Request $request, int $id)
    {
        $scholarship = Scholarship::with(['university:id,name', 'institute:id,name', 'creator:id,name'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $scholarship]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user || !in_array($user->role, ['super_admin', 'admin', 'university_admin', 'institute_admin'], true)) {
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
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        // Role constraints
        if ($user->role === 'university_admin') {
            $allowedUniversityId = $user->university_id
                ?? (function() use ($user) {
                    $adminInstituteId = $user->institute_id ?? 0;
                    return \DB::table('institutes')->where('id', $adminInstituteId)->value('university_id') ?? 0;
                })();
            if (!$allowedUniversityId) {
                return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
            }
            if ($request->type !== 'university') {
                return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
            }
            if (!$request->filled('university_id')) {
                $request->merge(['university_id' => $allowedUniversityId]);
            } elseif ((int) $request->university_id !== (int) $allowedUniversityId) {
                return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
            }
        }
        if ($user->role === 'institute_admin') {
            $allowedInstituteId = $user->institute_id ?? 0;
            if ($request->type !== 'institute') {
                return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
            }
            if (!$request->filled('institute_id')) {
                $request->merge(['institute_id' => $allowedInstituteId]);
            } elseif ((int) $request->institute_id !== (int) $allowedInstituteId) {
                return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
            }
        }

        $payload = $request->only(['title','description','type','university_id','institute_id','eligibility','start_date','deadline','apply_link']);
        $payload['created_by'] = $user->id;

        $scholarship = Scholarship::create($payload);
        return response()->json(['success' => true, 'message' => 'Scholarship created', 'data' => $scholarship], 201);
    }

    public function update(Request $request, int $id)
    {
        $user = $request->user();
        if (!$user || !in_array($user->role, ['super_admin', 'admin', 'university_admin', 'institute_admin'], true)) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $scholarship = Scholarship::findOrFail($id);

        // Role constraints
        if ($user->role === 'university_admin') {
            $allowedUniversityId = $user->university_id
                ?? (function() use ($user) {
                    $adminInstituteId = $user->institute_id ?? 0;
                    return \DB::table('institutes')->where('id', $adminInstituteId)->value('university_id') ?? 0;
                })();
            if ($scholarship->university_id !== $allowedUniversityId) {
                return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
            }
        }
        if ($user->role === 'institute_admin' && $scholarship->institute_id !== ($user->institute_id ?? 0)) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
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
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        // Additional role constraints for updates
        if ($user->role === 'university_admin') {
            $allowedUniversityId = $user->university_id
                ?? (function() use ($user) {
                    $adminInstituteId = $user->institute_id ?? 0;
                    return \DB::table('institutes')->where('id', $adminInstituteId)->value('university_id') ?? 0;
                })();
            if ($request->has('type') && $request->type !== 'university') {
                return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
            }
            if ($request->has('university_id') && (int) $request->university_id !== (int) $allowedUniversityId) {
                return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
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
        return response()->json(['success' => true, 'message' => 'Scholarship updated', 'data' => $scholarship->fresh()]);
    }

    public function destroy(Request $request, int $id)
    {
        $user = $request->user();
        if (!$user || !in_array($user->role, ['super_admin', 'admin', 'university_admin', 'institute_admin'], true)) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $scholarship = Scholarship::findOrFail($id);
        if ($user->role === 'university_admin') {
            $allowedUniversityId = $user->university_id
                ?? (function() use ($user) {
                    $adminInstituteId = $user->institute_id ?? 0;
                    return \DB::table('institutes')->where('id', $adminInstituteId)->value('university_id') ?? 0;
                })();
            if ($scholarship->university_id !== $allowedUniversityId) {
                return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
            }
        }
        if ($user->role === 'institute_admin' && $scholarship->institute_id !== ($user->institute_id ?? 0)) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $scholarship->delete();
        return response()->json(['success' => true, 'message' => 'Scholarship deleted']);
    }
}


