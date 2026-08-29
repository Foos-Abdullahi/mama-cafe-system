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
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Tag } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

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
                    <span className="font-semibold text-foreground">{row.original.name}</span>
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
                                <DropdownMenuItem asChild>
                                    <Link href={`/management/categories/${cat.id}`} className="flex items-center cursor-pointer">
                                        <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                        View Details
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/management/categories/${cat.id}/edit`} className="flex items-center cursor-pointer">
                                        <Edit className="mr-2 h-4 w-4 text-amber-600" />
                                        Edit Category
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(cat.id)} className="text-red-600 focus:text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
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
                    <Link href="/management/categories/create">
                        <Button className="bg-[#823d21] hover:bg-[#682e18] text-white font-semibold flex items-center gap-2 shadow-sm">
                            <Plus className="h-4 w-4" /> Add New Category
                        </Button>
                    </Link>
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
            </div>
        </>
    );
}

CategoriesIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/categories' },
            { title: 'Categories', href: '/management/categories' },
        ]}
    >
        {page}
    </AppLayout>
);
