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
    Route::post('test', 'KeHoachController@test');
});

Route::group([
    'middleware' => ['cors', 'auth:api']
], function() {
    Route::post('themkehoach', 'KeHoachController@themKeHoach');
    Route::get('loaikehoach', 'LoaiKeHoachController@getLoaiKeHoach');
});

Route::group([
    'middleware' => 'auth:api'
], function() {
    Route::get('dangxuat', 'TaiKhoanController@dangXuat');
    Route::get('thongtintaikhoan', 'TaiKhoanController@getTaiKhoan');
});

Route::post('quenmatkhau', 'TaiKhoanController@resetMatKhau');
