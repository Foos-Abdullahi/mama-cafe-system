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
     *   email:    admin@mamacafe.test
     *   password: password
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@mamacafe.test'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Admin user seeded: admin@mamacafe.test / password');
    }
}
