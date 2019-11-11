<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use DateTime;
use DateTimeZone;
use App\KeHoach;
use App\LoaiKeHoach;

class KeHoachController extends Controller
{
    public function themLoaiKeHoachMacDinh($email) {
        $loaikehoach = new LoaiKeHoach([
            'maloai' => 0,
            'email' => $email,
            'tenloai' => 'Công việc',
        ]);
        if(!$loaikehoach->daTonTai($email)) $loaikehoach->save();
    }

    public function themKeHoach(Request $request) {
        $email = $request->input('email');
        $tenkehoach = $request->input('tenkehoach');
        $thoigian = \DateTime::createFromFormat('D M d Y H:i:s e+', $request->input('thoigian'));
        $ghichu = $request->input('ghichu');
        $mauutien = $request->input('mauutien');
        $maloai = $request->input('maloai');
        $cothongbao = $request->input('cothongbao');
        $dahoanthanh = false;

        $kehoach = new KeHoach([
            'email' => $email,
            'tenkehoach' => $tenkehoach,
            'thoigian' => $thoigian,
            'ghichu' => $ghichu,
            'mauutien' => $mauutien,
            'maloai' => $maloai,
            'cothongbao' => $cothongbao,
            'dahoanthanh' => $dahoanthanh,
        ]);

        try {
            $this->themLoaiKeHoachMacDinh($email);
            $kehoach->save();
            return response()->json([
                'message' => "Thêm kế hoạch thành công."
            ], 201, [], JSON_UNESCAPED_UNICODE);
        } catch(\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400, [], JSON_UNESCAPED_UNICODE);
        }
    }

    public function test(Request $request) {
        $time = $request->input('time');
        $clientTime = DateTime::createFromFormat('D M d Y H:i:s e+', $time);
        $serverTime = new DateTime();
        $convert = new DateTime();
        $convert->setTimezone(new DateTimeZone('+07:00'));
        return response()->json([
            'client' => $clientTime,
            'server' => $serverTime,
            'convert_to_client_timezone' => $convert,
        ]);
    }
}
