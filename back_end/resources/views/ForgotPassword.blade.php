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

            <form action="{{$domain}}newpassword.php" method="POST">
                <input type="hidden" value="{{$token}}">
                <input type="submit" value="Restore Password">
            </form>

            <p>
                <br>
                Regards, DoAn Team
            </p>
        </div>
    </body>
</html>
