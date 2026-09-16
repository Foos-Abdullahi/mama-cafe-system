<?php

namespace Database\Seeders;

use App\Models\Category;
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
        $espresso = Category::updateOrCreate(
            ['name' => 'Espresso & Coffee'],
            [
                'description' => 'Artisanal hot and cold brewed coffee beverages.',
                'image_url' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=160&q=80',
                'status' => 'active',
            ]
        );

        $boba = Category::updateOrCreate(
            ['name' => 'Boba & Bubble Tea'],
            [
                'description' => 'Refreshing flavored teas with chewy tapioca pearls.',
                'image_url' => 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=160&q=80',
                'status' => 'active',
            ]
        );

        $pastries = Category::updateOrCreate(
            ['name' => 'Pastries & Bakery'],
            [
                'description' => 'Freshly baked croissants, cakes, and sweet treats.',
                'image_url' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=160&q=80',
                'status' => 'active',
            ]
        );

        $sandwiches = Category::updateOrCreate(
            ['name' => 'Snacks & Sandwiches'],
            [
                'description' => 'Savory gourmet bites, wraps, and toasted sandwiches.',
                'image_url' => 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=160&q=80',
                'status' => 'active',
            ]
        );

        // 2. Products with Real High Quality Image URLs
        $p1 = Product::updateOrCreate(
            ['name' => 'Spanish Latte'],
            [
                'category_id' => $espresso->id,
                'description' => 'Rich espresso with condensed milk and steamed fresh milk.',
                'price' => 4.50,
                'image_url' => 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ]
        );

        $p2 = Product::updateOrCreate(
            ['name' => 'Double Espresso'],
            [
                'category_id' => $espresso->id,
                'description' => 'Bold, intense double shot of premium dark roast beans.',
                'price' => 3.00,
                'image_url' => 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ]
        );

        $p3 = Product::updateOrCreate(
            ['name' => 'Brown Sugar Boba Milk Tea'],
            [
                'category_id' => $boba->id,
                'description' => 'Signature black tea with brown sugar boba pearls & fresh cream.',
                'price' => 5.50,
                'image_url' => 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ]
        );

        $p4 = Product::updateOrCreate(
            ['name' => 'Matcha Boba Latte'],
            [
                'category_id' => $boba->id,
                'description' => 'Ceremonial grade Japanese matcha green tea with tapioca pearls.',
                'price' => 5.75,
                'image_url' => 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ]
        );

        $p5 = Product::updateOrCreate(
            ['name' => 'Butter Croissant'],
            [
                'category_id' => $pastries->id,
                'description' => 'Flaky, buttery golden layer croissant baked daily.',
                'price' => 3.25,
                'image_url' => 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ]
        );

        $p6 = Product::updateOrCreate(
            ['name' => 'Blueberry Cheesecake'],
            [
                'category_id' => $pastries->id,
                'description' => 'Creamy classic cheesecake topped with blueberry compote.',
                'price' => 4.75,
                'image_url' => 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ]
        );

        $p7 = Product::updateOrCreate(
            ['name' => 'Club Sandwich'],
            [
                'category_id' => $sandwiches->id,
                'description' => 'Triple-decker smoked turkey, cheese, lettuce, and mayo.',
                'price' => 6.50,
                'image_url' => 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
                'status' => 'active',
            ]
        );

        // Remove test products like 'qq' if existing
        Product::where('name', 'qq')->delete();

        // 3. Waitresses
        $w1 = Waitress::firstOrCreate(
            ['phone' => '+252 61 555 0101'],
            [
                'name' => 'Sarah Ahmed',
                'commission_rate' => 0.15,
                'status' => 'active',
            ]
        );

        $w2 = Waitress::firstOrCreate(
            ['phone' => '+252 61 555 0202'],
            [
                'name' => 'Amina Hassan',
                'commission_rate' => 0.15,
                'status' => 'active',
            ]
        );

        $w3 = Waitress::firstOrCreate(
            ['phone' => '+252 61 555 0303'],
            [
                'name' => 'Halima Jama',
                'commission_rate' => 0.15,
                'status' => 'active',
            ]
        );

        // 4. Sample Orders
        if (Order::count() === 0) {
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
                    'completed_at' => now(),
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
