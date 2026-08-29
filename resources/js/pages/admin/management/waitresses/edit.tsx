import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit } from 'lucide-react';

interface FixedNumber {
    id: number;
    range_start: number;
    range_end: number;
}

interface Waitress {
    id: number;
    name: string;
    phone: string | null;
    commission_rate: number | string;
    status: 'active' | 'inactive';
    fixed_numbers: FixedNumber[];
}

interface Props {
    waitress: Waitress;
}

export default function WaitressEdit({ waitress }: Props) {
    const firstRange = waitress.fixed_numbers?.[0];

    const form = useForm({
        name: waitress.name,
        phone: waitress.phone ?? '',
        commission_rate: waitress.commission_rate?.toString() ?? '0.15',
        status: waitress.status,
        range_start: firstRange?.range_start?.toString() ?? '',
        range_end: firstRange?.range_end?.toString() ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/management/waitresses/${waitress.id}`);
    };

    return (
        <>
            <Head title={`Edit ${waitress.name} - MaMa Café`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <Edit className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Edit Waitress
                            </h1>
                            <p className="text-sm text-muted-foreground">Update details for <strong>{waitress.name}</strong>.</p>
                        </div>
                    </div>
                    <Link href="/management/waitresses">
                        <Button variant="outline" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Waitresses
                        </Button>
                    </Link>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    required
                                    autoFocus
                                />
                                <InputError message={form.errors.name} />
                            </div>

                            {/* Phone Number */}
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                                <Input
                                    id="phone"
                                    value={form.data.phone}
                                    onChange={(e) => form.setData('phone', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.phone} />
                            </div>

                            {/* Commission Rate */}
                            <div className="grid gap-2">
                                <Label htmlFor="commission_rate">Commission Rate <span className="text-red-500">*</span></Label>
                                <Input
                                    id="commission_rate"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max="1"
                                    value={form.data.commission_rate}
                                    onChange={(e) => form.setData('commission_rate', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.commission_rate} />
                            </div>

                            {/* Status */}
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                                <select
                                    id="status"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={form.data.status}
                                    onChange={(e) => form.setData('status', e.target.value as any)}
                                >
                                    <option value="active">Active (On Duty)</option>
                                    <option value="inactive">Inactive (Off Duty)</option>
                                </select>
                                <InputError message={form.errors.status} />
                            </div>
                        </div>

                        {/* Fixed Number Range */}
                        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
                            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                                Fixed Number Range
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="range_start" className="text-xs">Start Number <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="range_start"
                                        type="number"
                                        min="1"
                                        value={form.data.range_start}
                                        onChange={(e) => form.setData('range_start', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.range_start} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="range_end" className="text-xs">End Number <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="range_end"
                                        type="number"
                                        min="1"
                                        value={form.data.range_end}
                                        onChange={(e) => form.setData('range_end', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.range_end} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t pt-4">
                            <Link href="/management/waitresses">
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

WaitressEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/waitresses' },
            { title: 'Waitresses', href: '/management/waitresses' },
            { title: 'Edit Staff', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
