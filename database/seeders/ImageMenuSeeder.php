<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ImageMenuSeeder extends Seeder
{
    /**
     * Seed the menu categories and prices captured from the provided menu image.
     */
    public function run(): void
    {
        Category::query()->where('name', 'Shakes')->delete();

        $categories = [
            [
                'name' => 'Coffee',
                'description' => 'Espresso-based coffee drinks and flavoured lattes.',
                'products' => [
                    ['name' => 'Espresso', 'price' => 0.75, 'image_url' => '/images/drink-item-0.jpg'],
                    ['name' => 'Americano', 'price' => 0.75, 'image_url' => '/images/iced_coffee.jpg'],
                    ['name' => 'Cappuccino', 'price' => 1.00, 'image_url' => '/images/drink-item-1.jpg'],
                    ['name' => 'Latte', 'price' => 0.75, 'image_url' => '/images/coffee-bg.jpg'],
                    ['name' => 'Macchiato', 'price' => 0.75, 'image_url' => '/images/cup.png'],
                    ['name' => 'Caramel Latte', 'price' => 1.00, 'image_url' => '/images/drink-item-1.jpg'],
                    ['name' => 'Vanilla Latte', 'price' => 1.00, 'image_url' => '/images/drink-item-0.jpg'],
                    ['name' => 'Spanish Latte', 'price' => 1.00, 'image_url' => '/images/iced_coffee.jpg'],
                ],
            ],
            [
                'name' => 'Boba',
                'description' => 'Milk drinks served with boba pearls.',
                'products' => [
                    ['name' => 'Blueberry Boba', 'price' => 1.25, 'image_url' => '/images/boba_drink.jpg'],
                    ['name' => 'Mango Boba', 'price' => 1.25, 'image_url' => '/images/boba-drink.jpg'],
                    ['name' => 'Vanilla Milk Boba', 'price' => 1.75, 'image_url' => '/images/hero-drinks.png'],
                    ['name' => 'Strawberry Milk Boba', 'price' => 1.75, 'image_url' => '/images/hero-drinks-clean.png'],
                    ['name' => 'Chocolaty Milk Boba', 'price' => 1.75, 'image_url' => '/images/menu-drinks-strip.jpg'],
                ],
            ],
            [
                'name' => 'Ice Chocolate',
                'description' => 'Iced chocolate and specialty latte drinks.',
                'products' => [
                    ['name' => 'Chocolate Latte', 'price' => 1.00, 'image_url' => '/images/ice_chocolate.jpg'],
                    ['name' => 'Caramel Latte', 'price' => 1.25, 'image_url' => '/images/iced-chocolate.jpg'],
                ],
            ],
            [
                'name' => 'Hot Tea',
                'description' => 'Matcha tea drinks.',
                'products' => [
                    ['name' => 'Matcha', 'price' => 1.25, 'image_url' => '/images/hero-drinks-banner.jpg'],
                    ['name' => 'Strawberry Matcha', 'price' => 1.50, 'image_url' => '/images/hero-drinks-transparent.png'],
                ],
            ],
        ];

        foreach ($categories as $categoryData) {
            $category = Category::updateOrCreate(
                ['name' => $categoryData['name']],
                [
                    'description' => $categoryData['description'],
                    'status' => 'active',
                ],
            );

            foreach ($categoryData['products'] as $productData) {
                Product::updateOrCreate(
                    [
                        'category_id' => $category->id,
                        'name' => $productData['name'],
                    ],
                    [
                        'price' => $productData['price'],
                        'image_url' => $productData['image_url'],
                        'status' => 'active',
                    ],
                );
            }
        }
    }
}
