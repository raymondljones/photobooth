var http = require ('http');
var fs = require ('fs');
var util = require ('util');
var WebSocketServer = require ('websocket').server;
var logSize = 10;
var dir = __dirname;
var html = dir + '/html';
var pkg = dir + '/pkg';
var watch = require ('watch');
var utf8 = require ("utf8");
var maxIterations = 5;
var logger = require ('logat');
var watched = {};
var compress = require ('compression');
var uuid = require('uuid/v1');
var path = require ('path');

var lastModified = function () {
	var t = new Date ();
	// t.setSeconds (t.getSeconds() - 1);
	return t.toUTCString ();
};

var expires = function () {
	var t = new Date ();
	t.setSeconds (t.getSeconds() + 99999999);
	return t.toUTCString ();
};

var gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    less = require("gulp-less"),
    browserify = require("gulp-browserify"),
    concat = require("gulp-concat"),
    gutil = require("gulp-util"),
    rename = require("gulp-rename");

var mCSS = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    argv = require('yargs').argv,
	gulpif = require('gulp-if'),
	clean = require('gulp-clean'),
	minifyHTML = require('gulp-htmlmin'),
	replace = require('gulp-replace'),
	htmlMinifier = require('html-minifier').minify;
	
fs.writeFile (
	dir + '/log/access.log',
	'',
	(err) => {
		if (err) {
			
			derror (err);
		}
	}
);
fs.writeFile (
	dir + '/log/warn.log',
	'',
	(err) => {
		if (err) {
			
			derror (err);
		}
	}
);
fs.writeFile (
	dir + '/log/error.log',
	'',
	(err) => {
		if (err) {
			
			derror (err);
		}
	}
);
	
var dmessage = function (m) {
	
	console.log (m);
	var message = {
  		date: new Date().toUTCString(),
  		details: ((new Error ().stack).split ("at ") [3]).trim (),
  		message: m
  	};
  
	fs.appendFile(
		dir + '/log/access.log',
		"\n\n\n\n" + JSON.stringify (message),
		function (err) {
	  		
	  		if (err) {
	  			
	  			derror (err, false);
	  		}
		}
	);
};

var dwarn = function (m) {
	
	console.warn (m);
	var message = {
  		date: new Date().toUTCString(),
  		details: ((new Error ().stack).split ("at ") [3]).trim (),
  		message: m
  	};
  
	fs.appendFile(
		dir + '/log/warn.log',
		"\n\n\n\n" + JSON.stringify (message),
		function (err) {
	  		
	  		if (err) {
	  			
	  			derror (err, false);
	  		}
		}
	);
};

var derror = function (m) {
	
	console.error (m);
	var message = {
  		date: new Date().toUTCString(),
  		details: ((new Error ().stack).split ("at ") [3]).trim (),
  		message: m
  	};
  
	fs.appendFile(
		dir + '/log/error.log',
		"\n\n\n\n" + JSON.stringify (message),
		function (err) {
	  		
	  		if (err) {
	  			
	  			derror (err, false);
	  		}
		}
	);
};

var stats = fs.statSync (dir + '/index.js');
var launchTime = new Date (util.inspect (stats.mtime));

var sendError = function (message) {
	
	derror (message);
	for (var i = 0; i < wsServer.connections.length; i++) {
				
		var connection = wsServer.connections [i];
		var errorPayload = {
			code: 500,
			message: message
		};
		connection.sendUTF ((JSON.stringify (errorPayload)));
	}
};

var sendWarning = function (message) {
	
	dwarn (message);
	for (var i = 0; i < wsServer.connections.length; i++) {
				
		var connection = wsServer.connections [i];
		var warningPayload = {
			code: 300,
			message: message
		};
		connection.sendUTF ((JSON.stringify (warningPayload)));
	}
};

var sendMessage = function (code, message) {
	
	dmessage (message);
	for (var i = 0; i < wsServer.connections.length; i++) {
				
		var connection = wsServer.connections [i];
		var messagePayload = {
			code: code,
			message: message
		};
		connection.sendUTF ((JSON.stringify (messagePayload)));
	}
};

var check = function () {
	
	var stats = fs.statSync (dir + '/index.js');
	var checkTime = new Date (util.inspect (stats.mtime));
	
	stats = fs.statSync (dir + '/log/access.log');
	if (stats.size >= (1000000 * logSize)) {
		
		fs.truncate (
			dir + '/log/access.log',
			0,
			function () {
				
				sendWarning ('Reduced the access log.');
			}
		);
	}
	
	stats = fs.statSync (dir + '/log/warn.log');
	if (stats.size >= (1000000 * logSize)) {
		
		fs.truncate (
			dir + '/log/warn.log',
			0,
			function () {
				
				sendWarning ('Reduced the warning log.');
			}
		);
	}
	
	stats = fs.statSync (dir + '/log/access.log');
	if (stats.size >= (1000000 * logSize)) {
		
		fs.truncate (
			dir + '/log/error.log',
			0,
			function () {
				
				sendWarning ('Reduced the error log.');
			}
		);
	}
	
	if (checkTime > launchTime) {
		sendError ('Quitting because the server has changed.');
		process.exit (0);
	}
};

var originIsAllowed = function (origin) {
  
  // put logic here to detect whether the specified origin is allowed.
  return true;
};

var componentize = function (data) {
	
	var tmp = data;
	
	var files = fs.readdirSync(html + '/components/');
	
	// dmessage (files);
	
	for (var i = 0; i < files.length; i++) {
		
		var file = files [i];
		var regex = new RegExp ("{" + file + "}", "g");
		tmp = tmp.replace (regex, '<!-- Begin ' + file + ' -->' + "\n" + fs.readFileSync (html + '/components/' + file) + "\n" + '<!-- End ' + file + ' -->');
	}
	
	return utf8.encode (tmp);
};
  
var server = http.createServer (
	function (request, response) {
    	
    	check ();
    	
    	var noop = function () {}, useDefaultOptions = {};
  		compress (useDefaultOptions) (request, response, noop);
    	
    	dmessage ('------------------------------------------------');
		// dmessage (request.method);
    	// dmessage (request.headers);
    	dmessage ((new Date ()) + ' Received request for ' + request.url);
    	// dmessage (response);
    	
    	var pieces = request.url.split ('/');
    	var resource = pieces.join ('/');
    	pieces = resource.split ('?');
    	resource = pieces [0];
    	var query = "";
    	if (pieces.length > 1) {
    		query = pieces [1];
    	}
    	
    	dmessage (resource);
    	
    	if (resource === '/') {
    		
    		resource = 'index.html';
    	}
    	
    	try {
			
			fs.readFile (
				html + '/' + resource,
				function read (err, data) {
				
					if (err) {
					
						sendWarning ('404' + resource);
						
						response.writeHead (
							404,
							{
								'Content-Type': 'text/html'
							}
						);
					
						response.write ('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>Nope</h1><p>This resource cannot be found</p></body></html>');
						dmessage ((new Date ()) + ' 404');
						dmessage ('------------------------------------------------');
						response.end ();
					
						dmessage (err);
					}
				
					if (resource.endsWith ('.jss')) {
					
						response.writeHead (
							200,
							{
								'Content-Type': 'text/javascript',
								'Cache-Control': 'max-age=999999999, public',
								'Last-Modified': lastModified (),
								'Expires': expires (),
								'ETag': 'x234dff'
							}
						);
					 } else if (resource.indexOf ('.js') > -1) {
						
						response.writeHead (
							200,
							{
								'Content-Type': 'text/javascript',
								'Cache-Control': 'max-age=999999999, public',
								'Last-Modified': lastModified (),
								'Expires': expires (),
								'ETag': 'x234dff'
							}
						);
					} else if (resource.endsWith ('.less')) {
						
						response.writeHead (
							200,
							{
								'Content-Type': 'text/css',
								'Cache-Control': 'max-age=999999999, public',
								'Last-Modified': lastModified (),
								'Expires': expires (),
								'ETag': 'x234dff'
							}
						);
					} else if (resource.indexOf ('.css') > -1) {
					
						response.writeHead (
							200,
							{
								'Content-Type': 'text/css',
								'Cache-Control': 'max-age=999999999, public',
								'Last-Modified': lastModified (),
								'Expires': expires (),
								'ETag': 'x234dff'
							}
						);
					} else if (resource.indexOf ('.png') > -1) {
					
						response.writeHead (
							200,
							{
								'Content-Type': 'image/png',
								'Cache-Control': 'max-age=999999999, public',
								'Last-Modified': lastModified (),
								'Expires': expires (),
								'ETag': 'x234dff'
							}
						);
					} else if (resource.indexOf ('.jpg') > -1) {
					
						response.writeHead (
							200,
							{
								'Content-Type': 'image/jpeg',
								'Cache-Control': 'max-age=999999999, public',
								'Last-Modified': lastModified (),
								'Expires': expires (),
								'ETag': 'x234dff'
							}
						);
					} else if (resource.indexOf ('.gif') > -1) {
					
						response.writeHead (
							200,
							{
								'Content-Type': 'text/gif',
								'Cache-Control': 'max-age=999999999, public',
								'Last-Modified': lastModified (),
								'Expires': expires (),
								'ETag': 'x234dff'
							}
						);
					}  else if (resource.indexOf ('.ico') > -1) {
					
						response.writeHead (
							200,
							{
								'Content-Type': 'image/x-icon',
								'Cache-Control': 'max-age=999999999, public',
								'Last-Modified': lastModified (),
								'Expires': expires (),
								'ETag': 'x234dff'
							}
						);
					 } else if (resource.indexOf ('.pdf') > -1) {
						
						console.log ('download is :' + query + ' - ' + query.indexOf ('download'));
						if (query.indexOf ('download') > -1) {
						
							response.writeHead (
								200,
								{
									'Content-Type': 'application/pdf',
									'Cache-Control': 'max-age=999999999, public',
									'Content-Disposition': 'attachment; filename="' + path.basename (resource) + '"',
									'Last-Modified': lastModified (),
									'Expires': expires (),
									'ETag': 'x234dff'
								}
							);
						} else {
							
							response.writeHead (
								200,
								{
									'Content-Type': 'application/pdf',
									'Cache-Control': 'max-age=999999999, public',
									'Last-Modified': lastModified (),
									'Expires': expires (),
									'ETag': 'x234dff'
								}
							);
						}
					} else if (resource.indexOf ('.mp4') > -1) {
					
						if (query.indexOf ('download') > -1) {
						
							response.writeHead (
								200,
								{
									'Content-Type': 'video/mp4',
									'Cache-Control': 'max-age=999999999, public',
									'Content-Disposition': 'attachment; filename="' + path.basename (resource) + '"',
									'Last-Modified': lastModified (),
									'Expires': expires (),
									'ETag': 'x234dff'
								}
							);
						} else {
							
							response.writeHead (
								200,
								{
									'Content-Type': 'video/mp4',
									'Cache-Control': 'max-age=999999999, public',
									'Last-Modified': lastModified (),
									'Expires': expires (),
									'ETag': 'x234dff'
								}
							);
						}
					} else {
						response.writeHead (
							200,
							{
								'Content-Type': 'text/html; charset=utf-8',
								'Cache-Control': 'max-age=999999999, public',
								'Last-Modified': lastModified (),
								'Expires': expires (),
								'ETag': 'x234dff'
							}
						);
						
						if (data) {
							var iteration = 1;
							while (iteration <= maxIterations) {
								data = componentize (data.toString ());
								iteration++;
							}
							
							data = htmlMinifier (
								data,
								{
									removeAttributeQuotes: true,
									minifyCSS: true,
									minifyJS: true,
									sortAttributes: true,
									sortClassName: true,
									collapseWhitespace: true
								}
							);
							
							data = data.replace(/{debug}/g, 'true');
							data = data.replace(/\.less/g, '.less?cb=' + uuid ());
							data = data.replace(/\.jss/g, '.jss?cb=' + uuid ());
							data = data.replace(/\.jpg/g, '.jpg?cb=' + uuid ());
							data = data.replace(/\.png/g, '.png?cb=' + uuid ());
							data = data.replace(/\.gif/g, '.gif?cb=' + uuid ());
							data = data.replace(/\.ico/g, '.ico?cb=' + uuid ());
						}
					}
				
					if (resource.endsWith ('.less')) {
						
						if (!watched[resource] || new Date (util.inspect (fs.statSync (html + '/' + resource).mtime)) > watched[resource]) {
							
							gulp.src (html + '/' + resource)
							  .pipe (less ({}))
							  .pipe(replace('.jpg', '.jpg?cb=' + uuid ()))
								.pipe(replace('.png', '.png?cb=' + uuid ()))
								.pipe(replace('.gif', '.gif?cb=' + uuid ()))
							  .pipe (sourcemaps.write ())
							  .pipe (gulp.dest (html + '/css/'))
							  .on('finish', function () {
								
								response.write (fs.readFileSync (html + '/' + resource.replace ('.less', '.css')));
								// dmessage ((new Date ()) + ' Sent: ' + data);
								dmessage ('------------------------------------------------');
								response.end ();
								watched[resource] = new Date (util.inspect (fs.statSync (html + '/' + resource).mtime));
							  });
						} else {
							
							response.write (fs.readFileSync (html + '/' + resource.replace ('.less', '.css')));
							// dmessage ((new Date ()) + ' Sent: ' + data);
							dmessage ('------------------------------------------------');
							response.end ();
						}
					} else if (resource.endsWith ('.jss')) {
						
						if (!watched[resource] || new Date (util.inspect (fs.statSync (html + '/' + resource).mtime)) > watched[resource]) {
							
							gulp.src(html + '/' + resource)
							  .pipe(browserify({
								  insertGlobals: true
							  }))
							  .pipe (sourcemaps.write ())
							  .pipe(concat((resource.split('\\').pop().split('/').pop()).replace ('.jss', '.js')))
							  .pipe(uglify({ mangle: false }))
							  .pipe(replace('.jpg', '.jpg?cb=' + uuid ()))
								.pipe(replace('.png', '.png?cb=' + uuid ()))
								.pipe(replace('.gif', '.gif?cb=' + uuid ()))
							  .pipe(gulp.dest(html + '/js/'))
							  .on('finish', function () {

								  response.write (fs.readFileSync (html + '/' + resource.replace ('.jss', '.js')));
								// dmessage ((new Date ()) + ' Sent: ' + data);
								dmessage ('------------------------------------------------');
								response.end ();
								watched[resource] = new Date (util.inspect (fs.statSync (html + '/' + resource).mtime));
							  });
						} else {
							
							response.write (fs.readFileSync (html + '/' + resource.replace ('.jss', '.js')));
							// dmessage ((new Date ()) + ' Sent: ' + data);
							dmessage ('------------------------------------------------');
							response.end ();
						}
					} else {
						
						if (data) {
							response.write (data);
						}
						// dmessage ((new Date ()) + ' Sent: ' + data);
						dmessage ('------------------------------------------------');
						response.end ();
					}
				}
			);
		} catch (e) {
			
			sendWarning ('404' + resource);
			
			response.writeHead (
				404,
				{
					'Content-Type': 'text/html'
				}
			);
			
			response.write ('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>Nope</h1><p>This resource cannot be found</p></body></html>');
			dmessage ((new Date ()) + ' 404');
			dmessage ('------------------------------------------------');
			response.end ();
			
			dmessage (e);
		}
	}
);

server.listen (
	8888,
	function () {
    
		dmessage ('------------------------------------------------');
		dmessage ((new Date ()) + ' Server is listening on port 8888');
		dmessage ('------------------------------------------------');
	}
);

var socket = http.createServer (
	function(request, response) {
    	
    	dmessage ((new Date ()) + ' Received request for ' + request.url);
    	response.writeHead (404);
    	response.end ();
	}
);
socket.listen (
	8889,
	function() {
    	
    	dmessage((new Date()) + ' Socket is listening on port 8889');
	}
);
 
var wsServer = new WebSocketServer (
	{
		httpServer: socket,
		autoAcceptConnections: false
	}
);

wsServer.on (
	'request',
	function (request) {
    	
    	check ();
    	
    	if (!originIsAllowed(request.origin)) {
		  
		  // Make sure we only accept requests from an allowed origin
		  request.reject ();
		  dmessage ((new Date ()) + ' Connection from origin ' + request.origin + ' rejected.');
		  return;
		}
    
    	var connection = request.accept ('echo-protocol', request.origin);
    	dmessage ((new Date ()) + ' Connection accepted.');
    
    	connection.on (
    		'message',
    		function (message) {
        		
        		var tmp = message.utf8Data.toString ();
        		var data = tmp;
				data = JSON.parse (data);
				dmessage (data);
        		
        		if (data.code == 200) {
        			
        			var responsePayload = {
        				code: 200,
        				message: "You're welcome."
        			};
        			connection.sendUTF ((JSON.stringify (responsePayload)));
        		} else if (data.code == 201) {
        			
        			var responsePayload = {
        				code: 202,
        				message: "Packaging ..."
        			};
        			connection.sendUTF ((JSON.stringify (responsePayload)));
        			
        			/////
        			gulp.start ('src');
					/////
        		}
    		}
    	);
    	
    	connection.on (
    		'close',
    		function (reasonCode, description) {
        		
        		check ();
        		
        		dwarn ((new Date ()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    		}
    	);
	}
);

watch.createMonitor (
	html,
	{
		ignoreDotFiles: true
	},
	function (monitor) {
	
		monitor.files[html + '**/**']; // Stat object for my zshrc.
		monitor.on ("created", function (f, stat) {
	  		
	  		if ((!f.endsWith ('.js') && !f.endsWith ('.css') && !f.endsWith ('.log') && f.indexOf ('photos') < 0) || f.endsWith ('scripts.js') || f.endsWith ('scripts-photos.js')) {
				
				watched = {};
				sendMessage (201, 'New File: ' + f);
	  		}
		});
	
		monitor.on ("changed", function (f, curr, prev) {
	  		
	  		if ((!f.endsWith ('.js') && !f.endsWith ('.css') && !f.endsWith ('.log') && f.indexOf ('photos') < 0) || f.endsWith ('scripts.js') || f.endsWith ('scripts-photos.js')) {
				
				watched = {};
				sendMessage (201, 'Changed File: ' + f);
	  		}
		});
	
		monitor.on ("removed", function (f, stat) {
	  		
	  		if ((!f.endsWith ('.js') && !f.endsWith ('.css') && !f.endsWith ('.log') && f.indexOf ('photos') < 0) || f.endsWith ('scripts.js') || f.endsWith ('scripts-photos.js')) {
				
				watched = {};
				sendMessage (201, 'Removed File: ' + f);
	  		}
		});
	
		// monitor.stop(); // Stop watching
});

require (dir + '/gulpfile.js');