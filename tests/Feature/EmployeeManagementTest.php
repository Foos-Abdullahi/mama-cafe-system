<?php

use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function employeeAdmin(): User
{
    return User::factory()->create([
        'role' => 'admin',
    ]);
}

test('admin can complete employee crud without affecting waitresses', function () {
    $admin = employeeAdmin();

    $create = $this->actingAs($admin)->post('/management/employees', [
        'name' => 'Layla Hassan',
        'phone' => '0712345678',
        'email' => 'layla@example.com',
        'position' => 'Cashier',
        'status' => 'active',
        'hire_date' => '2026-09-16',
        'notes' => 'Morning shift',
    ]);

    $create->assertRedirect('/management/employees');
    $employee = Employee::where('email', 'layla@example.com')->firstOrFail();

    $this->assertDatabaseHas('employees', [
        'name' => 'Layla Hassan',
        'position' => 'Cashier',
        'status' => 'active',
    ]);

    $this->actingAs($admin)
        ->put("/management/employees/{$employee->id}", [
            'name' => 'Layla Ahmed',
            'phone' => '0712345678',
            'email' => 'layla@example.com',
            'position' => 'Supervisor',
            'status' => 'inactive',
            'hire_date' => '2026-09-16',
            'notes' => null,
        ])
        ->assertRedirect('/management/employees');

    $this->assertDatabaseHas('employees', [
        'id' => $employee->id,
        'name' => 'Layla Ahmed',
        'position' => 'Supervisor',
        'status' => 'inactive',
    ]);

    $this->actingAs($admin)
        ->delete("/management/employees/{$employee->id}")
        ->assertRedirect('/management/employees');

    $this->assertDatabaseMissing('employees', ['id' => $employee->id]);
});

test('employee creation validates the name', function () {
    $response = $this->actingAs(employeeAdmin())->post('/management/employees', [
        'position' => 'Cashier',
        'status' => 'active',
    ]);

    $response->assertSessionHasErrors(['name']);
});
