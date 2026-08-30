<?php

use App\Models\User;

test('authenticated admin user can manage user accounts', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get(route('system.users.index'));
    $response->assertOk();

    $createResponse = $this->actingAs($admin)->get(route('system.users.create'));
    $createResponse->assertOk();

    $postResponse = $this->actingAs($admin)->post(route('system.users.store'), [
        'name' => 'Cashier User',
        'email' => 'cashier@mamacafe.test',
        'role' => 'operations',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $postResponse->assertRedirect(route('system.users.index'));

    $this->assertDatabaseHas('users', [
        'email' => 'cashier@mamacafe.test',
        'role' => 'operations',
    ]);

    $user = User::where('email', 'cashier@mamacafe.test')->first();

    $showResponse = $this->actingAs($admin)->get(route('system.users.show', $user));
    $showResponse->assertOk();

    $editResponse = $this->actingAs($admin)->get(route('system.users.edit', $user));
    $editResponse->assertOk();

    $putResponse = $this->actingAs($admin)->put(route('system.users.update', $user), [
        'name' => 'Cashier Updated',
        'email' => 'cashier@mamacafe.test',
        'role' => 'manager',
    ]);

    $putResponse->assertRedirect(route('system.users.index'));
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Cashier Updated',
        'role' => 'manager',
    ]);

    $deleteResponse = $this->actingAs($admin)->delete(route('system.users.destroy', $user));
    $deleteResponse->assertRedirect(route('system.users.index'));
    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});
