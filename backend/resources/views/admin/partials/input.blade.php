<div class="field {{ ($span ?? 1) == 2 ? 'span-2' : '' }}">
    <label for="{{ $name }}">{{ $label }} @if ($required ?? false)<span class="req">*</span>@endif</label>
    <input id="{{ $name }}" name="{{ $name }}" type="{{ $type ?? 'text' }}" class="input @error($name) is-invalid @enderror"
        value="{{ old($name, $value ?? '') }}" @if ($required ?? false) required @endif
        @isset($placeholder) placeholder="{{ $placeholder }}" @endisset @isset($step) step="{{ $step }}" @endisset
        @isset($autocomplete) autocomplete="{{ $autocomplete }}" @endisset>
    @isset($hint)<span class="hint">{{ $hint }}</span>@endisset
    @include('partials.field-error', ['name' => $name])
</div>
