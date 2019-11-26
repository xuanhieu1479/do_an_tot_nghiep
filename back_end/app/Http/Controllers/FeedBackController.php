<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserFeedBack;

class FeedBackController extends Controller
{
    private $adminMail = 'xuanhieu1479@gmail.com';

    public function sendUserFeedBack(Request $request) {
        $email = $request->input('email');
        $feedback = $request->input('feedback');
        $msg = 'A feedback from user ' . $email . '.' . "\r\n" . "\r\n" . $feedback;

        try {
            Mail::to($this->adminMail)->send(new UserFeedBack($msg));
            return response()->json([], 200);
        } catch(\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
