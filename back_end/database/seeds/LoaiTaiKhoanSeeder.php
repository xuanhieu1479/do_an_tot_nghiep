<?php

use Illuminate\Database\Seeder;

class LoaiTaiKhoanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('loaitaikhoan')->insert([
            'maloaitk' => 0,
            'tenloaitk' => 'Thường',
        ]);

        DB::table('loaitaikhoan')->insert([
            'maloaitk' => 1,
            'tenloaitk' => 'VIP',
        ]);
    }
}
