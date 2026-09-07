<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Finance\DailyClosingController;
use App\Http\Controllers\Finance\PaymentController;
use App\Http\Controllers\Finance\PayrollController;
use App\Http\Controllers\Finance\ReportController;
use App\Http\Controllers\Management\CategoryController;
use App\Http\Controllers\Management\OrderController;
use App\Http\Controllers\Management\ProductController;
use App\Http\Controllers\Management\WaitressController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\System\ActivityLogController;
use App\Http\Controllers\System\RolePermissionController;
use App\Http\Controllers\System\SettingController;
use App\Http\Controllers\System\UserController;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $categories = Category::query()
        ->where('status', 'active')
        ->with(['products' => function ($query) {
            $query->where('status', 'active')->orderBy('name');
        }])
        ->orderBy('id')
        ->get()
        ->map(function (Category $category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                'products' => $category->products->map(function (Product $product) use ($category) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'description' => $product->description,
                        'price' => (float) $product->price,
                        'image_url' => $product->image_url,
                        'category_id' => $product->category_id,
                        'category_name' => $category->name,
                    ];
                })->values(),
            ];
        })
        ->values();

    $products = Product::query()
        ->where('status', 'active')
        ->with('category')
        ->orderBy('category_id')
        ->orderBy('name')
        ->get()
        ->map(function (Product $p) {
            return [
                'id' => $p->id,
                'category_id' => $p->category_id,
                'category_name' => $p->category->name ?? 'Specialty',
                'name' => $p->name,
                'description' => $p->description,
                'price' => (float) $p->price,
                'image_url' => $p->image_url,
            ];
        })
        ->values();

    return Inertia::render('welcome', [
        'categories' => $categories,
        'products' => $products,
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->middleware('role:admin,manager,operations')
        ->name('dashboard');

    // Operations POS routes
    Route::get('/pos', [PosController::class, 'index'])->name('pos.index');
    Route::get('/pos/orders', [PosController::class, 'orders'])->name('pos.orders');
    Route::post('/pos/orders', [PosController::class, 'store'])->name('pos.store');

    // Management routes
    Route::prefix('management')->name('management.')->group(function () {
        Route::resource('orders', OrderController::class)->only(['index', 'create', 'store', 'show']);

        Route::middleware('role:admin,manager')->group(function () {
            Route::resource('orders', OrderController::class)->only(['edit', 'update', 'destroy']);
            Route::resource('categories', CategoryController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);
            Route::resource('products', ProductController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);
            Route::resource('waitresses', WaitressController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);
        });
    });

    // Finance & Reports routes (Admin & Manager)
    Route::prefix('finance')->name('finance.')->middleware('role:admin,manager')->group(function () {
        Route::get('payments', [PaymentController::class, 'index'])->name('payments.index');

        Route::get('payroll', [PayrollController::class, 'index'])->name('payroll.index');
        Route::get('payroll/create', [PayrollController::class, 'create'])->name('payroll.create');
        Route::post('payroll', [PayrollController::class, 'store'])->name('payroll.store');
        Route::get('payroll/{payroll}', [PayrollController::class, 'show'])->name('payroll.show');

        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');

        Route::get('daily-closing', [DailyClosingController::class, 'index'])->name('daily-closing.index');
        Route::get('daily-closing/create', [DailyClosingController::class, 'create'])->name('daily-closing.create');
        Route::post('daily-closing', [DailyClosingController::class, 'store'])->name('daily-closing.store');
        Route::get('daily-closing/{dailyClosing}/edit', [DailyClosingController::class, 'edit'])->name('daily-closing.edit');
        Route::put('daily-closing/{dailyClosing}', [DailyClosingController::class, 'update'])->name('daily-closing.update');
    });

    // System routes (Admin only)
    Route::prefix('system')->name('system.')->middleware('role:admin')->group(function () {
        Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
        Route::put('settings', [SettingController::class, 'update'])->name('settings.update');

        Route::resource('roles', RolePermissionController::class)->names('roles');

        Route::resource('users', UserController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);

        Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
    });
});

require __DIR__.'/settings.php';
