<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\TaiKhoan;
use Hash;

class TaiKhoanController extends Controller
{
    
    public function dangKy(Request $request) {

        $email = $request->input('email');
        $matkhau = $request->input('matkhau');

        if (!$email || !$matkhau) return response()->json([
            'message' => 'Yêu cầu đầy đủ email và mật khẩu',
        ], 400, [], JSON_UNESCAPED_UNICODE);

        $taikhoan = new TaiKhoan([
            'email' => $email,
            'matkhau' => Hash::make($matkhau),
        ]);

        if ($taikhoan->daTonTai($email)) {
            return response()->json([
                'message' => 'Tài khoản này đã tồn tại',
            ], 400, [], JSON_UNESCAPED_UNICODE);
        }

        $taikhoan->save();
        return response()->json([
            'message' => 'Tạo tài khoản thành công',
        ], 201, [], JSON_UNESCAPED_UNICODE);

    }

    public function dangNhap(Request $request) {

        $email = $request->input('email');
        $matkhau = $request->input('matkhau');

        if (!$email || !$matkhau) return response()->json([
            'message' => 'Yêu cầu đầy đủ email và mật khẩu',
        ], 401, [], JSON_UNESCAPED_UNICODE);

        $taikhoan = new TaiKhoan();
        if (!$taikhoan->daTonTai($email)) {
            return response()->json([
                'message' => 'Email này không tồn tại',
            ], 401, [], JSON_UNESCAPED_UNICODE);
        } else if(!Auth::attempt(['email' => $email, 'matkhau' => $matkhau])) {
            return response()->json([
                'message' => 'Mật khẩu không chính xác',
            ], 401, [], JSON_UNESCAPED_UNICODE);
        } else {
            $user = $request->user();
            $tokenResult = $user->createToken('Token đăng nhập');
            $token = $tokenResult->token;
            $token->save();
            
            return response()->json([
                'message' => 'Đăng nhập thành công',
                'access_token' => $tokenResult->accessToken,
                'token_type' => 'Bearer',
                'expires_at' => Carbon::parse(
                    $tokenResult->token->expires_at
                )->toDateTimeString()
            ], 200, [], JSON_UNESCAPED_UNICODE);
        }

    }

    public function dangXuat(Request $request) {
        $request->user()->token()->revoke();

        return response()->json([
            'message' => 'Đăng xuất thành công',
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }

    public function getTaiKhoan(Request $request)
    {
        return response()->json($request->user());
    }
}
