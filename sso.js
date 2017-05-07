var argv=require('optimist').argv
var log=console.log
var express=require('express')
var app=express()
var session = require('express-session')
var bodyParser = require('body-parser')
var moment=require('moment')
var path=require('path')

const bearerToken = require('express-bearer-token');

var log=console.log
var jwt=require('jsonwebtoken')
//var expires = moment().add('days', 7).valueOf();
//log('expire',expires)

var cookieParser=require('cookie-parser')

app.use(bearerToken());

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 20000 }}))
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/show/:x/:y', function(req,res){
	res.render('show.jade',{
		obj:{
			x:req.params.x,
			y:req.params.y,
			cookie:req.cookies,
			session:req.session,
			header:req.headers
		}
	});
});

app.get('/upload', function(req,res){
	res.sendfile(path.join(__dirname,'upload.htm'));
});

app.post('/login', function(req,res){
	log('cookie',req.cookies);	
	if (req.body.id=='bruce') {

		req.session.user_id=req.body.id;
		var token=jwt.sign({name:req.body.id},'secret',{expiresIn:'30seconds'});

		res.cookie('cookie_user', req.body.id);
		res.cookie('cookie_token', token);

		return res.send('<a href="/cjwt?token='+token+'">whoami2</a>')
		return res.json({token:token});
		res.send('ok')
	}
	else res.render('login.jade')
});

app.get('/login', function(req,res){
	res.render('login.jade')
});

app.get('/', function(req,res){
	if (req.session.user_id) res.send('ok');
	else res.redirect('/login');
});

app.get('/verify', function(req,res){
	var token=req.query.token;
	jwt.verify(token, 'secret', function(err,decoded){
		if (err) res.send(err.message)
		else res.send(decoded)
	})
});

function get_token(req,res,next) {
 	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') 
		req.jwt_token=req.headers.authorization.split(' ')[1];
 	else if (req.query && req.query.token) 
    req.jwt_token=req.query.token;

	next();
}

function check_jwt(req,res,next){
	var token=req.token||req.cookies.cookie_token;

	jwt.verify(token, 'secret', function(err,decoded){
		if (err) 
			res.status(401).send(err.message)
		else {
			req.decoded=decoded;
			next()
		}
	})
}

function check_session(req,res,next){
	if (req.session.user_id) next()
	else res.status(401).send('check session exist fail')
}

app.get('/csession', check_session, function(req,res){
	res.send(req.session.user_id)
});
app.get('/cjwt', 
	//get_token, 
	check_jwt, function(req,res){
	res.send(req.decoded)
});
app.get('/ccookie', function(req,res){
	res.send(req.cookies)
});

var port=argv.port||8282
log('port',port);
app.listen(port)
