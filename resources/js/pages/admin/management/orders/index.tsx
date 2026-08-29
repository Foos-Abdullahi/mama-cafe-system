import { useState, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
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
    DollarSign,
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
    discount: number | string;
    tax: number | string;
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

export default function OrdersIndex({ orders, products, waitresses, stats }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [updatingOrder, setUpdatingOrder] = useState<Order | null>(null);
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

    // Create Order Item State
    const [createItems, setCreateItems] = useState<{ product_id: number; quantity: number }[]>([
        { product_id: products[0]?.id || 1, quantity: 1 },
    ]);

    // Edit Order Item State
    const [editItems, setEditItems] = useState<{ product_id: number; quantity: number }[]>([]);

    // Create Form
    const createForm = useForm({
        waitress_id: waitresses[0]?.id ? String(waitresses[0].id) : '',
        fixed_number: '101',
        order_type: 'dine_in' as 'dine_in' | 'takeaway',
        status: 'completed' as any,
        payment_status: 'paid' as any,
        payment_method: 'cash' as any,
        amount_paid: '',
        items: [] as any[],
    });

    // Edit Form
    const editForm = useForm({
        waitress_id: '',
        fixed_number: '',
        order_type: 'dine_in' as 'dine_in' | 'takeaway',
        status: 'completed' as any,
        payment_status: 'paid' as any,
        payment_method: 'cash' as any,
        amount_paid: '',
        reason: '',
        items: [] as any[],
    });

    // Calculated Subtotal for Create
    const createSubtotal = useMemo(() => {
        return createItems.reduce((sum, item) => {
            const p = products.find((prod) => prod.id === item.product_id);
            return sum + (p ? Number(p.price) * item.quantity : 0);
        }, 0);
    }, [createItems, products]);

    // Calculated Subtotal for Edit
    const editSubtotal = useMemo(() => {
        return editItems.reduce((sum, item) => {
            const p = products.find((prod) => prod.id === item.product_id);
            return sum + (p ? Number(p.price) * item.quantity : 0);
        }, 0);
    }, [editItems, products]);

    // Create Item Handlers
    const addCreateItemRow = () => {
        if (products.length === 0) return;
        setCreateItems([...createItems, { product_id: products[0].id, quantity: 1 }]);
    };

    const removeCreateItemRow = (index: number) => {
        if (createItems.length <= 1) return;
        setCreateItems(createItems.filter((_, i) => i !== index));
    };

    const updateCreateItemRow = (index: number, field: 'product_id' | 'quantity', value: number) => {
        const updated = [...createItems];
        updated[index][field] = value;
        setCreateItems(updated);
    };

    // Edit Item Handlers
    const addEditItemRow = () => {
        if (products.length === 0) return;
        setEditItems([...editItems, { product_id: products[0].id, quantity: 1 }]);
    };

    const removeEditItemRow = (index: number) => {
        if (editItems.length <= 1) return;
        setEditItems(editItems.filter((_, i) => i !== index));
    };

    const updateEditItemRow = (index: number, field: 'product_id' | 'quantity', value: number) => {
        const updated = [...editItems];
        updated[index][field] = value;
        setEditItems(updated);
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.setData('items', createItems);
        createForm.post('/management/orders', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                setCreateItems([{ product_id: products[0]?.id || 1, quantity: 1 }]);
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!updatingOrder) return;
        editForm.setData('items', editItems);
        editForm.put(`/management/orders/${updatingOrder.id}`, {
            onSuccess: () => {
                setUpdatingOrder(null);
            },
        });
    };

    const openEditModal = (order: Order) => {
        setUpdatingOrder(order);
        const existingItems = order.items && order.items.length > 0
            ? order.items.map((i) => ({ product_id: i.product_id, quantity: i.quantity }))
            : [{ product_id: products[0]?.id || 1, quantity: 1 }];

        setEditItems(existingItems);
        const paidAmount = order.payments && order.payments.length > 0 ? String(order.payments[0].amount) : '';

        editForm.setData({
            waitress_id: order.waitress_id ? String(order.waitress_id) : '',
            fixed_number: order.fixed_number ? String(order.fixed_number) : '',
            order_type: order.order_type,
            status: order.status,
            payment_status: order.payment_status,
            payment_method: order.payments?.[0]?.method || 'cash',
            amount_paid: paidAmount,
            reason: '',
            items: existingItems,
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
                                <DropdownMenuItem onClick={() => setViewingOrder(order)}>
                                    <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                    View Receipt & Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditModal(order)}>
                                    <Edit className="mr-2 h-4 w-4 text-amber-600" />
                                    Edit Order & Products
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

                            {/* Partial Payment Calculation */}
                            {createForm.data.payment_status === 'partial' && (
                                <div className="rounded-lg bg-amber-500/10 p-3.5 border border-amber-500/20 grid grid-cols-2 gap-4">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="create-amount-paid" className="text-amber-900 dark:text-amber-300 font-bold text-xs">
                                            Amount Paid ($)
                                        </Label>
                                        <Input
                                            id="create-amount-paid"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={createForm.data.amount_paid}
                                            onChange={(e) => createForm.setData('amount_paid', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="text-xs font-semibold text-amber-900 dark:text-amber-300 uppercase">
                                            Remaining Unpaid Balance
                                        </span>
                                        <span className="text-lg font-mono font-bold text-red-600 dark:text-red-400">
                                            ${Math.max(0, createSubtotal - Number(createForm.data.amount_paid || 0)).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Items Section */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <Label className="font-bold text-xs uppercase tracking-wide text-[#823d21]">
                                        Order Items Selection
                                    </Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addCreateItemRow} className="h-7 text-xs">
                                        + Add Item
                                    </Button>
                                </div>

                                {createItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-muted/40 p-2.5 rounded-lg border">
                                        <div className="flex-1">
                                            <select
                                                className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                                                value={item.product_id}
                                                onChange={(e) => updateCreateItemRow(index, 'product_id', Number(e.target.value))}
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
                                                onChange={(e) => updateCreateItemRow(index, 'quantity', Number(e.target.value))}
                                            />
                                        </div>
                                        {createItems.length > 1 && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeCreateItemRow(index)} className="h-8 w-8 p-0 text-red-600">
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}

                                <div className="flex justify-between items-center bg-muted/20 p-3 rounded-lg border font-bold text-sm text-foreground">
                                    <span>Calculated Subtotal:</span>
                                    <span className="font-mono text-[#823d21]">${createSubtotal.toFixed(2)}</span>
                                </div>
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

                {/* Edit Order Modal */}
                <Dialog open={!!updatingOrder} onOpenChange={(open) => !open && setUpdatingOrder(null)}>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-[#823d21]">
                                <Edit className="h-5 w-5" /> Edit Order & Product Items
                            </DialogTitle>
                            <DialogDescription>
                                Modify items, products, waitress, or payment status for order #{updatingOrder?.order_number}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-waitress_id">Waitress</Label>
                                    <select
                                        id="edit-waitress_id"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={editForm.data.waitress_id}
                                        onChange={(e) => editForm.setData('waitress_id', e.target.value)}
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
                                    <Label htmlFor="edit-fixed_number">Fixed Number</Label>
                                    <Input
                                        id="edit-fixed_number"
                                        type="number"
                                        value={editForm.data.fixed_number}
                                        onChange={(e) => editForm.setData('fixed_number', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-status">Order Status</Label>
                                    <select
                                        id="edit-status"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={editForm.data.status}
                                        onChange={(e) => editForm.setData('status', e.target.value as any)}
                                    >
                                        <option value="completed">Completed</option>
                                        <option value="draft">Draft</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="edit-payment_status">Payment Status</Label>
                                    <select
                                        id="edit-payment_status"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={editForm.data.payment_status}
                                        onChange={(e) => editForm.setData('payment_status', e.target.value as any)}
                                    >
                                        <option value="paid">Paid</option>
                                        <option value="partial">Partial</option>
                                        <option value="unpaid">Unpaid</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="edit-payment_method">Payment Method</Label>
                                    <select
                                        id="edit-payment_method"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={editForm.data.payment_method}
                                        onChange={(e) => editForm.setData('payment_method', e.target.value as any)}
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="mobile_money">Mobile Money</option>
                                        <option value="card">Card</option>
                                        <option value="credit">Credit</option>
                                    </select>
                                </div>
                            </div>

                            {/* Edit Partial Payment Calculation */}
                            {editForm.data.payment_status === 'partial' && (
                                <div className="rounded-lg bg-amber-500/10 p-3.5 border border-amber-500/20 grid grid-cols-2 gap-4">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="edit-amount-paid" className="text-amber-900 dark:text-amber-300 font-bold text-xs">
                                            Amount Paid ($)
                                        </Label>
                                        <Input
                                            id="edit-amount-paid"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={editForm.data.amount_paid}
                                            onChange={(e) => editForm.setData('amount_paid', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="text-xs font-semibold text-amber-900 dark:text-amber-300 uppercase">
                                            Remaining Unpaid Balance
                                        </span>
                                        <span className="text-lg font-mono font-bold text-red-600 dark:text-red-400">
                                            ${Math.max(0, editSubtotal - Number(editForm.data.amount_paid || 0)).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Edit Items Section */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <Label className="font-bold text-xs uppercase tracking-wide text-[#823d21]">
                                        Modify Order Products & Quantities
                                    </Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addEditItemRow} className="h-7 text-xs">
                                        + Add / Swap Product
                                    </Button>
                                </div>

                                {editItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-muted/40 p-2.5 rounded-lg border">
                                        <div className="flex-1">
                                            <select
                                                className="flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                                                value={item.product_id}
                                                onChange={(e) => updateEditItemRow(index, 'product_id', Number(e.target.value))}
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
                                                onChange={(e) => updateEditItemRow(index, 'quantity', Number(e.target.value))}
                                            />
                                        </div>
                                        {editItems.length > 1 && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeEditItemRow(index)} className="h-8 w-8 p-0 text-red-600">
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}

                                <div className="flex justify-between items-center bg-muted/20 p-3 rounded-lg border font-bold text-sm text-foreground">
                                    <span>Recalculated Order Total:</span>
                                    <span className="font-mono text-[#823d21]">${editSubtotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {(editForm.data.status === 'cancelled' || editForm.data.status === 'refunded') && (
                                <div className="grid gap-2">
                                    <Label htmlFor="reason">Reason for Void/Refund</Label>
                                    <Textarea
                                        id="reason"
                                        placeholder="Reason for cancellation or refund..."
                                        value={editForm.data.reason}
                                        onChange={(e) => editForm.setData('reason', e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setUpdatingOrder(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editForm.processing} className="bg-[#823d21] hover:bg-[#682e18]">
                                    {editForm.processing ? 'Saving...' : 'Update & Recalculate Order'}
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
                                    <div className="flex justify-between font-bold text-sm text-foreground pt-1 border-t">
                                        <span>Total Amount</span>
                                        <span className="font-mono text-[#823d21]">${Number(viewingOrder.total).toFixed(2)}</span>
                                    </div>

                                    {viewingOrder.payment_status === 'partial' && (
                                        <div className="flex justify-between text-xs font-semibold text-amber-700 dark:text-amber-400 pt-1">
                                            <span>Amount Paid</span>
                                            <span className="font-mono">
                                                ${Number(viewingOrder.payments?.[0]?.amount || 0).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    {viewingOrder.payment_status === 'partial' && (
                                        <div className="flex justify-between text-xs font-bold text-red-600 dark:text-red-400 pt-0.5">
                                            <span>Remaining Unpaid Balance</span>
                                            <span className="font-mono">
                                                ${Math.max(0, Number(viewingOrder.total) - Number(viewingOrder.payments?.[0]?.amount || 0)).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
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
