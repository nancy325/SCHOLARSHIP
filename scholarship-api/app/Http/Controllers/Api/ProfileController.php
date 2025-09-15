<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
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

    public function show(Request $request)
    {
        $user = $request->user();
        $path = $this->getProfilePath($user->id);

        if (!Storage::disk('local')->exists($path)) {
            $data = $this->defaultProfile($user->only(['name', 'email', 'category']));
            return response()->json(['success' => true, 'data' => $data]);
        }

        $raw = Storage::disk('local')->get($path);
        $data = json_decode($raw, true) ?: [];
        $data = array_merge($this->defaultProfile($user->only(['name', 'email', 'category'])), $data);

        return response()->json(['success' => true, 'data' => $data]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
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
        ]);

        $path = $this->getProfilePath($user->id);
        $existing = [];
        if (Storage::disk('local')->exists($path)) {
            $existing = json_decode(Storage::disk('local')->get($path), true) ?: [];
        }

        $merged = array_merge($this->defaultProfile($user->only(['name', 'email', 'category'])), $existing, $validated);

        Storage::disk('local')->put($path, json_encode($merged));

        return response()->json(['success' => true, 'data' => $merged, 'message' => 'Profile saved']);
    }
}


