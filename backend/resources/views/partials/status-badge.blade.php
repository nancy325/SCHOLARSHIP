@php
    $labels = ['pending' => 'Pending review', 'approved' => 'Approved', 'rejected' => 'Rejected', 'withdrawn' => 'Withdrawn'];
@endphp
<span class="badge badge-{{ $status }}"><span class="dot"></span>{{ $labels[$status] ?? ucfirst($status) }}</span>
