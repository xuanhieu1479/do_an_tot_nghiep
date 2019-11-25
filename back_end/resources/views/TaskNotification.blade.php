<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Task Notification</title>

    </head>
    <body>
        <div>
            <p>                
                You have a plan {{$tenkehoach}} at {{$thoigian}}.
            </p>
        </div>
    </body>
</html>
