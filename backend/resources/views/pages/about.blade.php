@extends('layouts.app')

@section('title', 'About us')

@section('hero')
<section class="page-hero">
    <div class="container">
        <div class="crumbs"><a href="{{ route('home') }}">Home</a> / About</div>
        <h1>About {{ config('site.name') }}</h1>
        <p>We believe money should never be the reason a student stops learning. Our portal brings every scholarship a student is eligible for into one simple place.</p>
    </div>
</section>
@endsection

@section('full')
<section class="section">
    <div class="container">
        <div class="grid grid-2" style="align-items: center; gap: 40px">
            <div>
                <span class="eyebrow">Our mission</span>
                <h2>Make scholarships easy to find, easy to apply for, and easy to track</h2>
                <p class="muted">Scholarship information in India is scattered across government portals, university notice boards and private foundations. Students miss deadlines simply because they never heard about an opportunity.</p>
                <p class="muted">{{ config('site.name') }} gathers these opportunities in one place, matches them to the student's university and institute, and gives administrators a simple way to publish scholarships and review applications.</p>
            </div>
            <div class="grid grid-2">
                <div class="card stat"><div class="s-icon tone-green"><x-icon name="award" /></div><div><div class="s-value">4</div><div class="s-label">Scholarship types</div></div></div>
                <div class="card stat"><div class="s-icon tone-amber"><x-icon name="users" /></div><div><div class="s-value">5</div><div class="s-label">User roles</div></div></div>
                <div class="card stat"><div class="s-icon tone-blue"><x-icon name="shield" /></div><div><div class="s-value">100%</div><div class="s-label">Free for students</div></div></div>
                <div class="card stat"><div class="s-icon tone-gray"><x-icon name="clock" /></div><div><div class="s-value">24/7</div><div class="s-label">Application tracking</div></div></div>
            </div>
        </div>
    </div>
</section>

<section class="section" style="background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border)">
    <div class="container">
        <div class="section-head">
            <span class="eyebrow">What we value</span>
            <h2>Built around students</h2>
        </div>
        <div class="grid grid-3">
            <div class="card feature"><div class="f-icon"><x-icon name="target" class="icon icon-lg" /></div><h3>Relevant, not overwhelming</h3><p>Students see national schemes plus the scholarships offered by their own university and institute.</p></div>
            <div class="card feature"><div class="f-icon"><x-icon name="shield" class="icon icon-lg" /></div><h3>Verified providers</h3><p>Universities and institutes are verified by our administrators before they can publish scholarships.</p></div>
            <div class="card feature"><div class="f-icon"><x-icon name="sparkles" class="icon icon-lg" /></div><h3>Transparent outcomes</h3><p>Every application shows its status and the reviewer's remarks, so students always know where they stand.</p></div>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="section-head">
            <span class="eyebrow">Who uses the portal</span>
            <h2>One platform, every role</h2>
        </div>
        <div class="grid grid-2">
            <div class="card card-body">
                <h3><x-icon name="cap" /> Students</h3>
                <p class="muted mb-0">Search and filter scholarships, apply with a short statement, withdraw pending applications and track results from a personal dashboard.</p>
            </div>
            <div class="card card-body">
                <h3><x-icon name="building" /> Institutes &amp; universities</h3>
                <p class="muted mb-0">Publish scholarships for your own students and review, approve or reject applications with remarks.</p>
            </div>
            <div class="card card-body">
                <h3><x-icon name="shield" /> Platform administrators</h3>
                <p class="muted mb-0">Manage universities, institutes and users, publish national schemes and read feedback from the contact form.</p>
            </div>
            <div class="card card-body">
                <h3><x-icon name="message" /> Get in touch</h3>
                <p class="muted">Want your institution listed? We would love to hear from you.</p>
                <a href="{{ route('contact') }}" class="btn btn-outline btn-sm">Contact us</a>
            </div>
        </div>
    </div>
</section>
@endsection
