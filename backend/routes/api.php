<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ScholarshipController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\ProfileController;
use App\Models\Institute;
use App\Models\University;
use App\Models\Scholarship;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is running',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0'
    ]);
});

// Authentication routes
Route::prefix('auth')->group(function () {
    // Rate limit authentication endpoints
    Route::middleware('throttle:5,1')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// Public/Protected Scholarship routes
Route::prefix('scholarships')->group(function () {
    // Public routes with rate limiting
    Route::middleware('throttle:100,1')->group(function () {
        Route::get('/', [ScholarshipController::class, 'index']);
        Route::get('/{id}', [ScholarshipController::class, 'show']);
    });
    
    // Admin routes with stricter rate limiting
    Route::middleware(['auth:sanctum', 'role:super_admin,admin,university_admin,institute_admin', 'throttle:30,1'])->group(function () {
        Route::post('/', [ScholarshipController::class, 'store']);
        Route::put('/{id}', [ScholarshipController::class, 'update']);
        Route::delete('/{id}', [ScholarshipController::class, 'destroy']);
    });
});

// Application routes (authenticated users)
Route::prefix('applications')->middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::get('/my-applications', [ApplicationController::class, 'myApplications']);
    Route::get('/stats', [ApplicationController::class, 'stats']);
    Route::get('/{id}', [ApplicationController::class, 'show']);
    Route::post('/', [ApplicationController::class, 'store']);
    Route::delete('/{id}', [ApplicationController::class, 'destroy']);
});

// Profile routes (authenticated users)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
});

// Public data endpoints for select inputs and dropdowns
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/institutes/options', function (Request $request) {
    try {
        $query = Institute::select('id', 'name', 'university_id')->orderBy('name');
        
        return response()->json([
            'success' => true,
            'data' => $query->get(),
            'message' => 'Institutes retrieved successfully'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to retrieve institutes',
            'error' => $e->getMessage()
        ], 500);
    }
});

Route::middleware('auth:sanctum')->get('/universities/options', function (Request $request) {
    try {
        $query = University::select('id', 'name')->orderBy('name');
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
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to retrieve universities',
            'error' => $e->getMessage()
        ], 500);
    }
});

    // Scholarship categories/types endpoint
    Route::get('/scholarship-types', function () {
    return response()->json([
        'success' => true,
        'data' => [
            ['value' => 'government', 'label' => 'Government'],
            ['value' => 'private', 'label' => 'Private'],
            ['value' => 'university', 'label' => 'University'],
            ['value' => 'institute', 'label' => 'Institute']
        ],
        'message' => 'Scholarship types retrieved successfully'
    ]);
});

    // User categories endpoint
    Route::get('/user-categories', function () {
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
    ]);
});

    // Statistics endpoint (public)
    Route::get('/stats', function () {
    try {
        $totalScholarships = Scholarship::count();
        $activeScholarships = Scholarship::where('deadline', '>=', now())->count();
        $governmentScholarships = Scholarship::where('type', 'government')->count();
        $privateScholarships = Scholarship::where('type', 'private')->count();
        $universityScholarships = Scholarship::where('type', 'university')->count();
        $instituteScholarships = Scholarship::where('type', 'institute')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_scholarships' => $totalScholarships,
                'active_scholarships' => $activeScholarships,
                'by_type' => [
                    'government' => $governmentScholarships,
                    'private' => $privateScholarships,
                    'university' => $universityScholarships,
                    'institute' => $instituteScholarships
                ]
            ],
            'message' => 'Statistics retrieved successfully'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to retrieve statistics',
            'error' => $e->getMessage()
        ], 500);
    }
});

    // Search endpoint
    Route::get('/search', function (Request $request) {
    try {
        $query = $request->get('q', '');
        $type = $request->get('type');
        $universityId = $request->get('university_id');
        $instituteId = $request->get('institute_id');
        $perPage = $request->get('per_page', 15);

        $scholarships = Scholarship::with(['university:id,name', 'institute:id,name'])
            ->when($query, function ($q) use ($query) {
                $q->where(function ($subQ) use ($query) {
                    $subQ->where('title', 'like', "%{$query}%")
                         ->orWhere('description', 'like', "%{$query}%");
                });
            })
            ->when($type, function ($q) use ($type) {
                $q->where('type', $type);
            })
            ->when($universityId, function ($q) use ($universityId) {
                $q->where('university_id', $universityId);
            })
            ->when($instituteId, function ($q) use ($instituteId) {
                $q->where('institute_id', $instituteId);
            })
            ->where('deadline', '>=', now())
            ->orderBy('deadline', 'asc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $scholarships,
            'message' => 'Search completed successfully'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Search failed',
            'error' => $e->getMessage()
        ], 500);
    }
    });
});

// Fallback route for undefined endpoints
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Endpoint not found',
        'error' => 'The requested endpoint does not exist'
    ], 404);
});