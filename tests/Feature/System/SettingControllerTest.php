<?php

use App\Models\User;

test('authenticated user can view and update system settings', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('system.settings.index'));
    $response->assertOk();

    $putResponse = $this->actingAs($user)->put(route('system.settings.update'), [
        'cafe_name' => 'MaMa Premium Café',
        'cafe_phone' => '+252610009999',
        'cafe_address' => 'KM4, Mogadishu',
        'currency' => 'USD ($)',
        'tax_rate' => 0,
        'vat_rate' => 0,
        'default_commission_rate' => 15,
        'commission_rates' => '10, 12, 15, 18, 20',
        'cafe_waitress_numbers' => '101, 102, 103',
    ]);

    $putResponse->assertRedirect(route('system.settings.index'));

    $this->assertDatabaseHas('settings', [
        'key' => 'cafe_name',
        'value' => 'MaMa Premium Café',
    ]);
});
