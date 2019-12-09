<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use DB;
use Carbon\Carbon;
use App\Console\Commands\SpeedSMSAPI;

class SendTaskSMS extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:tasksms';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send task sms to each user if they have telephone number';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        \Log::info('Schedule SMS did run');
        $serverTime = new \DateTime();
        $kehoach = DB::table('kehoach')
                    ->join('taikhoan', 'kehoach.email', '=', 'taikhoan.email')
                    ->select('taikhoan.sdt', 'tenkehoach', 'thoigian', 'mauutien', 'cothongbao', 'dahoanthanh', 'timezone')
                    ->get();

        $userList = [];

        foreach ($kehoach as $kh) {
            $thoigianObject = \DateTime::createFromFormat('Y-m-d H:i:s', $kh->thoigian, new \DateTimeZone($kh->timezone));
            $serverTime->setTimezone(new \DateTimeZone($kh->timezone));
            $beforeHour;
            switch($kh->mauutien) {
                case 0: 
                    $beforeHour = '+1 hour';
                    break;
                case 1:
                    $beforeHour = '+2 hour';
                    break;
                case 2:
                    $beforeHour = '+4 hour';
                    break;
                case 3:
                    $beforeHour = '+8 hour';
                    break;
                default:
                    $beforeHour = '+1 day';
                    break;
            }

            if (
                $kh->sdt != null &&
                $kh->dahoanthanh == false &&
                $kh->cothongbao == true &&
                $thoigianObject >= $serverTime &&
                $thoigianObject <= (clone $serverTime)->modify($beforeHour)
            ) {
                if (empty($userList[$kh->sdt])) $userList[$kh->sdt] = [$kh->tenkehoach => $kh->thoigian];
                else $userList[$kh->sdt] = array_merge($userList[$kh->sdt], [$kh->tenkehoach => $kh->thoigian]);
            }
        }

        foreach ($userList as $sdt => $tasks) {
            $msg = 'You have plans:' . "\r\n";
            foreach ($tasks as $name => $time) {
                $msg .= '  - ' . $name . ' on ' . \explode(" ", $time)[0] . ' at ' . \explode(" ", $time)[1] . '.' . "\r\n";
            }
            $sms = new SpeedSMSAPI("mUSFZEbeCwoyWDe8TFO46iMeYytN6ml2");
            $sms->sendSMS([$sdt], $msg, SpeedSMSAPI::SMS_TYPE_CSKH, "");
        }
    }
}
