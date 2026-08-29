import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    category_id: number;
    name: string;
    description: string;
    price: number | string;
    image_url: string | null;
    status: 'active' | 'inactive';
}

interface Props {
    product: Product;
    categories: Category[];
}

export default function ProductEdit({ product, categories }: Props) {
    const form = useForm({
        category_id: product.category_id?.toString() ?? '',
        name: product.name,
        description: product.description ?? '',
        price: product.price?.toString() ?? '',
        image_url: product.image_url ?? '',
        status: product.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/management/products/${product.id}`);
    };

    return (
        <>
            <Head title={`Edit ${product.name} - MaMa Café`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <Edit className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Edit Product
                            </h1>
                            <p className="text-sm text-muted-foreground">Update details for <strong>{product.name}</strong>.</p>
                        </div>
                    </div>
                    <Link href="/management/products">
                        <Button variant="outline" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Products
                        </Button>
                    </Link>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">
                                    Category <span className="text-red-500">*</span>
                                </Label>
                                <select
                                    id="category_id"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={form.data.category_id}
                                    onChange={(e) => form.setData('category_id', e.target.value)}
                                    required
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <InputError message={form.errors.category_id} />
                            </div>

                            {/* Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">
                                    Product Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    required
                                    autoFocus
                                />
                                <InputError message={form.errors.name} />
                            </div>

                            {/* Price */}
                            <div className="grid gap-2">
                                <Label htmlFor="price">
                                    Price ($) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={form.data.price}
                                    onChange={(e) => form.setData('price', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.price} />
                            </div>

                            {/* Status */}
                            <div className="grid gap-2">
                                <Label htmlFor="status">
                                    Availability <span className="text-red-500">*</span>
                                </Label>
                                <select
                                    id="status"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={form.data.status}
                                    onChange={(e) => form.setData('status', e.target.value as any)}
                                >
                                    <option value="active">Active (Available on POS)</option>
                                    <option value="inactive">Inactive (Out of Stock / Hidden)</option>
                                </select>
                                <InputError message={form.errors.status} />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="grid gap-2">
                            <Label htmlFor="description">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                rows={3}
                                required
                            />
                            <InputError message={form.errors.description} />
                        </div>

                        {/* Image URL */}
                        <div className="grid gap-2">
                            <Label htmlFor="image_url">Image URL <span className="text-muted-foreground text-xs">(optional)</span></Label>
                            <Input
                                id="image_url"
                                value={form.data.image_url}
                                onChange={(e) => form.setData('image_url', e.target.value)}
                            />
                            <InputError message={form.errors.image_url} />
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t pt-4">
                            <Link href="/management/products">
                                <Button type="button" variant="outline">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={form.processing} className="bg-[#823d21] hover:bg-[#682e18] min-w-[140px]">
                                {form.processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

ProductEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/products' },
            { title: 'Products', href: '/management/products' },
            { title: 'Edit Product', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
