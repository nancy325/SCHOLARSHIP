@extends(auth()->check() ? 'layouts.admin' : 'layouts.app')
@section('own_flash', true)
@section('crumb', 'Scholarships / Details')

@section('title', $scholarship->title)
@section('description', \Illuminate\Support\Str::limit($scholarship->description, 150))

@php
    $user = auth()->user();
    $days = $scholarship->daysLeft();
    $open = $scholarship->isOpen();
    $activeApplication = $application && $application->application_status !== 'withdrawn' ? $application : null;
@endphp

@section('hero')
<section class="page-hero">
    <div class="container">
        <div class="crumbs"><a href="{{ route('home') }}">Home</a> / <a href="{{ route('scholarships.index') }}">Scholarships</a> / {{ \Illuminate\Support\Str::limit($scholarship->title, 40) }}</div>
        <div class="row mb-1">
            <span class="badge badge-{{ $scholarship->type }}">{{ $types[$scholarship->type] ?? ucfirst($scholarship->type) }}</span>
            @if ($open)
                <span class="badge badge-open"><span class="dot"></span> Open</span>
            @elseif ($scholarship->start_date && $scholarship->start_date->isFuture())
                <span class="badge badge-pending">Opens {{ $scholarship->start_date->format('d M Y') }}</span>
            @else
                <span class="badge badge-closed">Closed</span>
            @endif
        </div>
        <h1>{{ $scholarship->title }}</h1>
        <p><x-icon name="{{ in_array($scholarship->type, ['government', 'private']) ? 'landmark' : 'building' }}" /> {{ $scholarship->providerName() }}</p>
    </div>
</section>
@endsection

@section('full')
<section class="section-tight">
    <div class="container">
        @include('partials.flash')
        <div class="layout-aside">
            <div class="stack">
                <div class="card">
                    <div class="card-head"><h2>About this scholarship</h2></div>
                    <div class="card-body"><p class="prose mb-0">{{ $scholarship->description }}</p></div>
                </div>
                @if ($scholarship->awardLabel() || $scholarship->benefits)
                    <div class="card">
                        <div class="card-head"><h2>Award &amp; benefits</h2></div>
                        <div class="card-body">
                            @if ($scholarship->awardLabel())<div class="award mb-1" style="font-size:1.3rem">{{ $scholarship->awardLabel() }}</div>@endif
                            @if ($scholarship->benefits)<p class="prose mb-0">{{ $scholarship->benefits }}</p>@endif
                        </div>
                    </div>
                @endif
                <div class="card">
                    <div class="card-head"><h2>Who can apply</h2></div>
                    <div class="card-body">
                        <dl class="dl mb-2">
                            <dt>Education level</dt><dd>{{ $scholarship->education_levels ? implode(', ', $scholarship->educationLevelLabels()) : 'Any level' }}</dd>
                            <dt>Family income</dt><dd>{{ $scholarship->max_family_income ? 'Up to ' . \App\Support\Options::rupees($scholarship->max_family_income) . ' per year' : 'No income limit' }}</dd>
                            @if ($scholarship->min_percentage)<dt>Minimum marks</dt><dd>{{ rtrim(rtrim(number_format($scholarship->min_percentage, 2), '0'), '.') }}% in the previous exam</dd>@endif
                            @if ($scholarship->gender && $scholarship->gender !== 'any')<dt>Gender</dt><dd>{{ ucfirst($scholarship->gender) }} students only</dd>@endif
                            @if ($scholarship->social_categories)<dt>Category</dt><dd>{{ implode(', ', array_map(fn ($c) => \App\Support\Options::SOCIAL_CATEGORIES[$c] ?? $c, $scholarship->social_categories)) }}</dd>@endif
                            <dt>Domicile</dt><dd>{{ $scholarship->state ? $scholarship->state . ' residents' : 'All India' }}</dd>
                            @if ($scholarship->own_students_only && in_array($scholarship->type, ['university', 'institute']))
                                <dt>Open to</dt><dd>Students of {{ $scholarship->type === 'university' ? $scholarship->university?->name : $scholarship->institute?->name }} only</dd>
                            @endif
                        </dl>
                        @if ($scholarship->eligibility)
                            <h3 class="small fw-600 mb-1">Full eligibility criteria</h3>
                            <p class="prose mb-0">{{ $scholarship->eligibility }}</p>
                        @endif
                    </div>
                </div>
                @if ($scholarship->documents_required)
                    <div class="card">
                        <div class="card-head"><h2>Documents required</h2></div>
                        <div class="card-body"><p class="prose mb-0">{{ $scholarship->documents_required }}</p></div>
                    </div>
                @endif
                <div class="card">
                    <div class="card-head"><h2>How to apply</h2></div>
                    <div class="card-body">
                        <ol class="mb-0" style="padding-left: 20px; color: var(--ink-2)">
                            <li>Check the eligibility details above{{ $user ? ' — your personal check is on the right' : '' }}.</li>
                            @if ($scholarship->apply_link)
                                <li>Apply on the <a href="{{ $scholarship->apply_link }}" target="_blank" rel="noopener">official website</a> before the deadline.</li>
                            @endif
                            <li>Press <strong>Apply now</strong> here to record your application and track its status in <strong>My Applications</strong>.</li>
                        </ol>
                        <p class="xs muted mt-2 mb-0">Scholarship rules and amounts can change every year. Always confirm the latest details on the official website.</p>
                    </div>
                </div>
            </div>

            <aside class="stack">
                <div class="card card-body">
                    <dl class="dl" style="grid-template-columns: 110px 1fr">
                        @if ($scholarship->awardLabel())<dt>Award</dt><dd class="fw-600">{{ $scholarship->awardLabel() }}</dd>@endif
                        <dt>Deadline</dt>
                        <dd>{{ $scholarship->deadline?->format('d M Y') }}
                            @if ($open && $days !== null)
                                <div class="xs {{ $days <= 7 ? 'text-danger' : 'muted' }}">{{ $days === 0 ? 'Closes today' : $days . ' days left' }}</div>
                            @endif
                        </dd>
                        <dt>Opens</dt>
                        <dd>{{ $scholarship->start_date?->format('d M Y') ?? '—' }}</dd>
                        <dt>Type</dt>
                        <dd>{{ $types[$scholarship->type] ?? ucfirst($scholarship->type) }}</dd>
                        @if ($scholarship->university)
                            <dt>University</dt><dd>{{ $scholarship->university->name }}</dd>
                        @endif
                        @if ($scholarship->institute)
                            <dt>Institute</dt><dd>{{ $scholarship->institute->name }}</dd>
                        @endif
                    </dl>

                    <div class="divider"></div>

                    @if (!$user)
                        <a href="{{ route('login') }}" class="btn btn-primary btn-block btn-lg">Sign in to apply</a>
                        <p class="xs muted text-center mt-1 mb-0">No account? <a href="{{ route('register') }}">Register for free</a></p>
                    @elseif ($user->isAdmin())
                        <div class="alert alert-info mb-0"><x-icon name="info" /> You are signed in as an administrator. Students apply from this page.</div>
                    @elseif ($activeApplication)
                        <div class="text-center">
                            <p class="small muted mb-1">Your application</p>
                            @include('partials.status-badge', ['status' => $activeApplication->application_status])
                            <p class="xs muted mt-1">Submitted {{ $activeApplication->application_date?->format('d M Y') }}</p>
                            <a href="{{ route('student.applications.index') }}" class="btn btn-outline btn-block">View my applications</a>
                        </div>
                    @elseif ($check && !$check['eligible'])
                        <button class="btn btn-outline btn-block" disabled>You are not eligible</button>
                    @elseif ($open)
                        <a href="{{ route('student.applications.create', $scholarship) }}" class="btn btn-primary btn-block btn-lg">Apply now <x-icon name="arrow-right" /></a>
                    @else
                        <button class="btn btn-outline btn-block" disabled>Applications closed</button>
                    @endif

                    @if ($scholarship->apply_link)
                        <a href="{{ $scholarship->apply_link }}" target="_blank" rel="noopener" class="btn btn-ghost btn-block mt-1">Official website <x-icon name="external" /></a>
                    @endif
                </div>

                @if ($check && $check['checks'])
                    <div class="card">
                        <div class="card-head">
                            <h3>Your eligibility</h3>
                            @if (!$check['eligible'])
                                <span class="badge badge-rejected">Not eligible</span>
                            @elseif ($check['complete'])
                                <span class="badge badge-open">Eligible</span>
                            @else
                                <span class="badge badge-pending">Likely eligible</span>
                            @endif
                        </div>
                        <div class="card-body" style="padding-top:6px;padding-bottom:6px">
                            <ul class="checklist">
                                @foreach ($check['checks'] as $c)
                                    <li>
                                        <span class="st st-{{ $c['status'] }}">{{ ['pass' => '✓', 'fail' => '✕', 'unknown' => '?'][$c['status']] }}</span>
                                        <div><div class="fw-600">{{ $c['label'] }}</div><div class="xs muted">{{ $c['requirement'] }} · {{ $c['you'] }}</div></div>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                        @unless ($check['complete'])
                            <div class="card-foot small">Some details are missing. <a href="{{ route('profile.edit') }}">Complete your profile</a>.</div>
                        @endunless
                    </div>
                @endif

                @if ($related->isNotEmpty())
                    <div class="card">
                        <div class="card-head"><h3>Similar scholarships</h3></div>
                        <ul class="list">
                            @foreach ($related as $r)
                                <li>
                                    <div>
                                        <a href="{{ route('scholarships.show', $r) }}" class="fw-600">{{ $r->title }}</a>
                                        <div class="xs muted">Deadline {{ $r->deadline?->format('d M Y') }}</div>
                                    </div>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                @endif
            </aside>
        </div>
    </div>
</section>
@endsection
