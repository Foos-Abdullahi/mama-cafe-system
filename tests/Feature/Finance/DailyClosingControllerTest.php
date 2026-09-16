<?php

use App\Models\User;
use App\Models\Waitress;

test('authenticated user can view and submit daily EOD closing', function () {
    $user = User::factory()->create();

    $waitress = Waitress::create([
        'name' => 'Fatima Ali',
        'phone' => '+252610000000',
        'commission_rate' => 0.15,
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)->get(route('finance.daily-closing.index'));
    $response->assertOk();

    $postResponse = $this->actingAs($user)->post(route('finance.daily-closing.store'), [
        'closing_date' => now()->format('Y-m-d'),
        'notes' => 'Daily roster notes',
        'assignments' => [
            [
                'waitress_id' => $waitress->id,
                'name' => $waitress->name,
                'assigned_number' => '101',
                'is_active' => true,
            ],
        ],
    ]);

    $postResponse->assertRedirect(route('finance.daily-closing.index'));
    $this->assertDatabaseHas('daily_closings', [
        'notes' => 'Daily roster notes',
    ]);
});
