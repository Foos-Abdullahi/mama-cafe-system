<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Waitress;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        // Global date range (applies to all sections when set)
        $globalFrom = $request->query('from');
        $globalTo = $request->query('to');

        // Per-section date ranges (fall back to global if not set)
        $revenueFrom = $request->query('revenue_from', $globalFrom);
        $revenueTo = $request->query('revenue_to', $globalTo);

        $productsFrom = $request->query('products_from', $globalFrom);
        $productsTo = $request->query('products_to', $globalTo);

        $leaderboardFrom = $request->query('leaderboard_from', $globalFrom);
        $leaderboardTo = $request->query('leaderboard_to', $globalTo);

        $paymentsFrom = $request->query('payments_from', $globalFrom);
        $paymentsTo = $request->query('payments_to', $globalTo);

        // --- Revenue / Orders stats ---
        $revenueQuery = Order::where('status', 'completed');
        if ($revenueFrom) {
            $revenueQuery->where(function ($q) use ($revenueFrom) {
                $q->whereDate('completed_at', '>=', $revenueFrom)
                    ->orWhere(function ($q2) use ($revenueFrom) {
                        $q2->whereNull('completed_at')->whereDate('created_at', '>=', $revenueFrom);
                    });
            });
        }
        if ($revenueTo) {
            $revenueQuery->where(function ($q) use ($revenueTo) {
                $q->whereDate('completed_at', '<=', $revenueTo)
                    ->orWhere(function ($q2) use ($revenueTo) {
                        $q2->whereNull('completed_at')->whereDate('created_at', '<=', $revenueTo);
                    });
            });
        }
        $completedOrders = $revenueQuery->get();

        $totalRevenue = $completedOrders->sum('total');
        $totalOrdersCount = $completedOrders->count();
        $averageOrderValue = $totalOrdersCount > 0 ? $totalRevenue / $totalOrdersCount : 0;

        // --- Order Chart (Weekly/Monthly/Yearly) ---
        $orderReportChart = $this->orderReportChart($request);

        // --- Payment method breakdown ---
        $cashSales = $this->paymentQuery('cash', $paymentsFrom, $paymentsTo)->sum('amount');
        $mobileMoneySales = $this->paymentQuery('mobile_money', $paymentsFrom, $paymentsTo)->sum('amount');
        $cardSales = $this->paymentQuery('card', $paymentsFrom, $paymentsTo)->sum('amount');
        $creditSales = Payment::where('method', 'credit')
            ->when($paymentsFrom, fn ($q) => $q->whereDate('paid_at', '>=', $paymentsFrom))
            ->when($paymentsTo, fn ($q) => $q->whereDate('paid_at', '<=', $paymentsTo))
            ->sum('amount');

        // --- Top selling products ---
        $topProducts = OrderItem::with('product')
            ->whereHas('order', function ($oq) use ($productsFrom, $productsTo) {
                $oq->where('status', 'completed');
                if ($productsFrom) {
                    $oq->where(function ($q) use ($productsFrom) {
                        $q->whereDate('completed_at', '>=', $productsFrom)
                            ->orWhere(function ($q2) use ($productsFrom) {
                                $q2->whereNull('completed_at')->whereDate('created_at', '>=', $productsFrom);
                            });
                    });
                }
                if ($productsTo) {
                    $oq->where(function ($q) use ($productsTo) {
                        $q->whereDate('completed_at', '<=', $productsTo)
                            ->orWhere(function ($q2) use ($productsTo) {
                                $q2->whereNull('completed_at')->whereDate('created_at', '<=', $productsTo);
                            });
                    });
                }
            })
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

        // --- Waitress leaderboard ---
        $waitressLeaderboard = Waitress::with(['orders' => function ($q) use ($leaderboardFrom, $leaderboardTo) {
            $q->where('status', 'completed');
            if ($leaderboardFrom) {
                $q->where(function ($sq) use ($leaderboardFrom) {
                    $sq->whereDate('completed_at', '>=', $leaderboardFrom)
                        ->orWhere(function ($q2) use ($leaderboardFrom) {
                            $q2->whereNull('completed_at')->whereDate('created_at', '>=', $leaderboardFrom);
                        });
                });
            }
            if ($leaderboardTo) {
                $q->where(function ($sq) use ($leaderboardTo) {
                    $sq->whereDate('completed_at', '<=', $leaderboardTo)
                        ->orWhere(function ($q2) use ($leaderboardTo) {
                            $q2->whereNull('completed_at')->whereDate('created_at', '<=', $leaderboardTo);
                        });
                });
            }
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

        // --- Dine In vs Takeaway ---
        $dineInQuery = Order::where('order_type', 'dine_in');
        $takeawayQuery = Order::where('order_type', 'takeaway');
        foreach ([$dineInQuery, $takeawayQuery] as $q) {
            if ($revenueFrom) {
                $q->where(function ($sq) use ($revenueFrom) {
                    $sq->whereDate('completed_at', '>=', $revenueFrom)
                        ->orWhere(function ($q2) use ($revenueFrom) {
                            $q2->whereNull('completed_at')->whereDate('created_at', '>=', $revenueFrom);
                        });
                });
            }
            if ($revenueTo) {
                $q->where(function ($sq) use ($revenueTo) {
                    $sq->whereDate('completed_at', '<=', $revenueTo)
                        ->orWhere(function ($q2) use ($revenueTo) {
                            $q2->whereNull('completed_at')->whereDate('created_at', '<=', $revenueTo);
                        });
                });
            }
        }

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
                'value' => $dineInQuery->count().' / '.$takeawayQuery->count(),
                'change' => 'Dine in vs Takeaway ratio',
                'trend' => 'up',
            ],
        ];

        return Inertia::render('admin/finance/reports/index', [
            'stats' => $stats,
            'orderReportChart' => $orderReportChart,
            'paymentBreakdown' => [
                'cash' => (float) $cashSales,
                'mobile_money' => (float) $mobileMoneySales,
                'card' => (float) $cardSales,
                'credit' => (float) $creditSales,
            ],
            'topProducts' => $topProducts,
            'waitressLeaderboard' => $waitressLeaderboard,
            'filters' => [
                'global_from' => $globalFrom,
                'global_to' => $globalTo,
                'revenue_from' => $revenueFrom,
                'revenue_to' => $revenueTo,
                'products_from' => $productsFrom,
                'products_to' => $productsTo,
                'leaderboard_from' => $leaderboardFrom,
                'leaderboard_to' => $leaderboardTo,
                'payments_from' => $paymentsFrom,
                'payments_to' => $paymentsTo,
            ],
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

    /**
     * Build a payment query scoped to a method and optional date range.
     */
    private function paymentQuery(string $method, ?string $from, ?string $to)
    {
        return Payment::where('status', 'paid')
            ->where('method', $method)
            ->when($from, fn ($q) => $q->whereDate('paid_at', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('paid_at', '<=', $to));
    }
}
