<div class="field {{ ($span ?? 1) == 2 ? 'span-2' : '' }}" @isset($showWhen) data-show-when="{{ $showWhen }}" @endisset>
    <label for="{{ $name }}">{{ $label }} @if ($required ?? false)<span class="req">*</span>@endif</label>
    <select id="{{ $name }}" name="{{ $name }}" class="input @error($name) is-invalid @enderror">
        @isset($placeholder)<option value="">{{ $placeholder }}</option>@endisset
        @foreach ($options as $v => $l)
            <option value="{{ $v }}" @selected((string) old($name, $value ?? '') === (string) $v)>{{ $l }}</option>
        @endforeach
    </select>
    @isset($hint)<span class="hint">{{ $hint }}</span>@endisset
    @include('partials.field-error', ['name' => $name])
</div>
