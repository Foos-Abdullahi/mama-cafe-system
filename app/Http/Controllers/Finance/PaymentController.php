<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Payment::with(['order.waitress']);

        // Filter by payment method
        if ($request->filled('method')) {
            $query->where('method', $request->query('method'));
        }

        // Filter by payment status
        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $payments = $query->latest()->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'order_id' => $p->order_id,
                'order_number' => $p->order->order_number ?? '—',
                'method' => $p->method,
                'amount' => (float) $p->amount,
                'status' => $p->status,
                'reference' => $p->reference,
                'waitress_name' => $p->order->waitress->name ?? 'Walk-in',
                'paid_at' => $p->paid_at ? $p->paid_at->format('Y-m-d H:i') : ($p->created_at ? $p->created_at->format('Y-m-d H:i') : '—'),
            ];
        });

        $totalCollected = Payment::where('status', 'paid')->sum('amount');
        $cashTotal = Payment::where('status', 'paid')->where('method', 'cash')->sum('amount');
        $mobileMoneyTotal = Payment::where('status', 'paid')->where('method', 'mobile_money')->sum('amount');
        $cardTotal = Payment::where('status', 'paid')->where('method', 'card')->sum('amount');
        $creditTotal = Payment::where('method', 'credit')->sum('amount');

        $stats = [
            [
                'title' => 'Total Payments Collected',
                'value' => '$'.number_format($totalCollected, 2),
                'change' => 'All time settled transactions',
                'trend' => 'up',
            ],
            [
                'title' => 'Cash Transactions',
                'value' => '$'.number_format($cashTotal, 2),
                'change' => 'Drawer cash received',
                'trend' => 'up',
            ],
            [
                'title' => 'Mobile Money & Card',
                'value' => '$'.number_format($mobileMoneyTotal + $cardTotal, 2),
                'change' => 'Digital payments total',
                'trend' => 'up',
            ],
            [
                'title' => 'Outstanding Credit',
                'value' => '$'.number_format($creditTotal, 2),
                'change' => 'Unsettled customer credit',
                'trend' => 'down',
            ],
        ];

        return Inertia::render('admin/finance/payments/index', [
            'payments' => $payments,
            'stats' => $stats,
            'filters' => $request->only(['method', 'status']),
        ]);
    }
}
