@extends('layouts.admin')

@section('title', 'My profile')
@section('crumb', 'Account / My profile')

@php
    $v = fn ($key) => old($key, $profile[$key] ?? '');
    $select = function ($key, array $options) use ($v) {
        return collect($options)->map(fn ($label, $value) => '<option value="' . e($value) . '"' . ((string) $v($key) === (string) $value ? ' selected' : '') . '>' . e($label) . '</option>')->implode('');
    };
@endphp

@section('content')
<div class="page-title">
    <h1>My profile</h1>
    <p>{{ $user->isAdmin() ? 'Your account details.' : 'These details are shared with reviewers when you apply for a scholarship.' }}</p>
</div>

<div class="layout-aside">
    <form method="POST" action="{{ route('profile.update') }}" class="card" novalidate>
        @csrf
        @method('PUT')
        <div class="card-body">
            @if ($missingFacts)
                <div class="alert alert-warning">
                    <x-icon name="info" />
                    <div>Add your <strong>{{ implode(', ', $missingFacts) }}</strong> — these decide which scholarships you are shown.</div>
                </div>
            @endif
            <div class="form-section">
                <h3>Personal details</h3>
                <div class="form-grid">
                    <div class="field">
                        <label for="name">Full name <span class="req">*</span></label>
                        <input id="name" name="name" class="input @error('name') is-invalid @enderror" value="{{ old('name', $user->name) }}" required>
                        @include('partials.field-error', ['name' => 'name'])
                    </div>
                    <div class="field">
                        <label for="email">Email</label>
                        <input id="email" class="input" value="{{ $user->email }}" readonly>
                    </div>
                    <div class="field">
                        <label for="phone">Phone</label>
                        <input id="phone" name="phone" class="input @error('phone') is-invalid @enderror" value="{{ $v('phone') }}" maxlength="20">
                        @include('partials.field-error', ['name' => 'phone'])
                    </div>
                    <div class="field">
                        <label for="dob">Date of birth</label>
                        <input id="dob" type="date" name="dob" class="input @error('dob') is-invalid @enderror" value="{{ $v('dob') }}">
                        @include('partials.field-error', ['name' => 'dob'])
                    </div>
                    @unless ($user->isAdmin())
                    <div class="field">
                        <label for="gender">Gender</label>
                        <select id="gender" name="gender" class="input @error('gender') is-invalid @enderror">{!! $select('gender', ['' => 'Select…'] + $genders) !!}</select>
                        @include('partials.field-error', ['name' => 'gender'])
                    </div>
                    <div class="field">
                        <label for="state">State of domicile</label>
                        <select id="state" name="state" class="input @error('state') is-invalid @enderror">{!! $select('state', ['' => 'Select…'] + array_combine($states, $states)) !!}</select>
                        @include('partials.field-error', ['name' => 'state'])
                    </div>
                    <div class="field">
                        <label for="socialCategory">Social category</label>
                        <select id="socialCategory" name="socialCategory" class="input">{!! $select('socialCategory', ['' => 'Prefer not to say'] + $socialCategories) !!}</select>
                    </div>
                    <div class="field">
                        <label for="disability">Person with disability</label>
                        <select id="disability" name="disability" class="input">{!! $select('disability', ['' => 'Select…', 'no' => 'No', 'yes' => 'Yes']) !!}</select>
                    </div>
                    @endunless
                </div>
            </div>

            @unless ($user->isAdmin())
            <div class="form-section">
                <h3>Family &amp; income</h3>
                <div class="form-grid">
                    <div class="field">
                        <label for="annualIncome">Annual family income</label>
                        <div class="input-prefix"><span>₹</span>
                            <input id="annualIncome" name="annualIncome" inputmode="numeric" class="input @error('annualIncome') is-invalid @enderror" value="{{ $v('annualIncome') }}" placeholder="e.g. 250000">
                        </div>
                        <span class="hint">As shown on your income certificate.</span>
                        @include('partials.field-error', ['name' => 'annualIncome'])
                    </div>
                    <div class="field">
                        <label for="parentOccupation">Parent / guardian occupation</label>
                        <input id="parentOccupation" name="parentOccupation" class="input" value="{{ $v('parentOccupation') }}">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Education</h3>
                <div class="form-grid">
                    <div class="field">
                        <label for="category">Current education level</label>
                        <select id="category" name="category" class="input">
                            @foreach ($categories as $value => $label)
                                <option value="{{ $value }}" @selected(old('category', $user->category) === $value)>{{ $label }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="field">
                        <label for="course">Course / programme</label>
                        <input id="course" name="course" class="input" value="{{ $v('course') }}" placeholder="e.g. B.Tech Computer Engineering">
                    </div>
                    <div class="field">
                        <label for="institute_id">College / institute</label>
                        <select id="institute_id" name="institute_id" class="input">
                            <option value="">Not listed</option>
                            @foreach ($institutes as $i)<option value="{{ $i->id }}" @selected((string) old('institute_id', $user->institute_id) === (string) $i->id)>{{ $i->name }}</option>@endforeach
                        </select>
                    </div>
                    <div class="field">
                        <label for="university_id">University</label>
                        <select id="university_id" name="university_id" class="input">
                            <option value="">Not listed</option>
                            @foreach ($universities as $u)<option value="{{ $u->id }}" @selected((string) old('university_id', $user->university_id) === (string) $u->id)>{{ $u->name }}</option>@endforeach
                        </select>
                        <span class="hint">Picking an institute sets its university automatically.</span>
                    </div>
                    <div class="field">
                        <label for="institution">Institution name (if not listed)</label>
                        <input id="institution" name="institution" class="input" value="{{ $v('institution') }}">
                    </div>
                    <div class="field">
                        <label for="year">Current year</label>
                        <select id="year" name="year" class="input">{!! $select('year', ['' => 'Select…', '1' => '1st year', '2' => '2nd year', '3' => '3rd year', '4' => '4th year', '5' => '5th year']) !!}</select>
                    </div>
                    <div class="field">
                        <label for="mode">Mode of study</label>
                        <select id="mode" name="mode" class="input">{!! $select('mode', ['' => 'Select…', 'full_time' => 'Full-time', 'part_time' => 'Part-time', 'distance' => 'Distance']) !!}</select>
                    </div>
                    <div class="field">
                        <label for="prevPercentage">Previous exam percentage</label>
                        <input id="prevPercentage" name="prevPercentage" type="number" step="0.01" min="0" max="100" class="input @error('prevPercentage') is-invalid @enderror" value="{{ $v('prevPercentage') }}" placeholder="e.g. 85">
                        @include('partials.field-error', ['name' => 'prevPercentage'])
                    </div>
                    <div class="field">
                        <label for="cgpa">Current CGPA</label>
                        <input id="cgpa" name="cgpa" type="number" step="0.01" min="0" max="10" class="input @error('cgpa') is-invalid @enderror" value="{{ $v('cgpa') }}" placeholder="e.g. 8.4">
                        @include('partials.field-error', ['name' => 'cgpa'])
                    </div>
                    <div class="field">
                        <label for="hasScholarship">Currently receiving a scholarship?</label>
                        <select id="hasScholarship" name="hasScholarship" class="input">{!! $select('hasScholarship', ['' => 'Select…', 'no' => 'No', 'yes' => 'Yes']) !!}</select>
                    </div>
                    <div class="field span-2">
                        <label for="careerGoal">Career goal</label>
                        <input id="careerGoal" name="careerGoal" class="input" value="{{ $v('careerGoal') }}" maxlength="255" placeholder="What do you want to do after your studies?">
                    </div>
                </div>
            </div>
            @endunless
        </div>
        <div class="card-foot text-right">
            <button class="btn btn-primary" type="submit">Save profile</button>
        </div>
    </form>

    <aside class="stack">
        <div class="card card-body">
            <div class="row">
                <span class="avatar avatar-lg">{{ strtoupper(mb_substr($user->name, 0, 1)) }}</span>
                <div>
                    <div class="fw-600">{{ $user->name }}</div>
                    <div class="xs muted">{{ $user->roleLabel() }} · member since {{ $user->created_at?->format('M Y') }}</div>
                </div>
            </div>
            @if ($user->university || $user->institute)
                <div class="divider"></div>
                <dl class="dl" style="grid-template-columns: 90px 1fr; font-size: .85rem">
                    @if ($user->university)<dt>University</dt><dd>{{ $user->university->name }}</dd>@endif
                    @if ($user->institute)<dt>Institute</dt><dd>{{ $user->institute->name }}</dd>@endif
                </dl>
            @endif
        </div>

        <form method="POST" action="{{ route('profile.password') }}" class="card" novalidate>
            @csrf
            @method('PUT')
            <div class="card-head"><h3>Change password</h3></div>
            <div class="card-body stack">
                <div class="field">
                    <label for="current_password">Current password</label>
                    <input id="current_password" type="password" name="current_password" class="input @error('current_password', 'password') is-invalid @enderror" autocomplete="current-password">
                    @include('partials.field-error', ['name' => 'current_password', 'bag' => 'password'])
                </div>
                <div class="field">
                    <label for="new_password">New password</label>
                    <input id="new_password" type="password" name="password" class="input @error('password', 'password') is-invalid @enderror" autocomplete="new-password">
                    @include('partials.field-error', ['name' => 'password', 'bag' => 'password'])
                </div>
                <div class="field">
                    <label for="password_confirmation">Confirm new password</label>
                    <input id="password_confirmation" type="password" name="password_confirmation" class="input" autocomplete="new-password">
                </div>
                <button class="btn btn-outline btn-block" type="submit">Update password</button>
            </div>
        </form>
    </aside>
</div>
@endsection
