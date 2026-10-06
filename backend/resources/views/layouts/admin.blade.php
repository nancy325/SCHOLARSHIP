<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @php $u = auth()->user(); @endphp
    <title>@yield('title', 'Dashboard') · {{ config('site.name') }}{{ $u->isAdmin() ? ' Admin' : '' }}</title>
    <link rel="icon" type="image/png" href="{{ asset('images/favicon.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}?v=3">
    {{-- Apply the saved "sidebar hidden" state before paint to avoid a flash --}}
    <script>try { if (localStorage.getItem('sidebar') === 'collapsed' && window.innerWidth > 1024) document.documentElement.classList.add('sb-collapsed'); } catch (e) {}</script>
</head>
<body class="panel-body">
@php
    $is = fn (...$p) => request()->routeIs(...$p) ? 'active' : '';
    $pendingCount = $u->isAdmin()
        ? app(\App\Http\Controllers\Web\Admin\DashboardController::class)->pendingCountFor($u)
        : 0;
    $show = request('show');
@endphp
<div class="admin-shell" id="panel">
    <aside class="sidebar" id="sidebar" aria-label="Sidebar">
        <div class="sidebar-top">
            <a href="{{ $u->isAdmin() ? route('admin.dashboard') : route('student.dashboard') }}" class="brand">
                <span class="brand-mark"><x-icon name="cap" /></span> {{ config('site.name') }}
            </a>
            <button type="button" class="sidebar-close" data-sidebar-toggle aria-label="Close menu">&times;</button>
        </div>

        <nav class="side-nav">
            @if ($u->isAdmin())
                <div class="side-label">Home</div>
                <a href="{{ route('admin.dashboard') }}" class="{{ $is('admin.dashboard') }}"><x-icon name="dashboard" /> <span>Dashboard</span></a>

                <div class="side-label">Scholarships</div>
                <a href="{{ route('admin.scholarships.index') }}" class="{{ request()->routeIs('admin.scholarships.index', 'admin.scholarships.edit') ? 'active' : '' }}"><x-icon name="award" /> <span>All scholarships</span></a>
                <a href="{{ route('admin.scholarships.create') }}" class="{{ $is('admin.scholarships.create') }}"><x-icon name="plus" /> <span>Add scholarship</span></a>
                <a href="{{ route('admin.applications.index') }}" class="{{ $is('admin.applications.*') }}"><x-icon name="file" /> <span>Applications</span>
                    @if ($pendingCount)<span class="pill">{{ $pendingCount }}</span>@endif
                </a>

                @if ($u->isPlatformAdmin())
                    <div class="side-label">Platform</div>
                    <a href="{{ route('admin.universities.index') }}" class="{{ $is('admin.universities.*') }}"><x-icon name="landmark" /> <span>Universities</span></a>
                    <a href="{{ route('admin.institutes.index') }}" class="{{ $is('admin.institutes.*') }}"><x-icon name="building" /> <span>Institutes</span></a>
                    <a href="{{ route('admin.users.index') }}" class="{{ $is('admin.users.*') }}"><x-icon name="users" /> <span>Users</span></a>
                    <a href="{{ route('admin.feedback.index') }}" class="{{ $is('admin.feedback.*') }}"><x-icon name="message" /> <span>Feedback</span></a>
                @endif
            @else
                <div class="side-label">Home</div>
                <a href="{{ route('student.dashboard') }}" class="{{ $is('student.dashboard') }}"><x-icon name="dashboard" /> <span>Dashboard</span></a>

                <div class="side-label">Scholarships</div>
                <a href="{{ route('scholarships.index', ['show' => 'eligible']) }}" class="{{ request()->routeIs('scholarships.index') && $show !== 'all' ? 'active' : '' }}"><x-icon name="check-circle" /> <span>Eligible for me</span></a>
                <a href="{{ route('scholarships.index', ['show' => 'all']) }}" class="{{ request()->routeIs('scholarships.index') && $show === 'all' ? 'active' : '' }}"><x-icon name="award" /> <span>All scholarships</span></a>
                <a href="{{ route('student.applications.index') }}" class="{{ $is('student.applications.*') }}"><x-icon name="file" /> <span>My applications</span></a>

                <div class="side-label">Help</div>
                <a href="{{ route('faqs') }}"><x-icon name="info" /> <span>FAQs</span></a>
                <a href="{{ route('contact') }}"><x-icon name="message" /> <span>Contact us</span></a>
            @endif

            <div class="side-label">Account</div>
            <a href="{{ route('profile.edit') }}" class="{{ $is('profile.*') }}"><x-icon name="user" /> <span>My profile</span></a>
            <a href="{{ route('home') }}"><x-icon name="globe" /> <span>View website</span></a>
        </nav>

        <div class="sidebar-user">
            <span class="avatar">{{ strtoupper(mb_substr($u->name, 0, 1)) }}</span>
            <div class="su-text">
                <div class="fw-600">{{ \Illuminate\Support\Str::limit($u->name, 18) }}</div>
                <div class="xs muted">{{ $u->roleLabel() }}</div>
            </div>
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="icon-btn" title="Sign out" aria-label="Sign out"><x-icon name="logout" /></button>
            </form>
        </div>
    </aside>
    <div class="sidebar-backdrop" data-sidebar-toggle></div>

    <div class="admin-main">
        <header class="topbar">
            <button type="button" class="hamburger" data-sidebar-toggle aria-label="Show or hide menu" aria-controls="sidebar" title="Show / hide menu">
                <x-icon name="menu" />
            </button>
            <span class="crumb">@yield('crumb', 'Dashboard')</span>
            <span class="spacer"></span>
            @unless ($u->isAdmin())
                <a href="{{ route('scholarships.index', ['show' => 'eligible']) }}" class="icon-btn" title="Find scholarships"><x-icon name="search" /></a>
            @endunless
            <a href="{{ $u->isAdmin() ? route('admin.applications.index') : route('student.applications.index') }}" class="icon-btn has-dot" title="Applications">
                <x-icon name="file" />@if ($pendingCount)<i class="dot-badge"></i>@endif
            </a>
            <details class="user-menu">
                <summary>
                    <span class="avatar">{{ strtoupper(mb_substr($u->name, 0, 1)) }}</span>
                    <span class="um-name">
                        <span class="fw-600 small">{{ \Illuminate\Support\Str::limit($u->name, 20) }}</span>
                        <span class="xs muted">{{ $u->roleLabel() }}</span>
                    </span>
                </summary>
                <div class="dropdown">
                    <div class="dropdown-head">
                        <div class="fw-600">{{ $u->name }}</div>
                        <div class="xs muted">{{ $u->email }}</div>
                    </div>
                    <a href="{{ route('profile.edit') }}"><x-icon name="user" /> My profile</a>
                    <a href="{{ route('home') }}"><x-icon name="globe" /> View website</a>
                    <form method="POST" action="{{ route('logout') }}" class="inline-form">
                        @csrf
                        <button type="submit"><x-icon name="logout" /> Sign out</button>
                    </form>
                </div>
            </details>
        </header>

        <main class="admin-content">
            @unless (View::hasSection('own_flash'))
                @include('partials.flash')
            @endunless
            @yield('hero')
            @yield('content')
            @yield('full')
        </main>

        <footer class="panel-footer">© {{ date('Y') }} {{ config('site.name') }} · Helping students find the scholarships they deserve</footer>
    </div>
</div>
<script src="{{ asset('js/app.js') }}?v=3" defer></script>
@stack('scripts')
</body>
</html>
