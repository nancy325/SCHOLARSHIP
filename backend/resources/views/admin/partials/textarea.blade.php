<div class="field span-2">
    <label for="{{ $name }}">{{ $label }}</label>
    <textarea id="{{ $name }}" name="{{ $name }}" rows="{{ $rows ?? 4 }}" class="input @error($name) is-invalid @enderror">{{ old($name, $value ?? '') }}</textarea>
    @include('partials.field-error', ['name' => $name])
</div>
