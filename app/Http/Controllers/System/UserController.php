<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::latest()->get()->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role ?? 'operations',
                'created_at' => $u->created_at ? $u->created_at->format('Y-m-d H:i') : '—',
            ];
        });

        $stats = [
            [
                'title' => 'Total Users',
                'value' => (string) $users->count(),
                'change' => 'Active staff accounts',
                'trend' => 'up',
            ],
            [
                'title' => 'Admin Roles',
                'value' => (string) $users->where('role', 'admin')->count(),
                'change' => 'System administrators',
                'trend' => 'up',
            ],
            [
                'title' => 'Operations & Staff',
                'value' => (string) $users->whereIn('role', ['operations', 'manager', 'waitress'])->count(),
                'change' => 'Floor & cashier accounts',
                'trend' => 'up',
            ],
        ];

        return Inertia::render('admin/system/users/index', [
            'users' => $users,
            'stats' => $stats,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/system/users/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'role' => 'required|in:admin,manager,operations,waitress',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        ActivityLog::log('user_create', "Created user account for {$user->name} ({$user->email}).");

        return redirect()->route('system.users.index')->with('success', 'User account created successfully!');
    }

    public function show(User $user): Response
    {
        return Inertia::render('admin/system/users/show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'operations',
                'created_at' => $user->created_at ? $user->created_at->format('Y-m-d H:i') : '—',
                'updated_at' => $user->updated_at ? $user->updated_at->format('Y-m-d H:i') : '—',
            ],
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('admin/system/users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'operations',
            ],
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => 'required|in:admin,manager,operations,waitress',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        ActivityLog::log('user_update', "Updated user account for {$user->name}.");

        return redirect()->route('system.users.index')->with('success', 'User account updated successfully!');
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'You cannot delete your own active account!');
        }

        $userName = $user->name;
        $user->delete();

        ActivityLog::log('user_delete', "Deleted user account {$userName}.");

        return redirect()->route('system.users.index')->with('success', 'User account deleted successfully!');
    }
}
