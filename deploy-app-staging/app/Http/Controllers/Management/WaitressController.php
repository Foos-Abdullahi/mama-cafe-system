<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Order;
use App\Models\Setting;
use App\Models\Waitress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WaitressController extends Controller
{
    public function index(): Response
    {
        $waitresses = Waitress::with(['fixedNumbers', 'orders'])
            ->withCount('orders')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($w) {
                $totalSales = $w->orders->where('status', 'completed')->sum('total');
                $commissionEarned = $totalSales * ($w->commission_rate);

                return [
                    'id' => $w->id,
                    'name' => $w->name,
                    'phone' => $w->phone,
                    'commission_rate' => $w->commission_rate,
                    'status' => $w->status,
                    'orders_count' => $w->orders_count,
                    'total_sales' => $totalSales,
                    'commission_earned' => $commissionEarned,
                    'fixed_numbers' => $w->fixedNumbers,
                    'created_at' => $w->created_at->format('Y-m-d'),
                ];
            });

        $totalWaitresses = Waitress::count();
        $activeWaitresses = Waitress::where('status', 'active')->count();
        $totalOrdersHandled = Order::whereNotNull('waitress_id')->count();
        $totalCommissionPaid = $waitresses->sum('commission_earned');

        $defaultCommSetting = Setting::getByKey('default_commission_rate', '15');

        $stats = [
            [
                'title' => 'Total Waitresses',
                'value' => (string) $totalWaitresses,
                'badge' => ['text' => 'Floor Staff', 'variant' => 'blue'],
                'description' => 'Registered waitstaff',
            ],
            [
                'title' => 'Active Waitresses',
                'value' => (string) $activeWaitresses,
                'badge' => ['text' => 'On Duty', 'variant' => 'emerald'],
                'description' => 'Assigned staff numbers',
            ],
            [
                'title' => 'Commission Rate',
                'value' => $defaultCommSetting.'%',
                'badge' => ['text' => 'System Managed', 'variant' => 'amber'],
                'description' => 'Global fixed commission',
            ],
            [
                'title' => 'Orders Handled',
                'value' => (string) $totalOrdersHandled,
                'badge' => ['text' => 'Completed', 'variant' => 'purple'],
                'description' => 'Total floor service orders',
            ],
        ];

        return Inertia::render('admin/management/waitresses/index', [
            'waitresses' => $waitresses,
            'stats' => $stats,
        ]);
    }

    public function create(): Response
    {
        $defaultCommSetting = Setting::getByKey('default_commission_rate', '15');
        $defaultCommRate = (float) $defaultCommSetting / 100;

        $rawRates = Setting::getByKey('commission_rates', '10, 12, 15, 18, 20');
        $commissionRates = array_values(array_filter(array_map('trim', explode(',', $rawRates))));

        return Inertia::render('admin/management/waitresses/create', [
            'default_commission_rate' => $defaultCommRate,
            'commission_rates' => $commissionRates,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'phone' => 'required|string|min:5|max:50',
            'status' => 'required|in:active,inactive',
            'commission_rate' => 'required|numeric|min:0|max:100',
        ]);

        // Convert percentage e.g. 15 to 0.15 decimal rate if > 1
        $commRate = (float) $validated['commission_rate'];
        if ($commRate > 1) {
            $commRate = $commRate / 100;
        }

        $waitress = Waitress::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'commission_rate' => $commRate,
            'status' => $validated['status'],
        ]);

        ActivityLog::log('waitress_create', "Waitress '{$waitress->name}' was registered with ".($commRate * 100).'% commission.');

        return redirect()->route('management.waitresses.index')->with('success', 'Waitress created successfully.');
    }

    public function show(Waitress $waitress): Response
    {
        $waitress->load(['fixedNumbers', 'orders.items.product']);
        $totalSales = $waitress->orders->where('status', 'completed')->sum('total');
        $commissionEarned = $totalSales * $waitress->commission_rate;

        return Inertia::render('admin/management/waitresses/show', [
            'waitress' => array_merge($waitress->toArray(), [
                'total_sales' => $totalSales,
                'commission_earned' => $commissionEarned,
                'orders_count' => $waitress->orders->count(),
            ]),
        ]);
    }

    public function edit(Waitress $waitress): Response
    {
        $defaultCommSetting = Setting::getByKey('default_commission_rate', '15');
        $defaultCommRate = (float) $defaultCommSetting / 100;

        $rawRates = Setting::getByKey('commission_rates', '10, 12, 15, 18, 20');
        $commissionRates = array_values(array_filter(array_map('trim', explode(',', $rawRates))));

        return Inertia::render('admin/management/waitresses/edit', [
            'waitress' => $waitress,
            'default_commission_rate' => $defaultCommRate,
            'commission_rates' => $commissionRates,
        ]);
    }

    public function update(Request $request, Waitress $waitress)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'phone' => 'required|string|min:5|max:50',
            'status' => 'required|in:active,inactive',
            'commission_rate' => 'required|numeric|min:0|max:100',
        ]);

        $commRate = (float) $validated['commission_rate'];
        if ($commRate > 1) {
            $commRate = $commRate / 100;
        }

        $waitress->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'commission_rate' => $commRate,
            'status' => $validated['status'],
        ]);

        ActivityLog::log('waitress_update', "Waitress '{$waitress->name}' details updated.");

        return redirect()->route('management.waitresses.index')->with('success', 'Waitress updated successfully.');
    }

    public function destroy(Waitress $waitress)
    {
        $name = $waitress->name;
        $waitress->delete();

        ActivityLog::log('waitress_delete', "Waitress '{$name}' was deleted.");

        return redirect()->route('management.waitresses.index')->with('success', 'Waitress deleted successfully.');
    }
}
