@extends('layouts.app')

@section('title', 'Sign in')
@section('hide_footer', true)

@section('full')
<div class="auth-wrap">
    <div class="auth-side">
        <h2>Welcome back</h2>
        <p style="color: rgba(255,255,255,.8)">Sign in to continue your scholarship journey.</p>
        <ul>
            <li><x-icon name="check-circle" /> Track every application in one dashboard</li>
            <li><x-icon name="check-circle" /> Get matched with scholarships from your university and institute</li>
            <li><x-icon name="check-circle" /> Never miss a deadline again</li>
        </ul>
    </div>
    <div class="auth-main">
        <div class="auth-card">
            <h1>Sign in</h1>
            <p class="muted">New here? <a href="{{ route('register') }}">Create a free account</a></p>
            @include('partials.flash', ['hideErrorSummary' => true])
            <form method="POST" action="{{ route('login.submit') }}" class="stack" novalidate>
                @csrf
                <div class="field">
                    <label for="email">Email address</label>
                    <input id="email" type="email" name="email" class="input @error('email') is-invalid @enderror" value="{{ old('email') }}" required autofocus autocomplete="email">
                    @include('partials.field-error', ['name' => 'email'])
                </div>
                <div class="field">
                    <label for="password">Password</label>
                    <input id="password" type="password" name="password" class="input @error('password') is-invalid @enderror" required autocomplete="current-password">
                    @include('partials.field-error', ['name' => 'password'])
                </div>
                <label class="check"><input type="checkbox" name="remember" value="1" @checked(old('remember'))> Keep me signed in</label>
                <button class="btn btn-primary btn-block btn-lg" type="submit">Sign in</button>
            </form>
            @if (app()->environment('local'))
                <div class="demo-box mt-3">
                    <strong>Demo accounts (local only)</strong><br>
                    Admin: admin@scholarship.com<br>
                    Student: john.doe@example.com<br>
                    Password: password123
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
