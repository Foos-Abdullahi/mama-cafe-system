import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
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
import { ArrowLeft, Wallet, DollarSign } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface WaitressOption {
    id: number;
    name: string;
    phone: string | null;
    commission_rate: number;
    total_orders: number;
    total_sales: number;
    earned_commission: number;
    paid_commission: number;
    unpaid_commission: number;
}

interface Props {
    waitresses: WaitressOption[];
    selectedWaitressId: number | null;
}

export default function PayrollCreate({ waitresses, selectedWaitressId }: Props) {
    const initialWaitress = waitresses.find((w) => w.id === selectedWaitressId) || waitresses[0];

    const form = useForm({
        waitress_id: initialWaitress ? String(initialWaitress.id) : '',
        period_start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
        period_end: new Date().toISOString().split('T')[0],
        commission_amount: initialWaitress ? String(initialWaitress.unpaid_commission > 0 ? initialWaitress.unpaid_commission.toFixed(2) : initialWaitress.earned_commission.toFixed(2)) : '',
        notes: initialWaitress ? `15% Commission Payout for ${initialWaitress.name}` : '',
    });

    const activeWaitress = waitresses.find((w) => String(w.id) === form.data.waitress_id);

    const handleWaitressChange = (value: string) => {
        const id = value;
        const w = waitresses.find((item) => String(item.id) === id);
        form.setData((data) => ({
            ...data,
            waitress_id: id,
            commission_amount: w ? String(w.unpaid_commission > 0 ? w.unpaid_commission.toFixed(2) : w.earned_commission.toFixed(2)) : '',
            notes: w ? `15% Commission Payout for ${w.name}` : '',
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/finance/payroll');
    };

    return (
        <>
            <Head title="Process Staff Payout — MaMa Café" />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header with Title and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <Wallet className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                                Process Staff Payout
                            </h1>
                            <p className="text-xs text-muted-foreground mt-0.5">Issue a 15% commission payment slip to floor staff.</p>
                        </div>
                    </div>
                    <Link href="/finance/payroll">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to Payroll
                        </Button>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-xs">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2.5">
                                Payout Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Waitress Selection */}
                                <div className="grid gap-2">
                                    <Label htmlFor="waitress_id" className="text-xs font-medium text-foreground">
                                        Select Waitress <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={form.data.waitress_id}
                                        onValueChange={handleWaitressChange}
                                    >
                                        <SelectTrigger id="waitress_id" className="w-full h-10">
                                            <SelectValue placeholder="— Select floor staff —" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {waitresses.map((w) => (
                                                <SelectItem key={w.id} value={String(w.id)}>
                                                    {w.name} (Unpaid: ${w.unpaid_commission.toFixed(2)})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.waitress_id} />
                                </div>

                                {/* Payout Amount */}
                                <div className="grid gap-2">
                                    <Label htmlFor="commission_amount" className="text-xs font-medium text-foreground">
                                        Payout Amount ($) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="commission_amount"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        placeholder="0.00"
                                        className="h-10 font-mono"
                                        value={form.data.commission_amount}
                                        onChange={(e) => form.setData('commission_amount', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.commission_amount} />
                                </div>

                                {/* Pay Period Start */}
                                <div className="grid gap-2">
                                    <Label htmlFor="period_start" className="text-xs font-medium text-foreground">
                                        Period Start <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="period_start"
                                        type="date"
                                        className="h-10"
                                        value={form.data.period_start}
                                        onChange={(e) => form.setData('period_start', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.period_start} />
                                </div>

                                {/* Pay Period End */}
                                <div className="grid gap-2">
                                    <Label htmlFor="period_end" className="text-xs font-medium text-foreground">
                                        Period End <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="period_end"
                                        type="date"
                                        className="h-10"
                                        value={form.data.period_end}
                                        onChange={(e) => form.setData('period_end', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.period_end} />
                                </div>
                            </div>
                        </div>

                        {/* Staff Metrics Summary Box */}
                        {activeWaitress && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/20 border border-border/70">
                                <div>
                                    <p className="text-[11px] text-muted-foreground uppercase font-semibold">Staff Name</p>
                                    <p className="text-sm font-bold text-foreground mt-0.5">{activeWaitress.name}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-muted-foreground uppercase font-semibold">Total Orders</p>
                                    <p className="text-sm font-bold text-foreground mt-0.5">{activeWaitress.total_orders} Orders</p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-muted-foreground uppercase font-semibold">Total Sales</p>
                                    <p className="text-sm font-bold text-foreground mt-0.5 font-mono">${activeWaitress.total_sales.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-muted-foreground uppercase font-semibold">Unpaid Balance</p>
                                    <p className="text-sm font-bold text-emerald-600 mt-0.5 font-mono">${activeWaitress.unpaid_commission.toFixed(2)}</p>
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        <div className="grid gap-2">
                            <Label htmlFor="notes" className="text-xs font-medium text-foreground">
                                Notes / Reference
                            </Label>
                            <Input
                                id="notes"
                                placeholder="e.g. Paid in cash by Manager"
                                className="h-10"
                                value={form.data.notes}
                                onChange={(e) => form.setData('notes', e.target.value)}
                            />
                            <InputError message={form.errors.notes} />
                        </div>

                        {/* Actions Footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                            <Link href="/finance/payroll">
                                <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={form.processing}
                                className="gap-1.5 text-xs shadow-xs bg-[#823d21] text-white hover:bg-[#682e18] min-w-[160px]"
                            >
                                <DollarSign className="h-3.5 w-3.5" />
                                {form.processing ? 'Processing...' : 'Confirm & Generate Slip'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

PayrollCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Finance & Reports', href: '/finance/payroll' },
            { title: 'Payroll', href: '/finance/payroll' },
            { title: 'Process Payout', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
