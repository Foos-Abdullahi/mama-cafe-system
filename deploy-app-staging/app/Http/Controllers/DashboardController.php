<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Waitress;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = now()->format('Y-m-d');

        $todayOrders = Order::whereDate('created_at', $today)->get();
        $todayTotalSales = $todayOrders->where('status', 'completed')->sum('total');
        $todayCompletedCount = $todayOrders->where('status', 'completed')->count();

        $todayCash = Payment::whereHas('order', function ($q) use ($today) {
            $q->whereDate('created_at', $today);
        })->where('method', 'cash')->where('status', 'paid')->sum('amount');

        $todayDigital = Payment::whereHas('order', function ($q) use ($today) {
            $q->whereDate('created_at', $today);
        })->whereIn('method', ['mobile_money', 'card'])->where('status', 'paid')->sum('amount');

        $activeWaitresses = Waitress::where('status', 'active')->count();
        $activeProducts = Product::where('status', 'active')->count();

        $stats = [
            [
                'title' => 'Today\'s Total Sales',
                'value' => '$'.number_format($todayTotalSales, 2),
                'change' => $todayCompletedCount.' completed orders today',
                'trend' => 'up',
            ],
            [
                'title' => 'Cash Drawer Total',
                'value' => '$'.number_format($todayCash, 2),
                'change' => 'Cash sales today',
                'trend' => 'up',
            ],
            [
                'title' => 'Digital Payments',
                'value' => '$'.number_format($todayDigital, 2),
                'change' => 'Mobile money & card',
                'trend' => 'up',
            ],
            [
                'title' => 'Active Floor Waitresses',
                'value' => (string) $activeWaitresses,
                'change' => $activeProducts.' products on menu',
                'trend' => 'up',
            ],
        ];

        // Payment Method Breakdown (Pie/Donut chart data)
        $paymentBreakdown = [
            ['name' => 'Cash', 'value' => (float) Payment::where('method', 'cash')->sum('amount'), 'color' => '#10b981'],
            ['name' => 'Mobile Money', 'value' => (float) Payment::where('method', 'mobile_money')->sum('amount'), 'color' => '#3b82f6'],
            ['name' => 'Card', 'value' => (float) Payment::where('method', 'card')->sum('amount'), 'color' => '#a855f7'],
            ['name' => 'Credit', 'value' => (float) Payment::where('method', 'credit')->sum('amount'), 'color' => '#f59e0b'],
        ];

        // 7-Day Sales Trend (Line Chart data)
        $salesTrend = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dateStr = $date->format('Y-m-d');
            $dayLabel = $date->format('D'); // Mon, Tue, etc.

            $daySales = Order::whereDate('created_at', $dateStr)
                ->where('status', 'completed')
                ->sum('total');

            $dayOrderCount = Order::whereDate('created_at', $dateStr)
                ->where('status', 'completed')
                ->count();

            $salesTrend->push([
                'day' => $dayLabel,
                'date' => $dateStr,
                'sales' => (float) round($daySales, 2),
                'orders' => (int) $dayOrderCount,
            ]);
        }

        // Waitress Performance (Bar Chart data)
        $waitressPerformance = Waitress::where('status', 'active')
            ->with(['orders' => function ($q) {
                $q->where('status', 'completed');
            }])
            ->take(5)
            ->get()
            ->map(function ($w) {
                return [
                    'name' => explode(' ', $w->name)[0], // First name only for chart
                    'sales' => (float) round($w->orders->sum('total'), 2),
                    'orders' => $w->orders->count(),
                    'commission' => (float) round($w->orders->sum('total') * (float) $w->commission_rate, 2),
                ];
            })->values();

        // Recent Orders
        $recentOrders = Order::with(['waitress', 'payments'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($o) {
                return [
                    'id' => $o->id,
                    'order_number' => $o->order_number,
                    'waitress_name' => $o->waitress->name ?? 'Walk-in',
                    'order_type' => $o->order_type,
                    'total' => (float) $o->total,
                    'status' => $o->status,
                    'payment_method' => $o->payments->first()->method ?? 'cash',
                    'created_at' => $o->created_at->format('H:i'),
                ];
            });

        // Recent Activity Logs
        $recentActivities = ActivityLog::with('user')
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'user_name' => $a->user->name ?? 'System',
                    'action' => $a->action,
                    'description' => $a->description,
                    'created_at' => $a->created_at ? $a->created_at->diffForHumans() : 'Just now',
                ];
            });

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'paymentBreakdown' => $paymentBreakdown,
            'salesTrend' => $salesTrend,
            'waitressPerformance' => $waitressPerformance,
            'recentOrders' => $recentOrders,
            'recentActivities' => $recentActivities,
        ]);
    }
}
