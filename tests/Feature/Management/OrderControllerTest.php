<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

test('admin or manager can access orders index page', function () {
    $user = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($user)->get(route('management.orders.index'));

    $response->assertOk();
});

test('admin or manager can access order detail show page', function () {
    $user = User::factory()->create(['role' => 'admin']);

    $category = Category::create([
        'name' => 'Hot Drinks',
        'status' => 'active',
    ]);

    $product = Product::create([
        'category_id' => $category->id,
        'name' => 'Spanish Latte',
        'price' => 5.00,
        'status' => 'active',
    ]);

    $order = Order::create([
        'order_number' => 'ORD-1002',
        'order_type' => 'dine_in',
        'status' => 'completed',
        'payment_status' => 'paid',
        'subtotal' => 5.00,
        'total' => 5.00,
    ]);

    $order->items()->create([
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => 5.00,
        'line_total' => 5.00,
    ]);

    $response = $this->actingAs($user)->get(route('management.orders.show', $order));

    $response->assertOk();
});

test('admin can delete an order', function () {
    $user = User::factory()->create(['role' => 'admin']);

    $order = Order::create([
        'order_number' => 'ORD-1004',
        'order_type' => 'dine_in',
        'status' => 'draft',
        'payment_status' => 'unpaid',
        'subtotal' => 10.00,
        'total' => 10.00,
    ]);

    $response = $this->actingAs($user)->delete(route('management.orders.destroy', $order));

    $response->assertRedirect(route('management.orders.index'));
    expect(Order::find($order->id))->toBeNull();
});

test('non-admin user cannot delete an order', function (string $role) {
    $user = User::factory()->create(['role' => $role]);

    $order = Order::create([
        'order_number' => 'ORD-1004-'.$role,
        'order_type' => 'dine_in',
        'status' => 'draft',
        'payment_status' => 'unpaid',
        'subtotal' => 10.00,
        'total' => 10.00,
    ]);

    $response = $this->actingAs($user)->delete(route('management.orders.destroy', $order));

    if (in_array($role, ['waitress', 'operations'], true)) {
        $response->assertRedirect(route('pos.index'));
    } else {
        $response->assertForbidden();
    }
    expect(Order::find($order->id))->not->toBeNull();
})->with(['manager', 'waitress', 'operations']);

test('authenticated user can change an order status', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $order = Order::create([
        'order_number' => 'ORD-1006',
        'order_type' => 'dine_in',
        'status' => 'pending',
        'payment_status' => 'paid',
        'subtotal' => 10.00,
        'total' => 10.00,
    ]);

    $response = $this->actingAs($user)->patch(route('management.orders.status', $order), [
        'status' => 'completed',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'completed',
    ]);
    expect($order->fresh()->completed_at)->not->toBeNull();
});

test('authenticated user can update payment status and partial balance', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $order = Order::create([
        'order_number' => 'ORD-1007',
        'order_type' => 'dine_in',
        'status' => 'pending',
        'payment_status' => 'pending',
        'subtotal' => 10.00,
        'total' => 10.00,
    ]);

    $order->payments()->create([
        'method' => 'cash',
        'amount' => 0,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($user)->patch(route('management.orders.payment-status', $order), [
        'payment_status' => 'partial',
        'amount_paid' => 4.25,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'payment_status' => 'partial',
    ]);
    $this->assertDatabaseHas('payments', [
        'order_id' => $order->id,
        'amount' => 4.25,
        'status' => 'partial',
    ]);
});

test('admin or manager can access order invoice page', function () {
    $user = User::factory()->create(['role' => 'admin']);

    $category = Category::create([
        'name' => 'Cold Drinks',
        'status' => 'active',
    ]);

    $product = Product::create([
        'category_id' => $category->id,
        'name' => 'Iced Boba Latte',
        'price' => 6.50,
        'status' => 'active',
    ]);

    $order = Order::create([
        'order_number' => 'ORD-1005',
        'order_type' => 'dine_in',
        'status' => 'completed',
        'payment_status' => 'paid',
        'subtotal' => 6.50,
        'total' => 6.50,
    ]);

    $order->items()->create([
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => 6.50,
        'line_total' => 6.50,
    ]);

    $response = $this->actingAs($user)->get(route('management.orders.invoice', $order));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/management/orders/invoice')
        ->has('order')
        ->has('company')
    );
});
