import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Store, Hash, Edit, X, Plus, Trash2, Percent } from 'lucide-react';

interface WaitressItem {
    id: number;
    name: string;
    phone: string;
    status: string;
    assigned_number: string;
}

interface SystemSettings {
    cafe_name: string;
    cafe_phone: string;
    cafe_address: string;
    currency: string;
    tax_rate: string;
    vat_rate: string;
    default_commission_rate: string;
    commission_rates?: string;
    cafe_waitress_numbers: string;
}

interface Props {
    settings: SystemSettings;
    waitresses?: WaitressItem[];
}

export default function SystemSettingsIndex({ settings, waitresses = [] }: Props) {
    const [isEditing, setIsEditing] = useState(false);

    // Parse waitress numbers into an array of strings
    const initialNumbers = (settings.cafe_waitress_numbers || '')
        .split(',')
        .map((n) => n.trim())
        .filter(Boolean);

    // Parse commission rates into an array of strings
    const initialCommissions = (settings.commission_rates || '10, 12, 15, 18, 20')
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

    const [numberInputs, setNumberInputs] = useState<string[]>(initialNumbers);
    const [commissionInputs, setCommissionInputs] = useState<string[]>(initialCommissions);

    const [waitressPage, setWaitressPage] = useState(1);
    const WAITRESS_PAGE_SIZE = 5;
    const totalWaitressPages = Math.ceil(waitresses.length / WAITRESS_PAGE_SIZE) || 1;
    const paginatedWaitresses = waitresses.slice(
        (waitressPage - 1) * WAITRESS_PAGE_SIZE,
        waitressPage * WAITRESS_PAGE_SIZE,
    );

    const form = useForm({
        cafe_name: settings.cafe_name || '',
        cafe_phone: settings.cafe_phone || '',
        cafe_address: settings.cafe_address || '',
        currency: settings.currency || 'USD ($)',
        tax_rate: settings.tax_rate || '0',
        vat_rate: settings.vat_rate || '0',
        default_commission_rate: settings.default_commission_rate || '15',
        commission_rates: settings.commission_rates || '10, 12, 15, 18, 20',
        cafe_waitress_numbers: settings.cafe_waitress_numbers || '',
    });

    // Sync state when reset or canceled
    const handleCancel = () => {
        form.reset();
        setNumberInputs(initialNumbers);
        setCommissionInputs(initialCommissions);
        setIsEditing(false);
    };

    // Number Inputs Management
    const handleNumberChange = (index: number, val: string) => {
        const updated = [...numberInputs];
        updated[index] = val;
        setNumberInputs(updated);
        form.setData('cafe_waitress_numbers', updated.filter(Boolean).join(', '));
    };

    const addNumberInput = () => {
        const updated = [...numberInputs, ''];
        setNumberInputs(updated);
    };

    const removeNumberInput = (index: number) => {
        const updated = numberInputs.filter((_, i) => i !== index);
        setNumberInputs(updated);
        form.setData('cafe_waitress_numbers', updated.filter(Boolean).join(', '));
    };

    // Commission Inputs Management
    const handleCommissionChange = (index: number, val: string) => {
        const updated = [...commissionInputs];
        updated[index] = val;
        setCommissionInputs(updated);
        form.setData('commission_rates', updated.filter(Boolean).join(', '));
    };

    const addCommissionInput = () => {
        const updated = [...commissionInputs, ''];
        setCommissionInputs(updated);
    };

    const removeCommissionInput = (index: number) => {
        const updated = commissionInputs.filter((_, i) => i !== index);
        setCommissionInputs(updated);
        form.setData('commission_rates', updated.filter(Boolean).join(', '));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanedNumbers = numberInputs.map((n) => n.trim()).filter(Boolean).join(', ');
        const cleanedCommissions = commissionInputs.map((c) => c.trim()).filter(Boolean).join(', ');

        form.transform((data) => ({
            ...data,
            cafe_waitress_numbers: cleanedNumbers,
            commission_rates: cleanedCommissions,
        }));

        form.put('/system/settings', {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    return (
        <>
            <Head title="General Settings - MaMa Café" />

            <div className="p-4 md:p-6">
                {/* Header with Title and Action Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground tracking-tight">General System Settings</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Configure cafe identity, registered working waitress numbers, currency, VAT, and available commission rates.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {!isEditing ? (
                            <Button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="bg-[#823d21] text-white hover:bg-[#682e18] gap-1.5 text-xs shadow-xs"
                            >
                                <Edit className="h-4 w-4" />
                                Edit Settings
                            </Button>
                        ) : (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="gap-1.5 text-xs shadow-xs"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={form.processing}
                                    className="bg-[#823d21] text-white hover:bg-[#682e18] gap-1.5 text-xs shadow-xs min-w-[120px]"
                                >
                                    <Save className="h-4 w-4" />
                                    {form.processing ? 'Saving...' : 'Save Settings'}
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Cafe Branding & Contact Information */}
                        <div className="rounded-xl border bg-card p-5 md:p-6 shadow-xs space-y-6">
                            <div className="flex items-center gap-2 border-b border-border pb-3">
                                <Store className="h-5 w-5 text-[#823d21]" />
                                <h2 className="font-semibold text-base text-foreground">Cafe Identity & Contact Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="cafe_name" className="text-xs font-medium">
                                        Cafe Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="cafe_name"
                                        disabled={!isEditing}
                                        className={!isEditing ? 'bg-muted/50 cursor-not-allowed' : ''}
                                        value={form.data.cafe_name}
                                        onChange={(e) => form.setData('cafe_name', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.cafe_name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="cafe_phone" className="text-xs font-medium">
                                        Phone Number <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="cafe_phone"
                                        disabled={!isEditing}
                                        className={!isEditing ? 'bg-muted/50 cursor-not-allowed' : ''}
                                        value={form.data.cafe_phone}
                                        onChange={(e) => form.setData('cafe_phone', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.cafe_phone} />
                                </div>

                                <div className="grid gap-2 md:col-span-2">
                                    <Label htmlFor="cafe_address" className="text-xs font-medium">
                                        Physical Address <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="cafe_address"
                                        disabled={!isEditing}
                                        className={!isEditing ? 'bg-muted/50 cursor-not-allowed' : ''}
                                        value={form.data.cafe_address}
                                        onChange={(e) => form.setData('cafe_address', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.cafe_address} />
                                </div>
                            </div>
                        </div>

                        {/* Financial Configuration */}
                        <div className="rounded-xl border bg-card p-5 md:p-6 shadow-xs space-y-6">
                            <div className="flex items-center gap-2 border-b border-border pb-3">
                                <Percent className="h-5 w-5 text-[#823d21]" />
                                <h2 className="font-semibold text-base text-foreground">Financial Configuration</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="currency" className="text-xs font-medium">
                                        Operating Currency <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="currency"
                                        disabled={!isEditing}
                                        className={`h-10 ${!isEditing ? 'bg-muted/50 cursor-not-allowed' : ''}`}
                                        value={form.data.currency}
                                        onChange={(e) => form.setData('currency', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.currency} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="tax_rate" className="text-xs font-medium">
                                        Tax Rate (%) <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="tax_rate"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            disabled={!isEditing}
                                            className={`h-10 pr-8 ${!isEditing ? 'bg-muted/50 cursor-not-allowed' : ''}`}
                                            value={form.data.tax_rate}
                                            onChange={(e) => form.setData('tax_rate', e.target.value)}
                                            required
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</span>
                                    </div>
                                    <InputError message={form.errors.tax_rate} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="vat_rate" className="text-xs font-medium">
                                        VAT Rate (%) <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="vat_rate"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            disabled={!isEditing}
                                            className={`h-10 pr-8 ${!isEditing ? 'bg-muted/50 cursor-not-allowed' : ''}`}
                                            value={form.data.vat_rate}
                                            onChange={(e) => form.setData('vat_rate', e.target.value)}
                                            required
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</span>
                                    </div>
                                    <InputError message={form.errors.vat_rate} />
                                </div>
                            </div>
                        </div>

                        {/* Waitress Numbers & Commission Configuration */}
                        <div className="rounded-xl border bg-card p-5 md:p-6 shadow-xs space-y-6">
                            <div className="flex items-center gap-2 border-b border-border pb-3">
                                <Hash className="h-5 w-5 text-[#823d21]" />
                                <h2 className="font-semibold text-base text-foreground">Working Waitress Numbers &amp; Commission Configuration</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* 1. Waitress Numbers Input List */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Registered Working Waitress Numbers ({numberInputs.length})
                                        </Label>
                                        {isEditing && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={addNumberInput}
                                                className="h-8 gap-1.5 text-xs bg-[#823d21] text-white hover:bg-[#682e18]"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                                Add Working Number
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                        {numberInputs.length === 0 ? (
                                            <p className="text-xs text-muted-foreground italic">No working waitress numbers configured. Click Add Working Number to register one.</p>
                                        ) : (
                                            numberInputs.map((num, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <div className="relative flex-1">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#823d21]">#</span>
                                                        <Input
                                                            placeholder="Working waitress number e.g. 1, 2, 101, 102"
                                                            disabled={!isEditing}
                                                            className={`h-10 font-mono pl-7 ${!isEditing ? 'bg-muted/50 cursor-not-allowed' : ''}`}
                                                            value={num}
                                                            onChange={(e) => handleNumberChange(idx, e.target.value)}
                                                        />
                                                    </div>
                                                    {isEditing && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => removeNumberInput(idx)}
                                                            className="h-10 w-10 shrink-0 text-red-500 hover:bg-red-500/10 hover:text-red-600 border-red-200 dark:border-red-900/30"
                                                            title="Remove input"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">
                                        Each registered number represents an active floor station / badge number assigned to working waitresses during service and at the POS terminal.
                                    </p>
                                    <InputError message={form.errors.cafe_waitress_numbers} />
                                </div>

                                {/* 2. Commission Rates Input List */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Available Commission Rates ({commissionInputs.length})
                                        </Label>
                                        {isEditing && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={addCommissionInput}
                                                className="h-8 gap-1.5 text-xs bg-[#823d21] text-white hover:bg-[#682e18]"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                                Add Commission
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                        {commissionInputs.length === 0 ? (
                                            <p className="text-xs text-muted-foreground italic">No commission rates configured. Click Add Commission to create one.</p>
                                        ) : (
                                            commissionInputs.map((rate, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <div className="relative flex-1">
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            placeholder="Commission percentage e.g. 15"
                                                            disabled={!isEditing}
                                                            className={`h-10 font-mono pr-8 ${!isEditing ? 'bg-muted/50 cursor-not-allowed' : ''}`}
                                                            value={rate}
                                                            onChange={(e) => handleCommissionChange(idx, e.target.value)}
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</span>
                                                    </div>
                                                    {isEditing && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => removeCommissionInput(idx)}
                                                            className="h-10 w-10 shrink-0 text-red-500 hover:bg-red-500/10 hover:text-red-600 border-red-200 dark:border-red-900/30"
                                                            title="Remove input"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">
                                        These rates will appear as options in the dropdown when adding or editing a waitress.
                                    </p>
                                    <InputError message={form.errors.commission_rates} />
                                </div>
                            </div>
                        </div>

                        {/* Registered Waitresses & Assigned Numbers Overview with 5-item Pagination */}
                        <div className="rounded-xl border bg-card p-5 md:p-6 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-border pb-3">
                                <div>
                                    <h2 className="font-semibold text-base text-foreground">Registered Waitresses &amp; Assigned Working Numbers</h2>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Overview of floor waitresses and their currently active working numbers used during orders.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-border overflow-hidden divide-y divide-border">
                                {paginatedWaitresses.length > 0 ? (
                                    paginatedWaitresses.map((w) => (
                                        <div key={w.id} className="p-3.5 flex items-center justify-between bg-card text-xs">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <p className="font-semibold text-foreground text-sm">{w.name}</p>
                                                    <p className="text-muted-foreground text-[11px]">{w.phone || 'No phone'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-muted-foreground">Assigned Working Number:</span>
                                                {w.assigned_number !== '—' ? (
                                                    <span className="font-mono font-bold bg-[#823d21] text-white px-2.5 py-1 rounded-full text-xs">
                                                        Working No. #{w.assigned_number}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">No working number assigned</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-xs text-muted-foreground italic">
                                        No waitresses registered in the system.
                                    </div>
                                )}
                            </div>

                            {waitresses.length > 0 && (
                                <div className="flex items-center justify-between pt-2 text-xs">
                                    <span className="text-muted-foreground">
                                        Showing {(waitressPage - 1) * WAITRESS_PAGE_SIZE + 1} to{' '}
                                        {Math.min(waitressPage * WAITRESS_PAGE_SIZE, waitresses.length)} of {waitresses.length} waitresses
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-xs px-2.5 cursor-pointer"
                                            disabled={waitressPage === 1}
                                            onClick={() => setWaitressPage((p) => Math.max(1, p - 1))}
                                        >
                                            Previous
                                        </Button>
                                        <span className="font-medium text-foreground">
                                            Page {waitressPage} of {totalWaitressPages}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-xs px-2.5 cursor-pointer"
                                            disabled={waitressPage === totalWaitressPages}
                                            onClick={() => setWaitressPage((p) => Math.min(totalWaitressPages, p + 1))}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Actions Footer */}
                        <div className="flex items-center justify-between border-t border-border pt-4">
                            <p className="text-xs text-muted-foreground">
                                {!isEditing
                                    ? 'Settings are currently locked. Click "Edit Settings" above to unlock inputs.'
                                    : 'Make your desired changes and click Save Settings to apply.'}
                            </p>
                            {isEditing && (
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancel}
                                        className="gap-1.5 text-xs shadow-xs"
                                    >
                                        <X className="h-4 w-4" />
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={form.processing}
                                        className="bg-[#823d21] text-white hover:bg-[#682e18] gap-1.5 text-xs shadow-xs min-w-[140px]"
                                    >
                                        <Save className="h-4 w-4" />
                                        {form.processing ? 'Saving...' : 'Save Settings'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

SystemSettingsIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'System', href: '/system/settings' },
            { title: 'General Settings', href: '/system/settings' },
        ]}
    >
        {page}
    </AppLayout>
);


