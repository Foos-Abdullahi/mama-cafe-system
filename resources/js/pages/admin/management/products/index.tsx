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
import { Plus, MoreHorizontal, Eye, Edit, Trash2, PackagePlus, Coffee } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    category_id: number;
    name: string;
    description: string | null;
    price: number | string;
    image_url: string | null;
    status: 'active' | 'inactive';
    category?: Category;
    created_at?: string;
}

interface Props {
    products: Product[];
    categories: Category[];
    stats: StatSection[];
}

export default function ProductsIndex({ products, categories, stats }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

    // Create Form
    const createForm = useForm({
        category_id: categories[0]?.id || '',
        name: '',
        description: '',
        price: '',
        image_url: '',
        status: 'active' as 'active' | 'inactive',
    });

    // Edit Form
    const editForm = useForm({
        category_id: '',
        name: '',
        description: '',
        price: '',
        image_url: '',
        status: 'active' as 'active' | 'inactive',
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/management/products', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;
        editForm.put(`/management/products/${editingProduct.id}`, {
            onSuccess: () => {
                setEditingProduct(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/management/products/${id}`);
        }
    };

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">#{row.original.id}</span>,
        },
        {
            accessorKey: 'name',
            header: 'Product',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#823d21]/10 text-[#823d21]">
                        <Coffee className="h-5 w-5" />
                    </div>
                    <div>
                        <span className="font-semibold text-foreground block">{row.original.name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{row.original.description || 'No details'}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }) => (
                <Badge variant="outline" className="font-medium bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20">
                    {row.original.category?.name || 'Uncategorized'}
                </Badge>
            ),
        },
        {
            accessorKey: 'price',
            header: 'Price',
            cell: ({ row }) => (
                <span className="font-mono font-bold text-foreground">
                    ${Number(row.original.price).toFixed(2)}
                </span>
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
                        {isActive ? 'Available' : 'Unavailable'}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: () => <span className="text-right block">Actions</span>,
            cell: ({ row }) => {
                const p = row.original;
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
                                <DropdownMenuItem onClick={() => setViewingProduct(p)}>
                                    <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setEditingProduct(p);
                                        editForm.setData({
                                            category_id: p.category_id,
                                            name: p.name,
                                            description: p.description || '',
                                            price: String(p.price),
                                            image_url: p.image_url || '',
                                            status: p.status,
                                        });
                                    }}
                                >
                                    <Edit className="mr-2 h-4 w-4 text-amber-600" />
                                    Edit Product
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(p.id)}>
                                    <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                                    Delete Product
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
            <Head title="Products Management - MaMa Café" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Products Management</h1>
                        <p className="text-sm text-muted-foreground">
                            Maintain café menu items, pricing, categories, and POS availability.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-[#823d21] hover:bg-[#682e18] text-white font-semibold flex items-center gap-2 shadow-sm"
                    >
                        <Plus className="h-4 w-4" /> Add New Product
                    </Button>
                </div>

                {/* Stats Section */}
                <StatsCard sections={stats} />

                {/* Main Data Table */}
                <DataTable
                    title="Menu Catalog"
                    searchTitle="Search products by name..."
                    columns={columns}
                    data={products}
                />

                {/* Create Product Modal */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-[#823d21]">
                                <PackagePlus className="h-5 w-5" /> Add New Menu Product
                            </DialogTitle>
                            <DialogDescription>
                                Add a new drink, pastry, or food item to the MaMa Café system.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Category</Label>
                                <select
                                    id="category_id"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={createForm.data.category_id}
                                    onChange={(e) => createForm.setData('category_id', e.target.value)}
                                    required
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Caramel Macchiato"
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        placeholder="4.50"
                                        value={createForm.data.price}
                                        onChange={(e) => createForm.setData('price', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Ingredients, brewing style, or flavor notes..."
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Availability Status</Label>
                                <select
                                    id="status"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={createForm.data.status}
                                    onChange={(e) => createForm.setData('status', e.target.value as any)}
                                >
                                    <option value="active">Active (Available on POS)</option>
                                    <option value="inactive">Inactive (Out of Stock / Hidden)</option>
                                </select>
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createForm.processing} className="bg-[#823d21] hover:bg-[#682e18]">
                                    {createForm.processing ? 'Saving...' : 'Save Product'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Product Modal */}
                <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-[#823d21]">
                                <Edit className="h-5 w-5" /> Edit Product
                            </DialogTitle>
                            <DialogDescription>Modify details for {editingProduct?.name}</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-category">Category</Label>
                                <select
                                    id="edit-category"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={editForm.data.category_id}
                                    onChange={(e) => editForm.setData('category_id', e.target.value)}
                                    required
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Product Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-price">Price ($)</Label>
                                    <Input
                                        id="edit-price"
                                        type="number"
                                        step="0.01"
                                        value={editForm.data.price}
                                        onChange={(e) => editForm.setData('price', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                />
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
                                <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editForm.processing} className="bg-[#823d21] hover:bg-[#682e18]">
                                    {editForm.processing ? 'Updating...' : 'Update Product'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* View Details Modal */}
                <Dialog open={!!viewingProduct} onOpenChange={(open) => !open && setViewingProduct(null)}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-[#823d21]">
                                <Coffee className="h-5 w-5" /> Product Information
                            </DialogTitle>
                        </DialogHeader>
                        {viewingProduct && (
                            <div className="space-y-4 py-3">
                                <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/40 p-4 border">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Product ID</p>
                                        <p className="text-base font-bold text-foreground">#{viewingProduct.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Category</p>
                                        <Badge variant="outline" className="mt-0.5 font-medium">
                                            {viewingProduct.category?.name || 'General'}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Product Name</p>
                                        <p className="text-sm font-semibold text-foreground">{viewingProduct.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Unit Price</p>
                                        <p className="text-base font-mono font-bold text-[#823d21]">
                                            ${Number(viewingProduct.price).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Description</p>
                                    <p className="text-sm text-foreground bg-muted/20 p-3 rounded-md border">
                                        {viewingProduct.description || 'No detailed description.'}
                                    </p>
                                </div>

                                <DialogFooter className="pt-3">
                                    <Button variant="outline" onClick={() => setViewingProduct(null)}>
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

ProductsIndex.layout = {
    breadcrumbs: [
        { title: 'Management', href: '/management/products' },
        { title: 'Products', href: '/management/products' },
    ],
};
