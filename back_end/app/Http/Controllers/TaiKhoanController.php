<?php

namespace App\Http\Controllers;
use App\TaiKhoan;

use Illuminate\Http\Request;

class TaiKhoanController extends Controller
{
    
    public function taoMoi(Request $request) {
        $email = $request->input('email');
        $matkhau = $request->input('matkhau');
        $taikhoan = new TaiKhoan();
        return $taikhoan->taoMoi($email, $matkhau);
    }
}
