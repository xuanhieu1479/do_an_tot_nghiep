<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DateTime;
use DateTimeZone;
use DB;
use App\ThongKe;

class ThongKeController extends Controller
{
    public function updateThongKe(Request $request) {
        $thongke = new ThongKe();
        $thongke->save();
        return response()->json([], 200);
    }

    public function getPageViews(Request $request) {
        $pageviews = ThongKe::count();
        return response()->json([
            'count' => $pageviews,
        ], 200);
    }
}
