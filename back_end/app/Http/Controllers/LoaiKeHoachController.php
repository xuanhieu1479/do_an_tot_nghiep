<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;

class LoaiKeHoachController extends Controller
{
    public function getLoaiKeHoach(Request $request) {
        $email = $request->input('email');
        $loaikehoach = DB::table('loaikehoach')->where('email', '=', $email)->get()->pluck('tenloai');
        if(count($loaikehoach) != 0) {
            return response()->json([
                'loaikehoach' => $loaikehoach,
            ], 200, [], JSON_UNESCAPED_UNICODE);
        } else {
            return response()->json([
                'message' => 'Chưa có loại kế hoạch nào',
            ], 400, [], JSON_UNESCAPED_UNICODE);
        }        
    }
}
