@extends('layouts.admin')

@section('title', 'Applications')
@section('crumb', 'Applications')

@section('content')
<div class="page-title">
    <h1>Applications</h1>
    <p>Review student applications for the scholarships you manage.</p>
</div>

<nav class="tabs mb-2">
    @foreach (['pending' => 'Pending', 'approved' => 'Approved', 'rejected' => 'Rejected', 'withdrawn' => 'Withdrawn', 'all' => 'All'] as $key => $label)
        <a href="{{ route('admin.applications.index', array_filter(['status' => $key, 'scholarship' => request('scholarship'), 'search' => request('search')])) }}" class="{{ $status === $key ? 'active' : '' }}">
            {{ $label }}<span class="count">{{ $key === 'all' ? $counts->sum() : ($counts[$key] ?? 0) }}</span>
        </a>
    @endforeach
</nav>

<div class="card">
    <form method="GET" class="card-head filter-bar">
        <input type="hidden" name="status" value="{{ $status }}">
        @if (request('scholarship'))<input type="hidden" name="scholarship" value="{{ request('scholarship') }}">@endif
        <div class="search-input grow"><x-icon name="search" /><input type="search" name="search" class="input" placeholder="Search student name or email…" value="{{ request('search') }}" aria-label="Search"></div>
        <button class="btn btn-outline" type="submit">Search</button>
        @if (request('scholarship') || request('search'))
            <a href="{{ route('admin.applications.index', ['status' => $status]) }}" class="btn btn-ghost">Clear filters</a>
        @endif
    </form>

    @if ($applications->isEmpty())
        <div class="empty"><div class="e-icon"><x-icon name="file" /></div><h3>No applications here</h3><p>Applications appear as soon as students apply.</p></div>
    @else
        <div class="table-wrap">
            <table class="table">
                <thead><tr><th>Student</th><th>Scholarship</th><th>Applied</th><th>Status</th><th class="text-right"></th></tr></thead>
                <tbody>
                @foreach ($applications as $a)
                    <tr>
                        <td>
                            <div class="cell-title">{{ $a->user?->name }}</div>
                            <div class="cell-sub">{{ $a->user?->email }}</div>
                        </td>
                        <td>
                            <div>{{ \Illuminate\Support\Str::limit($a->scholarship?->title, 50) }}</div>
                            <div class="cell-sub">Deadline {{ $a->scholarship?->deadline?->format('d M Y') }}</div>
                        </td>
                        <td class="nowrap">{{ $a->application_date?->format('d M Y') }}</td>
                        <td>@include('partials.status-badge', ['status' => $a->application_status])</td>
                        <td><div class="actions"><a href="{{ route('admin.applications.show', $a) }}" class="btn btn-sm {{ $a->isPending() ? 'btn-primary' : 'btn-outline' }}">{{ $a->isPending() ? 'Review' : 'View' }}</a></div></td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    @endif
</div>
{{ $applications->links('partials.pagination') }}
@endsection
