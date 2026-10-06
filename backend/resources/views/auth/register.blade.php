@extends('layouts.app')

@section('title', 'Create account')
@section('hide_footer', true)

@section('full')
<div class="auth-wrap">
    <div class="auth-side">
        <h2>Start your scholarship journey</h2>
        <p style="color: rgba(255,255,255,.8)">One free account gives you access to every scholarship on the portal.</p>
        <ul>
            <li><x-icon name="check-circle" /> See only the scholarships you are eligible for — matched on education and family income</li>
            <li><x-icon name="check-circle" /> Apply with a short statement — no repeated paperwork</li>
            <li><x-icon name="check-circle" /> See approvals and reviewer remarks as soon as they happen</li>
        </ul>
    </div>
    <div class="auth-main">
        <div class="auth-card" style="max-width:520px">
            <h1>Create your account</h1>
            <p class="muted">Already registered? <a href="{{ route('login') }}">Sign in</a></p>
            @include('partials.flash', ['hideErrorSummary' => true])
            <form method="POST" action="{{ route('register.submit') }}" class="stack" novalidate>
                @csrf
                <div class="field">
                    <label for="name">Full name</label>
                    <input id="name" name="name" class="input @error('name') is-invalid @enderror" value="{{ old('name') }}" required autofocus autocomplete="name">
                    @include('partials.field-error', ['name' => 'name'])
                </div>
                <div class="field">
                    <label for="email">Email address</label>
                    <input id="email" type="email" name="email" class="input @error('email') is-invalid @enderror" value="{{ old('email') }}" required autocomplete="email">
                    @include('partials.field-error', ['name' => 'email'])
                </div>
                <div class="field">
                    <label for="category">Current education level <span class="req">*</span></label>
                    <select id="category" name="category" class="input @error('category') is-invalid @enderror" required>
                        <option value="">Select…</option>
                        @foreach ($categories as $value => $label)
                            <option value="{{ $value }}" @selected(old('category') === $value)>{{ $label }}</option>
                        @endforeach
                    </select>
                    @include('partials.field-error', ['name' => 'category'])
                </div>
                <div class="field">
                    <label for="annual_family_income">Annual family income <span class="req">*</span></label>
                    <div class="input-prefix"><span>₹</span>
                        <input id="annual_family_income" name="annual_family_income" inputmode="numeric" class="input @error('annual_family_income') is-invalid @enderror" value="{{ old('annual_family_income') }}" placeholder="e.g. 250000" required>
                    </div>
                    <span class="hint">Total yearly income of your parents / guardians, as on your income certificate.</span>
                    @include('partials.field-error', ['name' => 'annual_family_income'])
                </div>
                <div class="form-grid">
                    <div class="field">
                        <label for="gender">Gender <span class="req">*</span></label>
                        <select id="gender" name="gender" class="input @error('gender') is-invalid @enderror" required>
                            <option value="">Select…</option>
                            @foreach ($genders as $v => $l)<option value="{{ $v }}" @selected(old('gender') === $v)>{{ $l }}</option>@endforeach
                        </select>
                        @include('partials.field-error', ['name' => 'gender'])
                    </div>
                    <div class="field">
                        <label for="state">State of domicile <span class="req">*</span></label>
                        <select id="state" name="state" class="input @error('state') is-invalid @enderror" required>
                            <option value="">Select…</option>
                            @foreach ($states as $st)<option value="{{ $st }}" @selected(old('state') === $st)>{{ $st }}</option>@endforeach
                        </select>
                        @include('partials.field-error', ['name' => 'state'])
                    </div>
                    <div class="field">
                        <label for="social_category">Category</label>
                        <select id="social_category" name="social_category" class="input">
                            <option value="">Prefer not to say</option>
                            @foreach ($socialCategories as $v => $l)<option value="{{ $v }}" @selected(old('social_category') === $v)>{{ $l }}</option>@endforeach
                        </select>
                    </div>
                    <div class="field">
                        <label for="previous_percentage">Last exam %</label>
                        <input id="previous_percentage" name="previous_percentage" type="number" step="0.01" min="0" max="100" class="input @error('previous_percentage') is-invalid @enderror" value="{{ old('previous_percentage') }}" placeholder="e.g. 82">
                        @include('partials.field-error', ['name' => 'previous_percentage'])
                    </div>
                </div>
                <div class="field">
                    <label for="institute_id">Your college / institute</label>
                    <select id="institute_id" name="institute_id" class="input">
                        <option value="">Not listed / not in college yet</option>
                        @foreach ($institutes as $i)<option value="{{ $i->id }}" @selected((string) old('institute_id') === (string) $i->id)>{{ $i->name }}</option>@endforeach
                    </select>
                </div>
                <div class="field">
                    <label for="university_id">Your university</label>
                    <select id="university_id" name="university_id" class="input">
                        <option value="">Not listed / not in university yet</option>
                        @foreach ($universities as $u)<option value="{{ $u->id }}" @selected((string) old('university_id') === (string) $u->id)>{{ $u->name }}</option>@endforeach
                    </select>
                    <span class="hint">Lets you see scholarships your own university or college offers.</span>
                </div>
                <div class="field">
                    <label for="password">Password</label>
                    <input id="password" type="password" name="password" class="input @error('password') is-invalid @enderror" required autocomplete="new-password">
                    <span class="hint">At least 8 characters with upper- and lower-case letters, a number and a symbol.</span>
                    @include('partials.field-error', ['name' => 'password'])
                </div>
                <div class="field">
                    <label for="password_confirmation">Confirm password</label>
                    <input id="password_confirmation" type="password" name="password_confirmation" class="input" required autocomplete="new-password">
                </div>
                <button class="btn btn-primary btn-block btn-lg" type="submit">Create account</button>
                <p class="xs muted text-center mb-0">By creating an account you agree to use the portal for genuine scholarship applications.</p>
            </form>
        </div>
    </div>
</div>
@endsection
