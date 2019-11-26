<?php

namespace App;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class QuenMKToken extends Authenticatable
{
    use Notifiable, HasApiTokens;
    protected $table = 'quenmktoken';
    protected $primaryKey = 'email';
    protected $fillable = ['email', 'token'];
}
