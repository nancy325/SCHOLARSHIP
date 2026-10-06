@extends('layouts.admin')

@php $editing = $scholarship->exists; @endphp
@section('title', $editing ? 'Edit scholarship' : 'New scholarship')
@section('crumb', 'Scholarships / ' . ($editing ? 'Edit' : 'New'))

@section('content')
<div class="page-title">
    <p class="small mb-1"><a href="{{ route('admin.scholarships.index') }}"><x-icon name="arrow-left" /> All scholarships</a></p>
    <h1>{{ $editing ? 'Edit scholarship' : 'New scholarship' }}</h1>
</div>

<form method="POST" action="{{ $editing ? route('admin.scholarships.update', $scholarship) : route('admin.scholarships.store') }}" class="card" novalidate>
    @csrf
    @if ($editing) @method('PUT') @endif
    <div class="card-body">
        <div class="form-section">
            <h3>Basic information</h3>
            <div class="form-grid">
                <div class="field span-2">
                    <label for="title">Title <span class="req">*</span></label>
                    <input id="title" name="title" class="input @error('title') is-invalid @enderror" value="{{ old('title', $scholarship->title) }}" maxlength="150" required>
                    @include('partials.field-error', ['name' => 'title'])
                </div>

                @if ($canChooseType)
                    <div class="field">
                        <label for="type">Type <span class="req">*</span></label>
                        <select id="type" name="type" class="input @error('type') is-invalid @enderror">
                            @foreach ($types as $v => $l)<option value="{{ $v }}" @selected(old('type', $scholarship->type) === $v)>{{ $l }}</option>@endforeach
                        </select>
                        @include('partials.field-error', ['name' => 'type'])
                    </div>
                    <div class="field" data-show-when="type=university">
                        <label for="university_id">University <span class="req">*</span></label>
                        <select id="university_id" name="university_id" class="input @error('university_id') is-invalid @enderror">
                            <option value="">Select university…</option>
                            @foreach ($universities as $u)<option value="{{ $u->id }}" @selected((string) old('university_id', $scholarship->university_id) === (string) $u->id)>{{ $u->name }}</option>@endforeach
                        </select>
                        @include('partials.field-error', ['name' => 'university_id'])
                    </div>
                    <div class="field" data-show-when="type=institute">
                        <label for="institute_id">Institute <span class="req">*</span></label>
                        <select id="institute_id" name="institute_id" class="input @error('institute_id') is-invalid @enderror">
                            <option value="">Select institute…</option>
                            @foreach ($institutes as $i)<option value="{{ $i->id }}" @selected((string) old('institute_id', $scholarship->institute_id) === (string) $i->id)>{{ $i->name }}</option>@endforeach
                        </select>
                        @include('partials.field-error', ['name' => 'institute_id'])
                    </div>
                @else
                    <div class="field">
                        <label>Type</label>
                        <input class="input" readonly value="{{ $types[$scholarship->type] ?? ucfirst($scholarship->type) }} — {{ auth()->user()->role === 'university_admin' ? (auth()->user()->university?->name ?? 'your university') : (auth()->user()->institute?->name ?? 'your institute') }}">
                        <span class="hint">Scholarships you create are linked to your {{ auth()->user()->role === 'university_admin' ? 'university' : 'institute' }} automatically.</span>
                    </div>
                @endif

                <div class="field span-2">
                    <label for="provider">Provider / funding body</label>
                    <input id="provider" name="provider" class="input @error('provider') is-invalid @enderror" value="{{ old('provider', $scholarship->provider) }}" maxlength="255" placeholder="e.g. Ministry of Education, Government of India">
                    <span class="hint">Shown on the scholarship card. Leave blank to use the university / institute name.</span>
                    @include('partials.field-error', ['name' => 'provider'])
                </div>
                <div class="field span-2">
                    <label for="description">Description <span class="req">*</span></label>
                    <textarea id="description" name="description" rows="5" class="input @error('description') is-invalid @enderror" required>{{ old('description', $scholarship->description) }}</textarea>
                    @include('partials.field-error', ['name' => 'description'])
                </div>
            </div>
        </div>

        <div class="form-section">
            <h3>Award</h3>
            <div class="form-grid">
                <div class="field">
                    <label for="award_amount">Amount (₹)</label>
                    <div class="input-prefix"><span>₹</span><input id="award_amount" name="award_amount" inputmode="numeric" class="input @error('award_amount') is-invalid @enderror" value="{{ old('award_amount', $scholarship->award_amount) }}" placeholder="e.g. 12000"></div>
                    @include('partials.field-error', ['name' => 'award_amount'])
                </div>
                <div class="field">
                    <label for="award_frequency">Paid</label>
                    <select id="award_frequency" name="award_frequency" class="input @error('award_frequency') is-invalid @enderror">
                        <option value="">—</option>
                        @foreach ($frequencies as $v => $l)<option value="{{ $v }}" @selected(old('award_frequency', $scholarship->award_frequency) === $v)>{{ ucfirst($l) }}</option>@endforeach
                    </select>
                    @include('partials.field-error', ['name' => 'award_frequency'])
                </div>
                <div class="field span-2">
                    <label for="benefits">Benefits in detail</label>
                    <textarea id="benefits" name="benefits" rows="3" class="input @error('benefits') is-invalid @enderror" placeholder="e.g. Tuition fee up to ₹50,000 + hostel ₹1,200/month">{{ old('benefits', $scholarship->benefits) }}</textarea>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h3>Eligibility rules <span class="xs muted" style="font-weight:500">— used to show this scholarship only to eligible students. Leave a rule empty for "no restriction".</span></h3>
            @php
                $oldLevels = old('education_levels', $scholarship->education_levels ?? []);
                $oldSocial = old('social_categories', $scholarship->social_categories ?? []);
            @endphp
            <div class="form-grid">
                <div class="field span-2">
                    <span class="label">Education levels</span>
                    <div class="chips">
                        @foreach ($levels as $v => $l)
                            @continue($v === 'other')
                            <label class="chip"><input type="checkbox" name="education_levels[]" value="{{ $v }}" @checked(in_array($v, $oldLevels))> {{ $l }}</label>
                        @endforeach
                    </div>
                    <span class="hint">None selected = open to all levels.</span>
                    @include('partials.field-error', ['name' => 'education_levels'])
                </div>
                <div class="field">
                    <label for="max_family_income">Maximum annual family income (₹)</label>
                    <div class="input-prefix"><span>₹</span><input id="max_family_income" name="max_family_income" inputmode="numeric" class="input @error('max_family_income') is-invalid @enderror" value="{{ old('max_family_income', $scholarship->max_family_income) }}" placeholder="e.g. 250000 — blank = no limit"></div>
                    @include('partials.field-error', ['name' => 'max_family_income'])
                </div>
                <div class="field">
                    <label for="min_percentage">Minimum % in previous exam</label>
                    <input id="min_percentage" name="min_percentage" type="number" step="0.01" min="0" max="100" class="input @error('min_percentage') is-invalid @enderror" value="{{ old('min_percentage', $scholarship->min_percentage) }}" placeholder="blank = no minimum">
                    @include('partials.field-error', ['name' => 'min_percentage'])
                </div>
                <div class="field">
                    <label for="gender">Gender</label>
                    <select id="gender" name="gender" class="input">
                        @foreach (['any' => 'Any', 'female' => 'Female only', 'male' => 'Male only'] as $v => $l)<option value="{{ $v }}" @selected(old('gender', $scholarship->gender ?? 'any') === $v)>{{ $l }}</option>@endforeach
                    </select>
                </div>
                <div class="field">
                    <label for="state">Domicile state</label>
                    <select id="state" name="state" class="input @error('state') is-invalid @enderror">
                        <option value="">All India</option>
                        @foreach ($states as $st)<option value="{{ $st }}" @selected(old('state', $scholarship->state) === $st)>{{ $st }}</option>@endforeach
                    </select>
                </div>
                <div class="field span-2">
                    <span class="label">Social categories</span>
                    <div class="chips">
                        @foreach ($socialCategories as $v => $l)
                            <label class="chip"><input type="checkbox" name="social_categories[]" value="{{ $v }}" @checked(in_array($v, $oldSocial))> {{ $l }}</label>
                        @endforeach
                    </div>
                    <span class="hint">None selected = open to all categories.</span>
                </div>
                @if ($canChooseType || in_array($scholarship->type, ['university', 'institute']))
                    <div class="field span-2" @if ($canChooseType) data-show-when="type=university,institute" @endif>
                        <input type="hidden" name="own_students_only" value="0">
                        <label class="check"><input type="checkbox" name="own_students_only" value="1" @checked(old('own_students_only', $scholarship->own_students_only))>
                            <span>Only for students of this university / institute</span></label>
                    </div>
                @endif
                <div class="field span-2">
                    <label for="eligibility">Full eligibility criteria (shown to students)</label>
                    <textarea id="eligibility" name="eligibility" rows="4" class="input @error('eligibility') is-invalid @enderror">{{ old('eligibility', $scholarship->eligibility) }}</textarea>
                    @include('partials.field-error', ['name' => 'eligibility'])
                </div>
                <div class="field span-2">
                    <label for="documents_required">Documents required</label>
                    <textarea id="documents_required" name="documents_required" rows="3" class="input" placeholder="e.g. Income certificate, marksheets, Aadhaar, bank passbook">{{ old('documents_required', $scholarship->documents_required) }}</textarea>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h3>Dates &amp; links</h3>
            <div class="form-grid">
                <div class="field">
                    <label for="start_date">Applications open</label>
                    <input id="start_date" type="date" name="start_date" class="input @error('start_date') is-invalid @enderror" value="{{ old('start_date', $scholarship->start_date?->format('Y-m-d')) }}">
                    @include('partials.field-error', ['name' => 'start_date'])
                </div>
                <div class="field">
                    <label for="deadline">Deadline <span class="req">*</span></label>
                    <input id="deadline" type="date" name="deadline" class="input @error('deadline') is-invalid @enderror" value="{{ old('deadline', $scholarship->deadline?->format('Y-m-d')) }}" required>
                    @include('partials.field-error', ['name' => 'deadline'])
                </div>
                <div class="field span-2">
                    <label for="apply_link">Official website / external form</label>
                    <input id="apply_link" type="url" name="apply_link" class="input @error('apply_link') is-invalid @enderror" value="{{ old('apply_link', $scholarship->apply_link) }}" placeholder="https://">
                    <span class="hint">Optional. Students always apply through this portal; this link is shown as extra information.</span>
                    @include('partials.field-error', ['name' => 'apply_link'])
                </div>
                @if ($editing)
                    <div class="field">
                        <label for="RecStatus">Status</label>
                        <select id="RecStatus" name="RecStatus" class="input">
                            @foreach (['active' => 'Active (visible)', 'inactive' => 'Deactivated (hidden)'] as $v => $l)<option value="{{ $v }}" @selected(old('RecStatus', $scholarship->RecStatus) === $v)>{{ $l }}</option>@endforeach
                        </select>
                    </div>
                @endif
            </div>
        </div>
    </div>
    <div class="card-foot form-actions" style="margin-top:0">
        <a href="{{ route('admin.scholarships.index') }}" class="btn btn-outline">Cancel</a>
        <button type="submit" class="btn btn-primary">{{ $editing ? 'Save changes' : 'Create scholarship' }}</button>
    </div>
</form>
@endsection
