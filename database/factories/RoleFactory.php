<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Role>
 */
class RoleFactory extends Factory
{
    protected $model = Role::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->words(2, true);

        return [
            'name' => ucwords($name),
            'slug' => Str::slug($name),
            'description' => $this->faker->sentence(),
            'is_system' => false,
            'permissions' => [],
        ];
    }

    public function system(): static
    {
        return $this->state(['is_system' => true]);
    }

    public function withPermissions(array $permissions): static
    {
        return $this->state(['permissions' => $permissions]);
    }
}
