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
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PosController extends Controller
{
    public function index(): Response
    {
        $categories = Category::where('status', 'active')->withCount(['products' => function ($q) {
            $q->where('status', 'active');
        }])->get()->map(function (Category $category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'image_url' => $category->image_url,
                'products_count' => $category->products_count,
            ];
        });

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
        $taxRate = (float) Setting::getByKey('tax_rate', '0');

        return Inertia::render('pos/index', [
            'categories' => $categories,
            'products' => $products,
            'waitresses' => $waitresses,
            'registeredWorkingNumbers' => $registeredWorkingNumbers,
            'recentOrders' => $recentOrders,
            'nextOrderNumber' => $nextOrderNumber,
            'taxRate' => $taxRate,
        ]);
    }

    public function orders(Request $request): Response
    {
        $today = now()->format('Y-m-d');
        $waitressId = $request->query('waitress_id');

        $query = Order::with(['waitress', 'payments', 'items']);

        if ($waitressId) {
            $query->where('waitress_id', $waitressId);
        } else {
            $query->whereDate('created_at', $today);
        }

        $orders = $query->latest()->get()->map(function ($o) {
            return [
                'id' => $o->id,
                'order_number' => $o->order_number,
                'fixed_number' => $o->fixed_number,
                'waitress_name' => $o->waitress->name ?? 'Walk-in',
                'order_type' => $o->order_type,
                'total' => (float) $o->total,
                'payment_status' => $o->payment_status,
                'payment_method' => $o->payments->first()->method ?? 'cash',
                'created_at' => $o->created_at ? $o->created_at->format('Y-m-d H:i') : '—',
                'items_count' => $o->items->sum('quantity'),
            ];
        });

        $selectedWaitress = $waitressId ? Waitress::find($waitressId) : null;
        $todayTotal = $orders->where('payment_status', 'paid')->sum('total');
        $todayCount = $orders->count();

        return Inertia::render('pos/orders', [
            'orders' => $orders->values(),
            'todayTotal' => (float) round($todayTotal, 2),
            'todayCount' => (int) $todayCount,
            'selectedWaitress' => $selectedWaitress ? [
                'id' => $selectedWaitress->id,
                'name' => $selectedWaitress->name,
                'phone' => $selectedWaitress->phone,
            ] : null,
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
            'amount_paid' => 'nullable|required_if:payment_status,partial|numeric|min:0.01',
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
            $discount = min($discount, $subtotal);
            $taxRate = (float) Setting::getByKey('tax_rate', '0');
            $taxableSubtotal = max(0, $subtotal - $discount);
            $tax = round($taxableSubtotal * ($taxRate / 100), 2);
            $total = round($taxableSubtotal + $tax, 2);
            $orderNumber = 'ORD-'.strtoupper(Str::random(6));

            $order = Order::create([
                'order_number' => $orderNumber,
                'fixed_number' => $validated['fixed_number'] ?? null,
                'waitress_id' => $validated['waitress_id'] ?? null,
                'order_type' => $validated['order_type'],
                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax' => $tax,
                'total' => $total,
                'status' => 'pending',
                'payment_status' => $validated['payment_status'],
                'completed_at' => null,
            ]);

            foreach ($itemsToCreate as $item) {
                $order->items()->create($item);
            }

            $paidAmount = match ($validated['payment_status']) {
                'paid' => $total,
                'partial' => (float) ($validated['amount_paid'] ?? 0),
                'unpaid' => 0.00,
            };

            if ($paidAmount > $total || ($validated['payment_status'] === 'partial' && $paidAmount >= $total)) {
                throw ValidationException::withMessages([
                    'amount_paid' => 'The partial payment amount must be less than the order total.',
                ]);
            }

            Payment::create([
                'order_id' => $order->id,
                'method' => $validated['payment_method'],
                'amount' => $paidAmount,
                'status' => $validated['payment_status'],
                'paid_at' => $validated['payment_status'] === 'unpaid' ? null : now(),
            ]);

            if ($paidAmount > 0) {
                $fixedNumberRecord = null;
                if (! empty($validated['fixed_number'])) {
                    $num = (int) $validated['fixed_number'];
                    $fixedNumberRecord = FixedNumber::where('current_number', $num)
                        ->orWhere(function ($q) use ($num) {
                            $q->where('range_start', '<=', $num)->where('range_end', '>=', $num);
                        })->first();
                }

                if (! $fixedNumberRecord && ! empty($validated['waitress_id'])) {
                    $fixedNumberRecord = FixedNumber::where('waitress_id', $validated['waitress_id'])
                        ->where('status', 'active')
                        ->first();
                }

                if ($fixedNumberRecord) {
                    $fixedNumberRecord->increment('balance', round($paidAmount, 2));
                }
            }

            return $order;
        });

        ActivityLog::log('pos_order', "POS order #{$order->order_number} was processed (total: \${$order->total}).");

        return redirect()->route('pos.index')->with('success', "Order #{$order->order_number} completed successfully!");
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,completed,refunded,cancelled',
        ]);

        if ($validated['status'] === 'completed' && $order->payment_status !== 'paid') {
            throw ValidationException::withMessages([
                'status' => 'This order must be paid before it can be marked as completed. Pay the order first.',
            ]);
        }

        $order->update([
            'status' => $validated['status'],
            'completed_at' => $validated['status'] === 'completed' ? now() : null,
        ]);

        ActivityLog::log('order_status', "Order #{$order->order_number} status changed to {$validated['status']}.");

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    public function updatePaymentStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'payment_status' => 'required|in:paid,pending,partial,unpaid,refunded',
            'amount_paid' => 'nullable|required_if:payment_status,partial|numeric|min:0.01',
        ]);

        $total = (float) $order->total;
        $currentPaid = (float) $order->payments()->sum('amount');
        $remaining = max(0, $total - $currentPaid);

        if ($validated['payment_status'] === 'partial') {
            $amountPaid = (float) $validated['amount_paid'];

            if ($amountPaid > $remaining) {
                throw ValidationException::withMessages([
                    'amount_paid' => 'The payment cannot exceed the remaining balance of $'.number_format($remaining, 2).'.',
                ]);
            }

            if ($amountPaid >= $remaining) {
                throw ValidationException::withMessages([
                    'amount_paid' => 'This amount settles the full balance. Mark the order as paid instead.',
                ]);
            }
        }

        DB::transaction(function () use ($order, $validated, $remaining): void {
            $status = $validated['payment_status'];

            if ($status === 'paid') {
                if ($remaining > 0) {
                    $order->payments()->create([
                        'method' => 'cash',
                        'amount' => $remaining,
                        'status' => 'paid',
                        'paid_at' => now(),
                    ]);
                }
            } elseif ($status === 'partial') {
                $order->payments()->create([
                    'method' => 'cash',
                    'amount' => (float) $validated['amount_paid'],
                    'status' => 'partial',
                    'paid_at' => now(),
                ]);
            } elseif ($status === 'refunded') {
                $order->payments()->latest('id')->first()?->update([
                    'status' => 'refunded',
                    'paid_at' => null,
                ]);
            } else {
                $order->payments()->update(['status' => $status]);
            }

            $order->update(['payment_status' => $status]);
        });

        ActivityLog::log('payment_status', "Payment status for order #{$order->order_number} changed to {$validated['payment_status']}.");

        return redirect()->back()->with('success', 'Payment status updated successfully.');
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
