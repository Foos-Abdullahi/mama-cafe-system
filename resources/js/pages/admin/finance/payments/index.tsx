import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { StatsCard, StatSection } from '@/components/tools/StatsCard';
import { DataTable } from '@/components/tools/table/main-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { CreditCard, Receipt, Eye, Filter } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Payment {
    id: number;
    order_id: number;
    order_number: string;
    method: 'cash' | 'mobile_money' | 'card' | 'credit';
    amount: number;
    status: 'paid' | 'partial' | 'unpaid' | 'refunded';
    reference: string | null;
    waitress_name: string;
    paid_at: string;
}

interface Props {
    payments: Payment[];
    stats: StatSection[];
    filters: {
        method?: string;
        status?: string;
    };
}

const methodBadges: Record<string, { label: string; class: string }> = {
    cash: { label: 'Cash', class: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' },
    mobile_money: { label: 'Mobile Money', class: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' },
    card: { label: 'Card', class: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20' },
    credit: { label: 'Credit', class: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' },
};

export default function PaymentsIndex({ payments, stats, filters }: Props) {
    const [selectedMethod, setSelectedMethod] = useState(filters.method || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const handleFilterChange = (method: string, status: string) => {
        setSelectedMethod(method);
        setSelectedStatus(status);
        router.get(
            '/finance/payments',
            { method: method || undefined, status: status || undefined },
            { preserveState: true, replace: true }
        );
    };

    const columns: ColumnDef<Payment>[] = [
        {
            accessorKey: 'id',
            header: 'Payment ID',
            cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">#PAY-{row.original.id}</span>,
        },
        {
            accessorKey: 'order_number',
            header: 'Order #',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-[#823d21]" />
                    <Link href={`/management/orders/${row.original.order_id}`} className="font-mono font-bold text-xs hover:underline text-foreground">
                        {row.original.order_number}
                    </Link>
                </div>
            ),
        },
        {
            accessorKey: 'waitress_name',
            header: 'Waitress',
            cell: ({ row }) => <span className="text-xs font-medium">{row.original.waitress_name}</span>,
        },
        {
            accessorKey: 'method',
            header: 'Method',
            cell: ({ row }) => {
                const m = methodBadges[row.original.method] || { label: row.original.method, class: '' };
                return <Badge className={`uppercase text-[10px] ${m.class}`}>{m.label}</Badge>;
            },
        },
        {
            accessorKey: 'amount',
            header: 'Amount Paid',
            cell: ({ row }) => (
                <span className="font-mono font-bold text-sm text-foreground">
                    ${Number(row.original.amount).toFixed(2)}
                </span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const isPaid = row.original.status === 'paid';
                return (
                    <Badge className={isPaid ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-700'}>
                        {row.original.status.toUpperCase()}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'paid_at',
            header: 'Date & Time',
            cell: ({ row }) => <span className="text-xs text-muted-foreground font-mono">{row.original.paid_at}</span>,
        },
        {
            id: 'actions',
            header: () => <span className="text-right block">Action</span>,
            cell: ({ row }) => (
                <div className="text-right">
                    <Link href={`/management/orders/${row.original.order_id}`}>
                        <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs text-blue-600 hover:text-blue-700">
                            <Eye className="h-3.5 w-3.5" /> Order Receipt
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Payments Tracking - MaMa Café" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">Payments Tracking</h1>
                        <p className="text-xs text-muted-foreground">
                            Monitor transactions, payment methods, digital money receipts, and customer credit.
                        </p>
                    </div>
                </div>

                {/* KPI Stats */}
                <StatsCard sections={stats} />

                {/* Filter Toolbar & DataTable */}
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-in-out">
                  
                    <DataTable
                        title="Payment Transactions"
                        searchTitle="Filter by order # or waitress..."
                        columns={columns}
                        data={payments}
                    />
                </div>
            </div>
        </>
    );
}

PaymentsIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Finance & Reports', href: '/finance/payments' },
            { title: 'Payments', href: '/finance/payments' },
        ]}
    >
        {page}
    </AppLayout>
);
