var express=require('express')
var app=express()
var argv=require('optimist').argv
var port=argv.port||8383
var log=console.log
var path=require('path')
var fs=require('fs')
var async=require('async')
var _=require('lodash')

app.get('/futil/list_file', check_dir, get_files, function(req,res){
	res.send(req.files);
})
app.get('/futil/list_dir', check_dir, get_files, function(req,res){
	res.send(req.dirs);
})

function get_file_info(fname, cb){
	fs.stat(fname, function(err,stat){
			if(err) return cb(err);

			if(stat.isFile())
				stat.type='file'
			else
				stat.type='dir'

			stat.name=path.basename(fname);
			cb(err, stat);
	});
}

function get_files(req,res,next) {
  fs.readdir(req.working_dir, function(err, filenames) {
		filenames=filenames.map(function(sfile){
			return path.join(req.working_dir, sfile)
		});

		return async.mapLimit(filenames, 3, get_file_info, function(err,results){
			results.map(function(stat){
			});		
			req.files=_.filter(results,{type:'file'});
			req.dirs=_.filter(results,{type:'dir'});
			//res.send(req.files)
			next()
		});
	});
}

function check_dir(req,res,next){
	if (!req.query.dir) {
		res.status(404).send('no dir specified')
	}
	else {
		req.working_dir=path.join('/fservice_root', req.query.dir)
		next()
	}
}

log('listent at ',port)
app.listen(port)
