<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds for MaMa Café & Boba Tea menu.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Hot Coffee',
                'description' => 'Freshly brewed artisanal hot coffees and espresso beverages.',
                'products' => [
                    ['name' => 'Espresso', 'price' => 2.50, 'description' => 'Rich single shot of premium dark roast espresso.', 'image_url' => 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80'],
                    ['name' => 'Americano', 'price' => 3.00, 'description' => 'Espresso diluted with hot filtered water.', 'image_url' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'],
                    ['name' => 'Cappuccino', 'price' => 4.00, 'description' => 'Espresso with rich steamed milk foam.', 'image_url' => 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80'],
                    ['name' => 'Latte', 'price' => 4.25, 'description' => 'Espresso with silky smooth steamed milk.', 'image_url' => 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80'],
                    ['name' => 'Caramel Latte', 'price' => 4.75, 'description' => 'Latte infused with sweet caramel syrup.', 'image_url' => 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80'],
                    ['name' => 'Spanish Latte', 'price' => 4.50, 'description' => 'Espresso with condensed milk and steamed fresh milk.', 'image_url' => 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80'],
                ],
            ],
            [
                'name' => 'Hot Tea',
                'description' => 'Traditional hot teas, spiced Somali teas, and cozy warm drinks.',
                'products' => [
                    ['name' => 'Somali Tea (Shaax)', 'price' => 2.00, 'description' => 'Traditional Somali spiced tea with fresh milk and cardamom.', 'image_url' => 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'],
                    ['name' => 'Qaxwo Somali', 'price' => 2.00, 'description' => 'Traditional Somali spiced coffee infused with ginger.', 'image_url' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'],
                    ['name' => 'Hot Chocolate', 'price' => 3.50, 'description' => 'Rich and velvety Dutch chocolate drink.', 'image_url' => 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80'],
                    ['name' => 'Green Tea', 'price' => 2.50, 'description' => 'Steamed antioxidant-rich organic green tea.', 'image_url' => 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=600&q=80'],
                ],
            ],
            [
                'name' => 'Boba Tea',
                'description' => 'Refreshing flavored milk teas served with chewy tapioca pearls.',
                'products' => [
                    ['name' => 'Brown Sugar Boba Milk Tea', 'price' => 5.50, 'description' => 'Signature black tea with brown sugar boba pearls & fresh cream.', 'image_url' => 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=600&q=80'],
                    ['name' => 'Matcha Boba Latte', 'price' => 5.75, 'description' => 'Ceremonial grade Japanese matcha green tea with tapioca pearls.', 'image_url' => 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80'],
                    ['name' => 'Taro Bubble Tea', 'price' => 5.50, 'description' => 'Creamy purple taro tea with tapioca pearls.', 'image_url' => 'https://images.unsplash.com/photo-1527156231393-7023794f363c?auto=format&fit=crop&w=600&q=80'],
                    ['name' => 'Strawberry Milk Boba', 'price' => 5.50, 'description' => 'Fresh strawberry infused milk tea with boba.', 'image_url' => 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80'],
                    ['name' => 'Mango Milk Boba', 'price' => 5.50, 'description' => 'Sweet tropical mango milk tea with boba pearls.', 'image_url' => 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80'],
                ],
            ],
            [
                'name' => 'Cold Drinks',
                'description' => 'Refreshing iced coffees, iced lattes, and iced matcha beverages.',
                'products' => [
                    ['name' => 'Iced Spanish Latte', 'price' => 4.75, 'description' => 'Chilled espresso over ice with condensed milk.', 'image_url' => 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80'],
                    ['name' => 'Iced Vanilla Latte', 'price' => 4.50, 'description' => 'Iced espresso with cold fresh milk and vanilla.', 'image_url' => 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80'],
                    ['name' => 'Iced Strawberry Matcha', 'price' => 5.25, 'description' => 'Layered iced matcha with strawberry puree.', 'image_url' => 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80'],
                ],
            ],
            [
                'name' => 'Shakes',
                'description' => 'Creamy thick milkshakes, fruit shakes, and blended specialty treats.',
                'products' => [
                    ['name' => 'Banana Milkshake', 'price' => 4.25, 'description' => 'Freshly blended creamy banana shake.', 'image_url' => 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80'],
                    ['name' => 'Mango Smoothie Shake', 'price' => 4.50, 'description' => 'Sweet ripe mango blended fruit shake.', 'image_url' => 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80'],
                    ['name' => 'Chocolate Fudge Shake', 'price' => 4.75, 'description' => 'Decadent rich chocolate fudge milkshake.', 'image_url' => 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80'],
                ],
            ],
        ];

        foreach ($categories as $categoryData) {
            $category = Category::updateOrCreate(
                ['name' => $categoryData['name']],
                [
                    'description' => $categoryData['description'],
                    'status' => 'active',
                ]
            );

            foreach ($categoryData['products'] as $productData) {
                Product::updateOrCreate(
                    [
                        'name' => $productData['name'],
                    ],
                    [
                        'category_id' => $category->id,
                        'price' => $productData['price'],
                        'description' => $productData['description'],
                        'image_url' => $productData['image_url'],
                        'status' => 'active',
                    ]
                );
            }
        }
    }
}
