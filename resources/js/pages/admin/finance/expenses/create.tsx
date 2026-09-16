import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Receipt } from 'lucide-react';
import React from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

export default function ExpenseCreate() {
    const form = useForm({
        item: '',
        category: '',
        amount: '',
        purchased_at: new Date().toISOString().slice(0, 10),
        vendor: '',
        notes: '',
        status: 'paid' as 'paid' | 'pending',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.post('/finance/expenses');
    };

    return (
        <>
            <Head title="Add Expense - MaMa Café" />
            <ExpenseForm
                title="Add Expense"
                description="Record a cafe purchase such as milk, coffee beans, or supplies."
                form={form}
                submit={submit}
                submitLabel="Save Expense"
            />
        </>
    );
}

export function ExpenseForm({
    title,
    description,
    form,
    submit,
    submitLabel,
}: {
    title: string;
    description: string;
    form: ReturnType<typeof useForm>;
    submit: (event: React.FormEvent) => void;
    submitLabel: string;
}) {
    return (
        <div className="flex animate-in flex-col gap-6 p-4 duration-300 fade-in slide-in-from-bottom-3 md:p-6">
            <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                        <Receipt className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight md:text-xl">
                            {title}
                        </h1>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>
                <Link href="/finance/expenses">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Expenses
                    </Button>
                </Link>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs md:p-6">
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Field
                            label="What was purchased?"
                            error={form.errors.item}
                        >
                            <Input
                                value={form.data.item}
                                onChange={(e) =>
                                    form.setData('item', e.target.value)
                                }
                                required
                                autoFocus
                                placeholder="e.g. Fresh Milk"
                            />
                        </Field>
                        <Field label="Amount (USD)" error={form.errors.amount}>
                            <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={form.data.amount}
                                onChange={(e) =>
                                    form.setData('amount', e.target.value)
                                }
                                required
                                placeholder="4.00"
                            />
                        </Field>
                        <Field
                            label="Expense Type"
                            error={form.errors.category}
                        >
                            <Input
                                value={form.data.category}
                                onChange={(e) =>
                                    form.setData('category', e.target.value)
                                }
                                required
                                placeholder="e.g. Ingredients, Supplies"
                            />
                        </Field>
                        <Field
                            label="Purchase Date"
                            error={form.errors.purchased_at}
                        >
                            <Input
                                type="date"
                                value={form.data.purchased_at}
                                onChange={(e) =>
                                    form.setData('purchased_at', e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field label="Vendor" error={form.errors.vendor}>
                            <Input
                                value={form.data.vendor}
                                onChange={(e) =>
                                    form.setData('vendor', e.target.value)
                                }
                                placeholder="e.g. Local Market"
                            />
                        </Field>
                        <Field label="Status" error={form.errors.status}>
                            <Select
                                value={form.data.status}
                                onValueChange={(value) =>
                                    form.setData(
                                        'status',
                                        value as 'paid' | 'pending',
                                    )
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <div className="grid gap-2 md:col-span-2">
                            <Label>Notes</Label>
                            <Textarea
                                value={form.data.notes}
                                onChange={(e) =>
                                    form.setData('notes', e.target.value)
                                }
                                placeholder="Optional purchase details"
                            />
                            <InputError message={form.errors.notes} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 border-t border-border pt-4">
                        <Link href="/finance/expenses">
                            <Button type="button" variant="outline" size="sm">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={form.processing}
                            className="min-w-[120px] bg-[#823d21] text-white hover:bg-[#682e18]"
                        >
                            {form.processing ? 'Saving...' : submitLabel}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="grid gap-2">
            <Label>
                {label} <span className="text-red-500">*</span>
            </Label>
            {children}
            <InputError message={error} />
        </div>
    );
}

ExpenseCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Finance & Reports', href: '/finance/expenses' },
            { title: 'Expenses', href: '/finance/expenses' },
            { title: 'Add Expense', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
