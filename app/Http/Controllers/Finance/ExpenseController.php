<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Expense;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    private const CATEGORIES = ['Supplies', 'Ingredients', 'Equipment', 'Utilities', 'Transport', 'Other'];

    public function index(): Response
    {
        $expenses = Expense::query()
            ->latest('purchased_at')
            ->latest('id')
            ->get()
            ->map(fn (Expense $expense) => $this->present($expense));

        $totalAmount = Expense::sum('amount');
        $thisMonthAmount = Expense::where('purchased_at', '>=', now()->startOfMonth()->toDateString())->sum('amount');

        $stats = [
            ['title' => 'Total Expenses', 'value' => '$'.number_format((float) $totalAmount, 2), 'change' => 'All recorded purchases', 'trend' => 'up'],
            ['title' => 'This Month', 'value' => '$'.number_format((float) $thisMonthAmount, 2), 'change' => 'Purchases this month', 'trend' => 'up'],
            ['title' => 'Purchase Records', 'value' => (string) $expenses->count(), 'change' => 'Logged expenses', 'trend' => 'up'],
            ['title' => 'Categories Used', 'value' => (string) $expenses->pluck('category')->unique()->count(), 'change' => 'Expense categories', 'trend' => 'up'],
        ];

        return Inertia::render('admin/finance/expenses/index', ['expenses' => $expenses, 'stats' => $stats]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/finance/expenses/create', ['categories' => self::CATEGORIES]);
    }

    public function store(Request $request): RedirectResponse
    {
        $expense = Expense::create($this->validated($request));
        ActivityLog::log('expense_create', "Expense '{$expense->item}' of \${$expense->amount} was recorded.");

        return redirect()->route('finance.expenses.index')->with('success', 'Expense recorded successfully.');
    }

    public function show(Expense $expense): Response
    {
        return Inertia::render('admin/finance/expenses/show', ['expense' => $this->present($expense)]);
    }

    public function edit(Expense $expense): Response
    {
        return Inertia::render('admin/finance/expenses/edit', ['expense' => $this->present($expense), 'categories' => self::CATEGORIES]);
    }

    public function update(Request $request, Expense $expense): RedirectResponse
    {
        $expense->update($this->validated($request));
        ActivityLog::log('expense_update', "Expense '{$expense->item}' details were updated.");

        return redirect()->route('finance.expenses.index')->with('success', 'Expense updated successfully.');
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        $item = $expense->item;
        $expense->delete();
        ActivityLog::log('expense_delete', "Expense '{$item}' was deleted.");

        return redirect()->route('finance.expenses.index')->with('success', 'Expense deleted successfully.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'item' => ['required', 'string', 'min:2', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'amount' => ['required', 'numeric', 'min:0.01', 'max:99999999.99'],
            'purchased_at' => ['required', 'date'],
            'vendor' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
    }

    private function present(Expense $expense): array
    {
        return [
            'id' => $expense->id,
            'item' => $expense->item,
            'category' => $expense->category,
            'amount' => (float) $expense->amount,
            'purchased_at' => $expense->purchased_at->format('Y-m-d'),
            'vendor' => $expense->vendor,
            'notes' => $expense->notes,
            'created_at' => $expense->created_at?->format('Y-m-d'),
        ];
    }
}
