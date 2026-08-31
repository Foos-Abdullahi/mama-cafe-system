<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RolePermissionController extends Controller
{
    public static function getDefaultPermissions(): array
    {
        return [
            'dashboard_view' => [
                'name' => 'View Dashboard & Analytics',
                'description' => 'Access main executive dashboard KPIs and charts',
                'category' => 'Overview',
                'admin' => true,
                'manager' => true,
                'operations' => true,
                'waitress' => false,
            ],
            'pos_access' => [
                'name' => 'Access POS Terminal',
                'description' => 'Open cashier point of sale terminal',
                'category' => 'Operations',
                'admin' => true,
                'manager' => true,
                'operations' => true,
                'waitress' => true,
            ],
            'orders_view' => [
                'name' => 'View Customer Orders',
                'description' => 'Browse and search sales order history',
                'category' => 'Management',
                'admin' => true,
                'manager' => true,
                'operations' => true,
                'waitress' => true,
            ],
            'orders_create' => [
                'name' => 'Create New Orders',
                'description' => 'Place new customer sales orders',
                'category' => 'Management',
                'admin' => true,
                'manager' => true,
                'operations' => true,
                'waitress' => true,
            ],
            'orders_edit' => [
                'name' => 'Edit / Update Orders',
                'description' => 'Modify existing items, prices, or statuses',
                'category' => 'Management',
                'admin' => true,
                'manager' => true,
                'operations' => false,
                'waitress' => false,
            ],
            'orders_delete' => [
                'name' => 'Delete / Void Orders',
                'description' => 'Permanently delete or void order records',
                'category' => 'Management',
                'admin' => true,
                'manager' => true,
                'operations' => false,
                'waitress' => false,
            ],
            'products_manage' => [
                'name' => 'Manage Products & Categories',
                'description' => 'Add, edit, or deactivate menu items and categories',
                'category' => 'Management',
                'admin' => true,
                'manager' => true,
                'operations' => false,
                'waitress' => false,
            ],
            'waitresses_manage' => [
                'name' => 'Manage Waitresses & Fixed Numbers',
                'description' => 'Manage floor waitresses, commission rates, and number ranges',
                'category' => 'Management',
                'admin' => true,
                'manager' => true,
                'operations' => false,
                'waitress' => false,
            ],
            'finance_payments' => [
                'name' => 'View Payments Ledger',
                'description' => 'Track payment transactions and payment methods',
                'category' => 'Finance & Reports',
                'admin' => true,
                'manager' => true,
                'operations' => false,
                'waitress' => false,
            ],
            'finance_payroll' => [
                'name' => 'Process Staff Payroll',
                'description' => 'Calculate and process 15% waitress commission payouts',
                'category' => 'Finance & Reports',
                'admin' => true,
                'manager' => true,
                'operations' => false,
                'waitress' => false,
            ],
            'finance_reports' => [
                'name' => 'View Financial Reports',
                'description' => 'Access revenue and waitress performance reports',
                'category' => 'Finance & Reports',
                'admin' => true,
                'manager' => true,
                'operations' => false,
                'waitress' => false,
            ],
            'finance_daily_closing' => [
                'name' => 'Perform Daily EOD Closing',
                'description' => 'Close cash drawer and submit daily cash reconciliation',
                'category' => 'Finance & Reports',
                'admin' => true,
                'manager' => true,
                'operations' => false,
                'waitress' => false,
            ],
            'system_manage' => [
                'name' => 'System Settings & Users',
                'description' => 'Manage cafe settings, user accounts, and activity logs',
                'category' => 'System',
                'admin' => true,
                'manager' => false,
                'operations' => false,
                'waitress' => false,
            ],
        ];
    }

    public static function getPermissions(): array
    {
        $defaults = static::getDefaultPermissions();
        $saved = Setting::getByKey('role_permissions');

        if (! $saved) {
            return $defaults;
        }

        $decoded = json_decode($saved, true);

        if (! is_array($decoded)) {
            return $defaults;
        }

        foreach ($defaults as $key => $meta) {
            if (isset($decoded[$key])) {
                $defaults[$key]['manager'] = (bool) ($decoded[$key]['manager'] ?? $meta['manager']);
                $defaults[$key]['operations'] = (bool) ($decoded[$key]['operations'] ?? $meta['operations']);
                $defaults[$key]['waitress'] = (bool) ($decoded[$key]['waitress'] ?? $meta['waitress']);
                // admin is always true
                $defaults[$key]['admin'] = true;
            }
        }

        return $defaults;
    }

    public function index(): Response
    {
        $permissions = static::getPermissions();

        $stats = [
            [
                'title' => 'Configurable Roles',
                'value' => '4 Roles',
                'change' => 'Admin, Manager, Operations, Waitress',
                'trend' => 'up',
            ],
            [
                'title' => 'Permission Rules',
                'value' => (string) count($permissions),
                'change' => 'Active system permission checks',
                'trend' => 'up',
            ],
        ];

        return Inertia::render('admin/system/roles/index', [
            'permissions' => $permissions,
            'stats' => $stats,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'permissions' => 'required|array',
        ]);

        $defaults = static::getDefaultPermissions();
        $updated = [];

        foreach ($validated['permissions'] as $key => $roles) {
            if (isset($defaults[$key])) {
                $updated[$key] = [
                    'admin' => true,
                    'manager' => (bool) ($roles['manager'] ?? false),
                    'operations' => (bool) ($roles['operations'] ?? false),
                    'waitress' => (bool) ($roles['waitress'] ?? false),
                ];
            }
        }

        Setting::setByKey('role_permissions', json_encode($updated), 'system');

        ActivityLog::log('roles_update', 'Updated role permissions matrix.');

        return redirect()->back()->with('success', 'Role permissions updated successfully!');
    }
}
