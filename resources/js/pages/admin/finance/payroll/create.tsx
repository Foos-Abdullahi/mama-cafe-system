import React, { useState } from 'react';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    ArrowLeft,
    Wallet,
    DollarSign,
    Smartphone,
    AlertTriangle,
    ChevronRight,
    CheckCircle,
    CheckCircle2,
} from 'lucide-react';
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
    is_fully_paid?: boolean;
}

interface CafeNumber {
    id: number;
    label: string;
    current_number: number;
    balance: number;
    status: string;
}

interface Props {
    waitresses: WaitressOption[];
    cafeNumbers: CafeNumber[];
    selectedWaitressId: number | null;
}

export default function PayrollCreate({ waitresses, cafeNumbers, selectedWaitressId }: Props) {
    const initialWaitress = waitresses.find((w) => w.id === selectedWaitressId) || waitresses[0];

    const form = useForm({
        waitress_id: initialWaitress ? String(initialWaitress.id) : '',
        period_start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
        period_end: new Date().toISOString().split('T')[0],
        commission_amount: initialWaitress
            ? String(
                  initialWaitress.unpaid_commission > 0
                      ? initialWaitress.unpaid_commission.toFixed(2)
                      : initialWaitress.earned_commission.toFixed(2),
              )
            : '',
        fixed_number_id: '',
        notes: '',
    });

    // Dialog state: null = closed, 'select' = dialog 1, 'confirm' = dialog 2
    const [dialogStep, setDialogStep] = useState<null | 'select' | 'confirm'>(null);

    const activeWaitress = waitresses.find((w) => String(w.id) === form.data.waitress_id);
    const selectedCafeNumber = cafeNumbers.find((c) => String(c.id) === form.data.fixed_number_id);

    const payoutAmount = parseFloat(form.data.commission_amount) || 0;
    const balanceAfter = selectedCafeNumber ? selectedCafeNumber.balance - payoutAmount : null;
    const isInsufficientBalance = selectedCafeNumber ? selectedCafeNumber.balance < payoutAmount : false;
    const isFullyPaid = activeWaitress ? (activeWaitress.unpaid_commission <= 0 || activeWaitress.is_fully_paid) : false;

    const handleWaitressChange = (value: string) => {
        const w = waitresses.find((item) => String(item.id) === value);
        form.setData((data) => ({
            ...data,
            waitress_id: value,
            commission_amount: w
                ? String(w.unpaid_commission > 0 ? w.unpaid_commission.toFixed(2) : w.earned_commission.toFixed(2))
                : '',
        }));
    };

    // Step 1: open the "select café number" dialog
    const handleConfirmClick = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFullyPaid) return;
        setDialogStep('select');
    };

    // Step 2: proceed to "Ma hubtaa?" confirmation dialog
    const handleNext = () => {
        if (!form.data.fixed_number_id) return;
        setDialogStep('confirm');
    };

    // Final submit
    const handleFinalSubmit = () => {
        setDialogStep(null);
        form.post('/finance/payroll');
    };

    return (
        <>
            <Head title="Process Staff Payout — MaMa Café" />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <Wallet className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                                Process Staff Payout
                            </h1>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Issue a commission payment slip to floor staff.
                            </p>
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
                    <form onSubmit={handleConfirmClick} className="space-y-6">
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
                                    <Select value={form.data.waitress_id} onValueChange={handleWaitressChange}>
                                        <SelectTrigger id="waitress_id" className="w-full h-10">
                                            <SelectValue placeholder="— Select floor staff —" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {waitresses.map((w) => (
                                                <SelectItem key={w.id} value={String(w.id)}>
                                                    {w.name} {w.unpaid_commission > 0 ? `(Unpaid: $${w.unpaid_commission.toFixed(2)})` : '(✓ Fully Paid)'}
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
                                        disabled={isFullyPaid}
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
                                        disabled={isFullyPaid}
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
                                        disabled={isFullyPaid}
                                        required
                                    />
                                    <InputError message={form.errors.period_end} />
                                </div>
                            </div>
                        </div>

                        {/* Staff Metrics Summary Box */}
                        {activeWaitress && (
                            <div className="rounded-xl bg-muted/20 border border-border/70 p-4 space-y-3">
                                <div className="border-b border-border/50 pb-2.5">
                                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                                        Staff Summary
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                                        <p className="text-sm font-bold text-foreground mt-0.5 font-mono">
                                            ${activeWaitress.total_sales.toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-muted-foreground uppercase font-semibold">Unpaid Balance</p>
                                        <p className={`text-sm font-bold mt-0.5 font-mono ${isFullyPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            ${activeWaitress.unpaid_commission.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Fully Paid Notice */}
                        {isFullyPaid && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                                <div className="text-xs">
                                    <p className="font-bold text-sm">Commission Fully Settled</p>
                                    <p className="mt-0.5 text-emerald-700 dark:text-emerald-400">
                                        This staff member has no pending unpaid commission for this period. All previous orders ({activeWaitress?.total_orders} orders, ${activeWaitress?.total_sales.toFixed(2)} sales) have been paid out.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Actions Footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                            <Link href="/finance/payroll">
                                <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                    Cancel
                                </Button>
                            </Link>
                            {!isFullyPaid && (
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={form.processing || !form.data.waitress_id || !form.data.commission_amount}
                                    className="gap-1.5 text-xs shadow-xs bg-[#823d21] text-white hover:bg-[#682e18] min-w-[160px]"
                                >
                                    <DollarSign className="h-3.5 w-3.5" />
                                    Confirm &amp; Generate Slip
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* ─── DIALOG 1: Select Café Number ─── */}
            <Dialog open={dialogStep === 'select'} onOpenChange={(open) => !open && setDialogStep(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#823d21]/10 text-[#823d21]">
                                <Smartphone className="h-4 w-4" />
                            </div>
                            <DialogTitle className="text-base">Select Café Number</DialogTitle>
                        </div>
                        <DialogDescription className="text-xs">
                            Choose which company number to send the payment from.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {/* Café Number Selector */}
                        <div className="grid gap-2">
                            <Label className="text-xs font-medium">Pay From <span className="text-red-500">*</span></Label>
                            <Select
                                value={form.data.fixed_number_id}
                                onValueChange={(v) => form.setData('fixed_number_id', v)}
                            >
                                <SelectTrigger id="fixed_number_id" className="w-full h-10">
                                    <SelectValue placeholder="— Select a café number —" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cafeNumbers.length === 0 ? (
                                        <SelectItem value="none" disabled>
                                            No café numbers available
                                        </SelectItem>
                                    ) : (
                                        cafeNumbers.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                <span className="font-mono">{c.label}</span>
                                                <span className="ml-2 text-muted-foreground">
                                                    — Bal: ${c.balance.toFixed(2)}
                                                </span>
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.fixed_number_id} />
                        </div>

                        {/* Amount being paid */}
                        <div className="rounded-lg bg-muted/30 border border-border/60 p-3 space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Paying to</span>
                                <span className="font-semibold text-foreground">{activeWaitress?.name ?? '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Amount</span>
                                <span className="font-mono font-bold text-foreground">${payoutAmount.toFixed(2)}</span>
                            </div>
                            {selectedCafeNumber && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Current Balance</span>
                                        <span className="font-mono font-medium">${selectedCafeNumber.balance.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-border/50 pt-2 flex justify-between">
                                        <span className="text-muted-foreground">Remaining After</span>
                                        <span
                                            className={`font-mono font-bold ${isInsufficientBalance ? 'text-red-600' : 'text-emerald-600'}`}
                                        >
                                            ${(balanceAfter ?? 0).toFixed(2)}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Insufficient balance warning */}
                        {isInsufficientBalance && (
                            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 p-3 text-xs text-red-700 dark:text-red-400">
                                <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                <span>
                                    Insufficient balance. This café number only has ${selectedCafeNumber?.balance.toFixed(2)} available.
                                </span>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setDialogStep(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            className="gap-1.5 text-xs bg-[#823d21] text-white hover:bg-[#682e18]"
                            disabled={!form.data.fixed_number_id || isInsufficientBalance}
                            onClick={handleNext}
                        >
                            Next
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─── DIALOG 2: Ma hubtaa? Confirmation ─── */}
            <Dialog open={dialogStep === 'confirm'} onOpenChange={(open) => !open && setDialogStep('select')}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                                <CheckCircle className="h-4 w-4" />
                            </div>
                            <DialogTitle className="text-base">Ma hubtaa?</DialogTitle>
                        </div>
                        <DialogDescription className="text-xs">
                            Are you sure you want to process this payment?
                        </DialogDescription>
                    </DialogHeader>

                    {/* Payment summary */}
                    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3 text-xs my-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Staff Member</span>
                            <span className="font-semibold text-foreground">{activeWaitress?.name ?? '—'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount to Pay</span>
                            <span className="font-mono font-bold text-[#823d21] text-sm">${payoutAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Sent From</span>
                            <span className="font-mono font-medium text-foreground">
                                {selectedCafeNumber?.label ?? '—'}
                            </span>
                        </div>
                        <div className="border-t border-border pt-3 flex justify-between">
                            <span className="text-muted-foreground">Balance After</span>
                            <span className="font-mono font-bold text-emerald-600">
                                ${(balanceAfter ?? 0).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs gap-1.5"
                            onClick={() => setDialogStep('select')}
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Maya, Jooji
                        </Button>
                        <Button
                            size="sm"
                            disabled={form.processing}
                            className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white min-w-[130px]"
                            onClick={handleFinalSubmit}
                        >
                            <CheckCircle className="h-3.5 w-3.5" />
                            {form.processing ? 'Processing...' : 'Haa, Sii wad'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
