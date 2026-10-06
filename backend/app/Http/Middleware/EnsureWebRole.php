<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Role guard for the Blade (web) pages.
 * Usage: ->middleware('web.role:super_admin,admin')
 * Unlike EnsureRole (API), this redirects guests to the login page
 * and shows the 403 page instead of returning JSON.
 */
class EnsureWebRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->guest(route('login'));
        }

        if (($user->RecStatus ?? 'active') !== 'active') {
            auth()->logout();
            $request->session()->invalidate();
            return redirect()->route('login')->withErrors(['email' => 'Your account has been deactivated.']);
        }

        if (!empty($roles) && !in_array($user->role ?? 'student', $roles, true)) {
            abort(403, 'You do not have permission to view this page.');
        }

        return $next($request);
    }
}
