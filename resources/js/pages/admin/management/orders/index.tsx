import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { StatsCard, StatSection } from '@/components/tools/StatsCard';
import { DataTable } from '@/components/tools/table/main-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import {
    Plus,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    Hash,
    Receipt,
    CheckCircle,
    XCircle,
    RefreshCw,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Product {
    id: number;
    name: string;
    price: number | string;
}

interface Waitress {
    id: number;
    name: string;
}

interface OrderItem {
    id?: number;
    product_id: number;
    product?: Product;
    quantity: number;
    unit_price: number | string;
    line_total: number | string;
}

interface Payment {
    id?: number;
    amount: number | string;
    method: string;
    status: string;
}

interface Order {
    id: number;
    order_number: string;
    fixed_number: number | null;
    waitress_id: number | null;
    waitress?: Waitress;
    order_type: 'dine_in' | 'takeaway';
    subtotal: number | string;
    total: number | string;
    status: 'draft' | 'completed' | 'cancelled' | 'refunded';
    payment_status: 'paid' | 'partial' | 'unpaid' | 'refunded';
    items: OrderItem[];
    payments?: Payment[];
    created_at?: string;
}

interface Props {
    orders: Order[];
    products: Product[];
    waitresses: Waitress[];
    stats: StatSection[];
}

export default function OrdersIndex({ orders, stats }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this order record?')) {
            router.delete(`/management/orders/${id}`);
        }
    };

    const columns: ColumnDef<Order>[] = [
        {
            accessorKey: 'order_number',
            header: 'Order #',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-[#823d21]" />
                    <span className="font-mono font-bold text-foreground text-xs">{row.original.order_number}</span>
                </div>
            ),
        },
        {
            accessorKey: 'fixed_number',
            header: 'Fixed #',
            cell: ({ row }) => (
                <Badge variant="outline" className="font-mono text-xs bg-amber-500/10 text-amber-900 dark:text-amber-300 border-amber-500/20">
                    <Hash className="h-3 w-3 mr-0.5" /> {row.original.fixed_number || 'N/A'}
                </Badge>
            ),
        },
        {
            accessorKey: 'waitress',
            header: 'Waitress',
            cell: ({ row }) => (
                <span className="font-medium text-xs text-foreground">
                    {row.original.waitress?.name || 'Walk-in'}
                </span>
            ),
        },
        {
            accessorKey: 'order_type',
            header: 'Type',
            cell: ({ row }) => (
                <Badge variant="secondary" className="capitalize text-xs font-semibold">
                    {row.original.order_type === 'dine_in' ? 'Dine In' : 'Takeaway'}
                </Badge>
            ),
        },
        {
            accessorKey: 'total',
            header: 'Total Price',
            cell: ({ row }) => {
                const total = Number(row.original.total);
                const paid = row.original.payments?.[0]?.amount ? Number(row.original.payments[0].amount) : 0;
                const balance = total - paid;
                const isPartial = row.original.payment_status === 'partial';

                return (
                    <div>
                        <span className="font-mono font-bold text-sm text-foreground block">
                            ${total.toFixed(2)}
                        </span>
                        {isPartial && (
                            <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                                Paid: ${paid.toFixed(2)} (Rem: ${balance > 0 ? balance.toFixed(2) : '0.00'})
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'payment_status',
            header: 'Payment',
            cell: ({ row }) => {
                const ps = row.original.payment_status;
                const variants: Record<string, string> = {
                    paid: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
                    partial: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
                    unpaid: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
                    refunded: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
                };
                return <Badge className={`uppercase text-[10px] ${variants[ps] || ''}`}>{ps}</Badge>;
            },
        },
        {
            accessorKey: 'status',
            header: 'Order Status',
            cell: ({ row }) => {
                const s = row.original.status;
                const icons: Record<string, any> = {
                    completed: CheckCircle,
                    draft: RefreshCw,
                    cancelled: XCircle,
                    refunded: RefreshCw,
                };
                const Icon = icons[s] || CheckCircle;
                return (
                    <div className="flex items-center gap-1.5 capitalize text-xs font-semibold">
                        <Icon className="h-3.5 w-3.5" />
                        <span>{s}</span>
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: () => <span className="text-right block">Actions</span>,
            cell: ({ row }) => {
                const order = row.original;
                return (
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
                                    <Link href={`/management/orders/${order.id}`} className="flex items-center cursor-pointer">
                                        <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                        View Receipt & Details
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/management/orders/${order.id}/edit`} className="flex items-center cursor-pointer">
                                        <Edit className="mr-2 h-4 w-4 text-amber-600" />
                                        Edit Order & Products
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(order.id)} className="text-red-600 focus:text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Order
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Orders Management - MaMa Café" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Orders Management</h1>
                        <p className="text-sm text-muted-foreground">
                            Track live café transactions, order receipts, waitress fixed numbers, and payment history.
                        </p>
                    </div>
                    <Link href="/management/orders/create">
                        <Button className="bg-[#823d21] hover:bg-[#682e18] text-white font-semibold flex items-center gap-2 shadow-sm">
                            <Plus className="h-4 w-4" /> New Order
                        </Button>
                    </Link>
                </div>

                <StatsCard sections={stats} />

                <DataTable
                    title="Orders"
                    searchTitle="Filter orders by number..."
                    columns={columns}
                    data={orders}
                />
            </div>
        </>
    );
}

OrdersIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/orders' },
            { title: 'Orders', href: '/management/orders' },
        ]}
    >
        {page}
    </AppLayout>
);
