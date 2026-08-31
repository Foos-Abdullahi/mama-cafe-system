<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        if (! in_array($user->role, $roles, true)) {
            // Waitress or Operations trying to access unauthorized route
            if (in_array($user->role, ['waitress', 'operations'], true)) {
                return redirect()->route('pos.index')->with('error', 'Access restricted to your user role.');
            }

            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}
