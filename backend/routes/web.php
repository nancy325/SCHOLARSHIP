<?php

use App\Http\Controllers\Web\Admin;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\PageController;
use App\Http\Controllers\Web\ScholarshipController;
use App\Http\Controllers\Web\Student;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web (multi-page) routes
|--------------------------------------------------------------------------
| Server-rendered Blade pages. The JSON API in routes/api.php is unchanged.
*/

// Public pages
Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/faqs', [PageController::class, 'faqs'])->name('faqs');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::post('/contact', [PageController::class, 'submitContact'])
    ->middleware('throttle:10,1')->name('contact.submit');

Route::get('/scholarships', [ScholarshipController::class, 'index'])->name('scholarships.index');
Route::get('/scholarships/{scholarship}', [ScholarshipController::class, 'show'])
    ->whereNumber('scholarship')->name('scholarships.show');

// Authentication
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1')->name('login.submit');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1')->name('register.submit');
});
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

// Student area
Route::middleware(['auth', 'web.role:student'])->group(function () {
    Route::get('/dashboard', [Student\DashboardController::class, 'index'])->name('student.dashboard');

    Route::get('/my-applications', [Student\ApplicationController::class, 'index'])->name('student.applications.index');
    Route::get('/scholarships/{scholarship}/apply', [Student\ApplicationController::class, 'create'])
        ->whereNumber('scholarship')->name('student.applications.create');
    Route::post('/scholarships/{scholarship}/apply', [Student\ApplicationController::class, 'store'])
        ->whereNumber('scholarship')->name('student.applications.store');
    Route::post('/my-applications/{application}/withdraw', [Student\ApplicationController::class, 'withdraw'])
        ->name('student.applications.withdraw');
});

// Profile (any signed-in user)
Route::middleware(['auth', 'web.role'])->group(function () {
    Route::get('/profile', [Student\ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [Student\ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [Student\ProfileController::class, 'updatePassword'])->name('profile.password');
});

// Admin panel
Route::prefix('admin')->name('admin.')
    ->middleware(['auth', 'web.role:super_admin,admin,university_admin,institute_admin'])
    ->group(function () {
        Route::get('/', [Admin\DashboardController::class, 'index'])->name('dashboard');

        Route::resource('scholarships', Admin\ScholarshipController::class)->except('show');

        Route::get('/applications', [Admin\ApplicationController::class, 'index'])->name('applications.index');
        Route::get('/applications/{application}', [Admin\ApplicationController::class, 'show'])->name('applications.show');
        Route::put('/applications/{application}', [Admin\ApplicationController::class, 'update'])->name('applications.update');

        // Platform administration (super admin / admin only)
        Route::middleware('web.role:super_admin,admin')->group(function () {
            Route::resource('universities', Admin\UniversityController::class)->except('show');
            Route::resource('institutes', Admin\InstituteController::class)->except('show');
            Route::resource('users', Admin\UserController::class)->except('show');
            Route::get('/feedback', [Admin\FeedbackController::class, 'index'])->name('feedback.index');
        });
    });
