<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Order;
use App\Models\Product;
use App\Models\Waitress;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::with(['waitress', 'items.product', 'payments', 'refund', 'cancellation'])
            ->orderBy('id', 'desc')
            ->get();

        $products = Product::where('status', 'active')->get();
        $waitresses = Waitress::where('status', 'active')->get();

        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', 'completed')->sum('total');
        $completedOrders = Order::where('status', 'completed')->count();
        $cancelledRefunded = Order::whereIn('status', ['cancelled', 'refunded'])->count();

        $stats = [
            [
                'title' => 'Total Orders',
                'value' => (string) $totalOrders,
                'badge' => ['text' => 'All Time', 'variant' => 'blue'],
                'description' => 'Cumulative customer orders',
            ],
            [
                'title' => 'Total Sales Revenue',
                'value' => '$'.number_format($totalRevenue, 2),
                'badge' => ['text' => 'Completed Sales', 'variant' => 'emerald'],
                'description' => 'Gross cafe income',
            ],
            [
                'title' => 'Completed Orders',
                'value' => (string) $completedOrders,
                'badge' => ['text' => 'Paid & Closed', 'variant' => 'purple'],
                'description' => 'Successfully served',
            ],
            [
                'title' => 'Cancelled / Refunded',
                'value' => (string) $cancelledRefunded,
                'badge' => ['text' => 'Adjusted', 'variant' => 'red'],
                'description' => 'Voided transactions',
            ],
        ];

        return Inertia::render('admin/management/orders/index', [
            'orders' => $orders,
            'products' => $products,
            'waitresses' => $waitresses,
            'stats' => $stats,
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['waitress', 'items.product', 'payments', 'refund', 'cancellation']);

        return Inertia::render('admin/management/orders/show', [
            'order' => $order,
        ]);
    }

    public function destroy(Order $order)
    {
        $orderNumber = $order->order_number;
        $order->delete();

        ActivityLog::log('order_delete', "Order #{$orderNumber} was deleted.");

        return redirect()->route('management.orders.index')->with('success', 'Order deleted successfully.');
    }
}
