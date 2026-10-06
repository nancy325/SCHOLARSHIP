@extends('layouts.admin')
@section('crumb', 'Scholarships / Apply')

@section('title', 'Apply — ' . $scholarship->title)

@php
    $keyFields = ['phone' => 'Phone', 'course' => 'Course', 'annualIncome' => 'Annual family income', 'prevPercentage' => 'Previous %', 'cgpa' => 'CGPA'];
    $missing = collect($keyFields)->filter(fn ($l, $k) => blank($profile[$k] ?? null));
@endphp

@section('content')
<p class="small"><a href="{{ route('scholarships.show', $scholarship) }}"><x-icon name="arrow-left" /> Back to scholarship</a></p>
<div class="layout-aside">
    <div class="card">
        <div class="card-head">
            <div>
                <h1 class="mb-0" style="font-size: 1.35rem">Apply for {{ $scholarship->title }}</h1>
                <p class="xs muted mb-0">{{ $scholarship->providerName() }} · Deadline {{ $scholarship->deadline?->format('d M Y') }}</p>
            </div>
        </div>
        <div class="card-body">
            @if ($missing->isNotEmpty())
                <div class="alert alert-warning">
                    <x-icon name="alert" />
                    <div>Your profile is missing: <strong>{{ $missing->implode(', ') }}</strong>. Reviewers see your profile with this application —
                        <a href="{{ route('profile.edit') }}">complete it first</a> for a stronger application.</div>
                </div>
            @endif

            <form method="POST" action="{{ route('student.applications.store', $scholarship) }}" novalidate>
                @csrf
                <div class="field">
                    <label for="notes">Why should you receive this scholarship? <span class="req">*</span></label>
                    <textarea id="notes" name="notes" rows="9" class="input @error('notes') is-invalid @enderror" maxlength="3000" data-counter="#notes-count"
                        placeholder="Tell the reviewers about your academic achievements, financial situation and goals.">{{ old('notes') }}</textarea>
                    <span class="hint"><span id="notes-count">0</span> / 3000 characters · minimum 30</span>
                    @include('partials.field-error', ['name' => 'notes'])
                </div>

                <label class="check mt-2">
                    <input type="checkbox" name="confirm" value="1" @checked(old('confirm'))>
                    <span>I confirm that the information in my profile and this application is true, and I meet the eligibility criteria.</span>
                </label>
                @include('partials.field-error', ['name' => 'confirm'])

                <div class="form-actions">
                    <a href="{{ route('scholarships.show', $scholarship) }}" class="btn btn-outline">Cancel</a>
                    <button type="submit" class="btn btn-primary">Submit application</button>
                </div>
            </form>
        </div>
    </div>

    <aside class="stack">
        <div class="card card-body">
            <h3>Eligibility check</h3>
            @if ($check['checks'])
                <ul class="checklist">
                    @foreach ($check['checks'] as $c)
                        <li><span class="st st-{{ $c['status'] }}">{{ ['pass' => '✓', 'fail' => '✕', 'unknown' => '?'][$c['status']] }}</span>
                            <div><div class="fw-600">{{ $c['label'] }}</div><div class="xs muted">{{ $c['requirement'] }} · {{ $c['you'] }}</div></div></li>
                    @endforeach
                </ul>
            @endif
            <p class="prose small mt-1 mb-0">{{ $scholarship->eligibility ?: 'See the official website for details.' }}</p>
        </div>
        <div class="card card-body">
            <h3>Your profile snapshot</h3>
            <dl class="dl" style="grid-template-columns: 120px 1fr; font-size: .85rem">
                <dt>Name</dt><dd>{{ $profile['name'] ?: '—' }}</dd>
                @foreach ($keyFields as $k => $l)
                    <dt>{{ $l }}</dt><dd>{{ $k === 'annualIncome' && $profile[$k] !== '' ? \App\Support\Options::rupees((int) $profile[$k]) : ($profile[$k] !== '' ? $profile[$k] : '—') }}</dd>
                @endforeach
            </dl>
            <a href="{{ route('profile.edit') }}" class="btn btn-ghost btn-sm mt-2">Edit profile</a>
        </div>
    </aside>
</div>
@endsection
