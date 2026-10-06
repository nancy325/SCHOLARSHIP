@extends('layouts.app')

@section('title', 'Frequently asked questions')

@section('hero')
<section class="page-hero">
    <div class="container">
        <div class="crumbs"><a href="{{ route('home') }}">Home</a> / FAQs</div>
        <h1>Frequently asked questions</h1>
        <p>Answers to the most common questions about finding and applying for scholarships.</p>
    </div>
</section>
@endsection

@section('full')
<section class="section">
    <div class="container container-sm">
        @foreach ($faqs as $group => $items)
            <h2 class="mt-3 mb-2" style="font-size: 1.2rem">{{ $group }}</h2>
            @foreach ($items as [$q, $a])
                <details class="faq" @if ($loop->parent->first && $loop->first) open @endif>
                    <summary>{{ $q }}</summary>
                    <div class="faq-body">{{ $a }}</div>
                </details>
            @endforeach
        @endforeach

        <div class="card card-body mt-4 row-between">
            <div>
                <h3 class="mb-0">Still have a question?</h3>
                <p class="muted mb-0 small">Our team usually replies within one working day.</p>
            </div>
            <a href="{{ route('contact') }}" class="btn btn-primary">Contact us</a>
        </div>
    </div>
</section>
@endsection
