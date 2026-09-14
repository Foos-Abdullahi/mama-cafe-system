<?php

use App\Models\Category;
use App\Models\Product;
use Database\Seeders\ImageMenuSeeder;

test('it seeds the categories and products from the supplied menu image', function () {
    $shakes = Category::create([
        'name' => 'Shakes',
        'status' => 'active',
    ]);

    Product::create([
        'category_id' => $shakes->id,
        'name' => 'Banana Shake',
        'price' => 1.00,
        'status' => 'active',
    ]);

    $this->seed(ImageMenuSeeder::class);

    expect(Category::query()->whereIn('name', ['Coffee', 'Boba', 'Ice Chocolate', 'Hot Tea'])->count())
        ->toBe(4)
        ->and(Category::query()->where('name', 'Shakes')->exists())
        ->toBeFalse();

    expect(Product::query()->count())->toBe(17)
        ->and(Product::query()->whereNull('image_url')->exists())
        ->toBeFalse();

    $coffee = Category::query()->where('name', 'Coffee')->firstOrFail();
    $boba = Category::query()->where('name', 'Boba')->firstOrFail();

    expect(Product::query()->whereBelongsTo($coffee)->where('name', 'Cappuccino')->value('price'))
        ->toBe('1.00')
        ->and(Product::query()->whereBelongsTo($boba)->where('name', 'Strawberry Milk Boba')->value('price'))
        ->toBe('1.75');
});
