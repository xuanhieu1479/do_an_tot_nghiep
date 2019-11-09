<?php

namespace App;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class KeHoach extends Authenticatable
{
    use Notifiable, HasApiTokens;
    protected $table = 'kehoach';
    protected $primaryKey = 'makehoach';
    protected $fillable = ['email', 'tenkehoach', 'thoigian', 'ghichu', 'mauutien', 'maloai', 'cothongbao', 'dahoanthanh'];
}
