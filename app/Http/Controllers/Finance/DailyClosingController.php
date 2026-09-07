<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\DailyClosing;
use App\Models\FixedNumber;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\Waitress;
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

        $todayClosing = DailyClosing::whereDate('closing_date', $today)->first();

        // Calculate active & off-duty waitresses for today
        $totalWaitressesCount = Waitress::count();
        if ($todayClosing && ! empty($todayClosing->waitress_assignments)) {
            $activeWaitressesCount = count(array_filter($todayClosing->waitress_assignments, fn ($w) => ! empty($w['is_active'])));
        } else {
            $activeWaitressesCount = Waitress::where('status', 'active')->count();
        }
        $offDutyWaitressesCount = max(0, $totalWaitressesCount - $activeWaitressesCount);

        $pastClosings = DailyClosing::with('closedBy')->latest('closing_date')->get()->map(function ($dc) {
            return [
                'id' => $dc->id,
                'closing_date' => $dc->closing_date ? $dc->closing_date->format('Y-m-d') : '—',
                'total_orders' => $dc->total_orders,
                'total_sales' => (float) $dc->total_sales,
                'notes' => $dc->notes,
                'waitress_assignments' => $dc->waitress_assignments ?? [],
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
                'title' => 'Active Waitresses Today',
                'value' => (string) $activeWaitressesCount,
                'change' => 'Staff assigned on floor today',
                'trend' => 'up',
            ],
            [
                'title' => 'Off Duty Waitresses',
                'value' => (string) $offDutyWaitressesCount,
                'change' => 'Staff off duty today',
                'trend' => 'down',
            ],
            [
                'title' => 'Daily Orders Handled',
                'value' => (string) $todayTotalOrders,
                'change' => 'Completed sales orders',
                'trend' => 'up',
            ],
        ];

        return Inertia::render('admin/finance/daily-closing/index', [
            'todaySummary' => [
                'date' => $today,
                'total_orders' => $todayTotalOrders,
                'total_sales' => $todayTotalSales,
                'is_closed' => (bool) $todayClosing,
                'closing' => $todayClosing,
            ],
            'pastClosings' => $pastClosings,
            'stats' => $stats,
        ]);
    }

    public function create(): Response
    {
        $today = now()->format('Y-m-d');
        $todayOrders = Order::whereDate('created_at', $today)->where('status', 'completed')->get();
        $todayClosing = DailyClosing::whereDate('closing_date', $today)->first();

        $rawNumbers = Setting::getByKey('cafe_fixed_numbers', '101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 150, 456543');
        $cafeFixedNumbers = array_values(array_filter(array_map('trim', explode(',', $rawNumbers))));

        $waitresses = Waitress::with('fixedNumbers')->orderBy('name')->get()->map(function ($w) {
            $fn = $w->fixedNumbers->first();

            return [
                'id' => $w->id,
                'name' => $w->name,
                'phone' => $w->phone,
                'status' => $w->status,
                'current_number' => $fn ? (string) $fn->current_number : '',
            ];
        });

        return Inertia::render('admin/finance/daily-closing/create', [
            'todaySummary' => [
                'date' => $today,
                'total_orders' => $todayOrders->count(),
                'total_sales' => (float) $todayOrders->sum('total'),
                'is_closed' => (bool) $todayClosing,
                'closing' => $todayClosing,
            ],
            'cafeFixedNumbers' => $cafeFixedNumbers,
            'waitresses' => $waitresses,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'closing_date' => 'required|date',
            'notes' => 'nullable|string',
            'assignments' => 'required|array',
            'assignments.*.waitress_id' => 'required|integer|exists:waitresses,id',
            'assignments.*.name' => 'required|string',
            'assignments.*.assigned_number' => 'nullable|string',
            'assignments.*.is_active' => 'required|boolean',
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

        $savedAssignments = [];

        foreach ($validated['assignments'] as $item) {
            if (! empty($item['is_active']) && ! empty($item['assigned_number'])) {
                $num = (int) $item['assigned_number'];
                $wId = $item['waitress_id'];

                FixedNumber::updateOrCreate(
                    ['waitress_id' => $wId],
                    [
                        'range_start' => $num,
                        'range_end' => $num,
                        'current_number' => $num,
                        'status' => 'active',
                        'assigned_at' => now(),
                    ]
                );

                $savedAssignments[] = [
                    'waitress_id' => $wId,
                    'name' => $item['name'],
                    'assigned_number' => (string) $num,
                    'is_active' => true,
                ];
            } else {
                FixedNumber::where('waitress_id', $item['waitress_id'])->update(['status' => 'inactive']);
            }
        }

        DailyClosing::updateOrCreate(
            ['closing_date' => $date],
            [
                'total_orders' => $totalOrders,
                'total_sales' => $totalSales,
                'cash_expected' => $cashExpected,
                'cash_actual' => $cashExpected,
                'mobile_money_total' => $mobileMoney,
                'card_total' => $card,
                'credit_total' => $credit,
                'variance' => 0.00,
                'notes' => $validated['notes'] ?? null,
                'waitress_assignments' => $savedAssignments,
                'closed_by_user_id' => auth()->id(),
            ]
        );

        ActivityLog::log('daily_closing', "Daily waitress shift numbers saved for {$date}.");

        return redirect()->route('finance.daily-closing.index')->with('success', 'Daily waitress roster saved successfully!');
    }

    public function edit(DailyClosing $dailyClosing): Response
    {
        $rawNumbers = Setting::getByKey('cafe_fixed_numbers', '101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 150, 456543');
        $cafeFixedNumbers = array_values(array_filter(array_map('trim', explode(',', $rawNumbers))));

        $waitresses = Waitress::with('fixedNumbers')->orderBy('name')->get()->map(function ($w) {
            $fn = $w->fixedNumbers->first();

            return [
                'id' => $w->id,
                'name' => $w->name,
                'phone' => $w->phone,
                'status' => $w->status,
                'current_number' => $fn ? (string) $fn->current_number : '',
            ];
        });

        return Inertia::render('admin/finance/daily-closing/edit', [
            'dailyClosing' => [
                'id' => $dailyClosing->id,
                'closing_date' => $dailyClosing->closing_date ? $dailyClosing->closing_date->format('Y-m-d') : '',
                'total_orders' => $dailyClosing->total_orders,
                'total_sales' => (float) $dailyClosing->total_sales,
                'notes' => $dailyClosing->notes ?? '',
                'waitress_assignments' => $dailyClosing->waitress_assignments ?? [],
            ],
            'cafeFixedNumbers' => $cafeFixedNumbers,
            'waitresses' => $waitresses,
        ]);
    }

    public function update(Request $request, DailyClosing $dailyClosing): RedirectResponse
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
            'assignments' => 'required|array',
            'assignments.*.waitress_id' => 'required|integer|exists:waitresses,id',
            'assignments.*.name' => 'required|string',
            'assignments.*.assigned_number' => 'nullable|string',
            'assignments.*.is_active' => 'required|boolean',
        ]);

        $savedAssignments = [];

        foreach ($validated['assignments'] as $item) {
            if (! empty($item['is_active']) && ! empty($item['assigned_number'])) {
                $num = (int) $item['assigned_number'];
                $wId = $item['waitress_id'];

                FixedNumber::updateOrCreate(
                    ['waitress_id' => $wId],
                    [
                        'range_start' => $num,
                        'range_end' => $num,
                        'current_number' => $num,
                        'status' => 'active',
                        'assigned_at' => now(),
                    ]
                );

                $savedAssignments[] = [
                    'waitress_id' => $wId,
                    'name' => $item['name'],
                    'assigned_number' => (string) $num,
                    'is_active' => true,
                ];
            } else {
                FixedNumber::where('waitress_id', $item['waitress_id'])->update(['status' => 'inactive']);
            }
        }

        $dailyClosing->update([
            'notes' => $validated['notes'] ?? null,
            'waitress_assignments' => $savedAssignments,
        ]);

        ActivityLog::log('daily_closing', "Updated daily waitress shift numbers for {$dailyClosing->closing_date->format('Y-m-d')}.");

        return redirect()->route('finance.daily-closing.index')->with('success', 'Daily waitress roster updated successfully!');
    }
}
