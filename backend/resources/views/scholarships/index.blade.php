@extends(auth()->check() ? 'layouts.admin' : 'layouts.app')
@section('own_flash', true)
@section('crumb', 'Scholarships')

@section('title', 'Scholarships')

@section('hero')
<section class="page-hero">
    <div class="container">
        <div class="crumbs"><a href="{{ route('home') }}">Home</a> / Scholarships</div>
        <h1>{{ $isStudent && $show === 'eligible' ? 'Scholarships you are eligible for' : 'Explore scholarships' }}</h1>
        <p>
            @if ($isStudent && $show === 'eligible')
                Matched using your education level, family income and other details from your profile.
            @elseif (!auth()->check())
                Every scholarship on the portal. <a href="{{ route('register') }}" style="color: var(--accent)">Create a free account</a> to see only the ones you qualify for.
            @else
                Every scholarship on the portal.
            @endif
        </p>
    </div>
</section>
@endsection

@section('full')
<section class="section-tight">
    <div class="container">
        @include('partials.flash')
        @include('partials.scholarship-browser', ['action' => route('scholarships.index')])
    </div>
</section>
@endsection
