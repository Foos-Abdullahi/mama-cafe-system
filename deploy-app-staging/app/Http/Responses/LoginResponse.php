<?php

namespace App\Http\Responses;

use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

/**
 * Role-based login redirect.
 *
 * - admin / manager  → /dashboard (Admin Panel)
 * - operations / waitress → /pos  (Operations Portal)
 */
class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): RedirectResponse
    {
        $role = $request->user()?->role;

        $redirectTo = match ($role) {
            'operations', 'waitress' => route('pos.index'),
            default => route('dashboard'),
        };

        return redirect()->to($redirectTo);
    }
}
