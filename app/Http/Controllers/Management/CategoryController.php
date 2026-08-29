<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        Category::create($validated);

        return redirect()->back()->with('success', 'Category created successfully.');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $category->update($validated);

        return redirect()->back()->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->back()->with('success', 'Category deleted successfully.');
    }
}
