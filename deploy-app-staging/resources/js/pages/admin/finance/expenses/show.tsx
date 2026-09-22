import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Edit,
    FileText,
    Receipt as ReceiptIcon,
    Store,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

interface Expense {
    id: number;
    item: string;
    category: string;
    amount: number;
    purchased_at: string;
    vendor: string | null;
    notes: string | null;
    created_at: string | null;
    status: 'paid' | 'pending';
}

export default function ExpenseShow({ expense }: { expense: Expense }) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteExpense = () => {
        setIsDeleting(true);
        router.delete(`/finance/expenses/${expense.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setConfirmOpen(false);
            },
        });
    };

    return (
        <>
            <Head title={`${expense.item} - Expense`} />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-semibold md:text-xl">
                                {expense.item}
                            </h1>
                            <Badge variant="outline">{expense.category}</Badge>
                            <Badge
                                className={
                                    expense.status === 'paid'
                                        ? 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400'
                                        : 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400'
                                }
                            >
                                {expense.status === 'paid' ? 'Paid' : 'Pending'}
                            </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Purchase record created{' '}
                            {expense.created_at || 'recently'}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link href={`/finance/expenses/${expense.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Edit className="h-3.5 w-3.5" />
                                Edit Expense
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConfirmOpen(true)}
                            className="text-destructive hover:bg-destructive/10"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </Button>
                        <Link href="/finance/expenses">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
                    <section className="rounded-xl border border-border bg-card p-5 shadow-xs">
                        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Amount Paid
                        </p>
                        <p className="mt-2 font-mono text-3xl font-bold text-amber-700 dark:text-amber-400">
                            ${Number(expense.amount).toFixed(2)}
                        </p>
                        <div className="mt-6 space-y-4">
                            <Summary
                                icon={<Calendar />}
                                label="Purchase Date"
                                value={expense.purchased_at}
                            />
                            <Summary
                                icon={<Store />}
                                label="Vendor"
                                value={expense.vendor || 'Not recorded'}
                            />
                            <Summary
                                icon={<FileText />}
                                label="Expense Type"
                                value={expense.category}
                            />
                            <Summary
                                icon={<FileText />}
                                label="Payment Status"
                                value={
                                    expense.status === 'paid'
                                        ? 'Paid'
                                        : 'Pending'
                                }
                            />
                        </div>
                    </section>
                    <section className="rounded-xl border border-border bg-card p-5 shadow-xs">
                        <h2 className="border-b border-border pb-3 font-semibold">
                            Purchase Information
                        </h2>
                        <div className="flex gap-3 pt-4">
                            <FileText className="mt-0.5 h-4 w-4 text-[#823d21]" />
                            <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                                {expense.notes ||
                                    'No notes have been added for this purchase.'}
                            </p>
                        </div>
                        <div className="mt-6 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
                            <Summary
                                icon={<Calendar />}
                                label="Recorded On"
                                value={expense.created_at || 'Not recorded'}
                            />
                            <Summary
                                icon={<ReceiptIcon />}
                                label="Record ID"
                                value={`#EXPENSE-${expense.id}`}
                            />
                        </div>
                    </section>
                </div>
            </div>
            <ConfirmDeleteDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                onConfirm={deleteExpense}
                title={`Delete Expense "${expense.item}"`}
                description="Are you sure you want to delete this expense? This action cannot be undone."
                isDeleting={isDeleting}
            />
        </>
    );
}

function Summary({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 text-[#823d21] [&>svg]:h-4 [&>svg]:w-4">
                {icon}
            </span>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    );
}

ExpenseShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Finance & Reports', href: '/finance/expenses' },
            { title: 'Expenses', href: '/finance/expenses' },
            { title: 'Expense Details', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
