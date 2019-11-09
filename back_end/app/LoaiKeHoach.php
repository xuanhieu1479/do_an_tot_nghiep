<?php

namespace App;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class LoaiKeHoach extends Authenticatable
{
    use Notifiable, HasApiTokens;
    protected $table = 'loaikehoach';
    protected $primaryKey = 'maloai';
    protected $fillable = ['email', 'tenloai'];

    public function daTonTai($email) {
        return (LoaiKeHoach::where('email', '=', $email)->exists());
    }
}
