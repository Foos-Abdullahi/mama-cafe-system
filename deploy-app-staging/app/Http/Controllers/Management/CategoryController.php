<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::withCount('products')
            ->orderBy('id', 'desc')
            ->get();

        $totalCategories = Category::count();
        $activeCategories = Category::where('status', 'active')->count();
        $totalProducts = Product::count();
        $topCategory = Category::withCount('products')
            ->orderBy('products_count', 'desc')
            ->first();

        $stats = [
            [
                'title' => 'Total Categories',
                'value' => (string) $totalCategories,
                'badge' => ['text' => 'All Categories', 'variant' => 'blue'],
                'description' => 'System wide menu groupings',
            ],
            [
                'title' => 'Active Categories',
                'value' => (string) $activeCategories,
                'badge' => ['text' => 'Live on POS', 'variant' => 'emerald'],
                'description' => 'Available for ordering',
            ],
            [
                'title' => 'Total Products',
                'value' => (string) $totalProducts,
                'badge' => ['text' => 'Items', 'variant' => 'purple'],
                'description' => 'Menu items registered',
            ],
            [
                'title' => 'Top Category',
                'value' => $topCategory ? $topCategory->name : 'N/A',
                'badge' => ['text' => $topCategory ? $topCategory->products_count.' items' : '0 items', 'variant' => 'amber'],
                'description' => 'Largest menu section',
            ],
        ];

        return Inertia::render('admin/management/categories/index', [
            'categories' => $categories,
            'stats' => $stats,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/management/categories/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
        ]);

        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'description' => 'required|string|min:3|max:1000',
            'image_url' => 'nullable|url|max:2048',
            'status' => 'required|in:active,inactive',
        ]);

        $validated['image_url'] = $this->storeImage($request->file('image')) ?? ($validated['image_url'] ?? null);

        Category::create($validated);

        ActivityLog::log('category_create', "Category '{$validated['name']}' was created.");

        return redirect()->route('management.categories.index')->with('success', 'Category created successfully.');
    }

    public function show(Category $category): Response
    {
        $category->loadCount('products');
        $category->load('products');

        return Inertia::render('admin/management/categories/show', [
            'category' => $category,
        ]);
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('admin/management/categories/edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
        ]);

        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'description' => 'required|string|min:3|max:1000',
            'image_url' => 'nullable|url|max:2048',
            'status' => 'required|in:active,inactive',
        ]);

        if ($request->hasFile('image')) {
            $this->deleteStoredImage($category->image_url);
            $validated['image_url'] = $this->storeImage($request->file('image'));
        } elseif (blank($validated['image_url'] ?? null) && str_starts_with((string) $category->image_url, '/uploads/categories/')) {
            $validated['image_url'] = $category->image_url;
        } else {
            $validated['image_url'] = $validated['image_url'] ?? $category->image_url;
        }

        $category->update($validated);

        ActivityLog::log('category_update', "Category '{$validated['name']}' was updated.");

        return redirect()->route('management.categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        $name = $category->name;
        $this->deleteStoredImage($category->image_url);
        $category->delete();

        ActivityLog::log('category_delete', "Category '{$name}' was deleted.");

        return redirect()->route('management.categories.index')->with('success', 'Category deleted successfully.');
    }

    private function storeImage(?UploadedFile $image): ?string
    {
        if (! $image) {
            return null;
        }

        $uploadDir = public_path('uploads/categories');

        if (! is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filename = time().'_'.uniqid().'.'.$image->getClientOriginalExtension();
        $image->move($uploadDir, $filename);

        return '/uploads/categories/'.$filename;
    }

    private function deleteStoredImage(?string $imageUrl): void
    {
        if ($imageUrl && str_starts_with($imageUrl, '/uploads/categories/')) {
            $path = public_path(ltrim($imageUrl, '/'));

            if (is_file($path)) {
                unlink($path);
            }
        }
    }
}
