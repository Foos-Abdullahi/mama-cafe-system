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
                    ['name' => 'Espresso', 'price' => 0.75, 'description' => 'Rich single shot of espresso.'],
                    ['name' => 'Americano', 'price' => 0.75, 'description' => 'Espresso diluted with hot water.'],
                    ['name' => 'Cappuccino', 'price' => 1.00, 'description' => 'Espresso with steamed milk foam.'],
                    ['name' => 'Latte', 'price' => 0.75, 'description' => 'Espresso with creamy steamed milk.'],
                    ['name' => 'Macchiato', 'price' => 0.75, 'description' => 'Espresso topped with a dollop of foamed milk.'],
                    ['name' => 'Caramel latte', 'price' => 1.00, 'description' => 'Latte with sweet caramel syrup.'],
                    ['name' => 'Vanilla latte', 'price' => 1.00, 'description' => 'Latte flavored with smooth vanilla.'],
                    ['name' => 'Spanish latte', 'price' => 1.00, 'description' => 'Espresso with condensed milk and steamed milk.'],
                    ['name' => 'Matcha', 'price' => 1.25, 'description' => 'Warm Japanese green tea latte.'],
                ],
            ],
            [
                'name' => 'Hot Tea',
                'description' => 'Traditional hot teas, spiced Somali teas, and cozy warm drinks.',
                'products' => [
                    ['name' => 'Loos tea', 'price' => 0.75, 'description' => 'Fresh loose leaf brewed tea.'],
                    ['name' => 'Somali tea', 'price' => 0.50, 'description' => 'Traditional Somali spiced tea with milk and cardamom.'],
                    ['name' => 'Qaxwo somali', 'price' => 0.50, 'description' => 'Traditional Somali spiced coffee with ginger.'],
                    ['name' => 'Hot Chocolate', 'price' => 0.75, 'description' => 'Rich and velvety hot chocolate.'],
                    ['name' => 'Green tea', 'price' => 0.50, 'description' => 'Steamed antioxidant-rich green tea.'],
                    ['name' => 'Shaax daqar', 'price' => 0.75, 'description' => 'Specialty spiced traditional tea.'],
                ],
            ],
            [
                'name' => 'Boba Tea',
                'description' => 'Refreshing flavored milk teas served with chewy boba pearls.',
                'products' => [
                    ['name' => 'Blueberry With boba', 'price' => 1.75, 'description' => 'Blueberry milk tea with tapioca pearls.'],
                    ['name' => 'Mango with boba', 'price' => 1.75, 'description' => 'Sweet tropical mango milk tea with boba pearls.'],
                    ['name' => 'Vanilla Milk boba', 'price' => 1.75, 'description' => 'Creamy vanilla milk tea with chewy boba pearls.'],
                    ['name' => 'Strawberry Milk boba', 'price' => 1.75, 'description' => 'Fresh strawberry milk tea with boba.'],
                    ['name' => 'Lutos Milk boba', 'price' => 1.75, 'description' => 'Lotus Biscoff flavored milk tea with boba pearls.'],
                    ['name' => 'Biskut Milk boba', 'price' => 1.50, 'description' => 'Crunchy biscuit infused milk tea with boba.'],
                    ['name' => 'Chocolate Milk boba', 'price' => 1.75, 'description' => 'Decadent chocolate milk tea with tapioca pearls.'],
                ],
            ],
            [
                'name' => 'Cold Drinks',
                'description' => 'Refreshing iced coffees, iced lattes, and iced matcha beverages.',
                'products' => [
                    ['name' => 'Americano', 'price' => 1.00, 'description' => 'Chilled espresso poured over iced water.'],
                    ['name' => 'Latte Ice Coffee', 'price' => 1.00, 'description' => 'Iced espresso with cold fresh milk.'],
                    ['name' => 'Caramel latte', 'price' => 1.25, 'description' => 'Iced latte infused with golden caramel syrup.'],
                    ['name' => 'Vanilla latte', 'price' => 1.25, 'description' => 'Iced latte infused with fragrant vanilla syrup.'],
                    ['name' => 'Chocolate latte', 'price' => 1.25, 'description' => 'Iced mocha latte with rich chocolate.'],
                    ['name' => 'Matcha', 'price' => 1.50, 'description' => 'Iced Japanese matcha green tea latte.'],
                    ['name' => 'Strawberry Matcha', 'price' => 1.50, 'description' => 'Layered iced matcha with strawberry puree.'],
                    ['name' => 'Mango Matcha', 'price' => 1.50, 'description' => 'Layered iced matcha with sweet mango puree.'],
                    ['name' => 'Vanilla Matcha', 'price' => 1.50, 'description' => 'Iced matcha blended with smooth vanilla.'],
                ],
            ],
            [
                'name' => 'Shakes',
                'description' => 'Creamy thick milkshakes, fruit shakes, and blended specialty treats.',
                'products' => [
                    ['name' => 'Banana shake', 'price' => 1.00, 'description' => 'Freshly blended creamy banana shake.'],
                    ['name' => 'Mango shake', 'price' => 1.25, 'description' => 'Sweet ripe mango fruit shake.'],
                    ['name' => 'Timir Milk shake', 'price' => 1.00, 'description' => 'Traditional sweet date (timir) milkshake.'],
                    ['name' => 'loos Milk shake', 'price' => 1.25, 'description' => 'Nutty peanut/loos flavored creamy milkshake.'],
                    ['name' => 'Vanilla Milkshake', 'price' => 1.25, 'description' => 'Classic rich vanilla bean milkshake.'],
                    ['name' => 'Strawberry Milkshake', 'price' => 1.25, 'description' => 'Fresh strawberry creamy milkshake.'],
                    ['name' => 'Lutos Milkshake', 'price' => 1.25, 'description' => 'Lotus Biscoff cookie butter milkshake.'],
                    ['name' => 'Biskut Milkshake', 'price' => 1.25, 'description' => 'Crushed biscuit blended milkshake.'],
                    ['name' => 'Chocolate Milkshake', 'price' => 1.25, 'description' => 'Decadent chocolate fudge milkshake.'],
                    ['name' => 'Blueberry Milkshake', 'price' => 1.25, 'description' => 'Sweet and tangy blueberry milkshake.'],
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
                        'category_id' => $category->id,
                        'name' => $productData['name'],
                    ],
                    [
                        'price' => $productData['price'],
                        'description' => $productData['description'],
                        'status' => 'active',
                    ]
                );
            }
        }
    }
}
