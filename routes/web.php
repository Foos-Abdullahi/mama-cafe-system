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
use App\Http\Controllers\System\SettingController;
use App\Http\Controllers\System\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Operations POS routes
    Route::get('/pos', [PosController::class, 'index'])->name('pos.index');
    Route::post('/pos/orders', [PosController::class, 'store'])->name('pos.store');

    // Management routes
    Route::prefix('management')->name('management.')->group(function () {
        Route::resource('categories', CategoryController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);
        Route::resource('products', ProductController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);
        Route::resource('waitresses', WaitressController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);
        Route::resource('orders', OrderController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);
    });

    // Finance & Reports routes
    Route::prefix('finance')->name('finance.')->group(function () {
        Route::get('payments', [PaymentController::class, 'index'])->name('payments.index');

        Route::get('payroll', [PayrollController::class, 'index'])->name('payroll.index');
        Route::get('payroll/create', [PayrollController::class, 'create'])->name('payroll.create');
        Route::post('payroll', [PayrollController::class, 'store'])->name('payroll.store');
        Route::get('payroll/{payroll}', [PayrollController::class, 'show'])->name('payroll.show');

        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');

        Route::get('daily-closing', [DailyClosingController::class, 'index'])->name('daily-closing.index');
        Route::post('daily-closing', [DailyClosingController::class, 'store'])->name('daily-closing.store');
    });

    // System routes
    Route::prefix('system')->name('system.')->group(function () {
        Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
        Route::put('settings', [SettingController::class, 'update'])->name('settings.update');

        Route::resource('users', UserController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);

        Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
    });
});

require __DIR__.'/settings.php';
