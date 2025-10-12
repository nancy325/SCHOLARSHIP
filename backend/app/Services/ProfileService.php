<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProfileService
{
    private function getProfilePath(int $userId): string
    {
        return "profiles/{$userId}.json";
    }

    private function defaultProfile(array $user): array
    {
        return [
            'name' => $user['name'] ?? '',
            'dob' => '',
            'gender' => '',
            'category' => $user['category'] ?? '',
            'disability' => '',
            'state' => '',
            'email' => $user['email'] ?? '',
            'phone' => '',
            'parentOccupation' => '',
            'annualIncome' => '',
            'course' => '',
            'year' => '',
            'mode' => '',
            'institution' => '',
            'prevPercentage' => '',
            'cgpa' => '',
            'hasScholarship' => '',
            'careerGoal' => '',
        ];
    }

    public function getProfile(User $user): array
    {
        $path = $this->getProfilePath($user->id);

        if (!Storage::disk('local')->exists($path)) {
            return $this->defaultProfile($user->only(['name', 'email', 'category']));
        }

        try {
            $raw = Storage::disk('local')->get($path);
            $data = json_decode($raw, true) ?: [];
            return array_merge($this->defaultProfile($user->only(['name', 'email', 'category'])), $data);
        } catch (\Exception $e) {
            throw new \Exception('Failed to read profile data: ' . $e->getMessage());
        }
    }

    public function updateProfile(User $user, array $data): array
    {
        $validated = $this->validateData($data);

        $path = $this->getProfilePath($user->id);
        $existing = [];
        if (Storage::disk('local')->exists($path)) {
            try {
                $raw = Storage::disk('local')->get($path);
                $existing = json_decode($raw, true) ?: [];
            } catch (\Exception $e) {
                throw new \Exception('Failed to read existing profile: ' . $e->getMessage());
            }
        }

        $merged = array_merge($this->defaultProfile($user->only(['name', 'email', 'category'])), $existing, $validated);

        try {
            Storage::disk('local')->put($path, json_encode($merged, JSON_PRETTY_PRINT));
            return $merged;
        } catch (\Exception $e) {
            throw new \Exception('Failed to save profile: ' . $e->getMessage());
        }
    }

    private function validateData(array $data): array
    {
        $rules = [
            'name' => 'nullable|string|max:255',
            'dob' => 'nullable|date',
            'gender' => 'nullable|string|max:50',
            'category' => 'nullable|string|max:50',
            'disability' => 'nullable|string|max:50',
            'state' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'parentOccupation' => 'nullable|string|max:255',
            'annualIncome' => 'nullable|string|max:50',
            'course' => 'nullable|string|max:255',
            'year' => 'nullable|string|max:50',
            'mode' => 'nullable|string|max:50',
            'institution' => 'nullable|string|max:255',
            'prevPercentage' => 'nullable|string|max:10',
            'cgpa' => 'nullable|string|max:10',
            'hasScholarship' => 'nullable|string|max:10',
            'careerGoal' => 'nullable|string|max:255',
        ];

        $validator = \Validator::make($data, $rules);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        return $validator->validated();
    }
}
