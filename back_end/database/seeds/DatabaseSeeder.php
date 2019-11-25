<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);
        $this->call(LoaiTaiKhoanSeeder::class);
        $this->call(TaiKhoanSeeder::class);
        $this->call(MucDoUuTienSeeder::class);
        $this->call(LoaiKeHoachSeeder::class);        
    }
}
