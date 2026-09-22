<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $employees = [
            ['name' => 'Mohamed Ali', 'phone' => '+252 61 555 0404', 'email' => 'mohamed.staff@mamacafe.test', 'position' => 'Staff'],
            ['name' => 'Nimco Yusuf', 'phone' => '+252 61 555 0505', 'email' => 'nimco.cashier@mamacafe.test', 'position' => 'Cashier'],
            ['name' => 'Abdi Noor', 'phone' => '+252 61 555 0606', 'email' => 'abdi.barista@mamacafe.test', 'position' => 'Barista'],
        ];

        foreach ($employees as $employee) {
            Employee::updateOrCreate(
                ['email' => $employee['email']],
                [...$employee, 'status' => 'active', 'hire_date' => now()->toDateString()]
            );
        }
    }
}
