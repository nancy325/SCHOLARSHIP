@php
    $days = $s->daysLeft();
    $applied = in_array($s->id, $appliedIds ?? []);
    $eligible = isset($eligibleIds) && ($isStudent ?? false) ? in_array($s->id, $eligibleIds) : null;
    $levels = $s->educationLevelLabels();
@endphp
<article class="card s-card type-{{ $s->type }}">
    <div class="card-body">
        <div class="row-between">
            <span class="badge badge-{{ $s->type }}">{{ ucfirst($s->type) }}</span>
            @if ($days !== null && $days < 0)
                <span class="badge badge-closed">Closed</span>
            @elseif ($days !== null && $days <= 7)
                <span class="badge badge-urgent"><x-icon name="clock" style="width:13px;height:13px" /> {{ $days === 0 ? 'Closes today' : $days . ' days left' }}</span>
            @endif
        </div>
        <h3><a href="{{ route('scholarships.show', $s) }}">{{ $s->title }}</a></h3>
        <div class="xs muted" style="margin-top:-4px">{{ $s->providerName() }}</div>
        @if ($s->awardLabel())
            <div class="award"><x-icon name="award" style="width:16px;height:16px" /> {{ $s->awardLabel() }}</div>
        @endif
        <p class="desc">{{ $s->description }}</p>
        <ul class="facts">
            <li><x-icon name="cap" /> {{ $levels ? implode(', ', array_map(fn ($l) => \Illuminate\Support\Str::before($l, ' ('), $levels)) : 'All levels' }}</li>
            <li><x-icon name="landmark" /> {{ $s->max_family_income ? 'Income up to ' . \App\Support\Options::lakh($s->max_family_income) : 'No income limit' }}</li>
            <li><x-icon name="calendar" /> Deadline {{ $s->deadline?->format('d M Y') }}</li>
        </ul>
    </div>
    <div class="card-foot">
        @if ($applied)
            <span class="badge badge-approved"><x-icon name="check" style="width:13px;height:13px" /> Applied</span>
        @elseif ($eligible === true)
            <span class="badge badge-open"><x-icon name="check-circle" style="width:13px;height:13px" /> You're eligible</span>
        @elseif ($eligible === false)
            <span class="badge badge-neutral">Not eligible</span>
        @else
            <span class="xs muted">{{ $s->own_students_only && in_array($s->type, ['university', 'institute']) ? 'Own students only' : ($s->state ? $s->state . ' only' : 'All India') }}</span>
        @endif
        <a class="btn btn-sm btn-outline" href="{{ route('scholarships.show', $s) }}">Details <x-icon name="arrow-right" /></a>
    </div>
</article>
