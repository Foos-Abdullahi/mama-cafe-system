<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\FixedNumber;
use App\Models\Order;
use App\Models\Payroll;
use App\Models\Waitress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PayrollController extends Controller
{
    public function index(): Response
    {
        $waitressesLedger = collect();

        foreach (Waitress::orderBy('name')->get() as $w) {
            $paidPayouts = Payroll::where('waitress_id', $w->id)->where('status', 'paid')->orderBy('created_at', 'asc')->get();

            foreach ($paidPayouts as $p) {
                $waitressesLedger->push([
                    'id' => $w->id,
                    'payroll_id' => $p->id,
                    'name' => $w->name,
                    'phone' => $w->phone,
                    'commission_rate' => (float) $w->commission_rate,
                    'total_orders' => (int) $p->total_orders,
                    'total_sales' => (float) $p->total_sales,
                    'earned_commission' => (float) $p->commission_amount,
                    'paid_commission' => (float) $p->commission_amount,
                    'unpaid_commission' => 0.00,
                    'is_fully_paid' => true,
                ]);
            }

            $latestPaid = $paidPayouts->last();
            $unpaidOrders = Order::where('waitress_id', $w->id)
                ->where('status', 'completed')
                ->when($latestPaid, function ($q) use ($latestPaid) {
                    $q->where('created_at', '>', $latestPaid->created_at);
                })
                ->get();

            if ($unpaidOrders->count() > 0) {
                $totalSales = (float) $unpaidOrders->sum('total');
                $earnedCommission = round($totalSales * (float) $w->commission_rate, 2);

                $waitressesLedger->push([
                    'id' => $w->id,
                    'payroll_id' => null,
                    'name' => $w->name,
                    'phone' => $w->phone,
                    'commission_rate' => (float) $w->commission_rate,
                    'total_orders' => $unpaidOrders->count(),
                    'total_sales' => $totalSales,
                    'earned_commission' => $earnedCommission,
                    'paid_commission' => 0.00,
                    'unpaid_commission' => $earnedCommission,
                    'is_fully_paid' => false,
                ]);
            } elseif ($paidPayouts->isEmpty()) {
                $waitressesLedger->push([
                    'id' => $w->id,
                    'payroll_id' => null,
                    'name' => $w->name,
                    'phone' => $w->phone,
                    'commission_rate' => (float) $w->commission_rate,
                    'total_orders' => 0,
                    'total_sales' => 0.00,
                    'earned_commission' => 0.00,
                    'paid_commission' => 0.00,
                    'unpaid_commission' => 0.00,
                    'is_fully_paid' => true,
                ]);
            }
        }

        $payoutHistory = Payroll::with('waitress')->latest()->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'waitress_id' => $p->waitress_id,
                'waitress_name' => $p->waitress->name ?? '—',
                'period_start' => $p->period_start ? $p->period_start->format('Y-m-d') : '—',
                'period_end' => $p->period_end ? $p->period_end->format('Y-m-d') : '—',
                'total_orders' => $p->total_orders,
                'total_sales' => (float) $p->total_sales,
                'commission_rate' => (float) $p->commission_rate,
                'commission_amount' => (float) $p->commission_amount,
                'status' => $p->status,
                'paid_at' => $p->paid_at ? $p->paid_at->toIso8601String() : ($p->created_at ? $p->created_at->toIso8601String() : null),
                'notes' => $p->notes,
                'sent_from_number' => $p->sent_from_number,
            ];
        });

        $totalPayoutsDistributed = Payroll::where('status', 'paid')->sum('commission_amount');
        $totalPendingCommissions = $waitressesLedger->sum('unpaid_commission');
        $activeWaitressesCount = Waitress::where('status', 'active')->count();

        $stats = [
            [
                'title' => 'Total Commission Paid Out',
                'value' => '$'.number_format($totalPayoutsDistributed, 2),
                'change' => 'Distributed to staff',
                'trend' => 'up',
            ],
            [
                'title' => 'Pending Staff Commission',
                'value' => '$'.number_format($totalPendingCommissions, 2),
                'change' => 'Ready for payout',
                'trend' => 'up',
            ],
            [
                'title' => 'Active Floor Waitresses',
                'value' => (string) $activeWaitressesCount,
                'change' => 'Registered staff members',
                'trend' => 'up',
            ],
        ];

        return Inertia::render('admin/finance/payroll/index', [
            'waitresses' => $waitressesLedger->values(),
            'payoutHistory' => $payoutHistory,
            'stats' => $stats,
        ]);
    }

    public function create(Request $request): Response
    {
        $waitresses = Waitress::orderBy('name')->get()->map(function ($w) {
            $latestPaid = Payroll::where('waitress_id', $w->id)->where('status', 'paid')->latest()->first();

            $unpaidOrders = Order::where('waitress_id', $w->id)
                ->where('status', 'completed')
                ->when($latestPaid, function ($q) use ($latestPaid) {
                    $q->where('created_at', '>', $latestPaid->created_at);
                })
                ->latest()
                ->get();

            if ($unpaidOrders->count() > 0) {
                $totalSales = (float) $unpaidOrders->sum('total');
                $earnedCommission = round($totalSales * (float) $w->commission_rate, 2);
                $unpaidCommission = $earnedCommission;
                $totalOrdersCount = $unpaidOrders->count();
                $isFullyPaid = false;
            } elseif ($latestPaid) {
                $totalSales = (float) $latestPaid->total_sales;
                $earnedCommission = (float) $latestPaid->commission_amount;
                $unpaidCommission = 0.00;
                $totalOrdersCount = (int) $latestPaid->total_orders;
                $isFullyPaid = true;
            } else {
                $totalSales = 0.00;
                $earnedCommission = 0.00;
                $unpaidCommission = 0.00;
                $totalOrdersCount = 0;
                $isFullyPaid = true;
            }

            return [
                'id' => $w->id,
                'name' => $w->name,
                'phone' => $w->phone,
                'commission_rate' => (float) $w->commission_rate,
                'total_orders' => $totalOrdersCount,
                'total_sales' => $totalSales,
                'earned_commission' => $earnedCommission,
                'paid_commission' => $isFullyPaid ? $earnedCommission : 0.00,
                'unpaid_commission' => $unpaidCommission,
                'is_fully_paid' => $isFullyPaid,
            ];
        });

        $cafeNumbers = FixedNumber::orderBy('range_start')->get()->map(function ($fn) {
            return [
                'id' => $fn->id,
                'label' => $fn->range_start.'-'.$fn->range_end,
                'current_number' => $fn->current_number,
                'balance' => (float) $fn->balance,
                'status' => $fn->status,
            ];
        });

        $selectedWaitressId = $request->query('waitress_id');

        return Inertia::render('admin/finance/payroll/create', [
            'waitresses' => $waitresses,
            'cafeNumbers' => $cafeNumbers,
            'selectedWaitressId' => $selectedWaitressId ? (int) $selectedWaitressId : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'waitress_id' => 'required|exists:waitresses,id',
            'fixed_number_id' => 'required|exists:fixed_numbers,id',
            'period_start' => 'required|date',
            'period_end' => 'required|date',
            'commission_amount' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
        ]);

        $cafeNumber = FixedNumber::findOrFail($validated['fixed_number_id']);

        if ((float) $cafeNumber->balance < (float) $validated['commission_amount']) {
            return back()->withErrors([
                'fixed_number_id' => "Insufficient balance on café number {$cafeNumber->range_start}-{$cafeNumber->range_end}. Available: $".number_format((float) $cafeNumber->balance, 2),
            ])->withInput();
        }

        $waitress = Waitress::findOrFail($validated['waitress_id']);

        $latestPaid = Payroll::where('waitress_id', $waitress->id)->where('status', 'paid')->latest()->first();

        $unpaidOrders = Order::where('waitress_id', $waitress->id)
            ->where('status', 'completed')
            ->when($latestPaid, function ($q) use ($latestPaid) {
                $q->where('created_at', '>', $latestPaid->created_at);
            })
            ->get();

        $totalSales = (float) $unpaidOrders->sum('total');

        $payroll = Payroll::create([
            'waitress_id' => $waitress->id,
            'fixed_number_id' => $cafeNumber->id,
            'sent_from_number' => $cafeNumber->range_start.'-'.$cafeNumber->range_end,
            'period_start' => $validated['period_start'],
            'period_end' => $validated['period_end'],
            'total_orders' => $unpaidOrders->count(),
            'total_sales' => $totalSales,
            'commission_rate' => $waitress->commission_rate,
            'commission_amount' => round((float) $validated['commission_amount'], 2),
            'status' => 'paid',
            'paid_at' => now(),
            'notes' => $validated['notes'] ?? 'Commission payout processed.',
        ]);

        // Deduct the payout amount from the café number's balance
        $cafeNumber->decrement('balance', round((float) $validated['commission_amount'], 2));

        ActivityLog::log('payroll_create', "Payroll payout of \${$payroll->commission_amount} recorded for '{$waitress->name}' via café number {$cafeNumber->range_start}-{$cafeNumber->range_end}.");

        return redirect()->route('finance.payroll.show', $payroll->id)->with('success', 'Payroll payout recorded successfully!');
    }

    public function show(Payroll $payroll): Response
    {
        $payroll->load('waitress');

        return Inertia::render('admin/finance/payroll/show', [
            'payroll' => [
                'id' => $payroll->id,
                'waitress_name' => $payroll->waitress->name ?? '—',
                'waitress_phone' => $payroll->waitress->phone ?? '—',
                'period_start' => $payroll->period_start ? $payroll->period_start->format('Y-m-d') : '—',
                'period_end' => $payroll->period_end ? $payroll->period_end->format('Y-m-d') : '—',
                'total_orders' => $payroll->total_orders,
                'total_sales' => (float) $payroll->total_sales,
                'commission_rate' => (float) $payroll->commission_rate,
                'commission_amount' => (float) $payroll->commission_amount,
                'status' => $payroll->status,
                'paid_at' => $payroll->paid_at ? $payroll->paid_at->toIso8601String() : ($payroll->created_at ? $payroll->created_at->toIso8601String() : null),
                'notes' => $payroll->notes,
                'sent_from_number' => $payroll->sent_from_number,
            ],
        ]);
    }
}
