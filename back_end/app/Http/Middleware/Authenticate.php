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
            $this->redirectTo = 'https://google.com'; //Tại lười, nhát override auth:api để thay vì redirect mà trả về json.
            return $this->redirectTo;
        }
    }
}
