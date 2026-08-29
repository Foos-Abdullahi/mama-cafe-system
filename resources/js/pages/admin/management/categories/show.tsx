import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Tag, Package, Trash2 } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number;
    status: string;
}

interface Category {
    id: number;
    name: string;
    description: string;
    status: 'active' | 'inactive';
    products_count: number;
    products: Product[];
    created_at: string;
    updated_at: string;
}

interface Props {
    category: Category;
}

export default function CategoryShow({ category }: Props) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
            router.delete(`/management/categories/${category.id}`);
        }
    };

    return (
        <>
            <Head title={`${category.name} - MaMa Café`} />

            <div className="space-y-6 p-6">
                {/* Page Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <Tag className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                {category.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">Category details & linked menu items</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/management/categories">
                            <Button variant="outline" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" /> Back to Categories
                            </Button>
                        </Link>
                        <Link href={`/management/categories/${category.id}/edit`}>
                            <Button size="sm" className="gap-2 bg-[#823d21] hover:bg-[#682e18]">
                                <Edit className="h-4 w-4" /> Edit
                            </Button>
                        </Link>
                        <Button size="sm" variant="destructive" className="gap-2" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>

                {/* Details Card */}
                <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h2 className="font-semibold text-lg">Category Information</h2>
                        <Badge variant={category.status === 'active' ? 'default' : 'secondary'}
                            className={category.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : ''}>
                            {category.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Category Name</p>
                            <p className="mt-1 font-semibold text-base text-foreground">{category.name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Linked Products</p>
                            <p className="mt-1 font-semibold text-base text-foreground">{category.products_count ?? 0} items</p>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</p>
                            <p className="mt-1 text-sm text-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border">
                                {category.description || 'No description provided.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products in this category */}
                {category.products && category.products.length > 0 && (
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-6 py-4 border-b bg-muted/30">
                            <Package className="h-4 w-4 text-[#823d21]" />
                            <h2 className="font-semibold text-base">Products in this Category ({category.products.length})</h2>
                        </div>
                        <ul className="divide-y">
                            {category.products.map((product) => (
                                <li key={product.id} className="flex items-center justify-between px-6 py-3.5">
                                    <span className="font-medium text-sm">{product.name}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold font-mono">${Number(product.price).toFixed(2)}</span>
                                        <Badge variant="outline" className={product.status === 'active' ? 'text-emerald-600 border-emerald-300' : 'text-slate-500'}>
                                            {product.status}
                                        </Badge>
                                        <Link href={`/management/products/${product.id}`}>
                                            <Button size="sm" variant="ghost" className="h-8 text-xs">View Product</Button>
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}

CategoryShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/categories' },
            { title: 'Categories', href: '/management/categories' },
            { title: 'Category Details', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
