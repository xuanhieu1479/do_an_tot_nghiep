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
use App\Mail\ForgotPassword;
use App\TaiKhoan;
use App\LoaiKeHoach;
use App\QuenMKToken;

class TaiKhoanController extends Controller
{
    public function taoToken(Request $request, $msg) {

        $user = $request->user();
        if ($request->input('email') == 'admin') {
            $tokenResult = $user->createToken('Token đăng nhập', ['admin']);
        } else {
            $tokenResult = $user->createToken('Token đăng nhập');
        }        
        $token = $tokenResult->token;
        $token->save();

        $quenmktoken = QuenMKToken::updateOrCreate(
            ['email' => $request->input('email')],
            ['token' => $tokenResult->accessToken]
        );
        
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
            'message' => 'Both email and password are required.',
        ], 400, [], JSON_UNESCAPED_UNICODE);

        $taikhoan = new TaiKhoan([
            'email' => $email,
            'matkhau' => Hash::make($matkhau),
            'sdt' => $sdt,
            'timezone' => $timezone,
        ]);

        if ($taikhoan->daTonTai($email)) {
            return response()->json([
                'message' => 'This email is already existed.',
            ], 400, [], JSON_UNESCAPED_UNICODE);
        }

        $taikhoan->save();
        $lkh = new LoaiKeHoach([
            'email' => $email,
            'tenloai' => 'Work',
        ]);
        $lkh->save();
        Auth::attempt(['email' => $email, 'matkhau' => $matkhau]);
        return $this->taoToken($request, 'Your Account Has Been Created Succesfully!');

    }

    public function dangNhap(Request $request) {
        
        $email = $request->input('email');
        $matkhau = $request->input('matkhau');

        if (!$email || !$matkhau) return response()->json([
            'message' => 'Both email and password are required.',
        ], 401, [], JSON_UNESCAPED_UNICODE);

        $taikhoan = new TaiKhoan();
        if (!$taikhoan->daTonTai($email)) {
            return response()->json([
                'message' => 'This email does not exist.',
            ], 401, [], JSON_UNESCAPED_UNICODE);
        } else if(!Auth::attempt(['email' => $email, 'matkhau' => $matkhau])) {
            return response()->json([
                'message' => 'Wrong Password.',
            ], 401, [], JSON_UNESCAPED_UNICODE);
        } else {
            return $this->taoToken($request, 'You are Signed In');
        }

    }

    public function dangXuat(Request $request) {

        $request->user()->token()->revoke();

        return response()->json([
            'message' => 'Log Out',
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
                'message' => 'This email does not exist.',
            ], 401, [], JSON_UNESCAPED_UNICODE);
        } else {
            $matKhauMoi = $taikhoan->resetMatKhau($email);
            Mail::to($email)->send(new ResetMatKhau($matKhauMoi));
            return response()->json([
                'message' => 'Mail Sent!',
            ], 200, [], JSON_UNESCAPED_UNICODE);
        }

    }

    public function submitEmail(Request $request) {
        $email = $request->input('email');
        if ((new TaiKhoan())->daTonTai($email)) {
            $token = DB::table('quenmktoken')->where('email', '=', $email)->pluck('token')[0];
            Mail::to($email)->send(new ForgotPassword($token));

            return response()->json([], 200);
        } else {
            return response()->json(['msg' => 'This email does not exist.'], 400);
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
                'message' => 'Update Telephone Number Succesful'
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
                'message' => 'Your Password Has Been Changed Successfully',
            ], 200, [], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400, [], JSON_UNESCAPED_UNICODE);
        }

    }
}
