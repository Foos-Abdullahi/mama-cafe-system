<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\FixedNumber;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Waitress;
use Illuminate\Http\JsonResponse;
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
                'image_url' => $p->image_url ?: '/images/drink-item-0.jpg',
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

        $latestOrder = Order::latest('id')->first();
        $nextOrderNumber = $latestOrder ? (1000 + $latestOrder->id + 1) : 1042;

        $rawNumbers = Setting::getByKey('cafe_waitress_numbers', '');
        $configuredNumbers = array_filter(array_map('trim', explode(',', $rawNumbers)));
        $assignedNumbers = FixedNumber::pluck('current_number')->map(fn ($n) => (string) $n)->toArray();
        $registeredWorkingNumbers = array_values(array_unique(array_filter(array_merge($configuredNumbers, $assignedNumbers))));
        sort($registeredWorkingNumbers, SORT_NATURAL);

        return Inertia::render('pos/index', [
            'categories' => $categories,
            'products' => $products,
            'waitresses' => $waitresses,
            'registeredWorkingNumbers' => $registeredWorkingNumbers,
            'recentOrders' => $recentOrders,
            'nextOrderNumber' => $nextOrderNumber,
        ]);
    }

    public function orders(): Response
    {
        $today = now()->format('Y-m-d');

        $orders = Order::with(['waitress', 'payments', 'items'])
            ->whereDate('created_at', $today)
            ->latest()
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
                    'items_count' => $o->items->sum('quantity'),
                ];
            });

        $todayTotal = $orders->where('payment_status', 'paid')->sum('total');
        $todayCount = $orders->count();

        return Inertia::render('pos/orders', [
            'orders' => $orders->values(),
            'todayTotal' => (float) round($todayTotal, 2),
            'todayCount' => (int) $todayCount,
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

        ActivityLog::log('pos_order', "POS order #{$order->order_number} was processed (total: \${$order->total}).");

        return redirect()->route('pos.index')->with('success', "Order #{$order->order_number} completed successfully!");
    }

    public function storeWaitress(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'phone' => 'nullable|string|min:5|max:50',
            'working_number' => 'nullable|integer|min:1|max:9999999999',
        ]);

        $waitress = Waitress::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'commission_rate' => 0.15,
            'status' => 'active',
        ]);

        $currentNumber = null;

        if (! empty($validated['working_number'])) {
            $fixedNumber = $waitress->fixedNumbers()->create([
                'range_start' => $validated['working_number'],
                'range_end' => $validated['working_number'],
                'current_number' => $validated['working_number'],
                'status' => 'active',
                'assigned_at' => now(),
            ]);
            $currentNumber = $fixedNumber->current_number;

            // Ensure the working number is saved into registered settings if not already present
            $rawNumbers = Setting::getByKey('cafe_waitress_numbers', '');
            $configured = array_filter(array_map('trim', explode(',', $rawNumbers)));
            if (! in_array((string) $currentNumber, $configured, true)) {
                $configured[] = (string) $currentNumber;
                sort($configured, SORT_NATURAL);
                Setting::setByKey('cafe_waitress_numbers', implode(', ', $configured), 'general');
            }
        }

        ActivityLog::log('waitress_create', "Waitress '{$waitress->name}' was registered from POS terminal with working number #".($currentNumber ?? 'none').'.');

        return response()->json([
            'id' => $waitress->id,
            'name' => $waitress->name,
            'phone' => $waitress->phone,
            'current_number' => $currentNumber,
            'range_start' => $currentNumber,
            'range_end' => $currentNumber,
        ], 201);
    }

    public function assignWaitressNumber(Request $request, Waitress $waitress): JsonResponse
    {
        $validated = $request->validate([
            'working_number' => 'required|integer|min:1|max:9999999999',
        ]);

        $workingNumber = $validated['working_number'];

        $fixedNumber = $waitress->fixedNumbers()->first();
        if ($fixedNumber) {
            $fixedNumber->update([
                'range_start' => $workingNumber,
                'range_end' => $workingNumber,
                'current_number' => $workingNumber,
                'status' => 'active',
                'assigned_at' => now(),
            ]);
        } else {
            $fixedNumber = $waitress->fixedNumbers()->create([
                'range_start' => $workingNumber,
                'range_end' => $workingNumber,
                'current_number' => $workingNumber,
                'status' => 'active',
                'assigned_at' => now(),
            ]);
        }

        // Ensure the working number is saved into registered settings if not already present
        $rawNumbers = Setting::getByKey('cafe_waitress_numbers', '');
        $configured = array_filter(array_map('trim', explode(',', $rawNumbers)));
        if (! in_array((string) $workingNumber, $configured, true)) {
            $configured[] = (string) $workingNumber;
            sort($configured, SORT_NATURAL);
            Setting::setByKey('cafe_waitress_numbers', implode(', ', $configured), 'general');
        }

        ActivityLog::log('waitress_number_assigned', "Assigned working number #{$workingNumber} to waitress '{$waitress->name}'.");

        return response()->json([
            'id' => $waitress->id,
            'name' => $waitress->name,
            'phone' => $waitress->phone,
            'current_number' => $workingNumber,
            'range_start' => $workingNumber,
            'range_end' => $workingNumber,
        ]);
    }
}
