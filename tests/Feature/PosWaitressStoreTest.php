<?php

use App\Models\User;
use App\Models\Waitress;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated user can quick-create a waitress from the POS terminal', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/pos/waitresses', [
        'name' => 'Amina Hassan',
        'phone' => '0712345678',
        'working_number' => 42,
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure(['id', 'name', 'phone', 'current_number'])
        ->assertJsonFragment(['name' => 'Amina Hassan', 'current_number' => 42]);

    $this->assertDatabaseHas('waitresses', [
        'name' => 'Amina Hassan',
        'phone' => '0712345678',
        'status' => 'active',
    ]);

    $waitress = Waitress::where('name', 'Amina Hassan')->first();
    $this->assertDatabaseHas('fixed_numbers', [
        'waitress_id' => $waitress->id,
        'current_number' => 42,
    ]);
});

test('quick-create waitress without optional fields creates waitress without fixed number', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/pos/waitresses', [
        'name' => 'Sara Ali',
    ]);

    $response->assertStatus(201)
        ->assertJsonFragment(['name' => 'Sara Ali', 'current_number' => null]);

    $this->assertDatabaseHas('waitresses', ['name' => 'Sara Ali']);
    $waitress = Waitress::where('name', 'Sara Ali')->first();
    $this->assertDatabaseMissing('fixed_numbers', ['waitress_id' => $waitress->id]);
});

test('quick-create waitress requires a name', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/pos/waitresses', [
        'phone' => '0712345678',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name']);
});

test('unauthenticated users cannot quick-create a waitress', function () {
    $response = $this->postJson('/pos/waitresses', [
        'name' => 'Hacker',
    ]);

    $response->assertStatus(401);
});

test('authenticated user can assign a working number to an existing waitress', function () {
    $user = User::factory()->create();
    $waitress = Waitress::create([
        'name' => 'Khadija Omar',
        'status' => 'active',
        'commission_rate' => 0.15,
    ]);

    $response = $this->actingAs($user)->postJson("/pos/waitresses/{$waitress->id}/assign-number", [
        'working_number' => 88,
    ]);

    $response->assertStatus(200)
        ->assertJsonFragment([
            'id' => $waitress->id,
            'current_number' => 88,
        ]);

    $this->assertDatabaseHas('fixed_numbers', [
        'waitress_id' => $waitress->id,
        'current_number' => 88,
    ]);
});
