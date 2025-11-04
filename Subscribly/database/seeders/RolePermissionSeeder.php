<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // Create Permissions
        $permissions = [
            ['name' => 'View Dashboard', 'slug' => 'view_dashboard'],
            ['name' => 'Manage Products', 'slug' => 'manage_products'],
            ['name' => 'Manage Users', 'slug' => 'manage_users'],
            ['name' => 'View Reports', 'slug' => 'view_reports'],
            ['name' => 'Manage Invoices', 'slug' => 'manage_invoices'],
            ['name' => 'Manage Stock', 'slug' => 'manage_stocks'],
            ['name' => 'Manage Account', 'slug' => 'manage_account'],

        ];

        foreach ($permissions as $p) {
            Permission::firstOrCreate(['slug' => $p['slug']], $p);
        }

        // Create Roles
        $roles = [
            'admin' => ['view_dashboard', 'manage_products', 'manage_users', 'view_reports'],
            'vendor' => ['view_dashboard', 'manage_products','manage_users','view_reports','manage_invoices','manage_stocks','manage_account'],
            'sub_vendor' => ['view_dashboard','manage_invoices'],
        ];

        foreach ($roles as $slug => $perms) {
            $role = Role::firstOrCreate(['slug' => $slug], ['name' => ucfirst($slug)]);
            $role->permissions()->sync(
                Permission::whereIn('slug', $perms)->pluck('id')
            );
            $role->refreshCachedPermission();
        }
    }
}
