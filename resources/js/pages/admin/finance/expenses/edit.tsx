import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { ExpenseForm } from './create';

interface Expense {
    id: number;
    item: string;
    category: string;
    amount: number;
    purchased_at: string;
    vendor: string | null;
    notes: string | null;
}

interface Props {
    expense: Expense;
    categories: string[];
}

export default function ExpenseEdit({ expense, categories }: Props) {
    const form = useForm({
        item: expense.item,
        category: expense.category,
        amount: String(expense.amount),
        purchased_at: expense.purchased_at,
        vendor: expense.vendor ?? '',
        notes: expense.notes ?? '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.put(`/finance/expenses/${expense.id}`);
    };

    return (
        <>
            <Head title={`Edit ${expense.item} - MaMa Café`} />
            <ExpenseForm
                title="Edit Expense"
                description={`Update the purchase record for ${expense.item}.`}
                form={form}
                categories={categories}
                submit={submit}
                submitLabel="Save Changes"
            />
        </>
    );
}

ExpenseEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Finance & Reports', href: '/finance/expenses' },
            { title: 'Expenses', href: '/finance/expenses' },
            { title: 'Edit Expense', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
