<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TaiKhoan extends Model
{
    protected $table = 'taikhoan';
    protected $primaryKey = 'email';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $attributes = [
        'maloaitk' => 0,
    ];
    protected $fillable = ['email', 'matkhau'];

    public function daTonTai($email) {
        return (TaiKhoan::where('email', '=', $email)->exists());
    }

    public function taoMoi($email, $matkhau) {
        if ($this->daTonTai($email)) {
            return response()->json([
                'message' => 'Tài khoản này đã tồn tại',
            ], 400, [], JSON_UNESCAPED_UNICODE);
        } else {
            TaiKhoan::create([
                'email' => $email,
                'matkhau' => $matkhau,
            ]);
            return response()->json([
                'message' => 'Tạo tài khoản thành công',
            ], 201, [], JSON_UNESCAPED_UNICODE);
        }
    }
}
