<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\FixedNumber;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Waitress;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ManagementSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Categories
        $espresso = Category::create([
            'name' => 'Espresso & Coffee',
            'description' => 'Artisanal hot and cold brewed coffee beverages.',
            'status' => 'active',
        ]);

        $boba = Category::create([
            'name' => 'Boba & Bubble Tea',
            'description' => 'Refreshing flavored teas with chewy tapioca pearls.',
            'status' => 'active',
        ]);

        $pastries = Category::create([
            'name' => 'Pastries & Bakery',
            'description' => 'Freshly baked croissants, cakes, and sweet treats.',
            'status' => 'active',
        ]);

        $sandwiches = Category::create([
            'name' => 'Snacks & Sandwiches',
            'description' => 'Savory gourmet bites, wraps, and toasted sandwiches.',
            'status' => 'active',
        ]);

        // 2. Products
        $p1 = Product::create([
            'category_id' => $espresso->id,
            'name' => 'Spanish Latte',
            'description' => 'Rich espresso with condensed milk and steamed fresh milk.',
            'price' => 4.50,
            'image_url' => '/images/spanish_latte.jpg',
            'status' => 'active',
        ]);

        $p2 = Product::create([
            'category_id' => $espresso->id,
            'name' => 'Double Espresso',
            'description' => 'Bold, intense double shot of premium dark roast beans.',
            'price' => 3.00,
            'image_url' => '/images/espresso.jpg',
            'status' => 'active',
        ]);

        $p3 = Product::create([
            'category_id' => $boba->id,
            'name' => 'Brown Sugar Boba Milk Tea',
            'description' => 'Signature black tea with brown sugar boba pearls & fresh cream.',
            'price' => 5.50,
            'image_url' => '/images/brown_sugar_boba.jpg',
            'status' => 'active',
        ]);

        $p4 = Product::create([
            'category_id' => $boba->id,
            'name' => 'Matcha Boba Latte',
            'description' => 'Ceremonial grade Japanese matcha green tea with tapioca pearls.',
            'price' => 5.75,
            'image_url' => '/images/matcha_boba.jpg',
            'status' => 'active',
        ]);

        $p5 = Product::create([
            'category_id' => $pastries->id,
            'name' => 'Butter Croissant',
            'description' => 'Flaky, buttery golden layer croissant baked daily.',
            'price' => 3.25,
            'image_url' => '/images/croissant.jpg',
            'status' => 'active',
        ]);

        $p6 = Product::create([
            'category_id' => $pastries->id,
            'name' => 'Blueberry Cheesecake',
            'description' => 'Creamy classic cheesecake topped with blueberry compote.',
            'price' => 4.75,
            'image_url' => '/images/cheesecake.jpg',
            'status' => 'active',
        ]);

        $p7 = Product::create([
            'category_id' => $sandwiches->id,
            'name' => 'Club Sandwich',
            'description' => 'Triple-decker smoked turkey, cheese, lettuce, and mayo.',
            'price' => 6.50,
            'image_url' => '/images/club_sandwich.jpg',
            'status' => 'active',
        ]);

        // 3. Waitresses & Fixed Numbers
        $w1 = Waitress::create([
            'name' => 'Sarah Ahmed',
            'phone' => '+252 61 555 0101',
            'commission_rate' => 0.15,
            'status' => 'active',
        ]);
        FixedNumber::create([
            'waitress_id' => $w1->id,
            'range_start' => 101,
            'range_end' => 150,
            'current_number' => 105,
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        $w2 = Waitress::create([
            'name' => 'Amina Hassan',
            'phone' => '+252 61 555 0202',
            'commission_rate' => 0.15,
            'status' => 'active',
        ]);
        FixedNumber::create([
            'waitress_id' => $w2->id,
            'range_start' => 151,
            'range_end' => 200,
            'current_number' => 158,
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        $w3 = Waitress::create([
            'name' => 'Halima Jama',
            'phone' => '+252 61 555 0303',
            'commission_rate' => 0.15,
            'status' => 'active',
        ]);
        FixedNumber::create([
            'waitress_id' => $w3->id,
            'range_start' => 201,
            'range_end' => 250,
            'current_number' => 202,
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        // 4. Sample Orders
        $orderData = [
            [
                'order_number' => 'ORD-'.strtoupper(Str::random(6)),
                'fixed_number' => 101,
                'waitress_id' => $w1->id,
                'order_type' => 'dine_in',
                'status' => 'completed',
                'payment_status' => 'paid',
                'items' => [
                    ['product' => $p1, 'quantity' => 2],
                    ['product' => $p5, 'quantity' => 1],
                ],
                'payment_method' => 'cash',
            ],
            [
                'order_number' => 'ORD-'.strtoupper(Str::random(6)),
                'fixed_number' => 152,
                'waitress_id' => $w2->id,
                'order_type' => 'takeaway',
                'status' => 'completed',
                'payment_status' => 'paid',
                'items' => [
                    ['product' => $p3, 'quantity' => 2],
                    ['product' => $p6, 'quantity' => 1],
                ],
                'payment_method' => 'mobile_money',
            ],
            [
                'order_number' => 'ORD-'.strtoupper(Str::random(6)),
                'fixed_number' => 201,
                'waitress_id' => $w3->id,
                'order_type' => 'dine_in',
                'status' => 'completed',
                'payment_status' => 'paid',
                'items' => [
                    ['product' => $p7, 'quantity' => 1],
                    ['product' => $p2, 'quantity' => 1],
                ],
                'payment_method' => 'card',
            ],
            [
                'order_number' => 'ORD-'.strtoupper(Str::random(6)),
                'fixed_number' => 102,
                'waitress_id' => $w1->id,
                'order_type' => 'dine_in',
                'status' => 'cancelled',
                'payment_status' => 'unpaid',
                'items' => [
                    ['product' => $p4, 'quantity' => 1],
                ],
                'payment_method' => 'cash',
            ],
        ];

        foreach ($orderData as $data) {
            $subtotal = 0;
            foreach ($data['items'] as $item) {
                $subtotal += $item['product']->price * $item['quantity'];
            }

            $order = Order::create([
                'order_number' => $data['order_number'],
                'fixed_number' => $data['fixed_number'],
                'waitress_id' => $data['waitress_id'],
                'order_type' => $data['order_type'],
                'subtotal' => $subtotal,
                'discount' => 0.00,
                'tax' => 0.00,
                'total' => $subtotal,
                'status' => $data['status'],
                'payment_status' => $data['payment_status'],
                'completed_at' => $data['status'] === 'completed' ? now() : null,
            ]);

            foreach ($data['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product']->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['product']->price,
                    'line_total' => $item['product']->price * $item['quantity'],
                ]);
            }

            if ($data['payment_status'] === 'paid') {
                Payment::create([
                    'order_id' => $order->id,
                    'method' => $data['payment_method'],
                    'amount' => $subtotal,
                    'status' => 'paid',
                    'reference' => 'TXN-'.strtoupper(Str::random(8)),
                    'paid_at' => now(),
                ]);
            }
        }
    }
}
