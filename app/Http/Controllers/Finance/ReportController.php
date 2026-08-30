<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Waitress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $completedOrders = Order::where('status', 'completed')->get();

        $totalRevenue = $completedOrders->sum('total');
        $totalOrdersCount = $completedOrders->count();
        $averageOrderValue = $totalOrdersCount > 0 ? $totalRevenue / $totalOrdersCount : 0;

        // Payment method breakdown
        $cashSales = Payment::where('status', 'paid')->where('method', 'cash')->sum('amount');
        $mobileMoneySales = Payment::where('status', 'paid')->where('method', 'mobile_money')->sum('amount');
        $cardSales = Payment::where('status', 'paid')->where('method', 'card')->sum('amount');
        $creditSales = Payment::where('method', 'credit')->sum('amount');

        // Top selling products
        $topProducts = OrderItem::with('product')
            ->selectRaw('product_id, SUM(quantity) as total_qty, SUM(line_total) as total_amount')
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->product_id,
                    'name' => $item->product->name ?? 'Unknown Product',
                    'total_qty' => (int) $item->total_qty,
                    'total_amount' => (float) $item->total_amount,
                ];
            });

        // Waitress sales leaderboard
        $waitressLeaderboard = Waitress::with(['orders' => function ($q) {
            $q->where('status', 'completed');
        }])->get()->map(function ($w) {
            $sales = $w->orders->sum('total');

            return [
                'id' => $w->id,
                'name' => $w->name,
                'orders_count' => $w->orders->count(),
                'total_sales' => (float) $sales,
                'commission' => (float) ($sales * (float) $w->commission_rate),
            ];
        })->sortByDesc('total_sales')->values();

        $stats = [
            [
                'title' => 'Gross Revenue',
                'value' => '$'.number_format($totalRevenue, 2),
                'change' => 'Total completed order income',
                'trend' => 'up',
            ],
            [
                'title' => 'Total Orders Served',
                'value' => (string) $totalOrdersCount,
                'change' => 'Completed transactions',
                'trend' => 'up',
            ],
            [
                'title' => 'Average Order Value',
                'value' => '$'.number_format($averageOrderValue, 2),
                'change' => 'Per ticket average',
                'trend' => 'up',
            ],
            [
                'title' => 'Dine In vs Takeaway',
                'value' => Order::where('order_type', 'dine_in')->count().' / '.Order::where('order_type', 'takeaway')->count(),
                'change' => 'Dine in vs Takeaway ratio',
                'trend' => 'up',
            ],
        ];

        return Inertia::render('admin/finance/reports/index', [
            'stats' => $stats,
            'paymentBreakdown' => [
                'cash' => (float) $cashSales,
                'mobile_money' => (float) $mobileMoneySales,
                'card' => (float) $cardSales,
                'credit' => (float) $creditSales,
            ],
            'topProducts' => $topProducts,
            'waitressLeaderboard' => $waitressLeaderboard,
        ]);
    }
}
