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

// Student dashboard (authenticated student)
Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
    Route::get('/student/dashboard', [StudentDashboardController::class, 'show']);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
});

// Public institutes options for select inputs
Route::get('/institutes/options', function () {
    return response()->json([
        'success' => true,
        'data' => Institute::select('id', 'name', 'university_id')->orderBy('name')->get(),
    ]);
});

Route::get('/universities/options', function () {
    return response()->json([
        'success' => true,
        'data' => University::select('id', 'name')->orderBy('name')->get(),
    ]);
});