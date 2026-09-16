<?php

use App\Models\Category;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

test('category can be created with an uploaded image', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $image = UploadedFile::fake()->image('coffee.jpg');

    $response = $this->actingAs($user)->post(route('management.categories.store'), [
        'name' => 'Coffee Drinks',
        'description' => 'Coffee menu items.',
        'image_url' => '',
        'image' => $image,
        'status' => 'active',
    ]);

    $response->assertRedirect(route('management.categories.index'));

    $category = Category::where('name', 'Coffee Drinks')->firstOrFail();

    expect($category->image_url)->toStartWith('/uploads/categories/');
    expect(File::exists(public_path($category->image_url)))->toBeTrue();

    File::delete(public_path($category->image_url));
});
