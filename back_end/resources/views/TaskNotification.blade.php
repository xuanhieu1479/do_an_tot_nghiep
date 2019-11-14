<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Nhắc nhở kế hoạch</title>

    </head>
    <body>
        <div>
            <p>                
                Bạn có kế hoạch {{$tenkehoach}} vào lúc {{$thoigian}}.<br><br>
                Xin hãy chú ý sắp xếp thời gian.
            </p>
        </div>
    </body>
</html>
