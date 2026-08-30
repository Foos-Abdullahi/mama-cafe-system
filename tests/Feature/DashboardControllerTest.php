<?php

use App\Models\User;

test('authenticated user can view dashboard with live metrics', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertOk();
});
