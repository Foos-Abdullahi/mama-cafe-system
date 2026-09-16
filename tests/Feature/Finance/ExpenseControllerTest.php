<?php

use App\Models\Expense;
use App\Models\User;

test('authenticated user can complete expense crud', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('finance.expenses.index'))->assertOk();
    $this->actingAs($user)->get(route('finance.expenses.create'))->assertOk();

    $this->actingAs($user)->post(route('finance.expenses.store'), [
        'item' => 'Fresh Milk',
        'category' => 'Ingredients',
        'amount' => 4.00,
        'purchased_at' => '2026-09-16',
        'vendor' => 'Local Market',
        'notes' => 'Daily supply',
        'status' => 'paid',
    ])->assertRedirect(route('finance.expenses.index'));

    $expense = Expense::where('item', 'Fresh Milk')->firstOrFail();
    $this->assertDatabaseHas('expenses', ['id' => $expense->id, 'item' => 'Fresh Milk', 'amount' => 4.00]);

    $this->actingAs($user)->get(route('finance.expenses.show', $expense))->assertOk();
    $this->actingAs($user)->put(route('finance.expenses.update', $expense), [
        'item' => 'Oat Milk',
        'category' => 'Ingredients',
        'amount' => 6.50,
        'purchased_at' => '2026-09-16',
        'vendor' => 'Local Market',
        'notes' => null,
        'status' => 'pending',
    ])->assertRedirect(route('finance.expenses.index'));

    $this->assertDatabaseHas('expenses', ['id' => $expense->id, 'item' => 'Oat Milk', 'amount' => 6.50]);
    $this->actingAs($user)->delete(route('finance.expenses.destroy', $expense))->assertRedirect(route('finance.expenses.index'));
    $this->assertDatabaseMissing('expenses', ['id' => $expense->id]);
});

test('expense creation validates required purchase details', function () {
    $response = $this->actingAs(User::factory()->create())->post(route('finance.expenses.store'), [
        'item' => 'Milk',
        'category' => 'Ingredients',
    ]);

    $response->assertSessionHasErrors(['amount', 'purchased_at']);
});
