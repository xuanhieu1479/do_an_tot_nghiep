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
            $table->bigIncrements('makehoach');
            $table->string('email');
            $table->string('tenkehoach');
            $table->dateTime('thoigian');
            $table->string('ghichu')->nullable();
            $table->bigInteger('mauutien');
            $table->bigInteger('maloai');
            $table->boolean('cothongbao');
            $table->boolean('dahoanthanh');
            $table->foreign('email')->references('email')->on('taikhoan')->onDelete('cascade');
            $table->foreign('maloai')->references('maloai')->on('loaikehoach');
            $table->foreign('mauutien')->references('mauutien')->on('mucdouutien');
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
