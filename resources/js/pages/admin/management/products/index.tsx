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
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Coffee } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

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

export default function ProductsIndex({ products, stats }: Props) {
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
                                <DropdownMenuItem asChild>
                                    <Link href={`/management/products/${p.id}`} className="flex items-center cursor-pointer">
                                        <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                        View Details
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/management/products/${p.id}/edit`} className="flex items-center cursor-pointer">
                                        <Edit className="mr-2 h-4 w-4 text-amber-600" />
                                        Edit Product
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(p.id)} className="text-red-600 focus:text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
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

            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">Products Management</h1>
                        <p className="text-xs text-muted-foreground">
                            Manage your café menu items, prices and availability.
                        </p>
                    </div>
                    <Button asChild size={'sm'}>
                        <Link href="/management/products/create">
                            <Plus className="h-4 w-4" />
                            Add
                            <span className="hidden sm:inline">Product</span>
                        </Link>
                    </Button>
                </div>

                <StatsCard sections={stats} />

                <div className="mt-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-in-out">
                    <DataTable
                        title="Menu Products"
                        searchTitle="Filter products by name..."
                        columns={columns}
                        data={products}
                    />
                </div>
            </div>
        </>
    );
}

ProductsIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/products' },
            { title: 'Products', href: '/management/products' },
        ]}
    >
        {page}
    </AppLayout>
);
