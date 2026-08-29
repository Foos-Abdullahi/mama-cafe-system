<?php

use App\Http\Controllers\Management\CategoryController;
use App\Http\Controllers\Management\OrderController;
use App\Http\Controllers\Management\ProductController;
use App\Http\Controllers\Management\WaitressController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Management routes
    Route::prefix('management')->name('management.')->group(function () {
        Route::resource('categories', CategoryController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('products', ProductController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('waitresses', WaitressController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('orders', OrderController::class)->only(['index', 'store', 'update', 'destroy']);
    });
});

require __DIR__.'/settings.php';
