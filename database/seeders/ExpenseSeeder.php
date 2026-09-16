<?php

namespace Database\Seeders;

use App\Models\Expense;
use Illuminate\Database\Seeder;

class ExpenseSeeder extends Seeder
{
    public function run(): void
    {
        $expenses = [
            ['item' => 'Fresh Milk', 'category' => 'Ingredients', 'amount' => 4.00, 'purchased_at' => '2026-09-16', 'vendor' => 'Local Market', 'notes' => 'Daily milk supply.'],
            ['item' => 'Coffee Beans', 'category' => 'Ingredients', 'amount' => 28.50, 'purchased_at' => '2026-09-15', 'vendor' => 'Bean House', 'notes' => 'Medium roast beans for espresso service.'],
            ['item' => 'Paper Cups', 'category' => 'Supplies', 'amount' => 12.00, 'purchased_at' => '2026-09-14', 'vendor' => 'Cafe Supplies Co.', 'notes' => 'Takeaway cups and lids.'],
        ];

        foreach ($expenses as $expense) {
            Expense::updateOrCreate(
                ['item' => $expense['item'], 'purchased_at' => $expense['purchased_at']],
                $expense
            );
        }
    }
}
