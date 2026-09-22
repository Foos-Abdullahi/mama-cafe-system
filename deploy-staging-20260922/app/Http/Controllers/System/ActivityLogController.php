<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ActivityLog::with('user');

        if ($request->filled('action')) {
            $query->where('action', $request->query('action'));
        }

        $logs = $query->latest()->get()->map(function ($l) {
            return [
                'id' => $l->id,
                'action' => $l->action,
                'description' => $l->description,
                'user_name' => $l->user->name ?? 'System',
                'ip_address' => $l->ip_address ?? '—',
                'created_at' => $l->created_at ? $l->created_at->format('Y-m-d H:i:s') : '—',
            ];
        });

        $stats = [
            [
                'title' => 'Total Recorded Logs',
                'value' => (string) $logs->count(),
                'change' => 'Audit entries',
                'trend' => 'up',
            ],
            [
                'title' => 'System Events Today',
                'value' => (string) ActivityLog::whereDate('created_at', now()->format('Y-m-d'))->count(),
                'change' => 'Today\'s activity',
                'trend' => 'up',
            ],
        ];

        return Inertia::render('admin/system/activity-logs/index', [
            'logs' => $logs,
            'stats' => $stats,
            'filters' => $request->only(['action']),
        ]);
    }
}
