<?php

use App\Models\User;

test('authenticated user can view sales reports page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('finance.reports.index'));

    $response->assertOk();
});
