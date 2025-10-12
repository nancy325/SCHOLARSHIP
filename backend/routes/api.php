<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ScholarshipController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\OptionsController;
use App\Http\Controllers\Api\InstituteController;
use App\Http\Controllers\Api\UniversityController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\UserController;

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
        Route::get('/', [ScholarshipController::class, 'index']); // GET /scholarships (list all) or GET /scholarships?id=2 (get by ID)
    });
    
    // Admin routes with stricter rate limiting
    Route::middleware(['auth:sanctum', 'role:super_admin,admin,university_admin,institute_admin', 'throttle:30,1'])->group(function () {
        Route::post('/', [ScholarshipController::class, 'store']); // POST /scholarships (create)
        Route::put('/', [ScholarshipController::class, 'update']); // PUT /scholarships (update with ID in body)
        Route::delete('/', [ScholarshipController::class, 'destroy']); // DELETE /scholarships (delete with ID in body)
    });
});


// Profile routes (authenticated users)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
});

// Admin routes for universities and institutes (protected by auth and role)
Route::middleware(['auth:sanctum', 'role:super_admin,admin', 'throttle:60,1'])->group(function () {
    Route::apiResource('/universities', UniversityController::class);
    Route::apiResource('/institutes', InstituteController::class);
});

// Admin dashboard and user management routes
Route::middleware(['auth:sanctum', 'role:super_admin,admin', 'throttle:60,1'])->group(function () {
    Route::prefix('admin')->group(function () {
        Route::prefix('dashboard')->group(function () {
            Route::get('/stats', [AdminController::class, 'stats']);
            Route::get('/recent-activity', [AdminController::class, 'recentActivity']);
        });
        Route::get('/users', [UserController::class, 'index']); // GET /admin/users (list all) or GET /admin/users?id=2 (get by ID)
        Route::post('/users', [UserController::class, 'store']); // POST /admin/users (create)
        Route::put('/users', [UserController::class, 'update']); // PUT /admin/users (update with ID in body)
        Route::delete('/users', [UserController::class, 'destroy']); // DELETE /admin/users (delete with ID in body)
    });
});

// Public data endpoints for select inputs and dropdowns
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/institutes/options', [OptionsController::class, 'institutes']);
    Route::get('/universities/options', [OptionsController::class, 'universities'])->middleware('auth:sanctum');
    Route::get('/scholarship-types', [OptionsController::class, 'scholarshipTypes']);
    Route::get('/user-categories', [OptionsController::class, 'userCategories']);
    Route::get('/stats', [ScholarshipController::class, 'stats']);
    Route::get('/search', [ScholarshipController::class, 'search']);
});

// Fallback route for undefined endpoints
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Endpoint not found',
        'error' => 'The requested endpoint does not exist'
    ], 404);
});