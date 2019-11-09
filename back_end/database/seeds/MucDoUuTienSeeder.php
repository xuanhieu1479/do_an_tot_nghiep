<?php

use Illuminate\Database\Seeder;

class MucDoUuTienSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('mucdouutien')->insert([
            'loaiuutien' => 'Cứ từ từ',
        ]);

        DB::table('mucdouutien')->insert([
            'loaiuutien' => 'Để mai cũng được',
        ]);

        DB::table('mucdouutien')->insert([
            'loaiuutien' => 'Bình thường',
        ]);

        DB::table('mucdouutien')->insert([
            'loaiuutien' => 'Làm không kẻo muộn',
        ]);

        DB::table('mucdouutien')->insert([
            'loaiuutien' => 'Vắt giò lên cổ chạy',
        ]);
    }
}
