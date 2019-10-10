<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Quên mật khẩu</title>

    </head>
    <body>
        <div>
            <h6>Lưu ý tác giả cực kì dốt văn*</h6>
        </div>
        <div>
            <p>                
                Xin chào<br><br>
                Mật khẩu tạm thời của bạn là {{ $matKhauMoi }}.<br><br>
                Chúng tôi khuyến cáo bạn nên đổi mật khẩu càng sớm càng tốt bằng đường dẫn sau.<br><br>
                &#60;bỏ link đổi mật khẩu vô đây&#62;
            </p>
        </div>
    </body>
</html>
