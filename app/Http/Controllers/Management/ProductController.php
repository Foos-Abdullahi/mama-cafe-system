<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::with('category')
            ->orderBy('id', 'desc')
            ->get();

        $categories = Category::where('status', 'active')->get();

        $totalProducts = Product::count();
        $activeProducts = Product::where('status', 'active')->count();
        $avgPrice = Product::avg('price') ?: 0;
        $totalCategories = Category::count();

        $stats = [
            [
                'title' => 'Total Products',
                'value' => (string) $totalProducts,
                'badge' => ['text' => 'Menu Catalog', 'variant' => 'blue'],
                'description' => 'All menu items',
            ],
            [
                'title' => 'Active Products',
                'value' => (string) $activeProducts,
                'badge' => ['text' => 'On POS', 'variant' => 'emerald'],
                'description' => 'Ready for customer order',
            ],
            [
                'title' => 'Average Price',
                'value' => '$'.number_format($avgPrice, 2),
                'badge' => ['text' => 'Avg Pricing', 'variant' => 'amber'],
                'description' => 'Across active menu items',
            ],
            [
                'title' => 'Categories',
                'value' => (string) $totalCategories,
                'badge' => ['text' => 'Groupings', 'variant' => 'purple'],
                'description' => 'Active product sections',
            ],
        ];

        return Inertia::render('admin/management/products/index', [
            'products' => $products,
            'categories' => $categories,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        Product::create($validated);

        return redirect()->back()->with('success', 'Product created successfully.');
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $product->update($validated);

        return redirect()->back()->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->back()->with('success', 'Product deleted successfully.');
    }
}
