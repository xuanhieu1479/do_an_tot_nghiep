<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    'middleware' => 'cors'
], function() {
    Route::post('dangky', 'TaiKhoanController@dangKy');
    Route::post('dangnhap', 'TaiKhoanController@dangNhap');    
    Route::get('mucdouutien', 'MucDoUuTienController@getMucDoUuTien');
    Route::get('updatethongke', 'ThongKeController@updateThongKe');
});

Route::group([
    'middleware' => ['cors', 'auth:api']
], function() {
    Route::post('themkehoach', 'KeHoachController@themKeHoach');
    Route::post('themloaikehoach', 'LoaiKeHoachController@addLoaiKeHoach');
    Route::post('checkoldpassword', 'TaiKhoanController@checkCurrentPassword');
    Route::get('loaikehoach', 'LoaiKeHoachController@getLoaiKeHoach');
    Route::get('kehoach', 'KeHoachController@getKeHoach');
    Route::get('allkehoach', 'KeHoachController@getAllKeHoach');
    Route::get('kehoachbyid', 'KeHoachController@getKeHoachByID');
    Route::get('sdt', 'TaiKhoanController@getTelephone');
    Route::get('pageviews', 'ThongKeController@getPageViews')->middleware('scopes:admin');
    Route::put('updatekehoach', 'KeHoachController@updateKeHoach');
    Route::put('updatesdt', 'TaiKhoanController@updateTelephone');
    Route::put('updatepassword', 'TaiKhoanController@updatePassword');
    Route::delete('deletekehoach', 'KeHoachController@deleteKeHoachByID');
    Route::delete('deleteloaikehoach', 'LoaiKeHoachController@deleteLoaiKeHoach');
});

Route::group([
    'middleware' => 'auth:api'
], function() {
    Route::get('dangxuat', 'TaiKhoanController@dangXuat');
    Route::get('thongtintaikhoan', 'TaiKhoanController@getTaiKhoan');
});

Route::post('quenmatkhau', 'TaiKhoanController@resetMatKhau');
