<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Institute;
use App\Models\University;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public const CATEGORIES = \App\Support\Options::EDUCATION_LEVELS;

    public function index(Request $request)
    {
        $query = User::query()->with(['university:id,name', 'institute:id,name'])->withCount('applications');

        $rec = $request->query('rec', 'active');
        if ($rec !== 'all') {
            $query->where('RecStatus', $rec === 'inactive' ? 'inactive' : 'active');
        }
        if ($role = $request->query('role')) {
            $query->where('role', $role);
        }
        if ($search = $request->query('search')) {
            $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
        }

        return view('admin.users.index', [
            'users' => $query->orderByDesc('id')->paginate(15)->withQueryString(),
            'roles' => $this->roles($request->user()),
        ]);
    }

    public function create(Request $request)
    {
        return view('admin.users.form', $this->formData($request, new User(['role' => 'student', 'category' => 'undergraduate'])));
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['password'] = Hash::make($data['password']);
        $data['RecStatus'] = 'active';
        $user = User::create($data);

        return redirect()->route('admin.users.index')->with('success', 'User "' . $user->name . '" created.');
    }

    public function edit(Request $request, User $user)
    {
        $this->guardTarget($request, $user);

        return view('admin.users.form', $this->formData($request, $user));
    }

    public function update(Request $request, User $user)
    {
        $this->guardTarget($request, $user);
        $data = $this->validated($request, $user);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        if ($user->is($request->user())) {
            // Never let an admin lock themselves out
            unset($data['role'], $data['RecStatus']);
        }

        $user->update($data);

        return redirect()->route('admin.users.index')->with('success', 'User updated.');
    }

    public function destroy(Request $request, User $user)
    {
        $this->guardTarget($request, $user);

        if ($user->is($request->user())) {
            return back()->with('error', 'You cannot deactivate your own account.');
        }

        $user->update(['RecStatus' => 'inactive']);

        return redirect()->route('admin.users.index')->with('success', 'User deactivated.');
    }

    /** Roles the current admin may assign. Only a super admin can manage super admins. */
    private function roles(User $actor): array
    {
        $roles = [
            'student' => 'Student',
            'institute_admin' => 'Institute Admin',
            'university_admin' => 'University Admin',
            'admin' => 'Admin',
        ];
        if ($actor->role === 'super_admin') {
            $roles['super_admin'] = 'Super Admin';
        }

        return $roles;
    }

    private function guardTarget(Request $request, User $target): void
    {
        abort_if(
            $target->role === 'super_admin' && $request->user()->role !== 'super_admin',
            403,
            'Only a super admin can manage super admin accounts.'
        );
    }

    private function formData(Request $request, User $user): array
    {
        return [
            'user' => $user,
            'roles' => $this->roles($request->user()),
            'categories' => self::CATEGORIES,
            'universities' => University::where('RecStatus', 'active')->orderBy('name')->get(['id', 'name']),
            'institutes' => Institute::where('RecStatus', 'active')->orderBy('name')->get(['id', 'name']),
        ];
    }

    private function validated(Request $request, ?User $user = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user?->id)],
            'password' => [$user ? 'nullable' : 'required', 'string', 'min:8', 'confirmed'],
            'category' => ['required', Rule::in(array_keys(self::CATEGORIES))],
            'role' => ['required', Rule::in(array_keys($this->roles($request->user())))],
            'university_id' => ['nullable', 'required_if:role,university_admin', 'exists:universities,id'],
            'institute_id' => ['nullable', 'required_if:role,institute_admin', 'exists:institutes,id'],
        ] + ($user ? ['RecStatus' => ['required', Rule::in(['active', 'inactive'])]] : []));

        // University admins are tied to a university only; institute admins inherit their institute's university
        if ($data['role'] === 'university_admin') {
            $data['institute_id'] = null;
        } elseif ($data['role'] === 'institute_admin') {
            $data['university_id'] = Institute::whereKey($data['institute_id'])->value('university_id');
        }

        return $data;
    }
}
