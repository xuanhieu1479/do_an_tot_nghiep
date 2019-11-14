<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use DB;
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
        $beforeHour = 2;
        $serverTime = new \DateTime();
        $kehoach = DB::table('kehoach')
                    ->join('taikhoan', 'kehoach.email', '=', 'taikhoan.email')
                    ->select('kehoach.email', 'tenkehoach', 'thoigian', 'dahoanthanh', 'cothongbao', 'timezone')
                    ->get();

        foreach ($kehoach as $kh) {
            $thoigianObject = \DateTime::createFromFormat('Y-m-d H:i:s', $kh->thoigian, new \DateTimeZone($kh->timezone));
            $serverTime->setTimezone(new \DateTimeZone($kh->timezone));
            if (
                $kh->dahoanthanh == false &&
                $kh->cothongbao == true &&
                $thoigianObject >= $serverTime &&
                $thoigianObject <= (clone $serverTime)->modify('+' . $beforeHour . ' hour')
            ) {
                Mail::to($kh->email)->send(new MailTaskNotification($kh->tenkehoach, (\explode(" ", $kh->thoigian))[1]));
            }
        }
    }
}
