{{-- Filter bar + grid of scholarships. Expects the data from ScholarshipController::listing() and $action (form URL) --}}
@if ($isStudent)
    <nav class="tabs mb-2">
        <a href="{{ $action . '?' . http_build_query(array_merge(request()->except(['show', 'page']), ['show' => 'eligible'])) }}" class="{{ $show === 'eligible' ? 'active' : '' }}">
            Eligible for me <span class="count">{{ $eligibleCount }}</span>
        </a>
        <a href="{{ $action . '?' . http_build_query(array_merge(request()->except(['show', 'page']), ['show' => 'all'])) }}" class="{{ $show === 'all' ? 'active' : '' }}">All scholarships</a>
    </nav>
    @if ($missingFacts)
        <div class="alert alert-warning">
            <x-icon name="info" />
            <div>Add your <strong>{{ implode(', ', $missingFacts) }}</strong> to <a href="{{ route('profile.edit') }}">your profile</a> so we can match scholarships more accurately.</div>
        </div>
    @endif
@endif

<form method="GET" action="{{ $action }}" class="card card-body filter-bar mb-3" role="search">
    @if ($isStudent)<input type="hidden" name="show" value="{{ $show }}">@endif
    <div class="search-input grow">
        <x-icon name="search" />
        <label for="search" class="sr-only">Search</label>
        <input id="search" type="search" name="search" class="input" value="{{ $filters['search'] ?? '' }}" placeholder="Search by name, provider or keyword…">
    </div>
    <label for="level" class="sr-only">Education level</label>
    <select id="level" name="level" class="input">
        <option value="">All education levels</option>
        @foreach ($levels as $value => $label)
            @continue($value === 'other')
            <option value="{{ $value }}" @selected(($filters['level'] ?? '') === $value)>{{ $label }}</option>
        @endforeach
    </select>
    <label for="type" class="sr-only">Type</label>
    <select id="type" name="type" class="input">
        <option value="">All providers</option>
        @foreach ($types as $value => $label)
            <option value="{{ $value }}" @selected(($filters['type'] ?? '') === $value)>{{ $label }}</option>
        @endforeach
    </select>
    <label for="status" class="sr-only">Status</label>
    <select id="status" name="status" class="input">
        <option value="open" @selected(($filters['status'] ?? 'open') === 'open')>Open now</option>
        <option value="all" @selected(($filters['status'] ?? '') === 'all')>Include closed</option>
    </select>
    <label for="sort" class="sr-only">Sort</label>
    <select id="sort" name="sort" class="input">
        <option value="deadline" @selected(($filters['sort'] ?? 'deadline') === 'deadline')>Deadline: soonest</option>
        <option value="amount" @selected(($filters['sort'] ?? '') === 'amount')>Award: highest</option>
        <option value="newest" @selected(($filters['sort'] ?? '') === 'newest')>Newest first</option>
    </select>
    <button class="btn btn-primary" type="submit">Filter</button>
    @if (collect($filters)->except('show')->filter()->isNotEmpty())
        <a href="{{ $action }}{{ $isStudent ? '?show=' . $show : '' }}" class="btn btn-ghost">Clear</a>
    @endif
</form>

<p class="small muted">{{ $scholarships->total() }} {{ \Illuminate\Support\Str::plural('scholarship', $scholarships->total()) }}{{ $show === 'eligible' ? ' you are eligible for' : '' }}</p>

@if ($scholarships->isEmpty())
    <div class="card empty">
        <div class="e-icon"><x-icon name="search" /></div>
        @if ($show === 'eligible' && collect($filters)->except('show')->filter()->isEmpty())
            <h3>No open scholarships match your profile right now</h3>
            <p>Check that your education level and family income are correct, or look through all scholarships.</p>
            <div class="row" style="justify-content:center">
                <a href="{{ route('profile.edit') }}" class="btn btn-outline">Update profile</a>
                <a href="{{ $action }}?show=all" class="btn btn-primary">See all scholarships</a>
            </div>
        @else
            <h3>No scholarships match your filters</h3>
            <p>Try a different keyword or include closed scholarships.</p>
            <a href="{{ $action }}" class="btn btn-outline">Reset filters</a>
        @endif
    </div>
@else
    <div class="grid grid-3">
        @foreach ($scholarships as $s)
            @include('partials.scholarship-card', ['s' => $s])
        @endforeach
    </div>
    {{ $scholarships->links('partials.pagination') }}
@endif
