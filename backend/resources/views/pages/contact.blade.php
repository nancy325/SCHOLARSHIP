@extends('layouts.app')

@section('title', 'Contact us')

@section('hero')
<section class="page-hero">
    <div class="container">
        <div class="crumbs"><a href="{{ route('home') }}">Home</a> / Contact</div>
        <h1>Contact us</h1>
        <p>Questions, issues or suggestions — send us a message and we'll get back to you.</p>
    </div>
</section>
@endsection

@section('full')
<section class="section">
    <div class="container">
        <div class="layout-aside">
            <div class="card">
                <div class="card-head"><h2>Send a message</h2></div>
                <div class="card-body">
                    @include('partials.flash', ['hideErrorSummary' => true])
                    <form method="POST" action="{{ route('contact.submit') }}" novalidate>
                        @csrf
                        <div class="form-grid">
                            <div class="field">
                                <label for="name">Your name <span class="req">*</span></label>
                                <input id="name" name="name" class="input @error('name') is-invalid @enderror" value="{{ old('name', $user?->name) }}" required maxlength="255">
                                @include('partials.field-error', ['name' => 'name'])
                            </div>
                            <div class="field">
                                <label for="email">Email address <span class="req">*</span></label>
                                <input id="email" type="email" name="email" class="input @error('email') is-invalid @enderror" value="{{ old('email', $user?->email) }}" required>
                                @include('partials.field-error', ['name' => 'email'])
                            </div>
                            <div class="field span-2">
                                <label for="feedback_type">Topic <span class="req">*</span></label>
                                <select id="feedback_type" name="feedback_type" class="input @error('feedback_type') is-invalid @enderror">
                                    @foreach (['general' => 'General question', 'issue' => 'Report an issue', 'suggestion' => 'Suggestion'] as $v => $l)
                                        <option value="{{ $v }}" @selected(old('feedback_type') === $v)>{{ $l }}</option>
                                    @endforeach
                                </select>
                                @include('partials.field-error', ['name' => 'feedback_type'])
                            </div>
                            <div class="field span-2">
                                <label for="message">Message <span class="req">*</span></label>
                                <textarea id="message" name="message" class="input @error('message') is-invalid @enderror" rows="6" required minlength="10" maxlength="5000">{{ old('message') }}</textarea>
                                @include('partials.field-error', ['name' => 'message'])
                            </div>
                        </div>
                        <div class="form-actions">
                            <button class="btn btn-primary" type="submit"><x-icon name="mail" /> Send message</button>
                        </div>
                    </form>
                </div>
            </div>
            <aside class="stack">
                <div class="card card-body">
                    <h3>Other ways to reach us</h3>
                    <ul class="list" style="margin: 0 -22px -22px">
                        <li><span class="row"><x-icon name="mail" /> Email</span><a href="mailto:{{ config('site.support_email') }}">{{ config('site.support_email') }}</a></li>
                        <li><span class="row"><x-icon name="phone" /> Phone</span><span>{{ config('site.support_phone') }}</span></li>
                        <li><span class="row"><x-icon name="clock" /> Hours</span><span>{{ config('site.support_hours') }}</span></li>
                    </ul>
                </div>
                <div class="card card-body">
                    <h3>Before you write</h3>
                    <p class="small muted">Many questions about eligibility, documents and application status are answered in our FAQs.</p>
                    <a href="{{ route('faqs') }}" class="btn btn-outline btn-sm">Read the FAQs</a>
                </div>
            </aside>
        </div>
    </div>
</section>
@endsection
