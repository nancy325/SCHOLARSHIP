<?php

namespace App\Http\Controllers\Web\Admin;

use App\Models\ScholarshipApplication;
use App\Models\User;
use App\Services\ScholarshipService;
use Illuminate\Database\Eloquent\Builder;

/**
 * Shared helpers for admin controllers.
 */
trait Concerns
{
    /** Applications on scholarships this admin is allowed to manage. */
    protected function applicationsFor(User $user): Builder
    {
        $service = app(ScholarshipService::class);

        return ScholarshipApplication::query()
            ->whereHas('scholarship', fn (Builder $q) => $service->applyRoleScoping($q, $user));
    }
}
