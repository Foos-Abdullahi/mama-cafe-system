<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RolePermissionController extends Controller
{
    /**
     * All available permissions grouped by module.
     * Format: 'key' => ['name' => '...', 'description' => '...', 'module' => '...']
     *
     * @return array<string, array{name: string, description: string, module: string}>
     */
    public static function getPermissionRegistry(): array
    {
        return [
            // Operations Module
            'pos_access' => [
                'name' => 'Access POS Terminal',
                'description' => 'Open and use the cashier point-of-sale terminal',
                'module' => 'Operations',
            ],

            // Management Module
            'orders_view' => [
                'name' => 'View Orders',
                'description' => 'Browse and search sales order history',
                'module' => 'Management',
            ],
            'orders_create' => [
                'name' => 'Create Orders',
                'description' => 'Place new customer sales orders',
                'module' => 'Management',
            ],
            'orders_edit' => [
                'name' => 'Edit Orders',
                'description' => 'Modify existing items, prices, or statuses on orders',
                'module' => 'Management',
            ],
            'orders_delete' => [
                'name' => 'Delete / Void Orders',
                'description' => 'Permanently delete or void order records',
                'module' => 'Management',
            ],
            'products_view' => [
                'name' => 'View Products & Categories',
                'description' => 'Browse the product catalog and category list',
                'module' => 'Management',
            ],
            'products_manage' => [
                'name' => 'Manage Products & Categories',
                'description' => 'Add, edit, or deactivate menu items and categories',
                'module' => 'Management',
            ],
            'waitresses_view' => [
                'name' => 'View Waitresses',
                'description' => 'Browse the waitress roster and fixed number ranges',
                'module' => 'Management',
            ],
            'waitresses_manage' => [
                'name' => 'Manage Waitresses',
                'description' => 'Add, edit, or remove waitresses and commission rates',
                'module' => 'Management',
            ],

            // Finance & Reports Module
            'finance_payments' => [
                'name' => 'View Payments Ledger',
                'description' => 'Track payment transactions and payment methods',
                'module' => 'Finance & Reports',
            ],
            'finance_payroll' => [
                'name' => 'Process Staff Payroll',
                'description' => 'Calculate and process 15% waitress commission payouts',
                'module' => 'Finance & Reports',
            ],
            'finance_reports' => [
                'name' => 'View Financial Reports',
                'description' => 'Access revenue and waitress performance reports',
                'module' => 'Finance & Reports',
            ],
            'finance_daily_closing' => [
                'name' => 'Perform Daily EOD Closing',
                'description' => 'Close cash drawer and submit daily cash reconciliation',
                'module' => 'Finance & Reports',
            ],

            // System Module
            'dashboard_view' => [
                'name' => 'View Dashboard & Analytics',
                'description' => 'Access main executive dashboard KPIs and charts',
                'module' => 'System',
            ],
            'system_users' => [
                'name' => 'Manage User Accounts',
                'description' => 'Create, edit, or deactivate system user accounts',
                'module' => 'System',
            ],
            'system_settings' => [
                'name' => 'Manage System Settings',
                'description' => 'Configure café identity, branding, and general settings',
                'module' => 'System',
            ],
            'system_roles' => [
                'name' => 'Manage Roles & Permissions',
                'description' => 'Create, edit, and assign role privileges to staff',
                'module' => 'System',
            ],
            'activity_logs' => [
                'name' => 'View Activity Audit Logs',
                'description' => 'Inspect security events and user activity audit trail',
                'module' => 'System',
            ],
        ];
    }

    /**
     * Group permission registry by module for frontend display.
     *
     * @return array<string, array<string, array{name: string, description: string, module: string}>>
     */
    public static function getPermissionsByModule(): array
    {
        $grouped = [];

        foreach (static::getPermissionRegistry() as $key => $meta) {
            $grouped[$meta['module']][$key] = $meta;
        }

        return $grouped;
    }

    public function index(): Response
    {
        $roles = Role::withCount('users')->orderBy('is_system', 'desc')->orderBy('name')->get();

        $registry = static::getPermissionRegistry();
        $totalPermissions = count($registry);

        $stats = [
            'total_roles' => $roles->count(),
            'system_roles' => $roles->where('is_system', true)->count(),
            'custom_roles' => $roles->where('is_system', false)->count(),
            'total_permissions' => $totalPermissions,
            'assigned_users' => User::count(),
        ];

        return Inertia::render('admin/system/roles/index', [
            'roles' => $roles->map(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'description' => $role->description,
                'is_system' => $role->is_system,
                'permissions_count' => $role->slug === 'admin' ? $totalPermissions : count($role->permissions ?? []),
                'users_count' => $role->users_count,
            ]),
            'stats' => $stats,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/system/roles/create', [
            'permissionsByModule' => static::getPermissionsByModule(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:100|unique:roles,slug|regex:/^[a-z0-9_-]+$/',
            'description' => 'nullable|string|max:500',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|in:'.implode(',', array_keys(static::getPermissionRegistry())),
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
            'is_system' => false,
            'permissions' => $validated['permissions'] ?? [],
        ]);

        ActivityLog::log('role_create', "Created custom role: {$role->name} ({$role->slug}).");

        return redirect()->route('system.roles.index')->with('success', "Role \"{$role->name}\" created successfully.");
    }

    public function show(Role $role): Response
    {
        $registry = static::getPermissionRegistry();

        return Inertia::render('admin/system/roles/show', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'description' => $role->description,
                'is_system' => $role->is_system,
                'permissions' => $role->permissions ?? [],
                'users_count' => $role->users()->count(),
            ],
            'permissionsByModule' => static::getPermissionsByModule(),
            'totalPermissions' => count($registry),
        ]);
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('admin/system/roles/edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'description' => $role->description,
                'is_system' => $role->is_system,
                'permissions' => $role->permissions ?? [],
            ],
            'permissionsByModule' => static::getPermissionsByModule(),
        ]);
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        $isSystem = $role->is_system;

        $rules = [
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|in:'.implode(',', array_keys(static::getPermissionRegistry())),
        ];

        if (! $isSystem) {
            $rules['name'] = 'required|string|max:255';
            $rules['slug'] = "required|string|max:100|unique:roles,slug,{$role->id}|regex:/^[a-z0-9_-]+$/";
            $rules['description'] = 'nullable|string|max:500';
        }

        $validated = $request->validate($rules);

        $updateData = [
            'permissions' => $validated['permissions'] ?? [],
        ];

        if (! $isSystem) {
            $updateData['name'] = $validated['name'];
            $updateData['slug'] = $validated['slug'];
            $updateData['description'] = $validated['description'] ?? null;
        }

        $role->update($updateData);

        ActivityLog::log('role_update', "Updated role: {$role->name} ({$role->slug}).");

        return redirect()->route('system.roles.index')->with('success', "Role \"{$role->name}\" updated successfully.");
    }

    public function destroy(Role $role): RedirectResponse
    {
        if ($role->is_system) {
            return redirect()->route('system.roles.index')->with('error', 'System roles cannot be deleted.');
        }

        $name = $role->name;
        $role->delete();

        ActivityLog::log('role_delete', "Deleted custom role: {$name}.");

        return redirect()->route('system.roles.index')->with('success', "Role \"{$name}\" deleted successfully.");
    }
}
