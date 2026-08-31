<?php

use App\Models\User;

test('admin can view role permissions management page', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get(route('system.roles.index'));

    $response->assertOk();
});

test('admin can update role permissions matrix', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->put(route('system.roles.update'), [
        'permissions' => [
            'orders_edit' => [
                'manager' => true,
                'operations' => true,
                'waitress' => false,
            ],
            'products_manage' => [
                'manager' => true,
                'operations' => false,
                'waitress' => false,
            ],
        ],
    ]);

    $response->assertRedirect();
});
