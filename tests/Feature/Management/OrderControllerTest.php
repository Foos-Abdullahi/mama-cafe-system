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

test('admin or manager can delete an order', function () {
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
