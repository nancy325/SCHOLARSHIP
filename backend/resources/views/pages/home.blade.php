@extends('layouts.app')

@section('title', 'Find scholarships that fit you')

@section('hero')
<section class="hero2">
    <div class="container">
        <div class="fade-up">
            <span class="pill"><b>Free</b> Scholarships for every Indian student</span>
            <h1>Find scholarships you're <span class="text-grad">actually eligible for.</span></h1>
            <p class="lead">Most students never hear about the scholarships they qualify for. Tell us your education level and family income — we'll match you with government, private and university scholarships in seconds.</p>
            <form class="hero-search" action="{{ route('home') }}#scholarships" method="GET" role="search">
                <label for="hero-q" class="sr-only">Search scholarships</label>
                <input id="hero-q" type="search" name="search" placeholder="Search by scholarship, provider or course…">
                <button class="btn btn-primary" type="submit"><x-icon name="search" /> Search</button>
            </form>
            <div class="quick">
                Popular:
                <a href="{{ route('home', ['level' => 'undergraduate']) }}#scholarships">Undergraduate</a>
                <a href="{{ route('home', ['level' => 'high-school']) }}#scholarships">School</a>
                <a href="{{ route('home', ['type' => 'government']) }}#scholarships">Government</a>
                <a href="{{ route('home', ['level' => 'phd']) }}#scholarships">PhD</a>
            </div>
        </div>
        <div class="hero-visual fade-up" style="animation-delay:.15s">
            <img class="photo" src="{{ asset('images/hero.jpg') }}" alt="Students studying together">
            <div class="float-card fc-1"><span class="fi g-emerald"><x-icon name="check-circle" /></span><div><strong>You're eligible</strong><span>Matched on income &amp; course</span></div></div>
            <div class="float-card fc-2"><span class="fi g-amber"><x-icon name="award" /></span><div><strong>₹50,000 / year</strong><span>AICTE Pragati for girls</span></div></div>
            <div class="float-card fc-3"><span class="fi g-violet"><x-icon name="clock" /></span><div><strong>Never miss a deadline</strong><span>Track every application</span></div></div>
        </div>
    </div>
</section>
<div class="container">
    <div class="stat-strip">
        <div class="card"><span class="ic g-indigo"><x-icon name="award" /></span><div><strong>{{ number_format($stats['open']) }}</strong><span>Open scholarships</span></div></div>
        <div class="card"><span class="ic g-violet"><x-icon name="landmark" /></span><div><strong>{{ number_format($stats['universities']) }}</strong><span>Universities</span></div></div>
        <div class="card"><span class="ic g-pink"><x-icon name="building" /></span><div><strong>{{ number_format($stats['institutes']) }}</strong><span>Institutes</span></div></div>
        <div class="card"><span class="ic g-amber"><x-icon name="users" /></span><div><strong>{{ number_format($stats['students']) }}</strong><span>Students</span></div></div>
    </div>
</div>
@endsection

@section('full')
<section class="section" id="scholarships" style="padding-top:48px">
    <div class="container">
        <div class="row-between mb-2">
            <div>
                <span class="eyebrow">{{ $isStudent && $show === 'eligible' ? 'Matched to your profile' : 'Live from our database' }}</span>
                <h2 class="mb-0">{{ $isStudent && $show === 'eligible' ? 'Scholarships you are eligible for' : 'All scholarships' }}</h2>
            </div>
            @guest
                <a href="{{ route('register') }}" class="btn btn-accent">Find the ones I'm eligible for <x-icon name="arrow-right" /></a>
            @endguest
        </div>
        @include('partials.flash')
        @include('partials.scholarship-browser', ['action' => route('home')])
    </div>
</section>

<section class="section section-alt">
    <div class="container">
        <div class="section-head">
            <span class="eyebrow">How it works</span>
            <h2>From search to approval in four steps</h2>
            <p>Everything happens in one place, so you never lose track of a deadline.</p>
        </div>
        <div class="grid grid-4 steps">
            <div class="step"><h3>Create your account</h3><p>Sign up for free in under two minutes.</p></div>
            <div class="step"><h3>Tell us about you</h3><p>Your education level, family income, state and category.</p></div>
            <div class="step"><h3>See your matches</h3><p>We only show the scholarships you are eligible for — then apply in one click.</p></div>
            <div class="step"><h3>Track the result</h3><p>See pending, approved and rejected applications on your dashboard.</p></div>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="section-head">
            <span class="eyebrow">Browse by type</span>
            <h2>Scholarships from every kind of provider</h2>
        </div>
        <div class="grid grid-4">
            @foreach ([
                ['government', 'landmark', 'Government', 'Central and state schemes such as NSP, post-matric and merit-cum-means awards.', 'g-sky'],
                ['private', 'heart', 'Private', 'Corporate and foundation-funded scholarships for merit and need.', 'g-violet'],
                ['university', 'cap', 'University', 'Awards offered by your university to its own students.', 'g-indigo'],
                ['institute', 'building', 'Institute', 'College-level scholarships from your own institute.', 'g-amber'],
            ] as [$type, $icon, $label, $text, $g])
                <a href="{{ route('home', ['type' => $type]) . '#scholarships' }}" class="card feature s-card type-card type-{{ $type }}" style="color: inherit; text-decoration: none">
                    <div class="f-icon {{ $g }}"><x-icon name="{{ $icon }}" class="icon icon-lg" /></div>
                    <h3>{{ $label }}</h3>
                    <p>{{ $text }}</p>
                </a>
            @endforeach
        </div>
        <p class="small muted text-center mt-2">Universities and institutes publish their own scholarships here through their admin login.</p>
    </div>
</section>

<section class="section-tight">
    <div class="container">
        <div class="cta-band">
            <div>
                <h2>Ready to fund your next step?</h2>
                <p>It takes less than two minutes to create a free account.</p>
            </div>
            @auth
                <a href="{{ auth()->user()->isAdmin() ? route('admin.dashboard') : route('student.dashboard') }}" class="btn btn-white btn-lg">Go to dashboard <x-icon name="arrow-right" /></a>
            @else
                <a href="{{ route('register') }}" class="btn btn-white btn-lg">Create free account <x-icon name="arrow-right" /></a>
            @endauth
        </div>
    </div>
</section>
@endsection
