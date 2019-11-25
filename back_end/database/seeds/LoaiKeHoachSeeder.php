<?php

use Illuminate\Database\Seeder;

class LoaiKeHoachSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('loaikehoach')->insert([
            'maloai' => 0,
            'email' => 'admin',
            'tenloai' => 'Doing Final Year Project',
        ]);
    }
}
