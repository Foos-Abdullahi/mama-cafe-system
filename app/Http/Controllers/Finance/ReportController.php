<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Waitress;
use Carbon\CarbonInterface;
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

        $orderReportChart = $this->orderReportChart($request);

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
            'orderReportChart' => $orderReportChart,
            'topProducts' => $topProducts,
            'waitressLeaderboard' => $waitressLeaderboard,
        ]);
    }

    private function orderReportChart(Request $request): array
    {
        $period = $request->input('period', 'weekly');

        if (! in_array($period, ['weekly', 'monthly', 'yearly'], true)) {
            $period = 'weekly';
        }

        $config = $this->periodConfig($period);

        $series = [];
        for ($i = $config['count'] - 1; $i >= 0; $i--) {
            $date = $config['interval'] === 'month'
                ? now()->startOfMonth()->subMonths($i)
                : now()->startOfDay()->subDays($i);

            $series[$config['key']($date)] = [
                'label' => $config['label']($date),
                'orders' => 0,
            ];
        }

        $orders = Order::where('status', 'completed')
            ->where('completed_at', '>=', $config['start'])
            ->get(['completed_at']);

        foreach ($orders as $order) {
            $key = $config['key']($order->completed_at);

            if (isset($series[$key])) {
                $series[$key]['orders'] += 1;
            }
        }

        return [
            'period' => $period,
            'series' => array_values($series),
        ];
    }

    private function periodConfig(string $period): array
    {
        return [
            'weekly' => [
                'interval' => 'day',
                'count' => 7,
                'start' => now()->subDays(6)->startOfDay(),
                'label' => fn (CarbonInterface $date): string => $date->format('D'),
                'key' => fn (CarbonInterface $date): string => $date->format('Y-m-d'),
            ],
            'monthly' => [
                'interval' => 'day',
                'count' => 30,
                'start' => now()->subDays(29)->startOfDay(),
                'label' => fn (CarbonInterface $date): string => $date->format('d/m'),
                'key' => fn (CarbonInterface $date): string => $date->format('Y-m-d'),
            ],
            'yearly' => [
                'interval' => 'month',
                'count' => 12,
                'start' => now()->startOfMonth()->subMonths(11),
                'label' => fn (CarbonInterface $date): string => $date->format('M Y'),
                'key' => fn (CarbonInterface $date): string => $date->format('Y-m'),
            ],
        ][$period];
    }
}
