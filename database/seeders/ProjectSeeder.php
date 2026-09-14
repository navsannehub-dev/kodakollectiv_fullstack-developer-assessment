<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        if (Project::query()->exists()) {
            return;
        }

        Project::query()->insert([
            [
                'client_name' => 'Northwind Retail',
                'project_name' => 'E-commerce Refresh',
                'description' => 'Rebuild storefront and checkout flow for seasonal campaigns.',
                'status' => 'In Progress',
                'priority' => 'High',
                'start_date' => '2026-08-01',
                'due_date' => '2026-10-15',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'client_name' => 'Lumen Health',
                'project_name' => 'Patient Portal MVP',
                'description' => 'Secure appointment booking and records overview.',
                'status' => 'Planning',
                'priority' => 'Medium',
                'start_date' => '2026-09-05',
                'due_date' => '2026-11-30',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'client_name' => 'Harbor Bank',
                'project_name' => 'Brand Guidelines Site',
                'description' => 'Internal brand system documentation and asset library.',
                'status' => 'On Hold',
                'priority' => 'Low',
                'start_date' => '2026-07-10',
                'due_date' => '2026-09-20',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
