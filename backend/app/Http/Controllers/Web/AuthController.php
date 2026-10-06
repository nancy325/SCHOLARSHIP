<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\Institute;
use App\Models\University;
use App\Models\User;
use App\Services\ProfileService;
use App\Support\Options;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /** kept for older references; use Options::EDUCATION_LEVELS */
    public const CATEGORIES = Options::EDUCATION_LEVELS;

    public function showLogin()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => 'The provided credentials are incorrect.']);
        }

        if (($user->RecStatus ?? 'active') !== 'active') {
            throw ValidationException::withMessages(['email' => 'Your account has been deactivated. Please contact support.']);
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        return redirect()->intended($user->isAdmin() ? route('admin.dashboard') : route('student.dashboard'))
            ->with('success', 'Welcome back, ' . $user->name . '!');
    }

    public function showRegister()
    {
        return view('auth.register', [
            'categories' => Options::EDUCATION_LEVELS,
            'socialCategories' => Options::SOCIAL_CATEGORIES,
            'genders' => Options::GENDERS,
            'states' => Options::STATES,
            'universities' => University::where('RecStatus', 'active')->orderBy('name')->get(['id', 'name']),
            'institutes' => Institute::where('RecStatus', 'active')->orderBy('name')->get(['id', 'name', 'university_id']),
        ]);
    }

    public function register(RegisterRequest $request, ProfileService $profiles)
    {
        $data = $request->validated();

        // Details needed to show the student only the scholarships they are eligible for
        if (is_string($request->input('annual_family_income'))) {
            $request->merge(['annual_family_income' => preg_replace('/[^\d]/', '', $request->input('annual_family_income'))]);
        }
        $extra = $request->validate([
            'annual_family_income' => ['required', 'integer', 'min:0', 'max:100000000'],
            'gender' => ['required', Rule::in(array_keys(Options::GENDERS))],
            'state' => ['required', Rule::in(Options::STATES)],
            'social_category' => ['nullable', Rule::in(array_keys(Options::SOCIAL_CATEGORIES))],
            'previous_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'university_id' => ['nullable', 'integer', Rule::exists('universities', 'id')->where('RecStatus', 'active')],
            'institute_id' => ['nullable', 'integer', Rule::exists('institutes', 'id')->where('RecStatus', 'active')],
        ], [
            'annual_family_income.required' => 'Please enter your annual family income — it is used to find scholarships you qualify for.',
        ]);

        $user = DB::transaction(function () use ($data, $extra, $profiles) {
            $universityId = $extra['university_id'] ?? null;
            if (!empty($extra['institute_id'])) {
                $universityId = Institute::whereKey($extra['institute_id'])->value('university_id') ?? $universityId;
            }

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'category' => $data['category'],
                'role' => 'student',
                'RecStatus' => 'active',
                'university_id' => $universityId,
                'institute_id' => $extra['institute_id'] ?? null,
            ]);

            $profiles->updateProfile($user, [
                'annualIncome' => $extra['annual_family_income'],
                'gender' => $extra['gender'],
                'state' => $extra['state'],
                'socialCategory' => $extra['social_category'] ?? null,
                'prevPercentage' => $extra['previous_percentage'] ?? null,
            ]);

            return $user;
        });

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('student.dashboard')
            ->with('success', 'Welcome! Here are the scholarships you are eligible for.');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')->with('success', 'You have been signed out.');
    }
}
