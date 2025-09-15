<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Models\Institute;
use App\Models\University;
use App\Http\Controllers\Api\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Api\ProfileController;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// Admin routes (all admin roles)
Route::prefix('admin')->middleware(['auth:sanctum', 'role:super_admin,admin,university_admin,institute_admin'])->group(function () {
    // Dashboard
    Route::get('/dashboard/stats', [\App\Http\Controllers\Api\Admin\AdminController::class, 'getDashboardStats']);
    Route::get('/dashboard/activity', [\App\Http\Controllers\Api\Admin\AdminController::class, 'getRecentActivity']);
    Route::get('/dashboard/analytics', [\App\Http\Controllers\Api\Admin\AdminController::class, 'getAnalytics']);
    
    // Users
    Route::apiResource('users', \App\Http\Controllers\Api\Admin\UserController::class);
    Route::get('/users/stats', [\App\Http\Controllers\Api\Admin\UserController::class, 'getStats']);
    
    // Institutes
    Route::apiResource('institutes', \App\Http\Controllers\Api\Admin\InstituteController::class);
    Route::get('/institutes/stats', [\App\Http\Controllers\Api\Admin\InstituteController::class, 'getStats']);
    
    // Scholarships
    Route::apiResource('scholarships', \App\Http\Controllers\Api\Admin\ScholarshipController::class);
    Route::get('/scholarships/stats', [\App\Http\Controllers\Api\Admin\ScholarshipController::class, 'getStats']);
    Route::get('/scholarships/institutes', [\App\Http\Controllers\Api\Admin\ScholarshipController::class, 'getInstitutes']);

    // Universities
    Route::middleware('role:super_admin,admin,university_admin')->post('/universities', [\App\Http\Controllers\Api\Admin\UniversityController::class, 'store']);
});

// Public/Protected Scholarship routes per spec
Route::prefix('scholarships')->group(function () {
    Route::get('/', [\App\Http\Controllers\Api\ScholarshipController::class, 'index']);
    Route::get('/{id}', [\App\Http\Controllers\Api\ScholarshipController::class, 'show']);
    Route::middleware(['auth:sanctum', 'role:super_admin,admin,university_admin,institute_admin'])->group(function () {
        Route::post('/', [\App\Http\Controllers\Api\ScholarshipController::class, 'store']);
        Route::put('/{id}', [\App\Http\Controllers\Api\ScholarshipController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\Api\ScholarshipController::class, 'destroy']);
    });
});

<<<<<<< Updated upstream
// Student dashboard (authenticated student)
Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
    Route::get('/student/dashboard', [StudentDashboardController::class, 'show']);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
});

// Public institutes options for select inputs
Route::get('/institutes/options', function () {
=======
// Institutes options for select inputs (auth to enable role scoping)
Route::middleware('auth:sanctum')->get('/institutes/options', function (Request $request) {
    $query = Institute::select('id', 'name', 'university_id')->orderBy('name');
    $user = $request->user();
    if ($user && ($user->role ?? null) === 'university_admin') {
        $universityId = $user->university_id
            ?? (function() use ($user) {
                $adminInstituteId = $user->institute_id ?? 0;
                return \DB::table('institutes')->where('id', $adminInstituteId)->value('university_id') ?? 0;
            })();
        $query->where('university_id', $universityId);
    } elseif ($user && ($user->role ?? null) === 'institute_admin') {
        $query->where('id', $user->institute_id ?? 0);
    }
>>>>>>> Stashed changes
    return response()->json([
        'success' => true,
        'data' => $query->get(),
    ]);
});

// Universities options for select inputs (auth to enable role scoping)
Route::middleware('auth:sanctum')->get('/universities/options', function (Request $request) {
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
    ]);
});