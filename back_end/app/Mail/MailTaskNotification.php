<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MailTaskNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $tenkehoach = 'ABC';
    public $thoigian = '7:00';

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($tenkehoach, $thoigian)
    {
        $this->tenkehoach = $tenkehoach;
        $this->thoigian = $thoigian;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('TaskNotification');
    }
}
