@extends('layouts.admin')
@section('crumb', 'Home / Dashboard')

@section('title', 'My dashboard')

@section('content')
@php $links = array_filter([$user->institute?->name, $user->university?->name]); @endphp
<div class="welcome row-between mb-3">
    <div class="row">
        <span class="avatar avatar-lg">{{ strtoupper(mb_substr($user->name, 0, 1)) }}</span>
        <div>
            <h1>Hello, {{ \Illuminate\Support\Str::before($user->name . ' ', ' ') }} 👋</h1>
            <p>{{ $links ? implode(' · ', $links) : 'Here is an overview of your scholarship journey.' }}</p>
        </div>
    </div>
    <a href="{{ route('scholarships.index', ['show' => 'eligible']) }}" class="btn btn-white"><x-icon name="search" /> My eligible scholarships</a>
</div>

<div class="grid grid-4 mb-3">
    <div class="card stat"><div class="s-icon tone-blue"><x-icon name="file" /></div><div><div class="s-value">{{ $counts['total'] }}</div><div class="s-label">Applications</div></div></div>
    <div class="card stat"><div class="s-icon tone-amber"><x-icon name="clock" /></div><div><div class="s-value">{{ $counts['pending'] }}</div><div class="s-label">Pending review</div></div></div>
    <div class="card stat"><div class="s-icon tone-green"><x-icon name="check-circle" /></div><div><div class="s-value">{{ $counts['approved'] }}</div><div class="s-label">Approved</div></div></div>
    <div class="card stat"><div class="s-icon tone-red"><x-icon name="x-circle" /></div><div><div class="s-value">{{ $counts['rejected'] }}</div><div class="s-label">Not selected</div></div></div>
</div>

<div class="layout-aside">
    <div class="stack">
        <div class="card">
            <div class="card-head">
                <h2>Recent applications</h2>
                <a href="{{ route('student.applications.index') }}" class="small">View all</a>
            </div>
            @if ($recentApplications->isEmpty())
                <div class="empty">
                    <div class="e-icon"><x-icon name="file" /></div>
                    <h3>No applications yet</h3>
                    <p>Browse scholarships and submit your first application.</p>
                    <a href="{{ route('scholarships.index') }}" class="btn btn-primary btn-sm">Browse scholarships</a>
                </div>
            @else
                <div class="table-wrap">
                    <table class="table">
                        <thead><tr><th>Scholarship</th><th>Applied</th><th>Status</th></tr></thead>
                        <tbody>
                        @foreach ($recentApplications as $a)
                            <tr>
                                <td><a class="cell-title" href="{{ route('scholarships.show', $a->scholarship_id) }}">{{ $a->scholarship?->title }}</a></td>
                                <td class="nowrap">{{ $a->application_date?->format('d M Y') }}</td>
                                <td>@include('partials.status-badge', ['status' => $a->application_status])</td>
                            </tr>
                        @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>

        <div class="card">
            <div class="card-head">
                <h2>Scholarships you are eligible for <span class="badge badge-open">{{ $eligibleCount }} open</span></h2>
                <a href="{{ route('scholarships.index', ['show' => 'eligible']) }}" class="small">See all</a>
            </div>
            <div class="card-body">
                @if ($missingFacts)
                    <div class="alert alert-warning">
                        <x-icon name="info" />
                        <div>Add your <strong>{{ implode(', ', $missingFacts) }}</strong> to <a href="{{ route('profile.edit') }}">your profile</a> for accurate matches.</div>
                    </div>
                @endif
                @if ($eligible->isEmpty())
                    <p class="muted mb-0">{{ $eligibleCount ? 'You have applied to every open scholarship you are eligible for. 🎉' : 'No open scholarships match your profile right now. New scholarships are added regularly.' }}</p>
                @else
                    <div class="grid grid-2">
                        @foreach ($eligible as $s)
                            @include('partials.scholarship-card', ['s' => $s, 'isStudent' => true, 'eligibleIds' => $eligibleIds])
                        @endforeach
                    </div>
                @endif
            </div>
        </div>
    </div>

    <aside class="stack">
        <div class="card card-body">
            <h3>Matched on</h3>
            <dl class="dl" style="grid-template-columns: 110px 1fr; font-size:.86rem">
                <dt>Education</dt><dd>{{ \App\Support\Options::EDUCATION_LEVELS[$facts['level']] ?? '—' }}</dd>
                <dt>Family income</dt><dd>{{ $facts['income'] !== null ? \App\Support\Options::rupees($facts['income']) : '—' }}</dd>
                <dt>State</dt><dd>{{ $facts['state'] ?? '—' }}</dd>
                <dt>Gender</dt><dd>{{ \App\Support\Options::GENDERS[$facts['gender']] ?? '—' }}</dd>
                <dt>Category</dt><dd>{{ \App\Support\Options::SOCIAL_CATEGORIES[$facts['social']] ?? '—' }}</dd>
                <dt>Last exam</dt><dd>{{ $facts['percentage'] !== null ? rtrim(rtrim(number_format($facts['percentage'], 2), '0'), '.') . '%' : '—' }}</dd>
            </dl>
            <a href="{{ route('profile.edit') }}" class="btn btn-ghost btn-sm mt-1">Update details</a>
        </div>

        <div class="card card-body">
            <div class="row-between mb-1">
                <h3 class="mb-0">Profile completion</h3>
                <strong>{{ $completion }}%</strong>
            </div>
            <div class="progress mb-2"><span style="width: {{ $completion }}%"></span></div>
            <p class="small muted">A complete profile helps reviewers assess your application quickly.</p>
            <a href="{{ route('profile.edit') }}" class="btn btn-outline btn-sm btn-block">{{ $completion < 100 ? 'Complete profile' : 'Review profile' }}</a>
        </div>

        @if ($closingSoon > 0)
            <div class="alert alert-warning mb-0">
                <x-icon name="clock" />
                <div><strong>{{ $closingSoon }} {{ \Illuminate\Support\Str::plural('scholarship', $closingSoon) }}</strong> you are eligible for close in the next 14 days.
                    <div class="mt-1"><a href="{{ route('scholarships.index', ['show' => 'eligible']) }}">View them</a></div></div>
            </div>
        @endif

        <div class="card card-body">
            <h3>Quick links</h3>
            <div class="stack" style="--gap: 8px">
                <a href="{{ route('student.applications.index') }}" class="btn btn-ghost btn-block" style="justify-content:flex-start"><x-icon name="file" /> My applications</a>
                <a href="{{ route('profile.edit') }}" class="btn btn-ghost btn-block" style="justify-content:flex-start"><x-icon name="user" /> Edit profile</a>
                <a href="{{ route('faqs') }}" class="btn btn-ghost btn-block" style="justify-content:flex-start"><x-icon name="info" /> Help &amp; FAQs</a>
            </div>
        </div>
    </aside>
</div>
@endsection
