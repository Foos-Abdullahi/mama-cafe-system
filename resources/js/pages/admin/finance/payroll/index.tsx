import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { StatsCard, StatSection } from '@/components/tools/StatsCard';
import { DataTable } from '@/components/tools/table/main-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { Wallet, DollarSign, Eye, Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface WaitressCommission {
    id: number;
    name: string;
    phone: string | null;
    commission_rate: number;
    total_orders: number;
    total_sales: number;
    earned_commission: number;
    paid_commission: number;
    unpaid_commission: number;
}

interface PayoutHistory {
    id: number;
    waitress_id: number;
    waitress_name: string;
    period_start: string;
    period_end: string;
    total_orders: number;
    total_sales: number;
    commission_rate: number;
    commission_amount: number;
    status: string;
    paid_at: string;
    notes: string | null;
}

interface Props {
    waitresses: WaitressCommission[];
    payoutHistory: PayoutHistory[];
    stats: StatSection[];
}

export default function PayrollIndex({ waitresses, payoutHistory, stats }: Props) {
    const columns: ColumnDef<WaitressCommission>[] = [
        {
            accessorKey: 'name',
            header: 'Waitress Name',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#823d21]/10 text-[#823d21] font-semibold text-xs">
                        {row.original.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <span className="font-semibold text-foreground block">{row.original.name}</span>
                        <span className="text-xs text-muted-foreground">{row.original.phone || 'No phone'}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'total_orders',
            header: 'Orders Handled',
            cell: ({ row }) => <span className="font-medium text-xs">{row.original.total_orders} Orders</span>,
        },
        {
            accessorKey: 'total_sales',
            header: 'Total Sales Generated',
            cell: ({ row }) => (
                <span className="font-mono font-bold text-sm text-foreground">
                    ${Number(row.original.total_sales).toFixed(2)}
                </span>
            ),
        },
        {
            accessorKey: 'earned_commission',
            header: '15% Commission Earned',
            cell: ({ row }) => (
                <span className="font-mono font-bold text-sm text-emerald-600">
                    ${Number(row.original.earned_commission).toFixed(2)}
                </span>
            ),
        },
        {
            accessorKey: 'unpaid_commission',
            header: 'Unpaid Commission Balance',
            cell: ({ row }) => {
                const unpaid = Number(row.original.unpaid_commission);
                return (
                    <Badge variant={unpaid > 0 ? 'default' : 'secondary'} className={unpaid > 0 ? 'bg-amber-500/10 text-amber-700 font-bold border-amber-500/20' : ''}>
                        ${unpaid.toFixed(2)}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: () => <span className="text-right block">Action</span>,
            cell: ({ row }) => {
                const w = row.original;
                return (
                    <div className="text-right">
                        <Link href={`/finance/payroll/create?waitress_id=${w.id}`}>
                            <Button
                                size="sm"
                                className="bg-[#823d21] hover:bg-[#682e18] text-xs gap-1.5"
                            >
                                <DollarSign className="h-3.5 w-3.5" /> Process Payout
                            </Button>
                        </Link>
                    </div>
                );
            },
        },
    ];

    const historyColumns: ColumnDef<PayoutHistory>[] = [
        {
            accessorKey: 'id',
            header: 'Payout ID',
            cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">#PAYROLL-{row.original.id}</span>,
        },
        {
            accessorKey: 'waitress_name',
            header: 'Waitress',
            cell: ({ row }) => <span className="font-medium text-xs text-foreground">{row.original.waitress_name}</span>,
        },
        {
            accessorKey: 'period',
            header: 'Period',
            cell: ({ row }) => (
                <span className="font-mono text-xs text-muted-foreground">
                    {row.original.period_start} to {row.original.period_end}
                </span>
            ),
        },
        {
            accessorKey: 'commission_amount',
            header: 'Payout Amount',
            cell: ({ row }) => (
                <span className="font-mono font-bold text-sm text-emerald-600">
                    ${Number(row.original.commission_amount).toFixed(2)}
                </span>
            ),
        },
        {
            accessorKey: 'paid_at',
            header: 'Payout Date',
            cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.paid_at}</span>,
        },
        {
            id: 'actions',
            header: () => <span className="text-right block">Receipt</span>,
            cell: ({ row }) => (
                <div className="text-right">
                    <Link href={`/finance/payroll/${row.original.id}`}>
                        <Button size="sm" variant="ghost" className="h-8 text-xs gap-1 text-blue-600">
                            <Eye className="h-3.5 w-3.5" /> View Slip
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Payroll & Commissions - MaMa Café" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">Payroll & Staff Commissions</h1>
                        <p className="text-xs text-muted-foreground">
                            Calculate automatic 15% waitress commissions, process staff payouts, and log commission history.
                        </p>
                    </div>
                    <Button asChild size={'sm'}>
                        <Link href="/finance/payroll/create">
                            <Plus className="h-4 w-4" />
                            Process
                            <span className="hidden sm:inline">Payout</span>
                        </Link>
                    </Button>
                </div>

                {/* KPI Stats */}
                <StatsCard sections={stats} />

                {/* Tables Container */}
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-in-out">
                    <DataTable
                        title="Staff Commission Ledger (15% Rate)"
                        searchTitle="Filter waitress by name..."
                        columns={columns}
                        data={waitresses}
                    />

                    <div className="pt-2">
                        <DataTable
                            title="Historical Payout Records"
                            searchTitle="Filter payout logs..."
                            columns={historyColumns}
                            data={payoutHistory}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

PayrollIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Finance & Reports', href: '/finance/payroll' },
            { title: 'Payroll', href: '/finance/payroll' },
        ]}
    >
        {page}
    </AppLayout>
);
