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
            'loaiuutien' => 'Low',
        ]);

        DB::table('mucdouutien')->insert([
            'loaiuutien' => 'Below Average',
        ]);

        DB::table('mucdouutien')->insert([
            'loaiuutien' => 'Average',
        ]);

        DB::table('mucdouutien')->insert([
            'loaiuutien' => 'High',
        ]);

        DB::table('mucdouutien')->insert([
            'loaiuutien' => 'Critical',
        ]);
    }
}
