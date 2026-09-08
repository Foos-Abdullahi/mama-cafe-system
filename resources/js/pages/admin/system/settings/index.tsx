import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, Store, Hash, Edit, X, Plus } from 'lucide-react';

interface SystemSettings {
    cafe_name: string;
    cafe_phone: string;
    cafe_address: string;
    currency: string;
    tax_rate: string;
    default_commission_rate: string;
    cafe_fixed_numbers: string;
}

interface Props {
    settings: SystemSettings;
}

export default function SystemSettingsIndex({ settings }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [newNumberInput, setNewNumberInput] = useState('');

    const form = useForm({
        cafe_name: settings.cafe_name || '',
        cafe_phone: settings.cafe_phone || '',
        cafe_address: settings.cafe_address || '',
        currency: settings.currency || 'USD ($)',
        tax_rate: settings.tax_rate || '0',
        default_commission_rate: settings.default_commission_rate || '15',
        cafe_fixed_numbers: settings.cafe_fixed_numbers || '101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 150, 456543',
    });

    const parsedNumbers = form.data.cafe_fixed_numbers
        .split(',')
        .map((num) => num.trim())
        .filter(Boolean);

    const handleAddNumber = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = newNumberInput.trim();
        if (!trimmed) return;

        if (!parsedNumbers.includes(trimmed)) {
            const updated = [...parsedNumbers, trimmed];
            form.setData('cafe_fixed_numbers', updated.join(', '));
        }
        setNewNumberInput('');
    };

    const handleRemoveNumber = (numToRemove: string) => {
        const updated = parsedNumbers.filter((n) => n !== numToRemove);
        form.setData('cafe_fixed_numbers', updated.join(', '));
    };

    const handleCancel = () => {
        form.reset();
        setNewNumberInput('');
        setIsEditing(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put('/system/settings', {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const presetCommissions = ['10', '12', '15', '18', '20', '25'];

    return (
        <>
            <Head title="General Settings - MaMa Café" />

            <div className="p-4 md:p-6">
                {/* Header with Title and Action Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground tracking-tight">General System Settings</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Configure cafe identity, waitress fixed numbers, operating currency, and commission rules.
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

                        {/* Fixed Numbers & Commission Configuration */}
                        <div className="rounded-xl border bg-card p-5 md:p-6 shadow-xs space-y-6">
                            <div className="flex items-center gap-2 border-b border-border pb-3">
                                <Hash className="h-5 w-5 text-[#823d21]" />
                                <h2 className="font-semibold text-base text-foreground">Fixed Numbers & Commission Configuration</h2>
                            </div>

                            <div className="space-y-6">
                                {/* Waitress Fixed Numbers List Management */}
                                <div className="grid gap-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-medium">
                                            Café Waitress Fixed Numbers <span className="text-red-500">*</span>
                                        </Label>
                                        <span className="text-xs text-muted-foreground">
                                            Total configured: {parsedNumbers.length} numbers
                                        </span>
                                    </div>

                                    {/* Add Number Input Control (When Editing) */}
                                    {isEditing && (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                placeholder="Enter a new waitress number (e.g. 108)"
                                                className="font-mono h-10 max-w-sm"
                                                value={newNumberInput}
                                                onChange={(e) => setNewNumberInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddNumber();
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => handleAddNumber()}
                                                variant="secondary"
                                                className="gap-1.5 h-10 text-xs bg-[#823d21]/10 text-[#823d21] hover:bg-[#823d21]/20 border border-[#823d21]/20 font-medium"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Add Number
                                            </Button>
                                        </div>
                                    )}

                                    {/* Display Chip Tags */}
                                    <div className="flex flex-wrap gap-2 p-3.5 rounded-lg border bg-muted/20 min-h-[56px] items-center">
                                        {parsedNumbers.length === 0 ? (
                                            <p className="text-xs text-muted-foreground italic">No fixed numbers configured yet.</p>
                                        ) : (
                                            parsedNumbers.map((num) => (
                                                <Badge
                                                    key={num}
                                                    variant="secondary"
                                                    className="font-mono text-xs px-2.5 py-1 gap-1.5 bg-background border border-border shadow-2xs hover:bg-muted"
                                                >
                                                    <span className="text-[#823d21] font-semibold">#{num}</span>
                                                    {isEditing && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveNumber(num)}
                                                            className="text-muted-foreground hover:text-red-500 rounded-full p-0.5 transition-colors"
                                                            title="Remove number"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    )}
                                                </Badge>
                                            ))
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        These numbers represent the physical floor cards available for waitresses on duty.
                                    </p>
                                    <InputError message={form.errors.cafe_fixed_numbers} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    {/* Commission Rate Config */}
                                    <div className="grid gap-3">
                                        <Label htmlFor="default_commission_rate" className="text-xs font-medium">
                                            Default Waitress Commission Rate (%) <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="default_commission_rate"
                                                type="number"
                                                step="0.1"
                                                disabled={!isEditing}
                                                className={`font-mono h-10 ${!isEditing ? 'bg-muted/50 cursor-not-allowed' : ''}`}
                                                value={form.data.default_commission_rate}
                                                onChange={(e) => form.setData('default_commission_rate', e.target.value)}
                                                required
                                            />
                                            <span className="font-semibold text-sm text-muted-foreground">%</span>
                                        </div>

                                        {/* Quick Add / Select Preset Commission Badges */}
                                        {isEditing && (
                                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                                <span className="text-[11px] text-muted-foreground mr-1">Quick Select:</span>
                                                {presetCommissions.map((rate) => (
                                                    <button
                                                        key={rate}
                                                        type="button"
                                                        onClick={() => form.setData('default_commission_rate', rate)}
                                                        className={`text-xs px-2 py-0.5 rounded border font-mono transition-colors ${
                                                            form.data.default_commission_rate === rate
                                                                ? 'bg-[#823d21] text-white border-[#823d21]'
                                                                : 'bg-background hover:bg-muted text-foreground border-border'
                                                        }`}
                                                    >
                                                        {rate}%
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        <InputError message={form.errors.default_commission_rate} />
                                    </div>

                                    {/* Currency */}
                                    <div className="grid gap-3">
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
                                </div>
                            </div>
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
