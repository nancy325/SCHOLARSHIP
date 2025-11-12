<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Institute;
use App\Models\University;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OptionsController extends Controller
{
    /**
     * Get institutes options for select inputs
     */
    public function institutes(Request $request): JsonResponse
    {
        try {
            $query = Institute::select('id', 'name', 'university_id')
                ->where('RecStatus', 'active')
                ->orderBy('name');

            return response()->json([
                'success' => true,
                'data' => $query->get(),
                'message' => 'Institutes retrieved successfully'
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
     * Get universities options for select inputs
     */
    public function universities(Request $request): JsonResponse
    {
        try {
            $query = University::select('id', 'name')
                ->where('RecStatus', 'active')
                ->orderBy('name');
            $user = $request->user();

            if ($user && ($user->role ?? null) === 'university_admin') {
                $universityId = $user->university_id
                    ?? (function() use ($user) {
                        $adminInstituteId = $user->institute_id ?? 0;
                        return \DB::table('institutes')->where('id', $adminInstituteId)->value('university_id') ?? 0;
                    })();
                if ($universityId) {
                    $query->where('id', $universityId);
                } else {
                    // if no scoping info, return empty list to avoid leakage
                    $query->whereRaw('1 = 0');
                }
            } elseif ($user && ($user->role ?? null) === 'institute_admin') {
                $adminInstituteId = $user->institute_id ?? 0;
                $universityId = \DB::table('institutes')->where('id', $adminInstituteId)->value('university_id') ?? 0;
                $query->where('id', $universityId);
            }

            return response()->json([
                'success' => true,
                'data' => $query->get(),
                'message' => 'Universities retrieved successfully'
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
     * Get scholarship types options
     */
    public function scholarshipTypes(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                ['value' => 'government', 'label' => 'Government'],
                ['value' => 'private', 'label' => 'Private'],
                ['value' => 'university', 'label' => 'University'],
                ['value' => 'institute', 'label' => 'Institute']
            ],
            'message' => 'Scholarship types retrieved successfully'
        ], 200);
    }

    /**
     * Get user categories options
     */
    public function userCategories(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                ['value' => 'high-school', 'label' => 'High School'],
                ['value' => 'diploma', 'label' => 'Diploma'],
                ['value' => 'undergraduate', 'label' => 'Undergraduate'],
                ['value' => 'postgraduate', 'label' => 'Postgraduate'],
                ['value' => 'other', 'label' => 'Other']
            ],
            'message' => 'User categories retrieved successfully'
        ], 200);
    }
}
