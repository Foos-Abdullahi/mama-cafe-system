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
import { Plus, MoreHorizontal, Eye, Edit, Trash2, FolderPlus, Tag } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    description: string | null;
    status: 'active' | 'inactive';
    products_count: number;
    created_at?: string;
}

interface Props {
    categories: Category[];
    stats: StatSection[];
}

export default function CategoriesIndex({ categories, stats }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [viewingCategory, setViewingCategory] = useState<Category | null>(null);

    // Create Form
    const createForm = useForm({
        name: '',
        description: '',
        status: 'active' as 'active' | 'inactive',
    });

    // Edit Form
    const editForm = useForm({
        name: '',
        description: '',
        status: 'active' as 'active' | 'inactive',
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/management/categories', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;
        editForm.put(`/management/categories/${editingCategory.id}`, {
            onSuccess: () => {
                setEditingCategory(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(`/management/categories/${id}`);
        }
    };

    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">#{row.original.id}</span>,
        },
        {
            accessorKey: 'name',
            header: 'Category Name',
            cell: ({ row }) => (
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#823d21]/10 text-[#823d21]">
                        <Tag className="h-4 w-4" />
                    </div>
                    <div>
                        <span className="font-semibold text-foreground">{row.original.name}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground line-clamp-1">
                    {row.original.description || 'No description provided.'}
                </span>
            ),
        },
        {
            accessorKey: 'products_count',
            header: 'Products',
            cell: ({ row }) => (
                <Badge variant="outline" className="font-mono text-xs bg-secondary/50">
                    {row.original.products_count} Items
                </Badge>
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
                        {isActive ? 'Active' : 'Inactive'}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: () => <span className="text-right block">Actions</span>,
            cell: ({ row }) => {
                const cat = row.original;
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
                                <DropdownMenuItem onClick={() => setViewingCategory(cat)}>
                                    <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setEditingCategory(cat);
                                        editForm.setData({
                                            name: cat.name,
                                            description: cat.description || '',
                                            status: cat.status,
                                        });
                                    }}
                                >
                                    <Edit className="mr-2 h-4 w-4 text-amber-600" />
                                    Edit Category
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(cat.id)}>
                                    <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                                    Delete Category
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
            <Head title="Category Management - MaMa Café" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Categories Management</h1>
                        <p className="text-sm text-muted-foreground">
                            Organize menu items into intuitive categories for POS and online orders.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-[#823d21] hover:bg-[#682e18] text-white font-semibold flex items-center gap-2 shadow-sm"
                    >
                        <Plus className="h-4 w-4" /> Add New Category
                    </Button>
                </div>

                {/* Stats Section */}
                <StatsCard sections={stats} />

                {/* Main Data Table */}
                <DataTable
                    title="Menu Categories"
                    searchTitle="Filter categories by name..."
                    columns={columns}
                    data={categories}
                />

                {/* Create Category Modal */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-[450px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-[#823d21]">
                                <FolderPlus className="h-5 w-5" /> Add New Category
                            </DialogTitle>
                            <DialogDescription>
                                Create a new category section to group products in the café menu.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Category Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Speciality Coffees"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Brief description of products in this category..."
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={createForm.data.status}
                                    onChange={(e) => createForm.setData('status', e.target.value as any)}
                                >
                                    <option value="active">Active (Visible on POS)</option>
                                    <option value="inactive">Inactive (Hidden)</option>
                                </select>
                            </div>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createForm.processing} className="bg-[#823d21] hover:bg-[#682e18]">
                                    {createForm.processing ? 'Creating...' : 'Save Category'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Category Modal */}
                <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
                    <DialogContent className="sm:max-w-[450px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-[#823d21]">
                                <Edit className="h-5 w-5" /> Edit Category
                            </DialogTitle>
                            <DialogDescription>Update details for {editingCategory?.name}</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Category Name</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    required
                                />
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
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={editForm.data.status}
                                    onChange={(e) => editForm.setData('status', e.target.value as any)}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editForm.processing} className="bg-[#823d21] hover:bg-[#682e18]">
                                    {editForm.processing ? 'Updating...' : 'Update Category'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* View Details Modal */}
                <Dialog open={!!viewingCategory} onOpenChange={(open) => !open && setViewingCategory(null)}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-[#823d21]">
                                <Tag className="h-5 w-5" /> Category Details
                            </DialogTitle>
                        </DialogHeader>
                        {viewingCategory && (
                            <div className="space-y-4 py-3">
                                <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/40 p-4 border">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Category ID</p>
                                        <p className="text-base font-bold text-foreground">#{viewingCategory.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Status</p>
                                        <Badge className="mt-0.5">
                                            {viewingCategory.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Category Name</p>
                                        <p className="text-sm font-semibold text-foreground">{viewingCategory.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Total Products</p>
                                        <p className="text-sm font-semibold text-foreground">{viewingCategory.products_count} Items</p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Description</p>
                                    <p className="text-sm text-foreground bg-muted/20 p-3 rounded-md border">
                                        {viewingCategory.description || 'No detailed description recorded.'}
                                    </p>
                                </div>

                                <DialogFooter className="pt-3">
                                    <Button variant="outline" onClick={() => setViewingCategory(null)}>
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

CategoriesIndex.layout = {
    breadcrumbs: [
        { title: 'Management', href: '/management/categories' },
        { title: 'Categories', href: '/management/categories' },
    ],
};
