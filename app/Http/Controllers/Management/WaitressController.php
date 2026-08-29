<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\FixedNumber;
use App\Models\Order;
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
                'description' => 'Assigned fixed numbers',
            ],
            [
                'title' => 'Commission Rate',
                'value' => '15%',
                'badge' => ['text' => 'Standard Rate', 'variant' => 'amber'],
                'description' => 'Default sales commission',
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'commission_rate' => 'required|numeric|min:0|max:1',
            'status' => 'required|in:active,inactive',
            'range_start' => 'nullable|integer',
            'range_end' => 'nullable|integer',
        ]);

        $waitress = Waitress::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'commission_rate' => $validated['commission_rate'],
            'status' => $validated['status'],
        ]);

        if (! empty($validated['range_start']) && ! empty($validated['range_end'])) {
            FixedNumber::create([
                'waitress_id' => $waitress->id,
                'range_start' => $validated['range_start'],
                'range_end' => $validated['range_end'],
                'current_number' => $validated['range_start'],
                'status' => 'active',
                'assigned_at' => now(),
            ]);
        }

        return redirect()->back()->with('success', 'Waitress created successfully.');
    }

    public function update(Request $request, Waitress $waitress)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'commission_rate' => 'required|numeric|min:0|max:1',
            'status' => 'required|in:active,inactive',
            'range_start' => 'nullable|integer',
            'range_end' => 'nullable|integer',
        ]);

        $waitress->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'commission_rate' => $validated['commission_rate'],
            'status' => $validated['status'],
        ]);

        if (! empty($validated['range_start']) && ! empty($validated['range_end'])) {
            FixedNumber::updateOrCreate(
                ['waitress_id' => $waitress->id],
                [
                    'range_start' => $validated['range_start'],
                    'range_end' => $validated['range_end'],
                    'current_number' => $validated['range_start'],
                    'status' => 'active',
                    'assigned_at' => now(),
                ]
            );
        }

        return redirect()->back()->with('success', 'Waitress updated successfully.');
    }

    public function destroy(Waitress $waitress)
    {
        $waitress->delete();

        return redirect()->back()->with('success', 'Waitress deleted successfully.');
    }
}
