<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

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

// Admin routes
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
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