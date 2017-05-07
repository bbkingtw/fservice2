vi nginx/html/test.html
#./build.open
docker-compose restart
curl -I http://localhost:9000/upload_file
