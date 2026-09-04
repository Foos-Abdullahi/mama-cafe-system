import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Tag, Package, Trash2, Calendar, Eye } from 'lucide-react';

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
            <Head title={`${category.name} — Category Details`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                                {category.name}
                            </h1>
                            <Badge
                                variant="outline"
                                className={
                                    category.status === 'active'
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                        : 'bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                                }
                            >
                                {category.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                {category.products_count ?? category.products?.length ?? 0} items
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            Created: {formatDateTime(category.created_at)}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/management/categories/${category.id}/edit`}>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                <Edit className="h-3.5 w-3.5" />
                                Edit Category
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
                        <Link href="/management/categories">
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back to Categories
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Main 2-Column Grid */}
                <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    {/* Left Column: Products Table */}
                    <section className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
                        <div className="border-b border-border px-4 py-3 bg-muted/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-[#823d21]" />
                                <h2 className="font-semibold text-foreground text-sm">
                                    Linked Products ({category.products?.length || 0})
                                </h2>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border text-sm">
                                <thead className="bg-muted/40">
                                    <tr>
                                        <TableHead>Product Name</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {category.products?.map((product) => (
                                        <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 font-medium text-foreground">
                                                {product.name}
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-600">
                                                ${Number(product.price).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${
                                                        product.status === 'active'
                                                            ? 'text-emerald-600 border-emerald-300'
                                                            : 'text-slate-500'
                                                    }`}
                                                >
                                                    {product.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link href={`/management/products/${product.id}`}>
                                                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                                                        <Eye className="h-3 w-3" /> View
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!category.products || category.products.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                                No products linked to this category yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Right Column: Information & Description Panels */}
                    <div className="space-y-4">
                        <Panel title="Category Information">
                            <SummaryRow
                                label="Category Name"
                                value={category.name}
                                strong
                            />
                            <SummaryRow
                                label="Status"
                                value={category.status === 'active' ? 'Active' : 'Inactive'}
                            />
                            <SummaryRow
                                label="Total Products"
                                value={`${category.products_count ?? category.products?.length ?? 0} items`}
                            />
                            <SummaryRow
                                label="Created Date"
                                value={formatDateTime(category.created_at)}
                            />
                            <SummaryRow
                                label="Last Updated"
                                value={formatDateTime(category.updated_at)}
                            />
                        </Panel>

                        <Panel title="Description">
                            <p className="text-sm text-foreground leading-relaxed bg-muted/20 p-3 rounded-lg border border-border/60">
                                {category.description || 'No description provided for this category.'}
                            </p>
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
                        ? 'font-bold text-foreground'
                        : 'font-medium text-foreground'
                }
            >
                {value}
            </span>
        </div>
    );
}

function TableHead({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <th
            className={`px-4 py-2.5 text-xs font-bold tracking-wider text-muted-foreground uppercase ${className}`}
        >
            {children}
        </th>
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

