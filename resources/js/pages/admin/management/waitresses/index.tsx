import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { StatsCard, StatSection } from '@/components/tools/StatsCard';
import { DataTable } from '@/components/tools/table/main-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, MoreHorizontal, Eye, Edit, Trash2, UserPlus, Users, Hash } from 'lucide-react';

interface FixedNumber {
    id: number;
    range_start: number;
    range_end: number;
    current_number: number;
    status: string;
}

interface Waitress {
    id: number;
    name: string;
    phone: string | null;
    commission_rate: number | string;
    status: 'active' | 'inactive';
    orders_count: number;
    total_sales: number;
    commission_earned: number;
    fixed_numbers: FixedNumber[];
    created_at?: string;
}

interface Props {
    waitresses: Waitress[];
    stats: StatSection[];
}

export default function WaitressesIndex({ waitresses, stats }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingWaitress, setEditingWaitress] = useState<Waitress | null>(null);
    const [viewingWaitress, setViewingWaitress] = useState<Waitress | null>(null);

    // Create Form
    const createForm = useForm({
        name: '',
        phone: '',
        commission_rate: '0.15',
        status: 'active' as 'active' | 'inactive',
        range_start: '',
        range_end: '',
    });

    // Edit Form
    const editForm = useForm({
        name: '',
        phone: '',
        commission_rate: '0.15',
        status: 'active' as 'active' | 'inactive',
        range_start: '',
        range_end: '',
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/management/waitresses', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingWaitress) return;
        editForm.put(`/management/waitresses/${editingWaitress.id}`, {
            onSuccess: () => {
                setEditingWaitress(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this waitress?')) {
            router.delete(`/management/waitresses/${id}`);
        }
    };

    const columns: ColumnDef<Waitress>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">#{row.original.id}</span>,
        },
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
            accessorKey: 'fixed_numbers',
            header: 'Fixed Number Range',
            cell: ({ row }) => {
                const fn = row.original.fixed_numbers?.[0];
                return fn ? (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-foreground">
                        <Hash className="h-3.5 w-3.5 text-amber-600" />
                        <span>Range: {fn.range_start} - {fn.range_end}</span>
                        <Badge variant="outline" className="ml-1 text-[10px] bg-secondary/40">
                            Current: #{fn.current_number}
                        </Badge>
                    </div>
                ) : (
                    <span className="text-xs text-muted-foreground italic">Unassigned</span>
                );
            },
        },
        {
            accessorKey: 'orders_count',
            header: 'Orders Handled',
            cell: ({ row }) => (
                <span className="font-medium text-xs text-foreground">
                    {row.original.orders_count} Orders
                </span>
            ),
        },
        {
            accessorKey: 'commission_rate',
            header: 'Commission',
            cell: ({ row }) => (
                <Badge variant="outline" className="font-bold text-xs bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20">
                    {(Number(row.original.commission_rate) * 100).toFixed(0)}%
                </Badge>
            ),
        },
        {
            accessorKey: 'total_sales',
            header: 'Sales / Earned',
            cell: ({ row }) => (
                <div>
                    <span className="font-mono font-bold text-foreground block text-xs">
                        Sales: ${Number(row.original.total_sales).toFixed(2)}
                    </span>
                    <span className="font-mono text-[11px] text-emerald-600 font-medium">
                        Comm: ${Number(row.original.commission_earned).toFixed(2)}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.original.status === 'active';
                return (
                    <Badge
                        className={
                            isActive
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20'
                                : 'bg-muted text-muted-foreground hover:bg-muted'
                        }
                    >
                        {isActive ? 'Active' : 'Off Duty'}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: () => <span className="text-right block">Actions</span>,
            cell: ({ row }) => {
                const w = row.original;
                const fn = w.fixed_numbers?.[0];
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
                                <DropdownMenuItem onClick={() => setViewingWaitress(w)}>
                                    <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setEditingWaitress(w);
                                        editForm.setData({
                                            name: w.name,
                                            phone: w.phone || '',
                                            commission_rate: String(w.commission_rate),
                                            status: w.status,
                                            range_start: fn ? String(fn.range_start) : '',
                                            range_end: fn ? String(fn.range_end) : '',
                                        });
                                    }}
                                >
                                    <Edit className="mr-2 h-4 w-4 text-amber-600" />
                                    Edit Staff
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(w.id)}>
                                    <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                                    Delete Waitress
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
            <Head title="Waitresses Management - MaMa Café" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Waitresses Management</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage café floor staff, assigned fixed order number ranges, and 15% commission earnings.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-[#823d21] hover:bg-[#682e18] text-white font-semibold flex items-center gap-2 shadow-sm"
                    >
                        <Plus className="h-4 w-4" /> Add New Waitress
                    </Button>
                </div>

                {/* Stats Section */}
                <StatsCard sections={stats} />

                {/* Main Data Table */}
                <DataTable
                    title="Floor Waitstaff"
                    searchTitle="Search by waitress name..."
                    columns={columns}
                    data={waitresses}
                />

                {/* Create Waitress Modal */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-[#823d21]">
                                <UserPlus className="h-5 w-5" /> Add New Waitress
                            </DialogTitle>
                            <DialogDescription>
                                Register floor staff and assign their daily fixed number range.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Fatima Ali"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+252 61 XXX XXXX"
                                        value={createForm.data.phone}
                                        onChange={(e) => createForm.setData('phone', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="commission_rate">Commission Rate</Label>
                                    <Input
                                        id="commission_rate"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.15 (15%)"
                                        value={createForm.data.commission_rate}
                                        onChange={(e) => createForm.setData('commission_rate', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="rounded-lg bg-amber-500/5 p-3 border border-amber-500/20 space-y-3">
                                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                                    Assigned Fixed Number Range
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="range_start" className="text-xs">Start Number</Label>
                                        <Input
                                            id="range_start"
                                            type="number"
                                            placeholder="101"
                                            value={createForm.data.range_start}
                                            onChange={(e) => createForm.setData('range_start', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="range_end" className="text-xs">End Number</Label>
                                        <Input
                                            id="range_end"
                                            type="number"
                                            placeholder="150"
                                            value={createForm.data.range_end}
                                            onChange={(e) => createForm.setData('range_end', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={createForm.data.status}
                                    onChange={(e) => createForm.setData('status', e.target.value as any)}
                                >
                                    <option value="active">Active (On Duty)</option>
                                    <option value="inactive">Inactive (Off Duty)</option>
                                </select>
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createForm.processing} className="bg-[#823d21] hover:bg-[#682e18]">
                                    {createForm.processing ? 'Saving...' : 'Save Waitress'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Waitress Modal */}
                <Dialog open={!!editingWaitress} onOpenChange={(open) => !open && setEditingWaitress(null)}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-[#823d21]">
                                <Edit className="h-5 w-5" /> Edit Staff Member
                            </DialogTitle>
                            <DialogDescription>Modify details for {editingWaitress?.name}</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Full Name</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-phone">Phone Number</Label>
                                    <Input
                                        id="edit-phone"
                                        value={editForm.data.phone}
                                        onChange={(e) => editForm.setData('phone', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-commission_rate">Commission Rate</Label>
                                    <Input
                                        id="edit-commission_rate"
                                        type="number"
                                        step="0.01"
                                        value={editForm.data.commission_rate}
                                        onChange={(e) => editForm.setData('commission_rate', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="rounded-lg bg-amber-500/5 p-3 border border-amber-500/20 space-y-3">
                                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                                    Assigned Fixed Number Range
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="edit-range_start" className="text-xs">Start Number</Label>
                                        <Input
                                            id="edit-range_start"
                                            type="number"
                                            value={editForm.data.range_start}
                                            onChange={(e) => editForm.setData('range_start', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="edit-range_end" className="text-xs">End Number</Label>
                                        <Input
                                            id="edit-range_end"
                                            type="number"
                                            value={editForm.data.range_end}
                                            onChange={(e) => editForm.setData('range_end', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <select
                                    id="edit-status"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={editForm.data.status}
                                    onChange={(e) => editForm.setData('status', e.target.value as any)}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setEditingWaitress(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editForm.processing} className="bg-[#823d21] hover:bg-[#682e18]">
                                    {editForm.processing ? 'Updating...' : 'Update Staff'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* View Details Modal */}
                <Dialog open={!!viewingWaitress} onOpenChange={(open) => !open && setViewingWaitress(null)}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-[#823d21]">
                                <Users className="h-5 w-5" /> Waitress Profile & Performance
                            </DialogTitle>
                        </DialogHeader>
                        {viewingWaitress && (
                            <div className="space-y-4 py-3">
                                <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/40 p-4 border">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Staff Name</p>
                                        <p className="text-base font-bold text-foreground">{viewingWaitress.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Phone</p>
                                        <p className="text-sm font-semibold text-foreground">{viewingWaitress.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Total Orders Handled</p>
                                        <p className="text-base font-bold text-foreground">{viewingWaitress.orders_count} Orders</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Commission Rate</p>
                                        <Badge variant="outline" className="mt-0.5 font-bold">
                                            {(Number(viewingWaitress.commission_rate) * 100).toFixed(0)}%
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 rounded-lg bg-emerald-500/5 p-4 border border-emerald-500/20">
                                    <div>
                                        <p className="text-xs text-emerald-700 dark:text-emerald-400 uppercase font-semibold">Gross Sales Handled</p>
                                        <p className="text-lg font-mono font-bold text-foreground">
                                            ${Number(viewingWaitress.total_sales).toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-emerald-700 dark:text-emerald-400 uppercase font-semibold">Total Commission Earned</p>
                                        <p className="text-lg font-mono font-bold text-emerald-600">
                                            ${Number(viewingWaitress.commission_earned).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <DialogFooter className="pt-3">
                                    <Button variant="outline" onClick={() => setViewingWaitress(null)}>
                                        Close
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

WaitressesIndex.layout = {
    breadcrumbs: [
        { title: 'Management', href: '/management/waitresses' },
        { title: 'Waitresses', href: '/management/waitresses' },
    ],
};
