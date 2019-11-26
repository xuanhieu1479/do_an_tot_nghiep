<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use DB;
use Carbon\Carbon;
use App\Mail\MailTaskNotification;

class SendTaskNotificationEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:tasknotification';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send task notification emails to each user';

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
        \Log::info('Schedule did run');
        $serverTime = new \DateTime();
        $kehoach = DB::table('kehoach')
                    ->join('taikhoan', 'kehoach.email', '=', 'taikhoan.email')
                    ->select('kehoach.email', 'tenkehoach', 'thoigian', 'mauutien', 'cothongbao', 'dahoanthanh', 'timezone')
                    ->get();

        $userList = [];

        foreach ($kehoach as $kh) {
            $thoigianObject = \DateTime::createFromFormat('Y-m-d H:i:s', $kh->thoigian, new \DateTimeZone($kh->timezone));
            $serverTime->setTimezone(new \DateTimeZone($kh->timezone));
            $beforeHour;
            switch($kh->mauutien) {
                case 0: 
                    $beforeHour = '+7 day';
                    break;
                case 1:
                    $beforeHour = '+3 day';
                    break;
                case 2:
                    $beforeHour = '+1 day';
                    break;
                case 3:
                    $beforeHour = '+4 hour';
                    break;
                default:
                    $beforeHour = '+1 hour';
                    break;
            }

            if (
                $kh->dahoanthanh == false &&
                $kh->cothongbao == true &&
                $thoigianObject >= $serverTime &&
                $thoigianObject <= (clone $serverTime)->modify($beforeHour)
            ) {
                if (empty($userList[$kh->email])) $userList[$kh->email] = [$kh->tenkehoach => $kh->thoigian];
                else $userList[$kh->email] = array_merge($userList[$kh->email], [$kh->tenkehoach => $kh->thoigian]);
            }
        }

        foreach ($userList as $email => $tasks) {
            $msg = 'You have plans:' . "\r\n";
            foreach ($tasks as $name => $time) {
                $msg .= '  - ' . $name . ' on ' . \explode(" ", $time)[0] . ' at ' . \explode(" ", $time)[1] . '.' . "\r\n";
            }
            Mail::to($email)->send(new MailTaskNotification($msg));
        }
    }
}
