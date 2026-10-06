@extends('layouts.admin')
@php
    $editing = $institute->exists;
    $typeOptions = $types;
    if ($institute->type && !isset($typeOptions[$institute->type])) { $typeOptions[$institute->type] = ucwords(str_replace('_', ' ', $institute->type)); }
@endphp
@section('title', $editing ? 'Edit institute' : 'Add institute')
@section('crumb', 'Platform / Institutes / ' . ($editing ? 'Edit' : 'New'))

@section('content')
<div class="page-title">
    <p class="small mb-1"><a href="{{ route('admin.institutes.index') }}"><x-icon name="arrow-left" /> All institutes</a></p>
    <h1>{{ $editing ? 'Edit ' . $institute->name : 'Add institute' }}</h1>
</div>
<form method="POST" action="{{ $editing ? route('admin.institutes.update', $institute) : route('admin.institutes.store') }}" class="card" novalidate>
    @csrf @if ($editing) @method('PUT') @endif
    <div class="card-body">
        <div class="form-grid">
            @include('admin.partials.input', ['name' => 'name', 'label' => 'Name', 'required' => true, 'value' => $institute->name, 'span' => 2])
            @include('admin.partials.select', ['name' => 'university_id', 'label' => 'University', 'required' => true, 'placeholder' => 'Select university…', 'options' => $universities->pluck('name', 'id')->all(), 'value' => $institute->university_id])
            @include('admin.partials.select', ['name' => 'type', 'label' => 'Type', 'required' => true, 'options' => $typeOptions, 'value' => $institute->type])
            @include('admin.partials.input', ['name' => 'email', 'label' => 'Email', 'type' => 'email', 'required' => true, 'value' => $institute->email])
            @include('admin.partials.input', ['name' => 'phone', 'label' => 'Phone', 'value' => $institute->phone])
            @include('admin.partials.input', ['name' => 'website', 'label' => 'Website', 'type' => 'url', 'value' => $institute->website, 'placeholder' => 'https://'])
            @include('admin.partials.select', ['name' => 'status', 'label' => 'Verification', 'options' => array_combine($statuses, array_map('ucfirst', $statuses)), 'value' => $institute->status])
            @include('admin.partials.input', ['name' => 'contact_person', 'label' => 'Contact person', 'value' => $institute->contact_person])
            @include('admin.partials.input', ['name' => 'contact_phone', 'label' => 'Contact phone', 'value' => $institute->contact_phone])
            @include('admin.partials.input', ['name' => 'established', 'label' => 'Established (year)', 'value' => $institute->established])
            @include('admin.partials.input', ['name' => 'accreditation', 'label' => 'Accreditation', 'value' => $institute->accreditation])
            @include('admin.partials.input', ['name' => 'students', 'label' => 'Number of students', 'type' => 'number', 'value' => $institute->students])
            @include('admin.partials.input', ['name' => 'rating', 'label' => 'Rating (0–5)', 'type' => 'number', 'value' => $institute->rating, 'step' => '0.1'])
            @include('admin.partials.textarea', ['name' => 'address', 'label' => 'Address', 'value' => $institute->address, 'rows' => 2])
            @include('admin.partials.textarea', ['name' => 'description', 'label' => 'Description', 'value' => $institute->description])
            @if ($editing)
                @include('admin.partials.select', ['name' => 'RecStatus', 'label' => 'Record status', 'options' => ['active' => 'Active', 'inactive' => 'Deactivated'], 'value' => $institute->RecStatus])
            @endif
        </div>
    </div>
    <div class="card-foot form-actions" style="margin-top:0">
        <a href="{{ route('admin.institutes.index') }}" class="btn btn-outline">Cancel</a>
        <button class="btn btn-primary" type="submit">{{ $editing ? 'Save changes' : 'Create institute' }}</button>
    </div>
</form>
@endsection
