<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
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
        $waitresses = Waitress::with(['orders' => function ($q) {
            $q->where('status', 'completed');
        }])->get()->map(function ($w) {
            $totalSales = $w->orders->sum('total');
            $earnedCommission = $totalSales * (float) $w->commission_rate;
            $paidCommission = Payroll::where('waitress_id', $w->id)->where('status', 'paid')->sum('commission_amount');
            $unpaidCommission = max(0, round($earnedCommission - $paidCommission, 2));

            return [
                'id' => $w->id,
                'name' => $w->name,
                'phone' => $w->phone,
                'commission_rate' => (float) $w->commission_rate,
                'total_orders' => $w->orders->count(),
                'total_sales' => (float) $totalSales,
                'earned_commission' => (float) $earnedCommission,
                'paid_commission' => (float) $paidCommission,
                'unpaid_commission' => (float) $unpaidCommission,
            ];
        });

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
                'paid_at' => $p->paid_at ? $p->paid_at->format('Y-m-d H:i') : ($p->created_at ? $p->created_at->format('Y-m-d H:i') : '—'),
                'notes' => $p->notes,
            ];
        });

        $totalPayoutsDistributed = Payroll::where('status', 'paid')->sum('commission_amount');
        $totalPendingCommissions = $waitresses->sum('unpaid_commission');

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
                'value' => (string) $waitresses->count(),
                'change' => 'Registered staff members',
                'trend' => 'up',
            ],
        ];

        return Inertia::render('admin/finance/payroll/index', [
            'waitresses' => $waitresses,
            'payoutHistory' => $payoutHistory,
            'stats' => $stats,
        ]);
    }

    public function create(Request $request): Response
    {
        $waitresses = Waitress::with(['orders' => function ($q) {
            $q->where('status', 'completed');
        }])->get()->map(function ($w) {
            $totalSales = $w->orders->sum('total');
            $earnedCommission = $totalSales * (float) $w->commission_rate;
            $paidCommission = Payroll::where('waitress_id', $w->id)->where('status', 'paid')->sum('commission_amount');
            $unpaidCommission = max(0, round($earnedCommission - $paidCommission, 2));

            return [
                'id' => $w->id,
                'name' => $w->name,
                'phone' => $w->phone,
                'commission_rate' => (float) $w->commission_rate,
                'total_orders' => $w->orders->count(),
                'total_sales' => (float) $totalSales,
                'earned_commission' => (float) $earnedCommission,
                'paid_commission' => (float) $paidCommission,
                'unpaid_commission' => (float) $unpaidCommission,
            ];
        });

        $selectedWaitressId = $request->query('waitress_id');

        return Inertia::render('admin/finance/payroll/create', [
            'waitresses' => $waitresses,
            'selectedWaitressId' => $selectedWaitressId ? (int) $selectedWaitressId : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'waitress_id' => 'required|exists:waitresses,id',
            'period_start' => 'required|date',
            'period_end' => 'required|date',
            'commission_amount' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
        ]);

        $waitress = Waitress::with(['orders' => function ($q) {
            $q->where('status', 'completed');
        }])->findOrFail($validated['waitress_id']);

        $totalSales = $waitress->orders->sum('total');

        $payroll = Payroll::create([
            'waitress_id' => $waitress->id,
            'period_start' => $validated['period_start'],
            'period_end' => $validated['period_end'],
            'total_orders' => $waitress->orders->count(),
            'total_sales' => $totalSales,
            'commission_rate' => $waitress->commission_rate,
            'commission_amount' => round((float) $validated['commission_amount'], 2),
            'status' => 'paid',
            'paid_at' => now(),
            'notes' => $validated['notes'] ?? 'Commission payout processed.',
        ]);

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
                'paid_at' => $payroll->paid_at ? $payroll->paid_at->format('Y-m-d H:i') : ($payroll->created_at ? $payroll->created_at->format('Y-m-d H:i') : '—'),
                'notes' => $payroll->notes,
            ],
        ]);
    }
}
