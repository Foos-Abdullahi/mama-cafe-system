<?php

use App\Models\Payroll;
use App\Models\User;
use App\Models\Waitress;

test('authenticated user can view payroll page and process payout', function () {
    $user = User::factory()->create();
    $waitress = Waitress::create([
        'name' => 'Fatima Ali',
        'phone' => '+252610000000',
        'commission_rate' => 0.15,
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)->get(route('finance.payroll.index'));
    $response->assertOk();

    $createResponse = $this->actingAs($user)->get(route('finance.payroll.create'));
    $createResponse->assertOk();

    $postResponse = $this->actingAs($user)->post(route('finance.payroll.store'), [
        'waitress_id' => $waitress->id,
        'period_start' => now()->subDays(7)->format('Y-m-d'),
        'period_end' => now()->format('Y-m-d'),
        'commission_amount' => 45.00,
        'notes' => 'Weekly payout',
    ]);

    $payroll = Payroll::first();
    $postResponse->assertRedirect(route('finance.payroll.show', $payroll->id));

    $this->assertDatabaseHas('payrolls', [
        'waitress_id' => $waitress->id,
        'commission_amount' => 45.00,
    ]);

    $showResponse = $this->actingAs($user)->get(route('finance.payroll.show', $payroll));
    $showResponse->assertOk();
});
