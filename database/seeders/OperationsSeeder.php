<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class OperationsSeeder extends Seeder
{
    /**
     * Seed the default operations/POS user.
     *
     * Credentials are supplied through SEED_OPERATIONS_EMAIL and
     * SEED_OPERATIONS_PASSWORD in the deployment environment.
     */
    public function run(): void
    {
        $email = (string) env('SEED_OPERATIONS_EMAIL', 'operations@mamacafe.test');
        $password = (string) env('SEED_OPERATIONS_PASSWORD', 'change-me-now');

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Operations',
                'password' => Hash::make($password),
                'role' => 'operations',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info("Operations user seeded: {$email}");
    }
}
