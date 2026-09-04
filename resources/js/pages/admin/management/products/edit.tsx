import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
            <Head title={`Edit ${product.name} — MaMa Café`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header with Title and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <Edit className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                                Edit Product
                            </h1>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Update details and pricing for <strong>{product.name}</strong>.
                            </p>
                        </div>
                    </div>
                    <Link href="/management/products">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to Products
                        </Button>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-xs">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2.5">
                                Product Details & Pricing
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Category */}
                                <div className="grid gap-2">
                                    <Label htmlFor="category_id" className="text-xs font-medium text-foreground">
                                        Category <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={form.data.category_id}
                                        onValueChange={(val) => form.setData('category_id', val)}
                                    >
                                        <SelectTrigger id="category_id" className="w-full h-10">
                                            <SelectValue placeholder="— Select a category —" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.category_id} />
                                </div>

                                {/* Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-xs font-medium text-foreground">
                                        Product Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        className="h-10"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <InputError message={form.errors.name} />
                                </div>

                                {/* Price */}
                                <div className="grid gap-2">
                                    <Label htmlFor="price" className="text-xs font-medium text-foreground">
                                        Price ($) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        className="h-10 font-mono"
                                        value={form.data.price}
                                        onChange={(e) => form.setData('price', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.price} />
                                </div>

                                {/* Status */}
                                <div className="grid gap-2">
                                    <Label htmlFor="status" className="text-xs font-medium text-foreground">
                                        Availability <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={form.data.status}
                                        onValueChange={(val: 'active' | 'inactive') => form.setData('status', val)}
                                    >
                                        <SelectTrigger id="status" className="w-full h-10">
                                            <SelectValue placeholder="Select availability" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active (Available on POS)</SelectItem>
                                            <SelectItem value="inactive">Inactive (Out of Stock / Hidden)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.status} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2.5">
                                Description & Media
                            </h2>

                            {/* Description */}
                            <div className="grid gap-2">
                                <Label htmlFor="description" className="text-xs font-medium text-foreground">
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
                                <Label htmlFor="image_url" className="text-xs font-medium text-foreground">
                                    Image URL <span className="text-muted-foreground text-xs">(optional)</span>
                                </Label>
                                <Input
                                    id="image_url"
                                    className="h-10"
                                    value={form.data.image_url}
                                    onChange={(e) => form.setData('image_url', e.target.value)}
                                />
                                <InputError message={form.errors.image_url} />
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                            <Link href="/management/products">
                                <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={form.processing}
                                className="gap-1.5 text-xs shadow-xs bg-[#823d21] text-white hover:bg-[#682e18] min-w-[120px]"
                            >
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
