import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, MoreHorizontal, Plus, Receipt, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import { StatsCard } from '@/components/tools/StatsCard';
import type { StatSection } from '@/components/tools/StatsCard';
import { DataTable } from '@/components/tools/table/main-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';

interface Expense {
    id: number;
    item: string;
    category: string;
    amount: number;
    purchased_at: string;
    vendor: string | null;
    notes: string | null;
    status: 'paid' | 'pending';
}

interface Props {
    expenses: Expense[];
    stats: StatSection[];
}

export default function ExpensesIndex({ expenses, stats }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setIsDeleting(true);
        router.delete(`/finance/expenses/${deleteTarget.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    const columns: ColumnDef<Expense>[] = [
        {
            accessorKey: 'item',
            header: 'Purchase',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#823d21]/10 text-[#823d21]">
                        <Receipt className="h-4 w-4" />
                    </div>
                    <div>
                        <span className="block font-semibold text-foreground">
                            {row.original.item}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {row.original.vendor || 'No vendor recorded'}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'category',
            header: 'Expense Type',
            cell: ({ row }) => (
                <Badge variant="outline">{row.original.category}</Badge>
            ),
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => (
                <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-400">
                    ${Number(row.original.amount).toFixed(2)}
                </span>
            ),
        },
        {
            accessorKey: 'purchased_at',
            header: 'Purchase Date',
            cell: ({ row }) => (
                <span className="font-mono text-xs text-muted-foreground">
                    {row.original.purchased_at}
                </span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge
                    className={
                        row.original.status === 'paid'
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400'
                            : 'border-amber-500/20 bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400'
                    }
                >
                    {row.original.status === 'paid' ? 'Paid' : 'Pending'}
                </Badge>
            ),
        },
        {
            id: 'actions',
            header: () => <span className="block text-right">Actions</span>,
            cell: ({ row }) => (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/finance/expenses/${row.original.id}`}
                                    className="flex cursor-pointer items-center"
                                >
                                    <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                    View Expense
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/finance/expenses/${row.original.id}/edit`}
                                    className="flex cursor-pointer items-center"
                                >
                                    <Edit className="mr-2 h-4 w-4 text-amber-600" />
                                    Edit Expense
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setDeleteTarget(row.original)}
                                className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Expense
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Cafe Expenses - MaMa Café" />
            <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-lg font-semibold">Cafe Expenses</h1>
                        <p className="text-xs text-muted-foreground">
                            Record milk, coffee, supplies, and other purchases
                            made for the cafe.
                        </p>
                    </div>
                    <Button asChild size="sm">
                        <Link href="/finance/expenses/create">
                            <Plus className="h-4 w-4" />
                            Add{' '}
                            <span className="hidden sm:inline">Expense</span>
                        </Link>
                    </Button>
                </div>
                <StatsCard sections={stats} />
                <div className="mt-6 animate-in duration-1000 ease-in-out fade-in slide-in-from-bottom-6">
                    <DataTable
                        title="Expense Ledger"
                        searchTitle="Filter purchases by item..."
                        columns={columns}
                        data={expenses}
                    />
                </div>
            </div>
            <ConfirmDeleteDialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                onConfirm={handleDelete}
                title={
                    deleteTarget
                        ? `Delete Expense "${deleteTarget.item}"`
                        : 'Confirm Deletion'
                }
                description="Are you sure you want to delete this expense? This action cannot be undone."
                isDeleting={isDeleting}
            />
        </>
    );
}

ExpensesIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Finance & Reports', href: '/finance/expenses' },
            { title: 'Expenses', href: '/finance/expenses' },
        ]}
    >
        {page}
    </AppLayout>
);
