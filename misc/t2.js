var jwt=require('jsonwebtoken')
var moment=require('moment')

var token=jwt.sign({foo: 'bar'}, 'shhhhh', { subject:'test', expiresIn:'5seconds' });

var log=console.log

log(token)

setInterval(check, 1000, token);

function check(token){
	jwt.verify(token, 'shhhhh', function(err, decoded){
		if(err) log('err',err)
		else {
			log('decoded',decoded)
			log(new Date(decoded.iat))
			log(moment()._d);
		}
	})
}
