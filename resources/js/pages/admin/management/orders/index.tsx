import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { StatsCard, StatSection } from '@/components/tools/StatsCard';
import { DataTable } from '@/components/tools/table/main-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
    ShoppingBag,
    Hash,
    Receipt,
    Trash,
    CheckCircle,
    XCircle,
    RefreshCw,
} from 'lucide-react';

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

interface Order {
    id: number;
    order_number: string;
    fixed_number: number | null;
    waitress_id: number | null;
    waitress?: Waitress;
    order_type: 'dine_in' | 'takeaway';
    subtotal: number | string;
    discount: number | string;
    tax: number | string;
    total: number | string;
    status: 'draft' | 'completed' | 'cancelled' | 'refunded';
    payment_status: 'paid' | 'partial' | 'unpaid' | 'refunded';
    items: OrderItem[];
    created_at?: string;
}

interface Props {
    orders: Order[];
    products: Product[];
    waitresses: Waitress[];
    stats: StatSection[];
}

export default function OrdersIndex({ orders, products, waitresses, stats }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [updatingOrder, setUpdatingOrder] = useState<Order | null>(null);
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

    // Dynamic item list for new order creation
    const [selectedItems, setSelectedItems] = useState<{ product_id: number; quantity: number }[]>([
        { product_id: products[0]?.id || 1, quantity: 1 },
    ]);

    // Create Form
    const createForm = useForm({
        waitress_id: waitresses[0]?.id ? String(waitresses[0].id) : '',
        fixed_number: '101',
        order_type: 'dine_in' as 'dine_in' | 'takeaway',
        status: 'completed' as any,
        payment_status: 'paid' as any,
        payment_method: 'cash' as any,
        items: [] as any[],
    });

    // Update Form
    const updateForm = useForm({
        status: 'completed' as any,
        payment_status: 'paid' as any,
        reason: '',
    });

    const addItemRow = () => {
        if (products.length === 0) return;
        setSelectedItems([...selectedItems, { product_id: products[0].id, quantity: 1 }]);
    };

    const removeItemRow = (index: number) => {
        if (selectedItems.length <= 1) return;
        setSelectedItems(selectedItems.filter((_, i) => i !== index));
    };

    const updateItemRow = (index: number, field: 'product_id' | 'quantity', value: number) => {
        const updated = [...selectedItems];
        updated[index][field] = value;
        setSelectedItems(updated);
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.setData('items', selectedItems);
        createForm.post('/management/orders', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                setSelectedItems([{ product_id: products[0]?.id || 1, quantity: 1 }]);
            },
        });
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!updatingOrder) return;
        updateForm.put(`/management/orders/${updatingOrder.id}`, {
            onSuccess: () => {
                setUpdatingOrder(null);
            },
        });
    };

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
            cell: ({ row }) => (
                <span className="font-mono font-bold text-sm text-foreground">
                    ${Number(row.original.total).toFixed(2)}
                </span>
            ),
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
                                <DropdownMenuItem onClick={() => setViewingOrder(order)}>
                                    <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                    View Receipt & Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setUpdatingOrder(order);
                                        updateForm.setData({
                                            status: order.status,
                                            payment_status: order.payment_status,
                                            reason: '',
                                        });
                                    }}
                                >
                                    <Edit className="mr-2 h-4 w-4 text-amber-600" />
                                    Update Status / Cancel
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(order.id)}>
                                    <Trash2 className="mr-2 h-4 w-4 text-red-600" />
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
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Orders Management</h1>
                        <p className="text-sm text-muted-foreground">
                            Track live café transactions, order receipts, waitress fixed numbers, and payment history.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-[#823d21] hover:bg-[#682e18] text-white font-semibold flex items-center gap-2 shadow-sm"
                    >
                        <Plus className="h-4 w-4" /> Create New Order
                    </Button>
                </div>

                {/* Stats Section */}
                <StatsCard sections={stats} />

                {/* Main Data Table */}
                <DataTable
                    title="Cafe Transactions"
                    searchTitle="Search orders by number or waitress..."
                    columns={columns}
                    data={orders}
                />

                {/* Create Order Modal */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-[#823d21]">
                                <ShoppingBag className="h-5 w-5" /> Create New Order
                            </DialogTitle>
                            <DialogDescription>
                                Manually record a customer order with items, waitress, and payment status.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="waitress_id">Waitress</Label>
                                    <select
                                        id="waitress_id"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                                        value={createForm.data.waitress_id}
                                        onChange={(e) => createForm.setData('waitress_id', e.target.value)}
                                    >
                                        <option value="">-- Select Waitress --</option>
                                        {waitresses.map((w) => (
                                            <option key={w.id} value={w.id}>
                                                {w.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="fixed_number">Fixed Number</Label>
                                    <Input
                                        id="fixed_number"
                                        type="number"
                                        placeholder="101"
                                        value={createForm.data.fixed_number}
                                        onChange={(e) => createForm.setData('fixed_number', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="order_type">Order Type</Label>
                                    <select
                                        id="order_type"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={createForm.data.order_type}
                                        onChange={(e) => createForm.setData('order_type', e.target.value as any)}
                                    >
                                        <option value="dine_in">Dine In</option>
                                        <option value="takeaway">Takeaway</option>
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="payment_status">Payment Status</Label>
                                    <select
                                        id="payment_status"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={createForm.data.payment_status}
                                        onChange={(e) => createForm.setData('payment_status', e.target.value as any)}
                                    >
                                        <option value="paid">Paid</option>
                                        <option value="partial">Partial</option>
                                        <option value="unpaid">Unpaid</option>
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="payment_method">Payment Method</Label>
                                    <select
                                        id="payment_method"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={createForm.data.payment_method}
                                        onChange={(e) => createForm.setData('payment_method', e.target.value as any)}
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="mobile_money">Mobile Money</option>
                                        <option value="card">Card</option>
                                        <option value="credit">Credit</option>
                                    </select>
                                </div>
                            </div>

                            {/* Items Section */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <Label className="font-bold text-xs uppercase tracking-wide text-[#823d21]">
                                        Order Items Selection
                                    </Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addItemRow} className="h-7 text-xs">
                                        + Add Item
                                    </Button>
                                </div>

                                {selectedItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-muted/40 p-2.5 rounded-lg border">
                                        <div className="flex-1">
                                            <select
                                                className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                                                value={item.product_id}
                                                onChange={(e) => updateItemRow(index, 'product_id', Number(e.target.value))}
                                            >
                                                {products.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name} (${Number(p.price).toFixed(2)})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-24">
                                            <Input
                                                type="number"
                                                min="1"
                                                className="h-9 text-xs"
                                                value={item.quantity}
                                                onChange={(e) => updateItemRow(index, 'quantity', Number(e.target.value))}
                                            />
                                        </div>
                                        {selectedItems.length > 1 && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeItemRow(index)} className="h-8 w-8 p-0 text-red-600">
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <DialogFooter className="pt-3">
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createForm.processing} className="bg-[#823d21] hover:bg-[#682e18]">
                                    {createForm.processing ? 'Creating Order...' : 'Complete & Save Order'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Update Status Modal */}
                <Dialog open={!!updatingOrder} onOpenChange={(open) => !open && setUpdatingOrder(null)}>
                    <DialogContent className="sm:max-w-[450px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-[#823d21]">
                                <Edit className="h-5 w-5" /> Update Order Status
                            </DialogTitle>
                            <DialogDescription>Update transaction status for order #{updatingOrder?.order_number}</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdateSubmit} className="space-y-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="update-status">Order Status</Label>
                                <select
                                    id="update-status"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={updateForm.data.status}
                                    onChange={(e) => updateForm.setData('status', e.target.value as any)}
                                >
                                    <option value="completed">Completed</option>
                                    <option value="draft">Draft</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="update-payment-status">Payment Status</Label>
                                <select
                                    id="update-payment-status"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={updateForm.data.payment_status}
                                    onChange={(e) => updateForm.setData('payment_status', e.target.value as any)}
                                >
                                    <option value="paid">Paid</option>
                                    <option value="partial">Partial</option>
                                    <option value="unpaid">Unpaid</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>

                            {(updateForm.data.status === 'cancelled' || updateForm.data.status === 'refunded') && (
                                <div className="grid gap-2">
                                    <Label htmlFor="reason">Reason for Void/Refund</Label>
                                    <Textarea
                                        id="reason"
                                        placeholder="Reason for cancellation or refund..."
                                        value={updateForm.data.reason}
                                        onChange={(e) => updateForm.setData('reason', e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setUpdatingOrder(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={updateForm.processing} className="bg-[#823d21] hover:bg-[#682e18]">
                                    {updateForm.processing ? 'Saving...' : 'Update Status'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* View Order Details & Receipt Modal */}
                <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-[#823d21]">
                                <Receipt className="h-5 w-5" /> Order Receipt & Details
                            </DialogTitle>
                        </DialogHeader>
                        {viewingOrder && (
                            <div className="space-y-4 py-2">
                                {/* Receipt Header */}
                                <div className="rounded-lg bg-[#FAF4EE] dark:bg-muted/40 p-4 border space-y-2 text-center">
                                    <h3 className="font-serif text-lg font-bold text-[#823d21]">MaMa Café & Boba Tea</h3>
                                    <p className="text-xs text-muted-foreground">Order Ref: <span className="font-mono font-semibold">{viewingOrder.order_number}</span></p>
                                    <div className="flex items-center justify-center gap-3 pt-1 text-xs">
                                        <Badge variant="outline">Fixed #{viewingOrder.fixed_number || 'N/A'}</Badge>
                                        <Badge variant="outline">Waitress: {viewingOrder.waitress?.name || 'Walk-in'}</Badge>
                                        <Badge variant="secondary">{viewingOrder.order_type.toUpperCase()}</Badge>
                                    </div>
                                </div>

                                {/* Items Breakdown */}
                                <div className="space-y-2">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ordered Items</p>
                                    <div className="divide-y rounded-lg border bg-card">
                                        {viewingOrder.items?.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 text-xs">
                                                <div>
                                                    <p className="font-semibold text-foreground">{item.product?.name || `Product #${item.product_id}`}</p>
                                                    <p className="text-muted-foreground">{item.quantity} x ${Number(item.unit_price).toFixed(2)}</p>
                                                </div>
                                                <span className="font-mono font-bold text-foreground">
                                                    ${Number(item.line_total).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Receipt Totals */}
                                <div className="rounded-lg bg-muted/40 p-3 border space-y-1.5 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-mono">${Number(viewingOrder.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tax / Discount</span>
                                        <span className="font-mono">$0.00</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-sm text-foreground pt-1 border-t">
                                        <span>Total Amount</span>
                                        <span className="font-mono text-[#823d21]">${Number(viewingOrder.total).toFixed(2)}</span>
                                    </div>
                                </div>

                                <DialogFooter className="pt-2">
                                    <Button variant="outline" onClick={() => setViewingOrder(null)}>
                                        Close Receipt
                                    </Button>
                                </DialogFooter>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

OrdersIndex.layout = {
    breadcrumbs: [
        { title: 'Management', href: '/management/orders' },
        { title: 'Orders', href: '/management/orders' },
    ],
};
