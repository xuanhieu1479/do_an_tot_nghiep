<?php

namespace App;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Hash;
use Str;

class TaiKhoan extends Authenticatable
{
    use Notifiable, HasApiTokens;
    protected $table = 'taikhoan';
    protected $primaryKey = 'email';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['email', 'matkhau', 'timezone'];

    public function getAuthPassword()
    {
        return $this->matkhau;
    }

    public function daTonTai($email) {
        return (TaiKhoan::where('email', '=', $email)->exists());
    }

    public function resetMatKhau($email) {
        $matKhauMoi = Str::random(8);
        TaiKhoan::where('email', '=', $email)->update([
            'matkhau' => Hash::make($matKhauMoi),
        ]);
        return $matKhauMoi;
    }
}
