<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateKeHoachConTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('kehoachcon', function (Blueprint $table) {
            $table->string('makhc');
            $table->string('makehoach');
            $table->string('tenkhc');
            $table->primary('makhc');
            $table->foreign('makehoach')->references('makehoach')->on('kehoach')->onDelete('cascade');
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
        Schema::dropIfExists('kehoachcon');
    }
}
