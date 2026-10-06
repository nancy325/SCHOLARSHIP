@extends('layouts.admin')
@section('title', 'Users')
@section('crumb', 'Platform / Users')

@section('content')
<div class="page-title row-between">
    <div><h1>Users</h1><p>Students and administrators on the platform.</p></div>
    <a href="{{ route('admin.users.create') }}" class="btn btn-primary"><x-icon name="plus" /> Add user</a>
</div>
<div class="card">
    <form method="GET" class="card-head filter-bar">
        <div class="search-input grow"><x-icon name="search" /><input type="search" name="search" class="input" placeholder="Search name or email…" value="{{ request('search') }}" aria-label="Search"></div>
        <select name="role" class="input" aria-label="Role"><option value="">All roles</option>@foreach ($roles + ['super_admin' => 'Super Admin'] as $v => $l)<option value="{{ $v }}" @selected(request('role') === $v)>{{ $l }}</option>@endforeach</select>
        <select name="rec" class="input" aria-label="Status">@foreach (['active' => 'Active', 'inactive' => 'Deactivated', 'all' => 'All'] as $v => $l)<option value="{{ $v }}" @selected(request('rec', 'active') === $v)>{{ $l }}</option>@endforeach</select>
        <button class="btn btn-outline" type="submit">Filter</button>
    </form>
    @if ($users->isEmpty())
        <div class="empty"><div class="e-icon"><x-icon name="users" /></div><h3>No users found</h3></div>
    @else
    <div class="table-wrap"><table class="table">
        <thead><tr><th>User</th><th>Role</th><th>Linked to</th><th>Applications</th><th>Status</th><th class="text-right">Actions</th></tr></thead>
        <tbody>
        @foreach ($users as $u)
            <tr>
                <td><div class="row" style="flex-wrap:nowrap"><span class="avatar">{{ strtoupper(mb_substr($u->name, 0, 1)) }}</span><div><div class="cell-title">{{ $u->name }}</div><div class="cell-sub">{{ $u->email }}</div></div></div></td>
                <td><span class="badge {{ $u->role === 'student' ? 'badge-neutral' : 'badge-university' }}">{{ $u->roleLabel() }}</span></td>
                <td class="small">{{ $u->institute?->name ?? $u->university?->name ?? '—' }}</td>
                <td>{{ $u->applications_count }}</td>
                <td><span class="badge badge-{{ $u->RecStatus }}">{{ ucfirst($u->RecStatus) }}</span></td>
                <td><div class="actions">
                    @if ($u->role !== 'super_admin' || auth()->user()->role === 'super_admin')
                        <a href="{{ route('admin.users.edit', $u) }}" class="btn btn-sm btn-outline"><x-icon name="edit" /> Edit</a>
                        @if ($u->RecStatus === 'active' && !$u->is(auth()->user()))
                        <form method="POST" action="{{ route('admin.users.destroy', $u) }}" class="inline-form" data-confirm="Deactivate {{ $u->name }}? They will no longer be able to sign in.">@csrf @method('DELETE')<button class="btn btn-sm btn-danger-outline" title="Deactivate"><x-icon name="trash" /></button></form>
                        @endif
                    @endif
                </div></td>
            </tr>
        @endforeach
        </tbody>
    </table></div>
    @endif
</div>
{{ $users->links('partials.pagination') }}
@endsection
