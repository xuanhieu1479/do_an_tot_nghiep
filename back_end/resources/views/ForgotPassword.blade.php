<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Forgot Password</title>

    </head>
    <body>
        <div>
            <p>
                Hello, we've received a request to restore password.<br>
                It if wasn't you, please ignore this email.<br>
                Otherwise, press the button below to create new password.<br>
                <br>
            </p>
            
            <a href="{{$domain}}newpassword?email={{$email}}&token={{$token}}">
                <button>Restore Password</button>
            </a>

            <p>
                <br>
                Regards, DoAn Team
            </p>
        </div>
    </body>
</html>
