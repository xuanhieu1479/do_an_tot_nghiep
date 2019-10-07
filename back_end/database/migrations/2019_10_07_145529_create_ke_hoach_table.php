<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateKeHoachTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('kehoach', function (Blueprint $table) {
            $table->string('makehoach');
            $table->string('email');
            $table->string('tenkehoach');
            $table->dateTime('thoigian');
            $table->string('ghichu');
            $table->integer('mauutien');
            $table->integer('maloai');
            $table->integer('cothongbao');
            $table->integer('dahoanthanh');            
            $table->primary('makehoach');
            $table->foreign('email')->references('email')->on('taikhoan')->onDelete('cascade');
            $table->foreign('maloai')->references('maloai')->on('loaikehoach')->onDelete('cascade');
            $table->foreign('mauutien')->references('mauutien')->on('mucdouutien')->onDelete('cascade');
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
        Schema::dropIfExists('kehoach');
    }
}
