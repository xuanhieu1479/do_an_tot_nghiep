<?php

namespace App\Http\Controllers;
use App\TaiKhoan;

use Illuminate\Http\Request;

class TaiKhoanController extends Controller
{
    
    public function taoMoi(Request $request) {
        $email = $request->input('email');
        $matkhau = $request->input('matkhau');
        if (!$email || !$matkhau) return response()->json([
            'message' => 'Yêu cầu đầy đủ email và mật khẩu',
        ], 400, [], JSON_UNESCAPED_UNICODE);
        $taikhoan = new TaiKhoan();
        return $taikhoan->taoMoi($email, $matkhau);
    }
}
