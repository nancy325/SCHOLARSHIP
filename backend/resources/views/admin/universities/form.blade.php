@extends('layouts.admin')
@php $editing = $university->exists; @endphp
@section('title', $editing ? 'Edit university' : 'Add university')
@section('crumb', 'Platform / Universities / ' . ($editing ? 'Edit' : 'New'))

@section('content')
<div class="page-title">
    <p class="small mb-1"><a href="{{ route('admin.universities.index') }}"><x-icon name="arrow-left" /> All universities</a></p>
    <h1>{{ $editing ? 'Edit ' . $university->name : 'Add university' }}</h1>
</div>
<form method="POST" action="{{ $editing ? route('admin.universities.update', $university) : route('admin.universities.store') }}" class="card" novalidate>
    @csrf @if ($editing) @method('PUT') @endif
    <div class="card-body">
        <div class="form-grid">
            @include('admin.partials.input', ['name' => 'name', 'label' => 'Name', 'required' => true, 'value' => $university->name, 'span' => 2])
            @include('admin.partials.input', ['name' => 'email', 'label' => 'Email', 'type' => 'email', 'required' => true, 'value' => $university->email])
            @include('admin.partials.input', ['name' => 'phone', 'label' => 'Phone', 'value' => $university->phone])
            @include('admin.partials.input', ['name' => 'website', 'label' => 'Website', 'type' => 'url', 'value' => $university->website, 'placeholder' => 'https://'])
            @include('admin.partials.select', ['name' => 'status', 'label' => 'Verification', 'options' => array_combine($statuses, array_map('ucfirst', $statuses)), 'value' => $university->status])
            @include('admin.partials.input', ['name' => 'established', 'label' => 'Established (year)', 'value' => $university->established])
            @include('admin.partials.input', ['name' => 'accreditation', 'label' => 'Accreditation', 'value' => $university->accreditation])
            @include('admin.partials.input', ['name' => 'students', 'label' => 'Number of students', 'type' => 'number', 'value' => $university->students])
            @include('admin.partials.input', ['name' => 'rating', 'label' => 'Rating (0–5)', 'type' => 'number', 'value' => $university->rating, 'step' => '0.1'])
            @include('admin.partials.textarea', ['name' => 'address', 'label' => 'Address', 'value' => $university->address, 'rows' => 2])
            @include('admin.partials.textarea', ['name' => 'description', 'label' => 'Description', 'value' => $university->description])
            @if ($editing)
                @include('admin.partials.select', ['name' => 'RecStatus', 'label' => 'Record status', 'options' => ['active' => 'Active', 'inactive' => 'Deactivated'], 'value' => $university->RecStatus])
            @endif
        </div>
    </div>
    <div class="card-foot form-actions" style="margin-top:0">
        <a href="{{ route('admin.universities.index') }}" class="btn btn-outline">Cancel</a>
        <button class="btn btn-primary" type="submit">{{ $editing ? 'Save changes' : 'Create university' }}</button>
    </div>
</form>
@endsection
