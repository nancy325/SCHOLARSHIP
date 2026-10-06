@if (session('success'))
    <div class="alert alert-success" role="status">
        <x-icon name="check-circle" />
        <div>{{ session('success') }}</div>
        <button type="button" class="alert-close" data-dismiss aria-label="Dismiss">&times;</button>
    </div>
@endif
@if (session('error'))
    <div class="alert alert-error" role="alert">
        <x-icon name="alert" />
        <div>{{ session('error') }}</div>
        <button type="button" class="alert-close" data-dismiss aria-label="Dismiss">&times;</button>
    </div>
@endif
@if ($errors->any() && !($hideErrorSummary ?? false))
    <div class="alert alert-error" role="alert">
        <x-icon name="alert" />
        <div>
            <strong>Please fix the following:</strong>
            <ul>
                @foreach ($errors->all() as $message)
                    <li>{{ $message }}</li>
                @endforeach
            </ul>
        </div>
    </div>
@endif
