import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, Store, Hash, DollarSign } from 'lucide-react';

interface SystemSettings {
    cafe_name: string;
    cafe_phone: string;
    cafe_address: string;
    currency: string;
    tax_rate: string;
    default_commission_rate: string;
    fixed_number_start: string;
    fixed_number_end: string;
}

interface Props {
    settings: SystemSettings;
}

export default function SystemSettingsIndex({ settings }: Props) {
    const form = useForm({
        cafe_name: settings.cafe_name || '',
        cafe_phone: settings.cafe_phone || '',
        cafe_address: settings.cafe_address || '',
        currency: settings.currency || 'USD ($)',
        tax_rate: settings.tax_rate || '0',
        default_commission_rate: settings.default_commission_rate || '15',
        fixed_number_start: settings.fixed_number_start || '101',
        fixed_number_end: settings.fixed_number_end || '199',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put('/system/settings');
    };

    return (
        <>
            <Head title="General Settings - MaMa Café" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <Settings className="h-6 w-6 text-[#823d21]" />
                            General System Settings
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Configure cafe identity, fixed-number table ranges, currency, and default commission rules.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Cafe Branding & Contact Information */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 border-b pb-3">
                            <Store className="h-5 w-5 text-[#823d21]" />
                            <h2 className="font-semibold text-lg">Cafe Identity & Contact Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="cafe_name">
                                    Cafe Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="cafe_name"
                                    value={form.data.cafe_name}
                                    onChange={(e) => form.setData('cafe_name', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.cafe_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="cafe_phone">
                                    Phone Number <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="cafe_phone"
                                    value={form.data.cafe_phone}
                                    onChange={(e) => form.setData('cafe_phone', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.cafe_phone} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="cafe_address">
                                    Physical Address <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="cafe_address"
                                    value={form.data.cafe_address}
                                    onChange={(e) => form.setData('cafe_address', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.cafe_address} />
                            </div>
                        </div>
                    </div>

                    {/* Financial Rules & Fixed Number Ranges */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 border-b pb-3">
                            <Hash className="h-5 w-5 text-[#823d21]" />
                            <h2 className="font-semibold text-lg">Fixed Numbers & Commission Configuration</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="fixed_number_start">
                                    Global Fixed Number Range Start <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="fixed_number_start"
                                    type="number"
                                    value={form.data.fixed_number_start}
                                    onChange={(e) => form.setData('fixed_number_start', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.fixed_number_start} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="fixed_number_end">
                                    Global Fixed Number Range End <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="fixed_number_end"
                                    type="number"
                                    value={form.data.fixed_number_end}
                                    onChange={(e) => form.setData('fixed_number_end', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.fixed_number_end} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="default_commission_rate">
                                    Default Waitress Commission Rate (%) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="default_commission_rate"
                                    type="number"
                                    step="0.1"
                                    value={form.data.default_commission_rate}
                                    onChange={(e) => form.setData('default_commission_rate', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.default_commission_rate} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="currency">
                                    Operating Currency <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="currency"
                                    value={form.data.currency}
                                    onChange={(e) => form.setData('currency', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.currency} />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end border-t pt-4">
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="bg-[#823d21] hover:bg-[#682e18] min-w-[160px] gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {form.processing ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </div>
                </form>
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
