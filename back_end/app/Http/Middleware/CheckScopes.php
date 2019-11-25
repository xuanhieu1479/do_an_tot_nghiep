<?php

namespace App\Http\Middleware;

use \Laravel\Passport\Http\Middleware\CheckScopes as Middleware;

class CheckScopes extends Middleware
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  mixed  ...$scopes
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Auth\AuthenticationException|\Laravel\Passport\Exceptions\MissingScopeException
     */
    public function handle($request, $next, ...$scopes)
    {
        foreach ($scopes as $scope) {
            if (! $request->user()->tokenCan($scope)) {
                return response()->json([], 403);
            }
        }

        return $next($request);
    }
}
