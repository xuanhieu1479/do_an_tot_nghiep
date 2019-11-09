Chương trình cần cài
 + Git
 + NodeJS - version 10.16.0
 + PHP - version 7 trở lên
 + Composer 
 + VirtualBox
 + Vagrant
 + Homestead
 + Laravel - version 6 trở lên

Cách chạy web
 - Front end:
    + npm install
    + npm start
    + mở trang localhost:3000 = trình duyệt
 - Back end:
    + composer install
    + chạy máy ảo = vagrant up trong thư mục cài Homestead hoặc php artisan serve
    + mở trang 127.0.0.1 hoặc localhost nếu chạy = php artisan serve, 192.168.10.10 hoặc Homestead.test nếu chạy = vagrant up

Cách reset csdl
 + php artisan migrate:refresh --seed
 + php artisan passport:install

Cách mở csdl trong máy ảo ra xem
 + Vào thư mục cài homestead
 + Git bash hoặc Command Line gõ vagrant ssh
 + Tiếp psql -U homestead -h localhost homestead
 + Password là 'secret'
 + \l để xem danh sách database
 + \dt để xem danh sách các bảng
 + \d+ <tên bảng> để xem thông tin bảng
 + TABLE <tên bảng> để xem dữ liệu bảng
Nếu không thấy bảng nào thì reset csdl rồi \dt trong máy ảo
