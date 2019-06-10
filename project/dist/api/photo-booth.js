var http = require ('http');
var fs = require ('fs');
var util = require ('util');
var WebSocketServer = require ('websocket').server;
var logSize = 10;
var dir = __dirname;
var utf8 = require ("utf8");
var logger = require ('logat');
var uuid = require('uuid/v1');
var path = require ('path');
var exec = require ('child_process').exec;
	
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

var stats = fs.statSync (dir + '/photo-booth.js');
var launchTime = new Date (util.inspect (stats.mtime));

var check = function () {
	
	var stats = fs.statSync (dir + '/photo-booth.js');
	var checkTime = new Date (util.inspect (stats.mtime));
	
	stats = fs.statSync (dir + '/log/access.log');
	if (stats.size >= (1000000 * logSize)) {
		
		fs.truncate (
			dir + '/log/access.log',
			0,
			function () {
				
				dwarn ('Reduced the access log.');
			}
		);
	}
	
	stats = fs.statSync (dir + '/log/warn.log');
	if (stats.size >= (1000000 * logSize)) {
		
		fs.truncate (
			dir + '/log/warn.log',
			0,
			function () {
				
				dwarn ('Reduced the warning log.');
			}
		);
	}
	
	stats = fs.statSync (dir + '/log/access.log');
	if (stats.size >= (1000000 * logSize)) {
		
		fs.truncate (
			dir + '/log/error.log',
			0,
			function () {
				
				dwarn ('Reduced the error log.');
			}
		);
	}
	
	if (checkTime > launchTime) {
		derror ('Quitting because the server has changed.');
		process.exit (0);
	}
};

var originIsAllowed = function (origin) {
  
  // put logic here to detect whether the specified origin is allowed.
  return true;
};
  
var socket = http.createServer (
	function(request, response) {
    	
    	dmessage ((new Date ()) + ' Received request for ' + request.url);
    	response.writeHead (404);
    	response.end ();
	}
);
socket.listen (
	8890,
	function() {
    	
    	dmessage((new Date()) + ' Socket is listening on port 8890');
	}
);
 
var wsServer = new WebSocketServer (
	{
		httpServer: socket,
		autoAcceptConnections: false,
		maxReceivedFrameSize: 20971520,
		maxReceivedMessageSize: 20971520
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
        		
        		check ();
        		
        		var tmp = message.utf8Data.toString ();
        		var data = tmp;
				data = JSON.parse (data);
				// dmessage (data);
        		
        		if (data.message == "capture") {
        			
        			dmessage ("Received an Image");
        			
        			var buffer = Buffer.from(data.payload, 'base64');
        			
        			var d = new Date ();
        			var name = d.getTime () + '-' + uuid () + '.jpg';
					
					fs.writeFile(dir + "/../photos/" + name, buffer,  "binary", function (err) {
	
						if(err) {
		
							dmessage((new Date()) + ' Error writing file ' + err.toString () + '.');
							
							var process = {
								message: "error",
								image: name
							};

							wsServer.connections.forEach (function (conn) {
				
								conn.sendUTF (JSON.stringify (process));
							});
						} else {
		
							var process = {
								message: "success",
								image: name
							};
							
							wsServer.connections.forEach (function (conn) {
				
								conn.sendUTF (JSON.stringify (process));
							});
						}
					});
        		} else if (data.message == "client") {
        			
        			dmessage ("Client connected");
        			
        			fs.readdir (dir + "/../photos", (err, files) => {
						
						var images = [];
						
						files.forEach (file => {
							
							images.push (file);
						});
						
						var list = {
							message: "list",
							images: images
						};

						connection.sendUTF (JSON.stringify (list));
					});
        		} else if (data.message == "remove") {
        			
        			dmessage ("Remove photo");
        			
        			fs.unlinkSync(dir + "/../photos/" + data.image);
					
					var removed = {
						message: "removed",
						image: data.image
					};
					
					wsServer.connections.forEach (function (conn) {
				
						conn.sendUTF (JSON.stringify (removed));
					});
        		} else if (data.message == "shoot") {
        			
        			dmessage ("Shoot photo");
        			
        			var shoot = {
						message: "shoot"
					};
					
					wsServer.connections.forEach (function (conn) {
				
						conn.sendUTF (JSON.stringify (shoot));
					});
        		} else if (data.message == "reboot") {
        			
        			dmessage ("Rebooted");
        			
        			var rebooted = {
						message: "rebooted"
					};
					
					wsServer.connections.forEach (function (conn) {
				
						conn.sendUTF (JSON.stringify (rebooted));
					});
					
					exec ('reboot',
						(error, stdout, stderr) => {
							
							if (stdout !== null) {
								
								dmessage (stdout);
							}
							
							if (stderr !== null) {
								
								derror (stderr);
							}
							
							if (error !== null) {
								
								derror (error);
							}
					});
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