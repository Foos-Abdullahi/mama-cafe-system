import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Coffee, Tag, DollarSign, Calendar, Clock, Image as ImageIcon } from 'lucide-react';

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
            <Head title={`${product.name} — Product Details`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                                {product.name}
                            </h1>
                            <Badge
                                variant="outline"
                                className={
                                    product.status === 'active'
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                        : 'bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                                }
                            >
                                {product.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                            {product.category && (
                                <Badge variant="outline" className="text-xs">
                                    {product.category.name}
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            Added: {formatDateTime(product.created_at)}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/management/products/${product.id}/edit`}>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                <Edit className="h-3.5 w-3.5" />
                                Edit Product
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            className="gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive shadow-xs border-destructive/30"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </Button>
                        <Link href="/management/products">
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back to Products
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Main 2-Column Grid */}
                <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    {/* Left Column: Product Visual & Description */}
                    <div className="space-y-4">
                        <section className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
                            <div className="border-b border-border px-4 py-3 bg-muted/20 flex items-center gap-2">
                                <Coffee className="h-4 w-4 text-[#823d21]" />
                                <h2 className="font-semibold text-foreground text-sm">
                                    Product Preview
                                </h2>
                            </div>

                            {product.image_url ? (
                                <div className="h-72 w-full overflow-hidden bg-muted/10 border-b border-border flex items-center justify-center">
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-48 w-full flex flex-col items-center justify-center gap-2 bg-muted/10 border-b border-border text-muted-foreground">
                                    <ImageIcon className="h-8 w-8 stroke-1" />
                                    <span className="text-xs">No product image uploaded</span>
                                </div>
                            )}

                            <div className="p-4 space-y-3">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Description & Recipe Details
                                </h3>
                                <p className="text-sm text-foreground leading-relaxed bg-muted/20 p-3.5 rounded-lg border border-border/60">
                                    {product.description || 'No description provided for this menu item.'}
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Pricing & Meta Panels */}
                    <div className="space-y-4">
                        <Panel title="Pricing & Category">
                            <SummaryRow
                                label="Unit Price"
                                value={`$${Number(product.price).toFixed(2)}`}
                                strong
                            />
                            <SummaryRow
                                label="Category"
                                value={product.category?.name ?? 'Uncategorized'}
                            />
                            <SummaryRow
                                label="Catalog Status"
                                value={product.status === 'active' ? 'Active / Available' : 'Inactive'}
                            />
                            <SummaryRow
                                label="Product ID"
                                value={`#PRD-${product.id}`}
                            />
                        </Panel>

                        <Panel title="Timeline">
                            <SummaryRow
                                label="Created Date"
                                value={formatDateTime(product.created_at)}
                            />
                            <SummaryRow
                                label="Last Updated"
                                value={formatDateTime(product.updated_at)}
                            />
                        </Panel>
                    </div>
                </div>
            </div>
        </>
    );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <h2 className="mb-3 font-semibold text-foreground text-sm border-b border-border pb-2">
                {title}
            </h2>
            {children}
        </section>
    );
}

function SummaryRow({
    label,
    value,
    strong = false,
}: {
    label: string;
    value: string;
    strong?: boolean;
}) {
    return (
        <div className="flex items-center justify-between py-1.5 text-sm">
            <span className="text-muted-foreground text-xs">{label}</span>
            <span
                className={
                    strong
                        ? 'font-bold font-mono text-emerald-600 text-base'
                        : 'font-medium font-mono text-foreground'
                }
            >
                {value}
            </span>
        </div>
    );
}

function formatDateTime(value: string | null): string {
    if (!value) {
        return '—';
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
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

