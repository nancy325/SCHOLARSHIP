<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\University;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UniversityController extends Controller
{
    /**
     * Create a new university
     */
    public function store(Request $request)
    {
        try {
            $user = $request->user();
            if (!in_array($user->role ?? 'student', ['super_admin', 'admin'], true)) {
                return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:universities,email',
                'phone' => 'nullable|string|max:20',
                'website' => 'nullable|url',
                'address' => 'nullable|string',
                'description' => 'nullable|string',
                'established' => 'nullable|string',
                'accreditation' => 'nullable|string',
                'status' => 'nullable|in:verified,pending,suspended,rejected',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $payload = $request->only([
                'name','email','phone','website','address','description','established','accreditation','status'
            ]);
            $payload['status'] = $payload['status'] ?? 'verified';
            $payload['students'] = 0;
            $payload['rating'] = 0;

            $university = University::create($payload);

            return response()->json([
                'success' => true,
                'message' => 'University created successfully',
                'data' => $university
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create university',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}


