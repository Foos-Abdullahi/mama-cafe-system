<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\DailyClosing;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DailyClosingController extends Controller
{
    public function index(): Response
    {
        $today = now()->format('Y-m-d');
        $todayOrders = Order::whereDate('created_at', $today)->where('status', 'completed')->get();

        $todayTotalSales = (float) $todayOrders->sum('total');
        $todayTotalOrders = $todayOrders->count();

        $todayCashExpected = (float) Payment::whereHas('order', function ($q) use ($today) {
            $q->whereDate('created_at', $today);
        })->where('status', 'paid')->where('method', 'cash')->sum('amount');

        $todayMobileMoney = (float) Payment::whereHas('order', function ($q) use ($today) {
            $q->whereDate('created_at', $today);
        })->where('status', 'paid')->where('method', 'mobile_money')->sum('amount');

        $todayCard = (float) Payment::whereHas('order', function ($q) use ($today) {
            $q->whereDate('created_at', $today);
        })->where('status', 'paid')->where('method', 'card')->sum('amount');

        $todayCredit = (float) Payment::whereHas('order', function ($q) use ($today) {
            $q->whereDate('created_at', $today);
        })->where('method', 'credit')->sum('amount');

        $todayClosing = DailyClosing::whereDate('closing_date', $today)->first();

        $pastClosings = DailyClosing::with('closedBy')->latest('closing_date')->get()->map(function ($dc) {
            return [
                'id' => $dc->id,
                'closing_date' => $dc->closing_date ? $dc->closing_date->format('Y-m-d') : '—',
                'total_orders' => $dc->total_orders,
                'total_sales' => (float) $dc->total_sales,
                'cash_expected' => (float) $dc->cash_expected,
                'cash_actual' => (float) $dc->cash_actual,
                'mobile_money_total' => (float) $dc->mobile_money_total,
                'card_total' => (float) $dc->card_total,
                'credit_total' => (float) $dc->credit_total,
                'variance' => (float) $dc->variance,
                'notes' => $dc->notes,
                'closed_by' => $dc->closedBy->name ?? 'Admin',
                'created_at' => $dc->created_at ? $dc->created_at->format('H:i') : '—',
            ];
        });

        $stats = [
            [
                'title' => "Today's Gross Sales",
                'value' => '$'.number_format($todayTotalSales, 2),
                'change' => $todayTotalOrders.' orders served today',
                'trend' => 'up',
            ],
            [
                'title' => 'Expected Cash in Drawer',
                'value' => '$'.number_format($todayCashExpected, 2),
                'change' => 'Cash sales balance',
                'trend' => 'up',
            ],
            [
                'title' => 'Digital & Credit Sales',
                'value' => '$'.number_format($todayMobileMoney + $todayCard + $todayCredit, 2),
                'change' => 'Mobile ($'.number_format($todayMobileMoney, 2).') + Card ($'.number_format($todayCard, 2).')',
                'trend' => 'up',
            ],
            [
                'title' => 'EOD Status',
                'value' => $todayClosing ? 'Closed & Reconciled' : 'Open (Pending EOD)',
                'change' => $todayClosing ? 'Reconciliation complete' : 'Awaiting cashier check',
                'trend' => $todayClosing ? 'up' : 'down',
            ],
        ];

        return Inertia::render('admin/finance/daily-closing/index', [
            'todaySummary' => [
                'date' => $today,
                'total_orders' => $todayTotalOrders,
                'total_sales' => $todayTotalSales,
                'cash_expected' => $todayCashExpected,
                'mobile_money_total' => $todayMobileMoney,
                'card_total' => $todayCard,
                'credit_total' => $todayCredit,
                'is_closed' => (bool) $todayClosing,
                'closing' => $todayClosing,
            ],
            'pastClosings' => $pastClosings,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'closing_date' => 'required|date',
            'cash_actual' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $date = $validated['closing_date'];
        $todayOrders = Order::whereDate('created_at', $date)->where('status', 'completed')->get();

        $totalSales = (float) $todayOrders->sum('total');
        $totalOrders = $todayOrders->count();

        $cashExpected = (float) Payment::whereHas('order', function ($q) use ($date) {
            $q->whereDate('created_at', $date);
        })->where('status', 'paid')->where('method', 'cash')->sum('amount');

        $mobileMoney = (float) Payment::whereHas('order', function ($q) use ($date) {
            $q->whereDate('created_at', $date);
        })->where('status', 'paid')->where('method', 'mobile_money')->sum('amount');

        $card = (float) Payment::whereHas('order', function ($q) use ($date) {
            $q->whereDate('created_at', $date);
        })->where('status', 'paid')->where('method', 'card')->sum('amount');

        $credit = (float) Payment::whereHas('order', function ($q) use ($date) {
            $q->whereDate('created_at', $date);
        })->where('method', 'credit')->sum('amount');

        $cashActual = (float) $validated['cash_actual'];
        $variance = $cashActual - $cashExpected;

        DailyClosing::updateOrCreate(
            ['closing_date' => $date],
            [
                'total_orders' => $totalOrders,
                'total_sales' => $totalSales,
                'cash_expected' => $cashExpected,
                'cash_actual' => $cashActual,
                'mobile_money_total' => $mobileMoney,
                'card_total' => $card,
                'credit_total' => $credit,
                'variance' => $variance,
                'notes' => $validated['notes'] ?? 'Daily closing completed.',
                'closed_by_user_id' => auth()->id(),
            ]
        );

        return redirect()->route('finance.daily-closing.index')->with('success', 'Daily EOD closing reconciled successfully!');
    }
}
