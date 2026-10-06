@extends('layouts.admin')
@section('title', 'Universities')
@section('crumb', 'Platform / Universities')

@section('content')
<div class="page-title row-between">
    <div><h1>Universities</h1><p>Universities that can publish scholarships for their students.</p></div>
    <a href="{{ route('admin.universities.create') }}" class="btn btn-primary"><x-icon name="plus" /> Add university</a>
</div>
<div class="card">
    <form method="GET" class="card-head filter-bar">
        <div class="search-input grow"><x-icon name="search" /><input type="search" name="search" class="input" placeholder="Search name or email…" value="{{ request('search') }}" aria-label="Search"></div>
        <select name="rec" class="input" aria-label="Status">@foreach (['active' => 'Active', 'inactive' => 'Deactivated', 'all' => 'All'] as $v => $l)<option value="{{ $v }}" @selected(request('rec', 'active') === $v)>{{ $l }}</option>@endforeach</select>
        <button class="btn btn-outline" type="submit">Filter</button>
    </form>
    @if ($universities->isEmpty())
        <div class="empty"><div class="e-icon"><x-icon name="landmark" /></div><h3>No universities found</h3></div>
    @else
    <div class="table-wrap"><table class="table">
        <thead><tr><th>University</th><th>Contact</th><th>Institutes</th><th>Verification</th><th>Status</th><th class="text-right">Actions</th></tr></thead>
        <tbody>
        @foreach ($universities as $u)
            <tr>
                <td><div class="cell-title">{{ $u->name }}</div><div class="cell-sub">{{ \Illuminate\Support\Str::limit($u->address, 50) }}</div></td>
                <td><div>{{ $u->email }}</div><div class="cell-sub">{{ $u->phone }}</div></td>
                <td><a href="{{ route('admin.institutes.index', ['university' => $u->id]) }}">{{ $u->institutes_count }}</a></td>
                <td><span class="badge badge-{{ $u->status }}">{{ ucfirst($u->status) }}</span></td>
                <td><span class="badge badge-{{ $u->RecStatus }}">{{ ucfirst($u->RecStatus) }}</span></td>
                <td><div class="actions">
                    <a href="{{ route('admin.universities.edit', $u) }}" class="btn btn-sm btn-outline"><x-icon name="edit" /> Edit</a>
                    @if ($u->RecStatus === 'active')
                    <form method="POST" action="{{ route('admin.universities.destroy', $u) }}" class="inline-form" data-confirm="Deactivate {{ $u->name }}?">@csrf @method('DELETE')<button class="btn btn-sm btn-danger-outline" title="Deactivate"><x-icon name="trash" /></button></form>
                    @endif
                </div></td>
            </tr>
        @endforeach
        </tbody>
    </table></div>
    @endif
</div>
{{ $universities->links('partials.pagination') }}
@endsection
