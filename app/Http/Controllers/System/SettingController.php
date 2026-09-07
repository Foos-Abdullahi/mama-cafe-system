<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        $settings = [
            'cafe_name' => Setting::getByKey('cafe_name', 'MaMa Café & Boba Tea'),
            'cafe_phone' => Setting::getByKey('cafe_phone', '+252 61 555 0101'),
            'cafe_address' => Setting::getByKey('cafe_address', 'Mogadishu, Somalia'),
            'currency' => Setting::getByKey('currency', 'USD ($)'),
            'tax_rate' => Setting::getByKey('tax_rate', '0'),
            'default_commission_rate' => Setting::getByKey('default_commission_rate', '15'),
            'cafe_fixed_numbers' => Setting::getByKey('cafe_fixed_numbers', '101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 150, 456543'),
        ];

        return Inertia::render('admin/system/settings/index', [
            'settings' => $settings,
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
            'default_commission_rate' => 'required|numeric|min:0|max:100',
            'cafe_fixed_numbers' => 'required|string|max:2000',
        ]);

        foreach ($validated as $key => $value) {
            Setting::setByKey($key, (string) $value, 'general');
        }

        ActivityLog::log('settings_update', 'Updated general system settings.');

        return redirect()->route('system.settings.index')->with('success', 'System settings saved successfully!');
    }
}
