<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\University;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UniversityController extends Controller
{
    public const STATUSES = ['verified', 'pending', 'suspended', 'rejected'];

    public function index(Request $request)
    {
        $query = University::query()->withCount('institutes');

        $rec = $request->query('rec', 'active');
        if ($rec !== 'all') {
            $query->where('RecStatus', $rec === 'inactive' ? 'inactive' : 'active');
        }
        if ($search = $request->query('search')) {
            $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
        }

        return view('admin.universities.index', [
            'universities' => $query->orderBy('name')->paginate(15)->withQueryString(),
        ]);
    }

    public function create()
    {
        return view('admin.universities.form', ['university' => new University(['status' => 'verified']), 'statuses' => self::STATUSES]);
    }

    public function store(Request $request)
    {
        $university = new University($this->validated($request));
        $university->forceFill(['created_by' => $request->user()->id, 'RecStatus' => 'active'])->save();

        return redirect()->route('admin.universities.index')->with('success', 'University "' . $university->name . '" created.');
    }

    public function edit(University $university)
    {
        return view('admin.universities.form', ['university' => $university, 'statuses' => self::STATUSES]);
    }

    public function update(Request $request, University $university)
    {
        $university->update($this->validated($request, $university));

        return redirect()->route('admin.universities.index')->with('success', 'University updated.');
    }

    public function destroy(University $university)
    {
        $university->update(['RecStatus' => 'inactive']);

        return redirect()->route('admin.universities.index')->with('success', 'University deactivated.');
    }

    private function validated(Request $request, ?University $university = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(self::STATUSES)],
            'email' => ['required', 'email', Rule::unique('universities', 'email')->ignore($university?->id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'website' => ['nullable', 'url'],
            'address' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'established' => ['nullable', 'string', 'max:10'],
            'accreditation' => ['nullable', 'string', 'max:50'],
            'students' => ['nullable', 'integer', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
        ] + ($university ? ['RecStatus' => ['required', Rule::in(['active', 'inactive'])]] : []));
    }
}
