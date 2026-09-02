<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $systemRoles = [
            [
                'name' => 'Administrator',
                'slug' => 'admin',
                'description' => 'Unrestricted full access across all modules, settings, and user management. Cannot be modified.',
                'is_system' => true,
                'permissions' => ['*'],
            ],
            [
                'name' => 'Manager',
                'slug' => 'manager',
                'description' => 'Full operational access including finance, reports, orders, products, and payroll management.',
                'is_system' => true,
                'permissions' => [
                    'dashboard_view',
                    'pos_access',
                    'orders_view', 'orders_create', 'orders_edit', 'orders_delete',
                    'products_view', 'products_manage',
                    'waitresses_view', 'waitresses_manage',
                    'finance_payments', 'finance_payroll', 'finance_reports', 'finance_daily_closing',
                    'activity_logs',
                ],
            ],
            [
                'name' => 'Operations',
                'slug' => 'operations',
                'description' => 'Access to POS terminal, order placement, and order history. No finance or management access.',
                'is_system' => true,
                'permissions' => [
                    'pos_access',
                    'orders_view', 'orders_create',
                    'products_view',
                    'waitresses_view',
                ],
            ],
            [
                'name' => 'Waitress',
                'slug' => 'waitress',
                'description' => 'POS terminal access only for order placement. Read-only access to orders and products.',
                'is_system' => true,
                'permissions' => [
                    'pos_access',
                    'orders_view', 'orders_create',
                    'products_view',
                ],
            ],
        ];

        foreach ($systemRoles as $roleData) {
            Role::updateOrCreate(
                ['slug' => $roleData['slug']],
                $roleData,
            );
        }
    }
}
