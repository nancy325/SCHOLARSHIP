<?php

namespace App\Services;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use App\Support\Options;

/**
 * Student profile stored in the `profiles` table.
 *
 * The array format (camelCase keys) is the same one the API and the old JSON files used,
 * so /api/profile keeps working. Old storage/app/private/profiles/{id}.json files are
 * imported into the database automatically the first time a profile is read.
 */
class ProfileService
{
    /** array key => profiles column */
    private const MAP = [
        'dob' => 'dob',
        'gender' => 'gender',
        'socialCategory' => 'social_category',
        'disability' => 'disability',
        'state' => 'state',
        'phone' => 'phone',
        'parentOccupation' => 'parent_occupation',
        'annualIncome' => 'annual_family_income',
        'course' => 'course',
        'year' => 'current_year',
        'mode' => 'study_mode',
        'institution' => 'institution',
        'prevPercentage' => 'previous_percentage',
        'cgpa' => 'cgpa',
        'hasScholarship' => 'has_other_scholarship',
        'careerGoal' => 'career_goal',
    ];

    public function model(User $user): Profile
    {
        $profile = $user->profile ?? Profile::firstOrNew(['user_id' => $user->id]);

        if (!$profile->exists) {
            $this->importLegacyJson($user, $profile);
        }

        return $profile;
    }

    public function getProfile(User $user): array
    {
        $profile = $this->model($user);

        $data = [
            'name' => $user->name ?? '',
            'email' => $user->email ?? '',
            'category' => $user->category ?? '',
        ];
        foreach (self::MAP as $key => $column) {
            $value = $profile->{$column};
            if ($value instanceof \DateTimeInterface) {
                $value = $value->format('Y-m-d');
            }
            $data[$key] = $value ?? '';
        }

        return $data;
    }

    public function updateProfile(User $user, array $data): array
    {
        $validated = $this->validateData($data);

        $profile = $this->model($user);
        foreach (self::MAP as $key => $column) {
            if (array_key_exists($key, $validated)) {
                $profile->{$column} = $validated[$key] === '' ? null : $validated[$key];
            }
        }
        $profile->user_id = $user->id;
        $profile->save();

        $userChanges = array_filter([
            'name' => $validated['name'] ?? null,
            'category' => $validated['category'] ?? null,
        ]);
        if ($userChanges) {
            $user->update($userChanges);
        }

        $user->setRelation('profile', $profile);

        return $this->getProfile($user);
    }

    /** Percentage of the key eligibility fields that are filled in */
    public function completion(User $user): int
    {
        $p = $this->getProfile($user);
        $keys = ['category', 'annualIncome', 'gender', 'state', 'socialCategory', 'prevPercentage', 'course', 'institution', 'phone', 'dob'];
        $filled = collect($keys)->filter(fn ($k) => filled($p[$k] ?? null))->count();

        return (int) round($filled / count($keys) * 100);
    }

    private function validateData(array $data): array
    {
        // Accept "2,50,000" style input for income
        if (isset($data['annualIncome']) && is_string($data['annualIncome'])) {
            $digits = preg_replace('/[^\d]/', '', $data['annualIncome']);
            $data['annualIncome'] = $digits === '' ? null : (int) $digits;
        }

        $validator = Validator::make($data, [
            'name' => 'nullable|string|max:255',
            'category' => ['nullable', Rule::in(array_keys(Options::EDUCATION_LEVELS))],
            'dob' => 'nullable|date|before:today',
            'gender' => ['nullable', Rule::in(array_keys(Options::GENDERS))],
            'socialCategory' => ['nullable', Rule::in(array_keys(Options::SOCIAL_CATEGORIES))],
            'disability' => 'nullable|in:yes,no',
            'state' => ['nullable', Rule::in(Options::STATES)],
            'phone' => 'nullable|string|max:20',
            'parentOccupation' => 'nullable|string|max:255',
            'annualIncome' => 'nullable|integer|min:0|max:100000000',
            'course' => 'nullable|string|max:255',
            'year' => 'nullable|string|max:10',
            'mode' => 'nullable|string|max:20',
            'institution' => 'nullable|string|max:255',
            'prevPercentage' => 'nullable|numeric|min:0|max:100',
            'cgpa' => 'nullable|numeric|min:0|max:10',
            'hasScholarship' => 'nullable|in:yes,no',
            'careerGoal' => 'nullable|string|max:255',
        ], [], [
            'annualIncome' => 'annual family income',
            'prevPercentage' => 'previous exam percentage',
            'socialCategory' => 'social category',
            'category' => 'education level',
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        return $validator->validated();
    }

    private function importLegacyJson(User $user, Profile $profile): void
    {
        $path = "profiles/{$user->id}.json";
        if (!Storage::disk('local')->exists($path)) {
            return;
        }

        $old = json_decode(Storage::disk('local')->get($path), true) ?: [];
        $income = $old['annualIncome'] ?? null;
        $brackets = ['below_1l' => 100000, '1l_2.5l' => 250000, '2.5l_5l' => 500000, '5l_8l' => 800000];
        $income = $brackets[$income] ?? (preg_replace('/[^\d]/', '', (string) $income) ?: null);

        $profile->fill([
            'dob' => strtotime($old['dob'] ?? '') ? $old['dob'] : null,
            'gender' => in_array($old['gender'] ?? '', array_keys(Options::GENDERS), true) ? $old['gender'] : null,
            'state' => in_array($old['state'] ?? '', Options::STATES, true) ? $old['state'] : null,
            'phone' => $old['phone'] ?? null,
            'disability' => in_array($old['disability'] ?? '', ['yes', 'no'], true) ? $old['disability'] : null,
            'parent_occupation' => $old['parentOccupation'] ?? null,
            'annual_family_income' => $income !== null ? (int) $income : null,
            'course' => $old['course'] ?? null,
            'current_year' => $old['year'] ?? null,
            'study_mode' => $old['mode'] ?? null,
            'institution' => $old['institution'] ?? null,
            'previous_percentage' => is_numeric($old['prevPercentage'] ?? null) ? $old['prevPercentage'] : null,
            'cgpa' => is_numeric($old['cgpa'] ?? null) ? $old['cgpa'] : null,
            'has_other_scholarship' => in_array($old['hasScholarship'] ?? '', ['yes', 'no'], true) ? $old['hasScholarship'] : null,
            'career_goal' => $old['careerGoal'] ?? null,
        ]);
        $profile->user_id = $user->id;
        $profile->save();
    }
}
