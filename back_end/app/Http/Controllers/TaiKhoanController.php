<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Carbon\Carbon;
use DB;
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

    public function getTelephone(Request $request) {

        $email = $request->input('email');
        $telephone = DB::table('taikhoan')->where('email', '=', $email)->pluck('sdt')[0];
        if ($telephone === null) $telephone = '';
        return response()->json([
           'sdt' => $telephone, 
        ], 200);

    }

    public function updateTelephone(Request $request) {

        $email = $request->input('email');
        $newTelephone = $request->input('telephone');

        try {
            DB::table('taikhoan')->where('email', '=', $email)->update(['sdt' => $newTelephone]);
            return response()->json([
                'message' => 'Update số điện thoại thành công'
            ], 200, [], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400, [], JSON_UNESCAPED_UNICODE);
        }

    }

    public function checkCurrentPassword(Request $request) {

        $email = $request->input('email');
        $oldPassword = $request->input('oldPassword');
        $currentPassword = DB::table('taikhoan')->where('email', '=', $email)->pluck('matkhau')[0];
        $result = \password_verify($oldPassword, $currentPassword);
        if ($result) {
            return response()->json([], 200);
        } else {
            return response()->json([], 400);
        }

    }

    public function updatePassword(Request $request) {

        $email = $request->input('email');
        $newPassword = $request->input('password');
        $newPassword = Hash::make($newPassword);

        try {
            DB::table('taikhoan')->where('email', '=', $email)->update(['matkhau' => $newPassword]);
            return response()->json([
                'message' => 'Cập nhật mật khẩu thành công',
            ], 200, [], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400, [], JSON_UNESCAPED_UNICODE);
        }

    }
}
