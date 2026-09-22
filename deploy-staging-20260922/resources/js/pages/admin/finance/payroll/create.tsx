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
    CheckCircle2,
    Copy,
    Smartphone,
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
        fixed_number_id: cafeNumbers[0]?.id ? String(cafeNumbers[0].id) : '',
        notes: '',
    });

    const [showEvcDialog, setShowEvcDialog] = useState(false);
    const [copied, setCopied] = useState(false);

    const activeWaitress = waitresses.find((w) => String(w.id) === form.data.waitress_id);

    const payoutAmount = parseFloat(form.data.commission_amount) || 0;
    const isFullyPaid = activeWaitress ? (activeWaitress.unpaid_commission <= 0 || activeWaitress.is_fully_paid) : false;

    const rawPhone = activeWaitress?.phone || '';
    const cleanReceiver = rawPhone.replace(/\D/g, '') || '55555555';
    const ussdInstruction = `*712*${cleanReceiver}*${payoutAmount.toFixed(2)}#`;

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

    const handleConfirmClick = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFullyPaid) return;
        setShowEvcDialog(true);
    };

    const handleCopyUssd = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(ussdInstruction);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFinalSubmit = () => {
        setShowEvcDialog(false);
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

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div>
                                        <p className="text-[11px] text-muted-foreground uppercase font-semibold">Staff Name</p>
                                        <p className="text-sm font-bold text-foreground mt-0.5">{activeWaitress.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-muted-foreground uppercase font-semibold">Staff Number</p>
                                        <p className="text-sm font-bold text-foreground mt-0.5 font-mono">{activeWaitress.phone || 'N/A'}</p>
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

            {/* ─── EVC (USSD) CONFIRMATION DIALOG ─── */}
            <Dialog open={showEvcDialog} onOpenChange={setShowEvcDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="space-y-1">
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                                <Smartphone className="h-5 w-5" />
                            </div>
                            <DialogTitle className="text-base font-bold text-foreground">
                                Confirm EVC (USSD)
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Please confirm you have completed the USSD payment to the receiver.
                        </DialogDescription>
                    </DialogHeader>

                    {/* USSD Details Box */}
                    <div className="my-2 rounded-xl bg-muted/30 border border-border/70 p-4 space-y-3.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
                            USSD Payment Details
                        </h4>

                        {/* Receiver Information */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground font-medium">Receiver Name:</span>
                                <span className="font-bold text-foreground text-sm">{activeWaitress?.name || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground font-medium">Receiver Number:</span>
                                <span className="font-mono font-bold text-foreground text-sm">{cleanReceiver}</span>
                            </div>
                        </div>

                        {/* USSD Instruction box */}
                        <div className="rounded-lg bg-card border border-border p-3 text-xs font-mono font-bold text-foreground flex items-center justify-between shadow-xs">
                            <span className="text-[#823d21]">USSD Instruction:</span>
                            <span className="text-foreground select-all">{ussdInstruction}</span>
                        </div>

                        {/* Copy USSD Button */}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleCopyUssd}
                            className="w-full h-9 gap-2 text-xs border-[#823d21]/30 text-[#823d21] hover:bg-[#823d21]/10 shadow-xs"
                        >
                            {copied ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    <span className="font-semibold text-emerald-600">Copied to Clipboard!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4" />
                                    <span>Copy USSD</span>
                                </>
                            )}
                        </Button>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setShowEvcDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            disabled={form.processing}
                            onClick={handleFinalSubmit}
                            className="text-xs font-semibold bg-[#823d21] hover:bg-[#682e18] text-white min-w-[150px] shadow-xs"
                        >
                            {form.processing ? 'Processing...' : 'Confirm I Have Paid'}
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
