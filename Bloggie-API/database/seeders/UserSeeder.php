<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create 10 test users
        User::factory(10)->create();

        // Or create specific users
        User::create([
            'name' => 'Menna Hassan',
            'email' => 'mennahassan@gmail.com',
            'password' => Hash::make('password123'),
            'image' => null,
        ]);

        User::create([
            'name' => 'Mostafa Emad',
            'email' => 'mostafa@gmail.com',
            'password' => Hash::make('password123'),
            'image' => null,
        ]);

        User::create([
            'name' => 'Youssef ',
            'email' => 'youssef@gmail.com',
            'password' => Hash::make('password123'),
            'image' => null,
        ]);

        $this->command->info(' Users seeded successfully!');
    }
}