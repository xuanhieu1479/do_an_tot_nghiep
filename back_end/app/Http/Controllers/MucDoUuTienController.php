<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\LoaiKeHoach;
use DB;

class MucDoUuTienController extends Controller
{
    public function getMucDoUuTien(Request $request) {
        $mucdouutien = DB::table('mucdouutien')->get()->pluck('loaiuutien');
        return response()->json([
            'mucdouutien' => $mucdouutien,
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }
}
