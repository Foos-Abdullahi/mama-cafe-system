<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\FixedNumber;
use App\Models\Setting;
use App\Models\Waitress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        $rawNumbers = Setting::getByKey('cafe_waitress_numbers', '');
        $configuredNumbers = array_filter(array_map('trim', explode(',', $rawNumbers)));

        $assignedNumbers = FixedNumber::pluck('current_number')->map(fn ($n) => (string) $n)->toArray();

        $allNumbers = array_values(array_unique(array_filter(array_merge($configuredNumbers, $assignedNumbers))));
        sort($allNumbers, SORT_NATURAL);

        $settings = [
            'cafe_name' => Setting::getByKey('cafe_name', 'MaMa Café & Boba Tea'),
            'cafe_phone' => Setting::getByKey('cafe_phone', '+252 61 555 0101'),
            'cafe_address' => Setting::getByKey('cafe_address', 'Mogadishu, Somalia'),
            'currency' => Setting::getByKey('currency', 'USD ($)'),
            'tax_rate' => Setting::getByKey('tax_rate', '0'),
            'vat_rate' => Setting::getByKey('vat_rate', '0'),
            'default_commission_rate' => Setting::getByKey('default_commission_rate', '15'),
            'commission_rates' => Setting::getByKey('commission_rates', '10, 12, 15, 18, 20'),
            'cafe_waitress_numbers' => implode(', ', $allNumbers),
        ];

        $waitresses = Waitress::with('fixedNumbers')->orderBy('name')->get()->map(function ($w) {
            $fn = $w->fixedNumbers->first();

            return [
                'id' => $w->id,
                'name' => $w->name,
                'phone' => $w->phone,
                'status' => $w->status,
                'assigned_number' => $fn ? (string) $fn->current_number : '—',
            ];
        });

        return Inertia::render('admin/system/settings/index', [
            'settings' => $settings,
            'waitresses' => $waitresses,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'cafe_name' => 'required|string|max:255',
            'cafe_phone' => 'required|string|max:100',
            'cafe_address' => 'required|string|max:255',
            'currency' => 'required|string|max:50',
            'tax_rate' => 'required|numeric|min:0|max:100',
            'vat_rate' => 'required|numeric|min:0|max:100',
            'default_commission_rate' => 'nullable|numeric|min:0|max:100',
            'commission_rates' => 'required|string|max:2000',
            'cafe_waitress_numbers' => 'nullable|string|max:2000',
        ]);

        foreach ($validated as $key => $value) {
            Setting::setByKey($key, (string) ($value ?? ''), 'general');
        }

        ActivityLog::log('settings_update', 'Updated general system settings.');

        return redirect()->route('system.settings.index')->with('success', 'System settings saved successfully!');
    }
}
