<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaiKhoanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('taikhoan')->insert([
            'email' => 'admin@gmail.com',
            'matkhau' => Hash::make('123'),
            'maloaitk' => 0,
        ]);
    }
}