jQuery = require('jquery/dist/jquery.min.js');
require('javascript-magic/js/ray.js');
require('javascript-magic/jquery/plugins/jquery.touchSwipe.js');
require('javascript-magic/jquery/jquery.ray.js');
$ = jQuery;

var socket;

$(function () {
  	
  	if (window.location.href.indexOf ('localhost') > -1) {  
  	
		var WebSocketConnect = function () {
	
			if ("WebSocket" in window) {
		
				if (socket && socket.readyState !== socket.CLOSED) {
				
					socket.close ();
				}
		
				socket = new WebSocket ("ws://localhost:8889", 'echo-protocol');

				socket.onopen = function () {
			
					window.debug.warn ("Connected to Websocket ...");
					$('html').addClass ('connected');
					var connectPayload = {
						code: 200,
						message: "Thanks for letting me connect."
					};
					socket.send (JSON.stringify (connectPayload));
				};

				socket.onmessage = function (evt) { 
				
					try {
					
						var data = JSON.parse (evt.data);
				
						if (data.code === 300) {
							window.debug.warn (data.message);
							return;
						}
						if (data.code === 500) {
							window.debug.warn (data.message);
							return;
						}
				
						if (data.code >= 200 && data.code < 300) {
							window.debug.warn (data.message);
					
							if (data.code == 201) {
				
								window.location.reload ();
							}
					
							return;
						}
					} catch (err) {
					
						console.error (err);
					}
				};

				socket.onclose = function () { 
			
					window.debug.warn ("Disconnected from Websocket ...");
					$('html').removeClass ('connected');
				};
			} else {
		
				window.error.warn ("WebSocket NOT supported by your Browser!");
			}
		};
		WebSocketConnect ();

		setInterval (
			function () {
		
				if (!$('html').is ('.connected')) {
			
					if (!socket || (socket && socket.readyState === socket.CLOSED)) {
			
						window.debug.warn ('Attempting to connect to WebSocket');
						WebSocketConnect ();
					}
				}
			},
			1000
		);
	
		window.pkg = function () {
		
			var pkgPayload = {
				code: 201,
				message: "Please package my site up."
			};
			socket.send (JSON.stringify (pkgPayload));
		};
	
	}

	//socket.send ('Stuff to send');
	
	require('./scripts-photos.js');
});

