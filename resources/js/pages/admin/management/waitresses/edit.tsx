import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
            <Head title={`Edit ${waitress.name} — MaMa Café`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header with Title and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <Edit className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                                Edit Waitress
                            </h1>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Update details for staff member <strong>{waitress.name}</strong>.
                            </p>
                        </div>
                    </div>
                    <Link href="/management/waitresses">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to Waitresses
                        </Button>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-xs">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2.5">
                                Staff Profile & Terms
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-xs font-medium text-foreground">
                                        Full Name <span className="text-red-500">*</span>
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

                                {/* Phone Number */}
                                <div className="grid gap-2">
                                    <Label htmlFor="phone" className="text-xs font-medium text-foreground">
                                        Phone Number <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        className="h-10"
                                        value={form.data.phone}
                                        onChange={(e) => form.setData('phone', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.phone} />
                                </div>

                                {/* Commission Rate */}
                                <div className="grid gap-2">
                                    <Label htmlFor="commission_rate" className="text-xs font-medium text-foreground">
                                        Commission Rate <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="commission_rate"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max="1"
                                        className="h-10 font-mono"
                                        value={form.data.commission_rate}
                                        onChange={(e) => form.setData('commission_rate', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.commission_rate} />
                                </div>

                                {/* Status */}
                                <div className="grid gap-2">
                                    <Label htmlFor="status" className="text-xs font-medium text-foreground">
                                        Status <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={form.data.status}
                                        onValueChange={(val: 'active' | 'inactive') => form.setData('status', val)}
                                    >
                                        <SelectTrigger id="status" className="w-full h-10">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active (On Duty)</SelectItem>
                                            <SelectItem value="inactive">Inactive (Off Duty)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.status} />
                                </div>
                            </div>
                        </div>

                        {/* Fixed Number Range */}
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 md:p-5 space-y-3">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                                Assigned Fixed / Table Number Range
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="range_start" className="text-xs font-medium text-foreground">
                                        Start Number <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="range_start"
                                        type="number"
                                        min="1"
                                        className="h-10 font-mono"
                                        value={form.data.range_start}
                                        onChange={(e) => form.setData('range_start', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.range_start} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="range_end" className="text-xs font-medium text-foreground">
                                        End Number <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="range_end"
                                        type="number"
                                        min="1"
                                        className="h-10 font-mono"
                                        value={form.data.range_end}
                                        onChange={(e) => form.setData('range_end', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.range_end} />
                                </div>
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                            <Link href="/management/waitresses">
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

WaitressEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/waitresses' },
            { title: 'Waitresses', href: '/management/waitresses' },
            { title: 'Edit Waitress', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
