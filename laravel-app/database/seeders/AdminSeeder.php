<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'kunambiwaziri1@gmail.com')],
            [
                'name'     => 'Waziri Kunambi',
                'email'    => env('ADMIN_EMAIL', 'kunambiwaziri1@gmail.com'),
                'password' => Hash::make(env('ADMIN_PASSWORD', 'Waziri@2026!')),
            ]
        );
    }
}
