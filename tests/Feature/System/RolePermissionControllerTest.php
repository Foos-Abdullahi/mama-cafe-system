<?php

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    // Ensure system roles exist for every test
    (new RoleSeeder)->run();
});

test('admin can view role permissions management page', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)->get(route('system.roles.index'))->assertOk();
});

test('admin can view create role page', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)->get(route('system.roles.create'))->assertOk();
});

test('admin can create a custom role', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('system.roles.store'), [
        'name' => 'Head Cashier',
        'slug' => 'head_cashier',
        'description' => 'Manages cash operations.',
        'permissions' => ['pos_access', 'orders_view'],
    ]);

    $response->assertRedirect(route('system.roles.index'));

    $this->assertDatabaseHas('roles', [
        'slug' => 'head_cashier',
        'is_system' => false,
    ]);
});

test('admin can view a role detail page', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $role = Role::where('slug', 'manager')->first();

    $this->actingAs($admin)->get(route('system.roles.show', $role))->assertOk();
});

test('admin can view edit role page', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $role = Role::where('slug', 'operations')->first();

    $this->actingAs($admin)->get(route('system.roles.edit', $role))->assertOk();
});

test('admin can update role permissions', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $role = Role::where('slug', 'operations')->first();

    $response = $this->actingAs($admin)->put(route('system.roles.update', $role), [
        'permissions' => ['pos_access', 'orders_view', 'orders_create'],
    ]);

    $response->assertRedirect(route('system.roles.index'));

    $role->refresh();
    expect($role->permissions)->toContain('orders_view');
});

test('system roles cannot be deleted', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $systemRole = Role::where('slug', 'waitress')->first();

    $response = $this->actingAs($admin)->delete(route('system.roles.destroy', $systemRole));

    $response->assertRedirect(route('system.roles.index'));
    $this->assertDatabaseHas('roles', ['slug' => 'waitress']);
});

test('custom roles can be deleted', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $customRole = Role::factory()->create(['slug' => 'temp_role', 'is_system' => false]);

    $response = $this->actingAs($admin)->delete(route('system.roles.destroy', $customRole));

    $response->assertRedirect(route('system.roles.index'));
    $this->assertDatabaseMissing('roles', ['slug' => 'temp_role']);
});

test('creating a role with duplicate slug fails', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)->post(route('system.roles.store'), [
        'name' => 'Duplicate',
        'slug' => 'admin',
        'permissions' => [],
    ])->assertSessionHasErrors('slug');
});
