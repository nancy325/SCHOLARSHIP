@extends('layouts.admin')
@php $editing = $user->exists; $self = $editing && $user->is(auth()->user()); @endphp
@section('title', $editing ? 'Edit user' : 'Add user')
@section('crumb', 'Platform / Users / ' . ($editing ? 'Edit' : 'New'))

@section('content')
<div class="page-title">
    <p class="small mb-1"><a href="{{ route('admin.users.index') }}"><x-icon name="arrow-left" /> All users</a></p>
    <h1>{{ $editing ? 'Edit ' . $user->name : 'Add user' }}</h1>
</div>
<form method="POST" action="{{ $editing ? route('admin.users.update', $user) : route('admin.users.store') }}" class="card" novalidate>
    @csrf @if ($editing) @method('PUT') @endif
    <div class="card-body">
        <div class="form-section">
            <h3>Account</h3>
            <div class="form-grid">
                @include('admin.partials.input', ['name' => 'name', 'label' => 'Full name', 'required' => true, 'value' => $user->name])
                @include('admin.partials.input', ['name' => 'email', 'label' => 'Email', 'type' => 'email', 'required' => true, 'value' => $user->email])
                @include('admin.partials.input', ['name' => 'password', 'label' => $editing ? 'New password' : 'Password', 'type' => 'password', 'required' => !$editing, 'value' => '', 'autocomplete' => 'new-password', 'hint' => $editing ? 'Leave blank to keep the current password.' : 'At least 8 characters.'])
                @include('admin.partials.input', ['name' => 'password_confirmation', 'label' => 'Confirm password', 'type' => 'password', 'value' => '', 'autocomplete' => 'new-password'])
                @include('admin.partials.select', ['name' => 'category', 'label' => 'Education level', 'required' => true, 'options' => $categories, 'value' => $user->category])
                @if ($editing && !$self)
                    @include('admin.partials.select', ['name' => 'RecStatus', 'label' => 'Account status', 'options' => ['active' => 'Active', 'inactive' => 'Deactivated (cannot sign in)'], 'value' => $user->RecStatus])
                @elseif ($self)
                    <input type="hidden" name="RecStatus" value="active">
                @endif
            </div>
        </div>
        <div class="form-section">
            <h3>Role &amp; access</h3>
            <div class="form-grid">
                @if ($self)
                    <input type="hidden" name="role" value="{{ $user->role }}">
                    <div class="field"><label>Role</label><input class="input" readonly value="{{ $user->roleLabel() }}"><span class="hint">You cannot change your own role.</span></div>
                @else
                    @include('admin.partials.select', ['name' => 'role', 'label' => 'Role', 'required' => true, 'options' => $roles, 'value' => $user->role])
                @endif
                @include('admin.partials.select', ['name' => 'university_id', 'label' => 'University', 'placeholder' => '— None —', 'options' => $universities->pluck('name', 'id')->all(), 'value' => $user->university_id, 'showWhen' => 'role=student,university_admin', 'hint' => 'Students see scholarships from this university. Required for university admins.'])
                @include('admin.partials.select', ['name' => 'institute_id', 'label' => 'Institute', 'placeholder' => '— None —', 'options' => $institutes->pluck('name', 'id')->all(), 'value' => $user->institute_id, 'showWhen' => 'role=student,institute_admin', 'hint' => 'Students see scholarships from this institute. Required for institute admins.'])
            </div>
        </div>
    </div>
    <div class="card-foot form-actions" style="margin-top:0">
        <a href="{{ route('admin.users.index') }}" class="btn btn-outline">Cancel</a>
        <button class="btn btn-primary" type="submit">{{ $editing ? 'Save changes' : 'Create user' }}</button>
    </div>
</form>
@endsection
