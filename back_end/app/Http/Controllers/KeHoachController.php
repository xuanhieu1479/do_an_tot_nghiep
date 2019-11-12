<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use DateTime;
use DateTimeZone;
use DB;
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

        $kehoach = new KeHoach($request->all());
        $kehoach->thoigian = DateTime::createFromFormat('D M d Y H:i:s e+', $request->input('thoigian'));
        $kehoach->dahoanthanh = false;

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

    public function getKeHoach(Request $request) {
        $email = $request->input('email');
        $clientTimeZone = DB::table('taikhoan')->where('email', '=', $email)->pluck('timezone')[0];
        $clientDateTime = new DateTime();
        $clientDateTime->setTimezone(new DateTimeZone($clientTimeZone));
        $clientTommorowDate = clone $clientDateTime;
        $clientTommorowDate->modify('+1 day');

        $clientDate = $clientDateTime->format('Y-m-d');
        
        $clientTommorowDate = $clientTommorowDate->format('Y-m-d');

        $clientDateTime = $clientDateTime->format('Y-m-d H:i:s');

        $taskList = DB::table('kehoach')->where('email', '=', $email)->get();
        $overdueTask = [];
        $todayTask = [];
        $tommorowTask = [];
        $otherTask = [];

        foreach($taskList as $task) {
            if(strtotime($task->thoigian) < strtotime($clientDateTime)) {
                array_push($overdueTask, $task);
            } else if(strtotime(\explode(" ", $task->thoigian)[0]) == strtotime($clientDate)) {
                array_push($todayTask, $task);
            } else if(strtotime(\explode(" ", $task->thoigian)[0]) == strtotime($clientTommorowDate)) {
                array_push($tommorowTask, $task);
            } else {
                array_push($otherTask, $task);
            }
        }        

        return response()->json([
           'overdueTask' => $overdueTask, 
           'todayTask' => $todayTask,
           'tommorowTask' => $tommorowTask,
           'otherTask' => $otherTask,
        ]);
    }

    public function getKeHoachByID(Request $request) {
        $kehoach = KeHoach::find($request->input('makehoach'));

        return response()->json([
            'kehoach' => $kehoach,
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }

    public function updateKehoach(Request $request) {
        $thoigian = DateTime::createFromFormat('D M d Y H:i:s e+', $request->input('thoigian'));
        $kehoach = KeHoach::find($request->input('makehoach'));        
        $request->merge([
            'thoigian' => $thoigian,
        ]);

        try {
            $kehoach->update($request->all());
            return response()->json([
                'message' => 'Update kế hoạch thành công',
            ], 200, [], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400, [], JSON_UNESCAPED_UNICODE);
        }
    }
}
