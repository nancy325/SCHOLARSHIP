@extends('layouts.admin')
@section('title', 'Feedback')
@section('crumb', 'Platform / Feedback')

@section('content')
<div class="page-title"><h1>Feedback</h1><p>Messages sent through the website's contact form.</p></div>
<nav class="tabs mb-2">
    @foreach (['' => 'All', 'general' => 'General', 'issue' => 'Issues', 'suggestion' => 'Suggestions'] as $k => $l)
        <a href="{{ route('admin.feedback.index', $k ? ['type' => $k] : []) }}" class="{{ ($type ?? '') === $k ? 'active' : '' }}">{{ $l }}</a>
    @endforeach
</nav>
@if ($feedback->isEmpty())
    <div class="card empty"><div class="e-icon"><x-icon name="message" /></div><h3>No messages yet</h3></div>
@else
    <div class="stack">
        @foreach ($feedback as $f)
            <div class="card card-body">
                <div class="row-between mb-1">
                    <div class="row"><span class="avatar">{{ strtoupper(mb_substr($f->name, 0, 1)) }}</span>
                        <div><div class="fw-600">{{ $f->name }} @if ($f->user)<span class="xs muted">(registered user)</span>@endif</div><a class="xs" href="mailto:{{ $f->email }}">{{ $f->email }}</a></div></div>
                    <div class="row">
                        <span class="badge {{ ['issue' => 'badge-rejected', 'suggestion' => 'badge-government'][$f->feedback_type] ?? 'badge-neutral' }}">{{ ucfirst($f->feedback_type) }}</span>
                        <span class="xs muted">{{ $f->created_at?->format('d M Y, h:i A') }}</span>
                    </div>
                </div>
                <p class="prose mb-0">{{ $f->message }}</p>
            </div>
        @endforeach
    </div>
    {{ $feedback->links('partials.pagination') }}
@endif
@endsection
