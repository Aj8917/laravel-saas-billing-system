<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use DB;
class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('plans')->insert([
            [
                'name' => 'Basic',
                'price' => 0.00,
                'features' => '["Trial for 7 days", "Free billing generation", "Single user access"]',
                'is_active' => true,
            ],
            [
                'name' => 'Pro',
                'price' => 8000.00,
                'features' => '["Billing cycle: 1 month", "Up to 2 users", "Stock Maintaince","Monthly billing reports"]',
                'is_active' => true,
            ],
            [
                'name' => 'Premium',
                'price' => 60000.00,
                'features' => '["Up to 5 users", "Billing with stock notifications via email", "Advanced analytics reports"]',
                'is_active' => true,
            ],
        ]);
    }//run
}//planseeder
