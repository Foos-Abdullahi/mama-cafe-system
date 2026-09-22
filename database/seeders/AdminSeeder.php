<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Seed the default admin user for MaMa Café.
     *
     * Credentials:
     *   email:    SEED_ADMIN_EMAIL (or admin@mamacafe.test)
     *   password: SEED_ADMIN_PASSWORD (or change-me-now)
     */
    public function run(): void
    {
        $email = (string) env('SEED_ADMIN_EMAIL', 'admin@mamacafe.test');
        $password = (string) env('SEED_ADMIN_PASSWORD', 'change-me-now');

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Admin',
                'password' => Hash::make($password),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info("Admin user seeded: {$email}");
    }
}
