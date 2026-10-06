<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

/**
 * Stores a list as ",a,b,c," so it can be matched portably with LIKE '%,a,%'.
 * An empty list is stored as NULL (meaning "no restriction").
 */
class CommaList implements CastsAttributes
{
    public function get($model, string $key, $value, array $attributes): array
    {
        return $value ? array_values(array_filter(explode(',', $value))) : [];
    }

    public function set($model, string $key, $value, array $attributes): ?string
    {
        $items = array_values(array_unique(array_filter((array) $value, fn ($v) => $v !== null && $v !== '')));

        return $items ? ',' . implode(',', $items) . ',' : null;
    }
}
