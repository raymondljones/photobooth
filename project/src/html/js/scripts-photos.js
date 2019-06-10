$window = $(window);
$html = $('html');
$body = $('body');
$photos = $('ul#photos');
$print = $('#print');
$shoot = $('#shoot');
$socket = null;
	
/*$image = {
	message: "capture",
	payload: $dataUrl.replace ('data:image/jpeg;base64,', '')
};
$socket.send (JSON.stringify ($image));

$html.addClassIfNotExists ('taken');*/
					
$.fn.scrollFx (
	function () {
		
		$('#photos > li').removeClassIfExists ('active');
		//$nav.removeClassIfExists ('open');
	}
);

$.fn.resizeFx (
	function () {
		
		$.fn.scrollFx ();
	}
);

$.fn.start = function () {

	setInterval (
		function () {
	
			if (!$html.is ('.api-connected')) {
				
				if (!$socket || ($socket && $socket.readyState === $socket.CLOSED)) {
		
					window.debug.warn ('Attempting to connect to API WebSocket');
					$.fn.WebSocketConnect ();
				}
			}
		},
		1000
	);
};

$.fn.takePhoto = function () {
	
	$shootPayload = {
		message: "shoot"
	};
	$socket.send (JSON.stringify ($shootPayload));
};

$shoot.click (
	function (e) {
		
		$.fn.takePhoto ();
	}
);
  
$.fn.WebSocketConnect = function () {

	if ("WebSocket" in window) {
	
		if ($socket && $socket.readyState !== $socket.CLOSED) {
			
			$socket.close ();
		}
		
		$host = window.location.hostname;
		$protocol = "ws";
		$path = "/socket";
	
		$socket = new WebSocket ($protocol + "://" + $host + $path, 'echo-protocol');
	
		$socket.onopen = function () {
		
			window.debug.warn ("Connected to API Websocket ...");
			$html.addClass ('api-connected');
			$connectPayload = {
				message: "client"
			};
			$socket.send (JSON.stringify ($connectPayload));
		};

		$socket.onmessage = function (evt) { 
			
			window.debug.warn ("Received a Message from API Websocket ...");
			try {
				
				var data = JSON.parse (evt.data);
			
				if (data.message == "list") {
					window.debug.warn ("API Websocket list ...");
					
					$photos.html('');
					
					for (var i=0;i<data.images.length;i++) {
						
						$image = data.images [i];
						
						if ($image.indexOf ('jpg') > -1) {
						
							//console.log ($image);
						
							$photos.append ('<li><img src="/photos/' + $image + '" /><a class="close" href="#">x</a></li>');
							
						}
						
					}
				} else if (data.message == "success") {
					
					window.debug.warn ("API Websocket success ...");
					
					$photos.append ('<li><img src="/photos/' + data.image + '" /><a class="close" href="#">x</a></li>');
					
				} else if (data.message == "removed") {
				
					$photos.find ('img[src="/photos/' + data.image + '"]').parent ().remove ();
				}
				
			} catch (err) {
				
				console.error (err);
			}
		};

		$socket.onclose = function () { 
		
			window.debug.warn ("Disconnected from API Websocket ...");
			$html.removeClass ('api-connected');
		};
	} else {
	
		window.error.warn ("WebSocket NOT supported by your Browser!");
	}
};

$body.delegate ('#photos > li', 'click', function (e) {
	
	$target = $(e.target);
	$element = $(this);
	
	if ($target.is ('.close')) {
	
		e.preventDefault ();
		e.stopPropagation ();
		
		if (confirm ("Are you sure you want to remove this photo?")) {
		
			$removePayload = {
				message: "remove",
				image: ($(this).find ('img').attr ('src')).replace ("/photos/", "")
			};
			$socket.send (JSON.stringify ($removePayload));
		
		}
	
	} else {
		
		if ($html.is ('.touch') && !$element.is ('.active')) {
			$('#photos > li').removeClassIfExists ('active');
			$element.addClassIfNotExists ('active');
			return;
		}
		
		$print.html('<iframe src="' + $(this).find ('img').get (0).src + '"></iframe>');
		$print.find ('iframe').get (0).onload = function () { $print.find ('iframe').get (0).contentWindow.print(); }
	
	}
	
});

$.fn.start ();

$.fn.detectionFx ();
$.fn.resizeFx ();

window.debug.warn ('Hi there');