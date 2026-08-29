import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Coffee, Tag, DollarSign } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number | string;
    image_url: string | null;
    status: 'active' | 'inactive';
    category: Category | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    product: Product;
}

export default function ProductShow({ product }: Props) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            router.delete(`/management/products/${product.id}`);
        }
    };

    return (
        <>
            <Head title={`${product.name} - MaMa Café`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <Coffee className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                {product.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">Product catalog details</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/management/products">
                            <Button variant="outline" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" /> Back to Products
                            </Button>
                        </Link>
                        <Link href={`/management/products/${product.id}/edit`}>
                            <Button size="sm" className="gap-2 bg-[#823d21] hover:bg-[#682e18]">
                                <Edit className="h-4 w-4" /> Edit
                            </Button>
                        </Link>
                        <Button size="sm" variant="destructive" className="gap-2" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border bg-card shadow-sm overflow-hidden space-y-6">
                    {/* Image banner */}
                    {product.image_url && (
                        <div className="h-56 w-full overflow-hidden border-b">
                            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                    )}

                    <div className="p-6 pt-0 space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="font-semibold text-lg">Product Information</h2>
                            <Badge className={product.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-600'}>
                                {product.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                    <Tag className="h-3.5 w-3.5 text-[#823d21]" /> Category
                                </p>
                                <p className="mt-1 font-semibold text-base text-foreground">{product.category?.name ?? '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                    <DollarSign className="h-3.5 w-3.5 text-emerald-600" /> Price
                                </p>
                                <p className="mt-1 font-bold text-emerald-600 text-lg">${Number(product.price).toFixed(2)}</p>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</p>
                                <p className="mt-1 text-sm text-foreground leading-relaxed bg-muted/30 p-3.5 rounded-lg border">
                                    {product.description || 'No description recorded.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ProductShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/products' },
            { title: 'Products', href: '/management/products' },
            { title: 'Product Details', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
