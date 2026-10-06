<?php

namespace App\Http\Controllers\Web\Student;

use App\Http\Controllers\Controller;
use App\Models\Institute;
use App\Models\University;
use App\Services\EligibilityService;
use App\Services\ProfileService;
use App\Support\Options;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    public function __construct(private ProfileService $profiles)
    {
    }

    public function edit(Request $request, EligibilityService $eligibility)
    {
        $user = $request->user();

        return view('student.profile', [
            'user' => $user,
            'profile' => $this->profiles->getProfile($user),
            'categories' => Options::EDUCATION_LEVELS,
            'socialCategories' => Options::SOCIAL_CATEGORIES,
            'genders' => Options::GENDERS,
            'states' => Options::STATES,
            'universities' => University::where('RecStatus', 'active')->orderBy('name')->get(['id', 'name']),
            'institutes' => Institute::where('RecStatus', 'active')->orderBy('name')->get(['id', 'name', 'university_id']),
            'missingFacts' => $user->isAdmin() ? [] : $eligibility->missingFacts($user),
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', Rule::in(array_keys(Options::EDUCATION_LEVELS))],
            'university_id' => ['nullable', 'integer', 'exists:universities,id'],
            'institute_id' => ['nullable', 'integer', 'exists:institutes,id'],
        ]);

        $fields = ['dob', 'gender', 'socialCategory', 'disability', 'state', 'phone', 'parentOccupation', 'annualIncome',
            'course', 'year', 'mode', 'institution', 'prevPercentage', 'cgpa', 'hasScholarship', 'careerGoal'];
        $profileData = array_map(fn ($v) => $v ?? '', $request->only($fields));
        $profileData['name'] = $data['name'];
        if (!empty($data['category'])) {
            $profileData['category'] = $data['category'];
        }

        // ProfileService validates and stores the details in the profiles table
        $this->profiles->updateProfile($user, $profileData);

        // Students choose their own university / institute (admins' links are managed by the super admin)
        if (!$user->isAdmin()) {
            $universityId = $data['university_id'] ?? null;
            if (!empty($data['institute_id'])) {
                $universityId = Institute::whereKey($data['institute_id'])->value('university_id') ?? $universityId;
            }
            $user->update(['university_id' => $universityId, 'institute_id' => $data['institute_id'] ?? null]);
        }

        return redirect()->route('profile.edit')->with('success', 'Your profile has been saved. Your scholarship matches are updated.');
    }

    public function updatePassword(Request $request)
    {
        $request->validateWithBag('password', [
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->mixedCase()->numbers()->symbols()],
        ]);

        $request->user()->update(['password' => Hash::make($request->input('password'))]);

        return redirect()->route('profile.edit')->with('success', 'Your password has been changed.');
    }
}
