<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Hash;
use DateTime;
use App\Mail\ResetMatKhau;
use App\TaiKhoan;
use App\LoaiKeHoach;

class TaiKhoanController extends Controller
{
    public function taoToken(Request $request, $msg) {

        $user = $request->user();
        $tokenResult = $user->createToken('Token đăng nhập');
        $token = $tokenResult->token;
        $token->save();
        
        return response()->json([
            'message' => $msg,
            'access_token' => $tokenResult->accessToken,
            'token_type' => 'Bearer',
            'expires_at' => Carbon::parse(
                $tokenResult->token->expires_at
            )->toDateTimeString()
        ], 200, [], JSON_UNESCAPED_UNICODE);

    }
    
    public function dangKy(Request $request) {

        $email = $request->input('email');
        $matkhau = $request->input('matkhau');
        $sdt = $request->input('sdt');
        $timezone =  DateTime::createFromFormat('D M d Y H:i:s e+', $request->input('timezone'))->getTimezone()->getName();

        if (!$email || !$matkhau) return response()->json([
            'message' => 'Yêu cầu đầy đủ email và mật khẩu',
        ], 400, [], JSON_UNESCAPED_UNICODE);

        $taikhoan = new TaiKhoan([
            'email' => $email,
            'matkhau' => Hash::make($matkhau),
            'sdt' => $sdt,
            'timezone' => $timezone,
        ]);

        if ($taikhoan->daTonTai($email)) {
            return response()->json([
                'message' => 'Tài khoản này đã tồn tại',
            ], 400, [], JSON_UNESCAPED_UNICODE);
        }

        $taikhoan->save();
        $lkh = new LoaiKeHoach([
            'email' => $email,
            'tenloai' => 'Công việc',
        ]);
        $lkh->save();
        Auth::attempt(['email' => $email, 'matkhau' => $matkhau]);
        return $this->taoToken($request, 'Tạo tài khoản thành công');

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
            return $this->taoToken($request, 'Đăng nhập thành công');
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

    public function resetMatKhau(Request $request) {      

        $email = $request->input('email');
        $taikhoan = new TaiKhoan();
        if (!$taikhoan->daTonTai($email)) {
            return response()->json([
                'message' => 'Email này không tồn tại',
            ], 401, [], JSON_UNESCAPED_UNICODE);
        } else {
            $matKhauMoi = $taikhoan->resetMatKhau($email);
            Mail::to($email)->send(new ResetMatKhau($matKhauMoi));
            return response()->json([
                'message' => 'Gửi mail thành công',
            ], 200, [], JSON_UNESCAPED_UNICODE);
        }

    }
}
