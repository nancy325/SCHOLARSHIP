@extends('layouts.admin')

@section('title', 'Application #' . $application->id)
@section('crumb', 'Applications / #' . $application->id)

@php
    $s = $application->scholarship;
    $st = $application->user;
    $labels = [
        'dob' => 'Date of birth', 'gender' => 'Gender', 'socialCategory' => 'Social category', 'state' => 'State', 'phone' => 'Phone', 'disability' => 'Disability',
        'parentOccupation' => 'Parent occupation', 'annualIncome' => 'Annual family income',
        'course' => 'Course', 'institution' => 'Institution', 'year' => 'Year', 'mode' => 'Mode of study',
        'prevPercentage' => 'Previous %', 'cgpa' => 'CGPA', 'hasScholarship' => 'Has other scholarship', 'careerGoal' => 'Career goal',
    ];
@endphp

@section('content')
<div class="page-title row-between">
    <div>
        <p class="small mb-1"><a href="{{ route('admin.applications.index') }}"><x-icon name="arrow-left" /> All applications</a></p>
        <h1>{{ $st?->name }}</h1>
        <p>Application #{{ $application->id }} for <strong>{{ $s?->title }}</strong></p>
    </div>
    @include('partials.status-badge', ['status' => $application->application_status])
</div>

<div class="layout-aside">
    <div class="stack">
        <div class="card">
            <div class="card-head"><h2>Student statement</h2></div>
            <div class="card-body"><p class="prose mb-0">{{ $application->notes ?: 'No statement provided.' }}</p></div>
        </div>

        <div class="card">
            <div class="card-head"><h2>Student profile</h2><span class="xs muted">{{ $st?->email }}</span></div>
            <div class="card-body">
                <dl class="dl">
                    <dt>Education level</dt><dd>{{ \App\Support\Options::EDUCATION_LEVELS[$st?->category] ?? '—' }}</dd>
                    @if ($st?->university)<dt>University</dt><dd>{{ $st->university->name }}</dd>@endif
                    @if ($st?->institute)<dt>Institute</dt><dd>{{ $st->institute->name }}</dd>@endif
                    @foreach ($labels as $key => $label)
                        <dt>{{ $label }}</dt><dd>@if (!filled($profile[$key] ?? null)) — @elseif ($key === 'annualIncome') {{ \App\Support\Options::rupees((int) $profile[$key]) }} @elseif ($key === 'socialCategory') {{ \App\Support\Options::SOCIAL_CATEGORIES[$profile[$key]] ?? $profile[$key] }} @else {{ ucwords(str_replace('_', ' ', $profile[$key])) }} @endif</dd>
                    @endforeach
                </dl>
            </div>
        </div>
    </div>

    <aside class="stack">
        <div class="card">
            <div class="card-head"><h3>Decision</h3></div>
            <div class="card-body">
                @if ($application->application_status === 'withdrawn')
                    <div class="alert alert-info mb-0"><x-icon name="info" /> The student withdrew this application.</div>
                @else
                    <form method="POST" action="{{ route('admin.applications.update', $application) }}" class="stack" novalidate>
                        @csrf @method('PUT')
                        <div class="field">
                            <span class="label">Status</span>
                            @foreach (['pending' => 'Pending review', 'approved' => 'Approve', 'rejected' => 'Reject'] as $v => $l)
                                <label class="check"><input type="radio" name="application_status" value="{{ $v }}" @checked(old('application_status', $application->application_status) === $v)> {{ $l }}</label>
                            @endforeach
                            @include('partials.field-error', ['name' => 'application_status'])
                        </div>
                        <div class="field">
                            <label for="admin_remarks">Remarks for the student</label>
                            <textarea id="admin_remarks" name="admin_remarks" rows="4" class="input @error('admin_remarks') is-invalid @enderror" maxlength="2000" placeholder="Required when rejecting">{{ old('admin_remarks', $application->admin_remarks) }}</textarea>
                            @include('partials.field-error', ['name' => 'admin_remarks'])
                        </div>
                        <button class="btn btn-primary btn-block" type="submit">Save decision</button>
                    </form>
                @endif
            </div>
        </div>

        <div class="card card-body">
            <h3>History</h3>
            <ul class="timeline">
                <li><strong>Submitted</strong><div class="xs muted">{{ $application->application_date?->format('d M Y, h:i A') }}</div></li>
                @if ($application->status_updated_at && $application->application_status !== 'pending')
                    <li><strong>{{ ucfirst($application->application_status) }}</strong>
                        <div class="xs muted">{{ $application->status_updated_at->format('d M Y, h:i A') }}{{ $application->reviewer ? ' by ' . $application->reviewer->name : '' }}</div></li>
                @endif
            </ul>
        </div>

        <div class="card card-body">
            <h3>Scholarship</h3>
            <dl class="dl" style="grid-template-columns: 80px 1fr; font-size:.86rem">
                <dt>Type</dt><dd>{{ ucfirst($s?->type) }}</dd>
                <dt>Provider</dt><dd>{{ $s?->providerName() }}</dd>
                <dt>Deadline</dt><dd>{{ $s?->deadline?->format('d M Y') }}</dd>
            </dl>
            <a href="{{ route('scholarships.show', $s) }}" target="_blank" class="btn btn-ghost btn-sm mt-1">View scholarship <x-icon name="external" /></a>
        </div>
    </aside>
</div>
@endsection
