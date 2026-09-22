<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
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

    public function create(): Response
    {
        $categories = Category::where('status', 'active')->get();

        return Inertia::render('admin/management/products/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $imageUrl = $request->input('image_url');

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'file|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            ]);

            $uploadDir = public_path('uploads/products');
            if (! file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            $file = $request->file('image');
            $filename = time().'_'.uniqid().'.'.$file->getClientOriginalExtension();
            $file->move($uploadDir, $filename);
            $imageUrl = '/uploads/products/'.$filename;
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|min:2|max:255',
            'description' => 'required|string|min:3|max:1000',
            'price' => 'required|numeric|min:0.01',
            'status' => 'required|in:active,inactive',
        ]);

        $validated['image_url'] = $imageUrl;

        Product::create($validated);

        ActivityLog::log('product_create', "Product '{$validated['name']}' was created.");

        return redirect()->route('management.products.index')->with('success', 'Product created successfully.');
    }

    public function show(Product $product): Response
    {
        $product->load('category');

        return Inertia::render('admin/management/products/show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product): Response
    {
        $product->load('category');
        $categories = Category::where('status', 'active')->get();

        return Inertia::render('admin/management/products/edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $imageUrl = $request->input('image_url', $product->image_url);

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'file|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            ]);

            $uploadDir = public_path('uploads/products');
            if (! file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            $file = $request->file('image');
            $filename = time().'_'.uniqid().'.'.$file->getClientOriginalExtension();
            $file->move($uploadDir, $filename);
            $imageUrl = '/uploads/products/'.$filename;
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|min:2|max:255',
            'description' => 'required|string|min:3|max:1000',
            'price' => 'required|numeric|min:0.01',
            'status' => 'required|in:active,inactive',
        ]);

        $validated['image_url'] = $imageUrl;

        $product->update($validated);

        ActivityLog::log('product_update', "Product '{$validated['name']}' was updated.");

        return redirect()->route('management.products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $name = $product->name;
        $product->delete();

        ActivityLog::log('product_delete', "Product '{$name}' was deleted.");

        return redirect()->route('management.products.index')->with('success', 'Product deleted successfully.');
    }
}
