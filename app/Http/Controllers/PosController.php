<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Waitress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PosController extends Controller
{
    public function index(): Response
    {
        $categories = Category::where('status', 'active')->withCount(['products' => function ($q) {
            $q->where('status', 'active');
        }])->get();

        $products = Product::where('status', 'active')->with('category')->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'category_id' => $p->category_id,
                'category_name' => $p->category->name ?? 'Uncategorized',
                'name' => $p->name,
                'description' => $p->description,
                'price' => (float) $p->price,
                'image_url' => $p->image_url,
            ];
        });

        $waitresses = Waitress::where('status', 'active')->with('fixedNumbers')->get()->map(function ($w) {
            $firstRange = $w->fixedNumbers->first();

            return [
                'id' => $w->id,
                'name' => $w->name,
                'range_start' => $firstRange->range_start ?? null,
                'range_end' => $firstRange->range_end ?? null,
                'current_number' => $firstRange->current_number ?? null,
            ];
        });

        $recentOrders = Order::with(['items.product', 'waitress', 'payments'])
            ->whereDate('created_at', now()->format('Y-m-d'))
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($o) {
                return [
                    'id' => $o->id,
                    'order_number' => $o->order_number,
                    'fixed_number' => $o->fixed_number,
                    'waitress_name' => $o->waitress->name ?? 'Walk-in',
                    'order_type' => $o->order_type,
                    'total' => (float) $o->total,
                    'payment_status' => $o->payment_status,
                    'payment_method' => $o->payments->first()->method ?? 'cash',
                    'created_at' => $o->created_at->format('H:i'),
                ];
            });

        return Inertia::render('pos/index', [
            'categories' => $categories,
            'products' => $products,
            'waitresses' => $waitresses,
            'recentOrders' => $recentOrders,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'order_type' => 'required|in:dine_in,takeaway',
            'fixed_number' => 'nullable|integer',
            'waitress_id' => 'nullable|exists:waitresses,id',
            'payment_method' => 'required|in:cash,mobile_money,card,credit',
            'payment_status' => 'required|in:paid,partial,unpaid',
            'amount_paid' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $order = DB::transaction(function () use ($validated) {
            $subtotal = 0;
            $itemsToCreate = [];

            foreach ($validated['items'] as $itemData) {
                $product = Product::findOrFail($itemData['product_id']);
                $unitPrice = (float) $product->price;
                $lineTotal = $unitPrice * $itemData['quantity'];
                $subtotal += $lineTotal;

                $itemsToCreate[] = [
                    'product_id' => $product->id,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $unitPrice,
                    'line_total' => $lineTotal,
                ];
            }

            $discount = (float) ($validated['discount'] ?? 0);
            $total = max(0, $subtotal - $discount);
            $orderNumber = 'ORD-'.strtoupper(Str::random(6));

            $order = Order::create([
                'order_number' => $orderNumber,
                'fixed_number' => $validated['fixed_number'] ?? null,
                'waitress_id' => $validated['waitress_id'] ?? null,
                'order_type' => $validated['order_type'],
                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax' => 0.00,
                'total' => $total,
                'status' => 'completed',
                'payment_status' => $validated['payment_status'],
            ]);

            foreach ($itemsToCreate as $item) {
                $order->items()->create($item);
            }

            $paidAmount = match ($validated['payment_status']) {
                'paid' => $total,
                'partial' => (float) ($validated['amount_paid'] ?? 0),
                'unpaid' => 0.00,
            };

            Payment::create([
                'order_id' => $order->id,
                'method' => $validated['payment_method'],
                'amount' => $paidAmount,
                'status' => $validated['payment_status'],
                'paid_at' => $validated['payment_status'] === 'unpaid' ? null : now(),
            ]);

            return $order;
        });

        return redirect()->route('pos.index')->with('success', "Order #{$order->order_number} completed successfully!");
    }
}
