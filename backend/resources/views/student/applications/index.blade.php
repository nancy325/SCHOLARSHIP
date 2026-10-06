@extends('layouts.admin')
@section('crumb', 'Scholarships / My applications')

@section('title', 'My applications')

@section('content')
<div class="row-between mb-2">
    <div>
        <h1 class="mb-0">My applications</h1>
        <p class="muted mb-0">Track the status of every scholarship you have applied for.</p>
    </div>
    <a href="{{ route('scholarships.index') }}" class="btn btn-primary"><x-icon name="plus" /> Apply for more</a>
</div>

<nav class="tabs mb-3">
    @foreach (['' => 'All', 'pending' => 'Pending', 'approved' => 'Approved', 'rejected' => 'Rejected', 'withdrawn' => 'Withdrawn'] as $key => $label)
        <a href="{{ route('student.applications.index', $key ? ['status' => $key] : []) }}" class="{{ ($status ?? '') === $key ? 'active' : '' }}">{{ $label }}</a>
    @endforeach
</nav>

@if ($applications->isEmpty())
    <div class="card empty">
        <div class="e-icon"><x-icon name="file" /></div>
        <h3>No applications {{ $status ? 'with this status' : 'yet' }}</h3>
        <p>When you apply for a scholarship it will appear here.</p>
        <a href="{{ route('scholarships.index') }}" class="btn btn-primary btn-sm">Browse scholarships</a>
    </div>
@else
    <div class="stack">
        @foreach ($applications as $a)
            @php $s = $a->scholarship; @endphp
            <div class="card">
                <div class="card-body">
                    <div class="row-between">
                        <div>
                            <a href="{{ route('scholarships.show', $a->scholarship_id) }}" class="cell-title" style="font-size: 1.05rem">{{ $s?->title ?? 'Scholarship removed' }}</a>
                            <div class="xs muted">{{ $s?->providerName() }} · Applied {{ $a->application_date?->format('d M Y, h:i A') }}</div>
                        </div>
                        @include('partials.status-badge', ['status' => $a->application_status])
                    </div>

                    @if ($a->admin_remarks && in_array($a->application_status, ['approved', 'rejected']))
                        <div class="alert {{ $a->application_status === 'approved' ? 'alert-success' : 'alert-error' }} mt-2 mb-0">
                            <x-icon name="message" />
                            <div><strong>Reviewer remarks:</strong> {{ $a->admin_remarks }}</div>
                        </div>
                    @endif

                    <details class="mt-2">
                        <summary class="small fw-600" style="cursor:pointer; color: var(--primary)">Your statement</summary>
                        <p class="prose small mt-1 mb-0">{{ $a->notes }}</p>
                    </details>
                </div>
                <div class="card-foot row-between">
                    <span class="xs muted">
                        @if ($a->status_updated_at && $a->application_status !== 'pending')
                            Updated {{ $a->status_updated_at->diffForHumans() }}
                        @elseif ($s?->deadline)
                            Deadline {{ $s->deadline->format('d M Y') }}
                        @endif
                    </span>
                    <div class="row">
                        @if ($a->application_status === 'withdrawn' && $s?->isOpen())
                            <a href="{{ route('student.applications.create', $s) }}" class="btn btn-sm btn-outline">Apply again</a>
                        @endif
                        @if ($a->isPending())
                            <form method="POST" action="{{ route('student.applications.withdraw', $a) }}" class="inline-form" data-confirm="Withdraw this application? You can re-apply while the scholarship is open.">
                                @csrf
                                <button class="btn btn-sm btn-danger-outline" type="submit">Withdraw</button>
                            </form>
                        @endif
                    </div>
                </div>
            </div>
        @endforeach
    </div>
    {{ $applications->links('partials.pagination') }}
@endif
@endsection
