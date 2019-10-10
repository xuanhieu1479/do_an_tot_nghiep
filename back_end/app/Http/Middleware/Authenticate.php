<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            return route('login');
            //mỗi khi vào trang nào cần đăng nhập chưa đăng nhập thì redirect tới trang đăng nhập bên front end
            //khi nào trang đăng nhập front end làm xong + push lên heroku r thì update sau
        }
    }
}
