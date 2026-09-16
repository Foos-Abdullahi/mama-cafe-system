<?php

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

function createReportOrder(string $status = 'completed', ?string $completedAt = null): void
{
    Order::create([
        'order_number' => 'ORD-'.Str::random(8),
        'fixed_number' => random_int(1, 9999),
        'order_type' => 'dine_in',
        'subtotal' => 25,
        'discount' => 0,
        'tax' => 0,
        'total' => 25,
        'status' => $status,
        'payment_status' => $status === 'completed' ? 'paid' : 'pending',
        'completed_at' => $completedAt ?? now(),
    ]);
}

test('authenticated user can view sales reports page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('finance.reports.index'));

    $response->assertOk();
});

test('orders report defaults to a seven day weekly period', function () {
    $this->actingAs(User::factory()->create());

    createReportOrder();
    createReportOrder();
    createReportOrder('pending');

    $this->get(route('finance.reports.index'))
        ->assertOk()
        ->assertInertia(function (Assert $page) {
            $page->component('admin/finance/reports/index')
                ->where('orderReportChart.period', 'weekly')
                ->has('orderReportChart.series', 7)
                ->where('orderReportChart.series.6.orders', 2);
        });
});

test('orders report buckets completed orders by the requested period', function (string $period, int $bucketCount) {
    $this->actingAs(User::factory()->create());

    createReportOrder();

    $this->get(route('finance.reports.index', ['period' => $period]))
        ->assertOk()
        ->assertInertia(function (Assert $page) use ($period, $bucketCount) {
            $page->component('admin/finance/reports/index')
                ->where('orderReportChart.period', $period)
                ->has('orderReportChart.series', $bucketCount);
        });
})->with([
    'weekly' => ['weekly', 7],
    'monthly' => ['monthly', 30],
    'yearly' => ['yearly', 12],
]);

test('orders report falls back to weekly for an invalid period', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('finance.reports.index', ['period' => 'daily']))
        ->assertOk()
        ->assertInertia(function (Assert $page) {
            $page->component('admin/finance/reports/index')
                ->where('orderReportChart.period', 'weekly')
                ->has('orderReportChart.series', 7);
        });
});
