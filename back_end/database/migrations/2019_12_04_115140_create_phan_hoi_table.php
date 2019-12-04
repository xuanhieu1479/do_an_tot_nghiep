<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePhanHoiTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('phanhoi', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('email');
            $table->string('noidung', 1000);
            $table->ngaygui('thoigian');
            $table->foreign('email')->references('email')->on('taikhoan')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('phanhoi');
    }
}
