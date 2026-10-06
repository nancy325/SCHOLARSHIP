@extends('layouts.admin')

@section('title', 'Dashboard')
@section('crumb', 'Dashboard')

@section('content')
<div class="welcome row-between mb-3">
    <div>
        <h1>Welcome, {{ \Illuminate\Support\Str::before(auth()->user()->name, ' ') }}</h1>
        <p>
            @switch(auth()->user()->role)
                @case('university_admin') Managing scholarships for {{ auth()->user()->university?->name ?? 'your university' }}. @break
                @case('institute_admin') Managing scholarships for {{ auth()->user()->institute?->name ?? 'your institute' }}. @break
                @default Here is what is happening across the platform today.
            @endswitch
        </p>
    </div>
    <div class="row">
        <a href="{{ route('admin.applications.index') }}" class="btn btn-white"><x-icon name="file" /> Review applications</a>
        <a href="{{ route('admin.scholarships.create') }}" class="btn btn-accent"><x-icon name="plus" /> New scholarship</a>
    </div>
</div>

<div class="grid grid-4 mb-3">
    <a href="{{ route('admin.scholarships.index') }}" class="card stat" style="color:inherit;text-decoration:none"><div class="s-icon tone-green"><x-icon name="award" /></div><div><div class="s-value">{{ $stats['open_scholarships'] }}<span class="small muted"> / {{ $stats['scholarships'] }}</span></div><div class="s-label">Open scholarships</div></div></a>
    <a href="{{ route('admin.applications.index', ['status' => 'all']) }}" class="card stat" style="color:inherit;text-decoration:none"><div class="s-icon tone-blue"><x-icon name="file" /></div><div><div class="s-value">{{ $stats['applications'] }}</div><div class="s-label">Applications</div></div></a>
    <a href="{{ route('admin.applications.index', ['status' => 'pending']) }}" class="card stat" style="color:inherit;text-decoration:none"><div class="s-icon tone-amber"><x-icon name="clock" /></div><div><div class="s-value">{{ $stats['pending'] }}</div><div class="s-label">Awaiting review</div></div></a>
    <a href="{{ route('admin.applications.index', ['status' => 'approved']) }}" class="card stat" style="color:inherit;text-decoration:none"><div class="s-icon tone-green"><x-icon name="check-circle" /></div><div><div class="s-value">{{ $stats['approved'] }}</div><div class="s-label">Approved</div></div></a>
</div>

@isset($stats['students'])
<div class="grid grid-4 mb-3">
    <a href="{{ route('admin.users.index', ['role' => 'student']) }}" class="card stat" style="color:inherit;text-decoration:none"><div class="s-icon tone-gray"><x-icon name="users" /></div><div><div class="s-value">{{ $stats['students'] }}</div><div class="s-label">Students</div></div></a>
    <a href="{{ route('admin.universities.index') }}" class="card stat" style="color:inherit;text-decoration:none"><div class="s-icon tone-gray"><x-icon name="landmark" /></div><div><div class="s-value">{{ $stats['universities'] }}</div><div class="s-label">Universities</div></div></a>
    <a href="{{ route('admin.institutes.index') }}" class="card stat" style="color:inherit;text-decoration:none"><div class="s-icon tone-gray"><x-icon name="building" /></div><div><div class="s-value">{{ $stats['institutes'] }}</div><div class="s-label">Institutes</div></div></a>
    <a href="{{ route('admin.feedback.index') }}" class="card stat" style="color:inherit;text-decoration:none"><div class="s-icon tone-gray"><x-icon name="message" /></div><div><div class="s-value">{{ $stats['feedback'] }}</div><div class="s-label">Feedback messages</div></div></a>
</div>
@endisset

<div class="grid grid-2" style="align-items:start">
    <div class="card">
        <div class="card-head"><h2>Latest applications</h2><a class="small" href="{{ route('admin.applications.index', ['status' => 'all']) }}">View all</a></div>
        @if ($recentApplications->isEmpty())
            <div class="empty"><div class="e-icon"><x-icon name="file" /></div><p class="mb-0">No applications yet.</p></div>
        @else
            <ul class="list">
                @foreach ($recentApplications as $a)
                    <li>
                        <div class="row" style="flex-wrap:nowrap; min-width:0">
                            <span class="avatar">{{ strtoupper(mb_substr($a->user?->name ?? '?', 0, 1)) }}</span>
                            <div style="min-width:0">
                                <a href="{{ route('admin.applications.show', $a) }}" class="cell-title">{{ $a->user?->name }}</a>
                                <div class="cell-sub">{{ \Illuminate\Support\Str::limit($a->scholarship?->title, 42) }} · {{ $a->application_date?->diffForHumans() }}</div>
                            </div>
                        </div>
                        @include('partials.status-badge', ['status' => $a->application_status])
                    </li>
                @endforeach
            </ul>
        @endif
    </div>

    <div class="card">
        <div class="card-head"><h2>Deadlines in the next 30 days</h2><a class="small" href="{{ route('admin.scholarships.index') }}">All scholarships</a></div>
        @if ($closingSoon->isEmpty())
            <div class="empty"><div class="e-icon"><x-icon name="calendar" /></div><p class="mb-0">No deadlines in the next 30 days.</p></div>
        @else
            <ul class="list">
                @foreach ($closingSoon as $s)
                    <li>
                        <div style="min-width:0">
                            <a href="{{ route('admin.scholarships.edit', $s) }}" class="cell-title">{{ \Illuminate\Support\Str::limit($s->title, 48) }}</a>
                            <div class="cell-sub">Closes {{ $s->deadline->format('d M Y') }} ({{ $s->daysLeft() }} days)</div>
                        </div>
                        @if ($s->pending_count)
                            <a href="{{ route('admin.applications.index', ['scholarship' => $s->id]) }}" class="badge badge-pending">{{ $s->pending_count }} pending</a>
                        @endif
                    </li>
                @endforeach
            </ul>
        @endif
    </div>
</div>
@endsection
