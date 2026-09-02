<?php

namespace App\Models;

use Database\Factories\RoleFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property bool $is_system
 * @property array<string> $permissions
 */
#[Fillable(['name', 'slug', 'description', 'is_system', 'permissions'])]
class Role extends Model
{
    /** @use HasFactory<RoleFactory> */
    use HasFactory;

    /**
     * Cast columns.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_system' => 'boolean',
            'permissions' => 'array',
        ];
    }

    /**
     * Users assigned to this role (matched via slug = users.role).
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'role', 'slug');
    }

    /**
     * Whether this role can be deleted.
     */
    public function isDeletable(): bool
    {
        return ! $this->is_system;
    }

    /**
     * Check if a permission key is granted to this role.
     */
    public function hasPermission(string $permission): bool
    {
        if ($this->slug === 'admin') {
            return true;
        }

        return in_array($permission, $this->permissions ?? [], true);
    }
}
