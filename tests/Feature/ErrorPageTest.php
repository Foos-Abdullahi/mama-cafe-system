<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('it renders the custom error page on 404 not found', function () {
    $response = $this->get('/non-existent-route-404');

    $response->assertStatus(404);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('error')
        ->where('status', 404)
    );
});

test('it renders the custom error page for authenticated user on 404', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/non-existent-dashboard-page');

    $response->assertStatus(404);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('error')
        ->where('status', 404)
    );
});

test('it renders the custom error page on 403 unauthorized', function () {
    $user = User::factory()->create(['role' => 'manager']);

    // system/settings requires admin role
    $response = $this->actingAs($user)->get('/system/settings');

    $response->assertStatus(403);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('error')
        ->where('status', 403)
    );
});
