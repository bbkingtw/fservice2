local res = ngx.location.capture("/auth")

ngx.log(ngx.OK,"res.status",res.status,"==>",ngx.HTTP_UNAUTHORIZED)

if res.status == ngx.HTTP_OK then
	return
end

if res.status == ngx.HTTP_FORBIDDEN then
	ngx.exit(res.status)
end

if res.status == ngx.HTTP_UNAUTHORIZED then
	ngx.exit(res.status)
end

if res.status == ngx.HTTP_NOT_FOUND then
	ngx.exit(res.status)
end

ngx.exit(ngx.HTTP_INTERNAL_SERVER_ERROR)

