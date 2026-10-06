@extends('layouts.admin')
@section('title', 'Institutes')
@section('crumb', 'Platform / Institutes')

@section('content')
<div class="page-title row-between">
    <div><h1>Institutes</h1><p>Colleges and institutes, grouped under their university.</p></div>
    <a href="{{ route('admin.institutes.create') }}" class="btn btn-primary"><x-icon name="plus" /> Add institute</a>
</div>
<div class="card">
    <form method="GET" class="card-head filter-bar">
        <div class="search-input grow"><x-icon name="search" /><input type="search" name="search" class="input" placeholder="Search name or email…" value="{{ request('search') }}" aria-label="Search"></div>
        <select name="university" class="input" aria-label="University"><option value="">All universities</option>@foreach ($universities as $u)<option value="{{ $u->id }}" @selected((string) request('university') === (string) $u->id)>{{ \Illuminate\Support\Str::limit($u->name, 40) }}</option>@endforeach</select>
        <select name="rec" class="input" aria-label="Status">@foreach (['active' => 'Active', 'inactive' => 'Deactivated', 'all' => 'All'] as $v => $l)<option value="{{ $v }}" @selected(request('rec', 'active') === $v)>{{ $l }}</option>@endforeach</select>
        <button class="btn btn-outline" type="submit">Filter</button>
    </form>
    @if ($institutes->isEmpty())
        <div class="empty"><div class="e-icon"><x-icon name="building" /></div><h3>No institutes found</h3></div>
    @else
    <div class="table-wrap"><table class="table">
        <thead><tr><th>Institute</th><th>University</th><th>Type</th><th>Verification</th><th>Status</th><th class="text-right">Actions</th></tr></thead>
        <tbody>
        @foreach ($institutes as $i)
            <tr>
                <td><div class="cell-title">{{ $i->name }}</div><div class="cell-sub">{{ $i->email }}</div></td>
                <td>{{ $i->university?->name ?? '—' }}</td>
                <td>{{ $types[$i->type] ?? ucwords(str_replace('_', ' ', $i->type)) }}</td>
                <td><span class="badge badge-{{ $i->status }}">{{ ucfirst($i->status) }}</span></td>
                <td><span class="badge badge-{{ $i->RecStatus }}">{{ ucfirst($i->RecStatus) }}</span></td>
                <td><div class="actions">
                    <a href="{{ route('admin.institutes.edit', $i) }}" class="btn btn-sm btn-outline"><x-icon name="edit" /> Edit</a>
                    @if ($i->RecStatus === 'active')
                    <form method="POST" action="{{ route('admin.institutes.destroy', $i) }}" class="inline-form" data-confirm="Deactivate {{ $i->name }}?">@csrf @method('DELETE')<button class="btn btn-sm btn-danger-outline" title="Deactivate"><x-icon name="trash" /></button></form>
                    @endif
                </div></td>
            </tr>
        @endforeach
        </tbody>
    </table></div>
    @endif
</div>
{{ $institutes->links('partials.pagination') }}
@endsection
