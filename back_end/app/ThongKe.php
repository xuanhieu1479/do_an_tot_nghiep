<?php

namespace App;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class ThongKe extends Authenticatable
{
    use Notifiable, HasApiTokens;
    protected $table = 'thongke';
    protected $primaryKey = 'id';
}
