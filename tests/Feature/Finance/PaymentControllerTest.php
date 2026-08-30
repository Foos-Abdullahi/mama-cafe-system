<?php

use App\Models\Order;
use App\Models\Payment;
use App\Models\User;

test('authenticated user can view payments tracking page', function () {
    $user = User::factory()->create();

    $order = Order::create([
        'order_number' => 'ORD-1001',
        'order_type' => 'dine_in',
        'status' => 'completed',
        'payment_status' => 'paid',
        'subtotal' => 15.50,
        'total' => 15.50,
    ]);

    Payment::create([
        'order_id' => $order->id,
        'method' => 'cash',
        'amount' => 15.50,
        'status' => 'paid',
        'paid_at' => now(),
    ]);

    $response = $this->actingAs($user)->get(route('finance.payments.index'));

    $response->assertOk();
});
