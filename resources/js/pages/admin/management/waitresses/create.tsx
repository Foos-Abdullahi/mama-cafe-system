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
import { ArrowLeft, UserPlus, Hash, Lock } from 'lucide-react';

interface Props {
    default_commission_rate?: number;
    cafe_fixed_numbers?: string[];
    assigned_numbers?: string[];
}

export default function WaitressCreate({
    default_commission_rate = 0.15,
    cafe_fixed_numbers = ['101', '102', '103', '104', '105', '456543'],
    assigned_numbers = [],
}: Props) {
    // Select first number not assigned, or first available number
    const firstAvailable = cafe_fixed_numbers.find((num) => !assigned_numbers.includes(num)) ?? cafe_fixed_numbers[0] ?? '101';

    const form = useForm({
        name: '',
        phone: '',
        status: 'active' as 'active' | 'inactive',
        assigned_number: firstAvailable,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/management/waitresses');
    };

    return (
        <>
            <Head title="Add Waitress — MaMa Café" />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header with Title and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <UserPlus className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                                Add Waitress
                            </h1>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Register a new floor staff member and assign their unique waitress number.
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
                                        placeholder="e.g. Fatima Ali"
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
                                        placeholder="+252 61 XXX XXXX"
                                        className="h-10"
                                        value={form.data.phone}
                                        onChange={(e) => form.setData('phone', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.phone} />
                                </div>

                                {/* Commission Rate (Disabled - Managed in Settings) */}
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="commission_rate" className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                            Commission Rate <Lock className="h-3 w-3 text-muted-foreground" />
                                        </Label>
                                        <span className="text-[11px] text-muted-foreground">Managed in Settings</span>
                                    </div>
                                    <Input
                                        id="commission_rate"
                                        type="text"
                                        disabled
                                        className="h-10 font-mono bg-muted/50 cursor-not-allowed opacity-75"
                                        value={`${(default_commission_rate * 100).toFixed(0)}% (${default_commission_rate})`}
                                    />
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

                        {/* Single Assigned Waitress Number */}
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 md:p-5 space-y-3">
                            <div className="flex items-center gap-2">
                                <Hash className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                                    Assigned Waitress Number
                                </h2>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Select the unique number assigned to this waitress from the numbers configured in General Settings.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                <div className="grid gap-2">
                                    <Label htmlFor="assigned_number" className="text-xs font-medium text-foreground">
                                        Waitress Number <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={form.data.assigned_number}
                                        onValueChange={(val) => form.setData('assigned_number', val)}
                                    >
                                        <SelectTrigger id="assigned_number" className="w-full h-10 font-mono">
                                            <SelectValue placeholder="Select Waitress Number" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            {cafe_fixed_numbers.map((numStr) => {
                                                const isTaken = assigned_numbers.includes(numStr);
                                                return (
                                                    <SelectItem
                                                        key={numStr}
                                                        value={numStr}
                                                        disabled={isTaken}
                                                        className="font-mono text-xs"
                                                    >
                                                        #{numStr} {isTaken ? '(In Use by Another Waitress)' : ''}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.assigned_number} />
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
                                {form.processing ? 'Saving...' : 'Save Waitress'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

WaitressCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/waitresses' },
            { title: 'Waitresses', href: '/management/waitresses' },
            { title: 'Add Waitress', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
