<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    private const POSITIONS = ['Staff', 'Cashier', 'Barista', 'Cook', 'Cleaner', 'Supervisor'];

    public function index(): Response
    {
        $employees = Employee::query()
            ->latest('id')
            ->get()
            ->map(fn (Employee $employee) => $this->present($employee));

        $stats = [
            [
                'title' => 'Total Employees',
                'value' => (string) $employees->count(),
                'badge' => ['text' => 'Team', 'variant' => 'blue'],
                'description' => 'Registered employees',
            ],
            [
                'title' => 'Active Employees',
                'value' => (string) $employees->where('status', 'active')->count(),
                'badge' => ['text' => 'On Duty', 'variant' => 'emerald'],
                'description' => 'Currently active team members',
            ],
            [
                'title' => 'Job Positions',
                'value' => (string) $employees->pluck('position')->unique()->count(),
                'badge' => ['text' => 'Roles', 'variant' => 'amber'],
                'description' => 'Positions across the cafe',
            ],
            [
                'title' => 'Added This Month',
                'value' => (string) Employee::where('created_at', '>=', now()->startOfMonth())->count(),
                'badge' => ['text' => 'New', 'variant' => 'purple'],
                'description' => 'New employee records',
            ],
        ];

        return Inertia::render('admin/management/employees/index', [
            'employees' => $employees,
            'stats' => $stats,
            'positions' => self::POSITIONS,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/management/employees/create', [
            'positions' => self::POSITIONS,
        ]);
    }

    public function store(Request $request)
    {
        $employee = Employee::create($this->validated($request));

        ActivityLog::log('employee_create', "Employee '{$employee->name}' was registered as {$employee->position}.");

        return redirect()->route('management.employees.index')->with('success', 'Employee created successfully.');
    }

    public function show(Employee $employee): Response
    {
        return Inertia::render('admin/management/employees/show', [
            'employee' => $this->present($employee),
        ]);
    }

    public function edit(Employee $employee): Response
    {
        return Inertia::render('admin/management/employees/edit', [
            'employee' => $this->present($employee),
            'positions' => self::POSITIONS,
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $employee->update($this->validated($request));

        ActivityLog::log('employee_update', "Employee '{$employee->name}' details updated.");

        return redirect()->route('management.employees.index')->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        $name = $employee->name;
        $employee->delete();

        ActivityLog::log('employee_delete', "Employee '{$name}' was deleted.");

        return redirect()->route('management.employees.index')->with('success', 'Employee deleted successfully.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'position' => ['required', 'string', 'max:100'],
            'status' => ['required', 'in:active,inactive'],
            'hire_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
    }

    private function present(Employee $employee): array
    {
        return [
            'id' => $employee->id,
            'name' => $employee->name,
            'phone' => $employee->phone,
            'email' => $employee->email,
            'position' => $employee->position,
            'status' => $employee->status,
            'hire_date' => $employee->hire_date?->format('Y-m-d'),
            'notes' => $employee->notes,
            'created_at' => $employee->created_at?->format('Y-m-d'),
        ];
    }
}
