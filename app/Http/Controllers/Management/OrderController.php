<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\Cancellation;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Refund;
use App\Models\Waitress;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::with(['waitress', 'items.product', 'payments', 'refund', 'cancellation'])
            ->orderBy('id', 'desc')
            ->get();

        $products = Product::where('status', 'active')->get();
        $waitresses = Waitress::where('status', 'active')->get();

        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', 'completed')->sum('total');
        $completedOrders = Order::where('status', 'completed')->count();
        $cancelledRefunded = Order::whereIn('status', ['cancelled', 'refunded'])->count();

        $stats = [
            [
                'title' => 'Total Orders',
                'value' => (string) $totalOrders,
                'badge' => ['text' => 'All Time', 'variant' => 'blue'],
                'description' => 'Cumulative customer orders',
            ],
            [
                'title' => 'Total Sales Revenue',
                'value' => '$'.number_format($totalRevenue, 2),
                'badge' => ['text' => 'Completed Sales', 'variant' => 'emerald'],
                'description' => 'Gross cafe income',
            ],
            [
                'title' => 'Completed Orders',
                'value' => (string) $completedOrders,
                'badge' => ['text' => 'Paid & Closed', 'variant' => 'purple'],
                'description' => 'Successfully served',
            ],
            [
                'title' => 'Cancelled / Refunded',
                'value' => (string) $cancelledRefunded,
                'badge' => ['text' => 'Adjusted', 'variant' => 'red'],
                'description' => 'Voided transactions',
            ],
        ];

        return Inertia::render('admin/management/orders/index', [
            'orders' => $orders,
            'products' => $products,
            'waitresses' => $waitresses,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'waitress_id' => 'nullable|exists:waitresses,id',
            'fixed_number' => 'nullable|integer',
            'order_type' => 'required|in:dine_in,takeaway',
            'status' => 'required|in:draft,completed,cancelled,refunded',
            'payment_status' => 'required|in:paid,partial,unpaid,refunded',
            'payment_method' => 'nullable|in:cash,mobile_money,card,credit',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $subtotal = 0;
        $itemsToInsert = [];

        foreach ($validated['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            $lineTotal = $product->price * $item['quantity'];
            $subtotal += $lineTotal;

            $itemsToInsert[] = [
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'unit_price' => $product->price,
                'line_total' => $lineTotal,
            ];
        }

        $order = Order::create([
            'order_number' => 'ORD-'.strtoupper(Str::random(6)),
            'fixed_number' => $validated['fixed_number'] ?? null,
            'waitress_id' => $validated['waitress_id'] ?? null,
            'order_type' => $validated['order_type'],
            'subtotal' => $subtotal,
            'discount' => 0.00,
            'tax' => 0.00,
            'total' => $subtotal,
            'status' => $validated['status'],
            'payment_status' => $validated['payment_status'],
            'completed_at' => $validated['status'] === 'completed' ? now() : null,
        ]);

        foreach ($itemsToInsert as $itemData) {
            $order->items()->create($itemData);
        }

        if ($validated['payment_status'] === 'paid' && ! empty($validated['payment_method'])) {
            Payment::create([
                'order_id' => $order->id,
                'method' => $validated['payment_method'],
                'amount' => $subtotal,
                'status' => 'paid',
                'reference' => 'TXN-'.strtoupper(Str::random(8)),
                'paid_at' => now(),
            ]);
        }

        return redirect()->back()->with('success', 'Order created successfully.');
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,completed,cancelled,refunded',
            'payment_status' => 'required|in:paid,partial,unpaid,refunded',
            'reason' => 'nullable|string',
        ]);

        $previousStatus = $order->status;

        $order->update([
            'status' => $validated['status'],
            'payment_status' => $validated['payment_status'],
            'completed_at' => $validated['status'] === 'completed' ? now() : $order->completed_at,
        ]);

        if ($validated['status'] === 'cancelled' && $previousStatus !== 'cancelled') {
            Cancellation::create([
                'order_id' => $order->id,
                'reason' => $validated['reason'] ?? 'Cancelled by Admin',
                'cancelled_by' => auth()->id(),
            ]);
        }

        if ($validated['status'] === 'refunded' && $previousStatus !== 'refunded') {
            Refund::create([
                'order_id' => $order->id,
                'amount' => $order->total,
                'reason' => $validated['reason'] ?? 'Refunded by Admin',
                'processed_by' => auth()->id(),
            ]);
        }

        return redirect()->back()->with('success', 'Order updated successfully.');
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return redirect()->back()->with('success', 'Order deleted successfully.');
    }
}
