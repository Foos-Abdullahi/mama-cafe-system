<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use App\Models\Waitress;

test('authenticated user can view POS terminal and submit a pending order with discount and tax', function () {
    $user = User::factory()->create(['role' => 'admin']);

    $category = Category::create([
        'name' => 'Hot Beverages',
        'description' => 'Coffee & Tea',
        'status' => 'active',
    ]);

    Setting::create(['key' => 'tax_rate', 'value' => '5']);

    $product = Product::create([
        'category_id' => $category->id,
        'name' => 'Espresso',
        'description' => 'Double shot',
        'price' => 3.50,
        'status' => 'active',
    ]);

    $waitress = Waitress::create([
        'name' => 'Amina Hassan',
        'phone' => '+252615550202',
        'commission_rate' => 0.15,
        'status' => 'active',
    ]);

    // View POS terminal
    $response = $this->actingAs($user)->get(route('pos.index'));
    $response->assertOk();

    // Submit POS sale
    $postResponse = $this->actingAs($user)->post(route('pos.store'), [
        'order_type' => 'dine_in',
        'fixed_number' => 102,
        'waitress_id' => $waitress->id,
        'payment_method' => 'cash',
        'payment_status' => 'paid',
        'discount' => 1,
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 2,
            ],
        ],
    ]);

    $postResponse->assertRedirect(route('pos.index'));

    $this->assertDatabaseHas('orders', [
        'waitress_id' => $waitress->id,
        'fixed_number' => 102,
        'discount' => 1.00,
        'tax' => 0.30,
        'total' => 6.30,
        'status' => 'pending',
    ]);

    $this->assertDatabaseHas('order_items', [
        'product_id' => $product->id,
        'quantity' => 2,
        'line_total' => 7.00,
    ]);

    $this->assertDatabaseHas('payments', [
        'method' => 'cash',
        'amount' => 6.30,
        'status' => 'paid',
    ]);
});

test('authenticated user can view POS order history page', function () {
    $user = User::factory()->create(['role' => 'operations']);

    $response = $this->actingAs($user)->get(route('pos.orders'));

    $response->assertOk();
});

test('operations and waitress roles redirect to POS after login', function () {
    $operationsUser = User::factory()->create([
        'email' => 'ops@mamacafe.test',
        'password' => bcrypt('password'),
        'role' => 'operations',
    ]);

    $response = $this->post('/login', [
        'email' => 'ops@mamacafe.test',
        'password' => 'password',
    ]);

    $response->assertRedirect(route('pos.index'));
});

test('admin role redirects to dashboard after login', function () {
    $adminUser = User::factory()->create([
        'email' => 'admin@mamacafe.test',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);

    $response = $this->post('/login', [
        'email' => 'admin@mamacafe.test',
        'password' => 'password',
    ]);

    $response->assertRedirect(route('dashboard'));
});

test('waitress user role is restricted from system user administration', function () {
    $waitressUser = User::factory()->create(['role' => 'waitress']);

    $response = $this->actingAs($waitressUser)->get(route('system.users.index'));

    $response->assertRedirect(route('pos.index'));
});

test('POS store rejects a partial payment that equals or exceeds the order total', function () {
    $user = User::factory()->create(['role' => 'admin']);

    $category = Category::create([
        'name' => 'Hot Beverages',
        'description' => 'Coffee & Tea',
        'status' => 'active',
    ]);

    $product = Product::create([
        'category_id' => $category->id,
        'name' => 'Espresso',
        'description' => 'Double shot',
        'price' => 3.50,
        'status' => 'active',
    ]);

    $this->actingAs($user)->post(route('pos.store'), [
        'order_type' => 'dine_in',
        'payment_method' => 'cash',
        'payment_status' => 'partial',
        'amount_paid' => 7.00,
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 2,
            ],
        ],
    ])->assertSessionHasErrors('amount_paid');

    $this->assertDatabaseCount('orders', 0);
});

test('payment status update rejects a partial payment that equals the order total', function () {
    $user = User::factory()->create(['role' => 'admin']);

    $category = Category::create([
        'name' => 'Hot Beverages',
        'description' => 'Coffee & Tea',
        'status' => 'active',
    ]);

    $product = Product::create([
        'category_id' => $category->id,
        'name' => 'Espresso',
        'description' => 'Double shot',
        'price' => 3.50,
        'status' => 'active',
    ]);

    $this->actingAs($user)->post(route('pos.store'), [
        'order_type' => 'dine_in',
        'payment_method' => 'cash',
        'payment_status' => 'partial',
        'amount_paid' => 3.00,
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 2,
            ],
        ],
    ]);

    $order = Order::firstOrFail();

    $this->actingAs($user)->patch(
        route('management.orders.payment-status', $order),
        [
            'payment_status' => 'partial',
            'amount_paid' => 7.00,
        ],
    )->assertSessionHasErrors('amount_paid');
});

test('a pending order cannot be marked completed until its payment is paid', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $order = Order::create([
        'order_number' => 'ORD-1008',
        'order_type' => 'dine_in',
        'status' => 'pending',
        'payment_status' => 'partial',
        'subtotal' => 10.00,
        'total' => 10.00,
    ]);

    $this->actingAs($user)->patch(
        route('management.orders.status', $order),
        ['status' => 'completed'],
    )->assertSessionHasErrors('status');

    expect($order->fresh()->status)->toBe('pending');
});

test('payment status update rejects a partial payment exceeding the current remaining balance', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $order = Order::create([
        'order_number' => 'ORD-1009',
        'order_type' => 'dine_in',
        'status' => 'pending',
        'payment_status' => 'partial',
        'subtotal' => 10.00,
        'total' => 10.00,
    ]);

    $order->payments()->create([
        'method' => 'cash',
        'amount' => 5.00,
        'status' => 'partial',
    ]);

    $this->actingAs($user)->patch(
        route('management.orders.payment-status', $order),
        [
            'payment_status' => 'partial',
            'amount_paid' => 6.00,
        ],
    )->assertSessionHasErrors('amount_paid');

    expect($order->fresh()->payment_status)->toBe('partial');
});

test('payment status update collects the remaining balance when an order is marked paid', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $order = Order::create([
        'order_number' => 'ORD-1010',
        'order_type' => 'dine_in',
        'status' => 'pending',
        'payment_status' => 'partial',
        'subtotal' => 10.00,
        'total' => 10.00,
    ]);

    $order->payments()->create([
        'method' => 'cash',
        'amount' => 5.00,
        'status' => 'partial',
    ]);

    $this->actingAs($user)->patch(
        route('management.orders.payment-status', $order),
        ['payment_status' => 'paid'],
    )->assertRedirect();

    expect($order->fresh()->payment_status)->toBe('paid');
    expect((float) $order->payments()->sum('amount'))->toBe(10.0);
});
