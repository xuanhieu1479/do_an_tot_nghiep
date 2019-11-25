<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\LoaiKeHoach;

class LoaiKeHoachController extends Controller
{
    public function getLoaiKeHoach(Request $request) {
        $email = $request->input('email');
        $loaikehoach = DB::table('loaikehoach')->select('maloai', 'tenloai')->where('email', '=', $email)->get();
        if(count($loaikehoach) != 0) {
            return response()->json([
                'loaikehoach' => $loaikehoach,
            ], 200, [], JSON_UNESCAPED_UNICODE);
        } else {
            return response()->json([
                'message' => 'This account does not have any task type.',
            ], 400, [], JSON_UNESCAPED_UNICODE);
        }        
    }

    public function addLoaiKeHoach(Request $request) {
        $loaikehoach = new LoaiKeHoach($request->all());
        try {
            $loaikehoach->save();
            return response()->json([
                'message' => 'Add task type successfully.',
            ], 200, [], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400, [], JSON_UNESCAPED_UNICODE);
        }
    }

    public function deleteLoaiKeHoach(Request $request) {
        try {
            DB::table('loaikehoach')->where('maloai', '=', $request->input('maloai'))->delete();
            return response()->json([
                'message' => 'This task type has been removed.',
            ], 200, [], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'This task type is still being used.',
                'error message' => $e->getMessage(),
            ], 400, [], JSON_UNESCAPED_UNICODE);
        }
    }
}
