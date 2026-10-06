<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Find scholarships') · {{ config('site.name') }}</title>
    <meta name="description" content="@yield('description', 'Discover and apply for government, private, university and institute scholarships in one place.')">
    <link rel="icon" type="image/png" href="{{ asset('images/favicon.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}?v=1">
    @stack('head')
</head>
<body>
@php
    $u = auth()->user();
    $is = fn (...$patterns) => request()->routeIs(...$patterns) ? 'active' : '';
@endphp
<header class="site-header">
    <div class="container">
        <a href="{{ route('home') }}" class="brand">
            <span class="brand-mark"><x-icon name="cap" /></span>
            {{ config('site.name') }}
        </a>
        <button class="nav-toggle" type="button" data-nav-toggle aria-label="Open menu" aria-expanded="false"><x-icon name="menu" /></button>

        <nav class="nav" aria-label="Main">
            <a href="{{ route('home') }}" class="{{ $is('home') }}">Home</a>
            <a href="{{ route('scholarships.index') }}" class="{{ $is('scholarships.*', 'student.applications.create') }}">Scholarships</a>
            @if ($u && !$u->isAdmin())
                <a href="{{ route('student.dashboard') }}" class="{{ $is('student.dashboard') }}">Dashboard</a>
                <a href="{{ route('student.applications.index') }}" class="{{ $is('student.applications.index') }}">My Applications</a>
            @endif
            <a href="{{ route('about') }}" class="{{ $is('about') }}">About</a>
            <a href="{{ route('faqs') }}" class="{{ $is('faqs') }}">FAQs</a>
            <a href="{{ route('contact') }}" class="{{ $is('contact') }}">Contact</a>
        </nav>

        <div class="nav-actions">
            @auth
                <details class="user-menu">
                    <summary>
                        <span class="avatar">{{ strtoupper(mb_substr($u->name, 0, 1)) }}</span>
                        <span class="small fw-600">{{ \Illuminate\Support\Str::limit($u->name, 18) }}</span>
                    </summary>
                    <div class="dropdown">
                        <div class="dropdown-head">
                            <div class="fw-600">{{ $u->name }}</div>
                            <div class="xs muted">{{ $u->email }}</div>
                        </div>
                        @if ($u->isAdmin())
                            <a href="{{ route('admin.dashboard') }}"><x-icon name="dashboard" /> Admin panel</a>
                        @else
                            <a href="{{ route('student.dashboard') }}"><x-icon name="dashboard" /> Dashboard</a>
                            <a href="{{ route('student.applications.index') }}"><x-icon name="file" /> My applications</a>
                        @endif
                        <a href="{{ route('profile.edit') }}"><x-icon name="user" /> My profile</a>
                        <form method="POST" action="{{ route('logout') }}" class="inline-form">
                            @csrf
                            <button type="submit"><x-icon name="logout" /> Sign out</button>
                        </form>
                    </div>
                </details>
            @else
                <a href="{{ route('login') }}" class="btn btn-ghost">Sign in</a>
                <a href="{{ route('register') }}" class="btn btn-primary">Create account</a>
            @endauth
        </div>
    </div>
</header>

<main>
    @hasSection('hero')
        @yield('hero')
    @endif

    @hasSection('content')
        <div class="container @yield('container_class')" style="padding-top: 28px">
            @include('partials.flash')
            @yield('content')
        </div>
    @endif

    @yield('full')
</main>

@unless (View::hasSection('hide_footer'))
<footer class="site-footer">
    <div class="container">
        <div class="footer-grid">
            <div>
                <a href="{{ route('home') }}" class="brand"><span class="brand-mark"><x-icon name="cap" /></span> {{ config('site.name') }}</a>
                <p class="small mt-2" style="max-width: 340px">Connecting deserving students across India with government, private, university and institute scholarships — free for every student.</p>
            </div>
            <div>
                <h4>Explore</h4>
                <ul>
                    <li><a href="{{ route('scholarships.index') }}">All scholarships</a></li>
                    <li><a href="{{ route('scholarships.index', ['type' => 'government']) }}">Government</a></li>
                    <li><a href="{{ route('scholarships.index', ['type' => 'private']) }}">Private</a></li>
                </ul>
            </div>
            <div>
                <h4>Company</h4>
                <ul>
                    <li><a href="{{ route('about') }}">About us</a></li>
                    <li><a href="{{ route('faqs') }}">FAQs</a></li>
                    <li><a href="{{ route('contact') }}">Contact</a></li>
                </ul>
            </div>
            <div>
                <h4>Account</h4>
                <ul>
                    @auth
                        <li><a href="{{ auth()->user()->isAdmin() ? route('admin.dashboard') : route('student.dashboard') }}">Dashboard</a></li>
                        <li><a href="{{ route('profile.edit') }}">My profile</a></li>
                    @else
                        <li><a href="{{ route('login') }}">Sign in</a></li>
                        <li><a href="{{ route('register') }}">Create account</a></li>
                    @endauth
                </ul>
            </div>
        </div>
        <div class="footer-bottom row-between">
            <span>&copy; {{ date('Y') }} {{ config('site.name') }}. All rights reserved.</span>
            <span>Made for students, by educators.</span>
        </div>
    </div>
</footer>
@endunless

<script src="{{ asset('js/app.js') }}?v=1" defer></script>
@stack('scripts')
</body>
</html>
