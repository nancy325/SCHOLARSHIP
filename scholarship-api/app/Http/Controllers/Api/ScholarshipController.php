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
                case 'admin':
                    // no restriction
                    break;
                case 'university_admin':
                    $query->where('university_id', $user->institute_id ?? 0);
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
            'university_id' => 'nullable|exists:institutes,id',
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
            if ($request->type !== 'university' || (int) $request->university_id !== (int) ($user->institute_id ?? 0)) {
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
        if ($user->role === 'university_admin' && $scholarship->university_id !== ($user->institute_id ?? 0)) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }
        if ($user->role === 'institute_admin' && $scholarship->institute_id !== ($user->institute_id ?? 0)) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:150',
            'description' => 'sometimes|required|string',
            'type' => 'sometimes|required|in:government,private,university,institute',
            'university_id' => 'nullable|exists:institutes,id',
            'institute_id' => 'nullable|exists:institutes,id',
            'eligibility' => 'nullable|string',
            'start_date' => 'nullable|date',
            'deadline' => 'sometimes|required|date',
            'apply_link' => 'sometimes|required|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $validator->errors()], 422);
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
        if ($user->role === 'university_admin' && $scholarship->university_id !== ($user->institute_id ?? 0)) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }
        if ($user->role === 'institute_admin' && $scholarship->institute_id !== ($user->institute_id ?? 0)) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $scholarship->delete();
        return response()->json(['success' => true, 'message' => 'Scholarship deleted']);
    }
}


