<?php

use App\Models\ActivityLog;
use App\Models\User;

test('authenticated user can view activity logs', function () {
    $user = User::factory()->create();

    ActivityLog::log('test_event', 'Sample test event logged');

    $response = $this->actingAs($user)->get(route('system.activity-logs.index'));
    $response->assertOk();
});
