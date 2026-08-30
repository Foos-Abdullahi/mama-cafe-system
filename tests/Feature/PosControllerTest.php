<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\Waitress;

test('authenticated user can view POS terminal and submit order', function () {
    $user = User::factory()->create();

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
        'discount' => 0,
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
        'total' => 7.00,
        'status' => 'completed',
    ]);

    $this->assertDatabaseHas('order_items', [
        'product_id' => $product->id,
        'quantity' => 2,
        'line_total' => 7.00,
    ]);

    $this->assertDatabaseHas('payments', [
        'method' => 'cash',
        'amount' => 7.00,
        'status' => 'paid',
    ]);
});
