@extends('layouts.admin')

@section('title', 'Scholarships')
@section('crumb', 'Scholarships')

@section('content')
<div class="page-title row-between">
    <div><h1>Scholarships</h1><p>Create, edit and deactivate the scholarships you manage.</p></div>
    <a href="{{ route('admin.scholarships.create') }}" class="btn btn-primary"><x-icon name="plus" /> New scholarship</a>
</div>

<div class="card">
    <form method="GET" class="card-head filter-bar">
        <div class="search-input grow"><x-icon name="search" /><input type="search" name="search" class="input" placeholder="Search title…" value="{{ request('search') }}" aria-label="Search"></div>
        <select name="type" class="input" aria-label="Type">
            <option value="">All types</option>
            @foreach ($types as $v => $l)<option value="{{ $v }}" @selected(request('type') === $v)>{{ $l }}</option>@endforeach
        </select>
        <select name="status" class="input" aria-label="Status">
            @foreach (['active' => 'Active', 'inactive' => 'Deactivated', 'all' => 'All'] as $v => $l)<option value="{{ $v }}" @selected(request('status', 'active') === $v)>{{ $l }}</option>@endforeach
        </select>
        <button class="btn btn-outline" type="submit">Filter</button>
    </form>

    @if ($scholarships->isEmpty())
        <div class="empty"><div class="e-icon"><x-icon name="award" /></div><h3>No scholarships found</h3><a href="{{ route('admin.scholarships.create') }}" class="btn btn-primary btn-sm">Create one</a></div>
    @else
        <div class="table-wrap">
            <table class="table">
                <thead><tr><th>Scholarship</th><th>Type</th><th>Deadline</th><th>Applications</th><th>Status</th><th class="text-right">Actions</th></tr></thead>
                <tbody>
                @foreach ($scholarships as $s)
                    <tr>
                        <td>
                            <div class="cell-title">{{ \Illuminate\Support\Str::limit($s->title, 60) }}</div>
                            <div class="cell-sub">{{ $s->providerName() }}{{ $s->awardLabel() ? ' · ' . $s->awardLabel() : '' }}{{ $s->max_family_income ? ' · income ≤ ' . \App\Support\Options::lakh($s->max_family_income) : '' }}</div>
                        </td>
                        <td><span class="badge badge-{{ $s->type }}">{{ $types[$s->type] ?? $s->type }}</span></td>
                        <td class="nowrap">
                            {{ $s->deadline?->format('d M Y') }}
                            @if ($s->deadline && $s->deadline->isPast() && !$s->deadline->isToday())<div class="cell-sub text-danger">Closed</div>@endif
                        </td>
                        <td>
                            <a href="{{ route('admin.applications.index', ['scholarship' => $s->id, 'status' => 'all']) }}">{{ $s->applications_count }}</a>
                            @if ($s->pending_count)<span class="badge badge-pending">{{ $s->pending_count }} pending</span>@endif
                        </td>
                        <td><span class="badge badge-{{ $s->RecStatus }}">{{ ucfirst($s->RecStatus) }}</span></td>
                        <td>
                            <div class="actions">
                                <a href="{{ route('scholarships.show', $s) }}" class="btn btn-sm btn-ghost" title="View on site" target="_blank"><x-icon name="eye" /></a>
                                <a href="{{ route('admin.scholarships.edit', $s) }}" class="btn btn-sm btn-outline"><x-icon name="edit" /> Edit</a>
                                @if ($s->RecStatus === 'active')
                                    <form method="POST" action="{{ route('admin.scholarships.destroy', $s) }}" class="inline-form" data-confirm="Deactivate this scholarship? Students will no longer see it.">
                                        @csrf @method('DELETE')
                                        <button class="btn btn-sm btn-danger-outline" title="Deactivate"><x-icon name="trash" /></button>
                                    </form>
                                @endif
                            </div>
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    @endif
</div>
{{ $scholarships->links('partials.pagination') }}
@endsection
