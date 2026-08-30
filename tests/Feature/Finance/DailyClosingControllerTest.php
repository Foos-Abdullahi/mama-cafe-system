<?php

use App\Models\User;

test('authenticated user can view and submit daily EOD closing', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('finance.daily-closing.index'));
    $response->assertOk();

    $postResponse = $this->actingAs($user)->post(route('finance.daily-closing.store'), [
        'closing_date' => now()->format('Y-m-d'),
        'cash_actual' => 120.00,
        'notes' => 'EOD cash balanced',
    ]);

    $postResponse->assertRedirect(route('finance.daily-closing.index'));
    $this->assertDatabaseHas('daily_closings', [
        'cash_actual' => 120.00,
    ]);
});
