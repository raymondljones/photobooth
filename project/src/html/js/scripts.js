$window = $(window);
$html = $('html');
$body = $('body');
$canvas = $('#canvas');
$placeholder = $('#placeholder');
$video = $('#video');
$videoElem = $video.get (0);
$context = $canvas.get (0).getContext ("2d");
$videoObj = { video: true };
$imageFormat = "jpeg";
$quality = 100;
$capture = $('#capture');
$countdown = 3;
$countdownLabel = $('#countdown label');
$interval = null;
$options = $('body > header > ul > li');
$border = $('#border');
$tracking = $('#tracking');
$isTracking = false;
$socket = false;
$footer = $('footer');
$rebootButton = $('#reboot-button');
$cancelButton = $('#cancel-button');

$html.attr ('data-style', '');

$footer.click (function (e) {
	
	$html.addClassIfNotExists ('ask');
});

$cancelButton.click (function (e) {
	
	$html.removeClassIfExists ('ask');
});

$rebootButton.click (function (e) {
	
	$reboot = {
		message: "reboot"
	};
	$socket.send (JSON.stringify ($reboot));
});

$.fn.chosenOption = function () {
	
	return $('body > header > ul > li[data-option="' + $html.attr ('data-option') + '"] img').get (0);
	
}

$.fn.errBack = function (error) {
	
	$('html').removeClassIfExists ('cam-supported').removeClassIfExists ('cam-error').addClassIfNotExists ('cam-not-supported');
	console.log("Video capture error: ", error.code); 
};

$.fn.startCountdown = function () {
	$countdown = 5;
	$countdownLabel.html ($countdown);
	$html.addClassIfNotExists ('countdown');
	$html.removeClassIfExists ('taken');
	
	if ($interval != null) {
		
		clearInterval ($interval);
		
	}
	
	$interval = setInterval (
		function () {
			
			if ($countdown == 1) {
				
				$html.removeClassIfExists ('countdown');
				$.fn.takePicture ();
				
			}
			
			$countdown--;
			
			if ($countdown >= 0) {
			
				$countdownLabel.html ($countdown);
				
			}
		},
		1000
	);
}

$.fn.takePicture = function () {
	
	$html.removeClassIfExists ('countdown');
	
	if ($interval != null) {
		
		clearInterval ($interval);
		
	}
	
	$vidWidth = $videoElem.videoWidth;
	$vidHeight = $videoElem.videoHeight;
	
	$newWidth = 0;
	$newHeight = 0;
	
	if (($vidHeight / 6) <= 0.7142857142857143) {
	
		$newWidth = ($vidHeight * 6) / 4;
		$newHeight = $vidHeight;
	
	} else {
	
		$newWidth = $vidWidth;
		$newHeight = ($vidWidth * 4) / 6;
		
	}
		
	$newY = 0 - (($vidHeight - $newHeight) / 2);
	$newX = 0 - (($vidWidth - $newWidth) / 2);
	
	//console.log ($vidWidth, $newWidth, $newX);
	//console.log ($vidHeight, $newHeight, $newY);
	
	$context.canvas.width = $newWidth;
	$context.canvas.height = $newHeight;
	
	$context.beginPath();
	$context.rect(0, 0, $newWidth, $newHeight);
	$context.fillStyle = "white";
	$context.fill ();

	$context.drawImage($videoElem, $newX, $newY, $vidWidth, $vidHeight);
	
	if ($html.attr ('data-style') == 'gray') {
		
		$imgData = $context.getImageData (0, 0, $newWidth, $newHeight);
		$pixels  = $imgData.data;
		for (var i = 0, n = $pixels.length; i < n; i += 4) {
			
			$grayscale = $pixels [i] * .3 + $pixels [i+1] * .59 + $pixels [i+2] * .11;
			$pixels [i ] = $grayscale;        // red
			$pixels [i+1] = $grayscale;        // green
			$pixels [i+2] = $grayscale;        // blue
			// pixels[i+3]              is alpha
		}
		$context.putImageData ($imgData, 0, 0);
	}
	
	$context.drawImage($.fn.chosenOption (), 0, 0, $newWidth, $newHeight);
	
	$dataUrl = $canvas.get (0).toDataURL ("image/" + $imageFormat, $quality / 100);
	//console.log ($dataUrl);
	
	$image = {
		message: "capture",
		payload: $dataUrl.replace ('data:image/jpeg;base64,', '')
	};
	$socket.send (JSON.stringify ($image));
	
	$html.addClassIfNotExists ('taken');
					
};

$.fn.scrollFx (
	function () {
		
		//$nav.removeClassIfExists ('open');
	}
);

$.fn.resizeFx (
	function () {
		
		$placeholder.css ('width', '');
		$fontSize = ($html.css ('font-size')).replace ("px", "") * 1;
		$maxHeight = $window.height () - ($fontSize * 2);
		
		// console.log ($video.height (), $maxHeight);
		
		if ($video.height () > $maxHeight) {
			
			$placeholder.css ('width', ($maxHeight * 6) / 4);
			
		}
		
		$.fn.scrollFx ();
	}
);

$.fn.start = function () {

	if (navigator.getUserMedia) {
			
		navigator.getUserMedia ($videoObj, function(stream) {
		
			$('html').removeClassIfExists ('cam-not-supported').removeClassIfExists ('cam-error').addClassIfNotExists ('cam-supported');
			supported = true;
			
			$videoElem.srcObject = stream;
			$videoElem.play();
		
		}, $.fn.errBack);
	
	} else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
	
		navigator.webkitGetUserMedia ($videoObj, function(stream){
		
			$('html').removeClassIfExists ('cam-not-supported').removeClassIfExists ('cam-error').addClassIfNotExists ('cam-supported');
			supported = true;
			
			$videoElem.src = window.webkitURL.createObjectURL (stream);
			$videoElem.play();
		
		}, $.fn.errBack);
	
	} else if (navigator.mediaDevices.getUserMedia) { // WebKit-prefixed

		navigator.mediaDevices.getUserMedia ($videoObj)
			.then(function(stream) {
  				
  				$('html').removeClassIfExists ('cam-not-supported').removeClassIfExists ('cam-error').addClassIfNotExists ('cam-supported');
				supported = true;
			
				$videoElem.srcObject = stream;
				$videoElem.play();
			
			})
			.catch(function(err) {
			  
			  $.fn.errBack(err);
			});

	} else if (navigator.mozGetUserMedia) { // moz-prefixed
	
		navigator.mozGetUserMedia ($videoObj, function(stream){
		
			$('html').removeClassIfExists ('cam-not-supported').removeClassIfExists ('cam-error').addClassIfNotExists ('cam-supported');
			supported = true;
			
			$videoElem.src = window.URL.createObjectURL (stream);
			$videoElem.play ();
		
		}, $.fn.errBack);
	
	} else {
	
		$('html').removeClassIfExists ('cam-supported').removeClassIfExists ('cam-error').addClassIfNotExists ('cam-not-supported');
	
	}
	
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
	
	//$.fn.WebSocketConnect ();
	
	//var objects = new tracking.ObjectTracker ('eye');
	/*objects.setInitialScale(3);
	objects.setStepSize(1);
	objects.setEdgesDensity(0.1);*/
	/*objects.setStepSize (1.7);

	objects.on ('track', function (event) {
		
		if (!$isTracking) {
			
			if (event.data.length === 0) {

				// No objects were detected in this frame.

			} else {
			
				$isTracking = true;
				
				$tracking.html('');
			
				event.data.forEach (function (rect) {

					// console.log (rect);
					// console.log (rect.x, rect.y, rect.height, rect.width);
					$scale = 1;
					
					//console.log ($videoElem.videoWidth, $tracking.width (), $scale);
				
					$tracking.append ('<div class="eye" style="top: ' + rect.y * $scale + 'px; left: ' + rect.x * $scale + 'px; width: ' + rect.width * $scale + 'px; height: ' + rect.height * $scale + 'px;"></div>');

				});
				
				$isTracking = false;

			}
			
		}
	});

	tracking.track('#video', objects, { camera: true });*/
};

$capture.click (function (e) {
	
	$.fn.startCountdown ();
	
});

$options.click (function (e) {
	
	$html.attr ('data-option', $(this).attr ('data-option'));
	$border.css ('background-image', 'url(' + $(this).find ('img').first ().attr ('src') + ')');
	$style = $(this).attr ('data-style');
	
	if (typeof $style !== typeof undefined && $style !== false) {
		
		$html.attr ('data-style', $style);
	} else {
		
		$html.attr ('data-style', '');
	}
	
});

$options.first ().click ();

$.fn.start ();
  
$.fn.WebSocketConnect = function () {

	if ("WebSocket" in window) {
	
		if ($socket && $socket.readyState !== $socket.CLOSED) {
			
			$socket.close ();
		}
		
		$host = window.location.hostname;
		$protocol = "wss";
		$path = "/socket";
		if ($host.indexOf ('localhost') > -1) {
			$protocol = "ws";
			$path = ":8890";
		}
	
		$socket = new WebSocket ($protocol + "://" + $host + $path, 'echo-protocol');

		$socket.onopen = function () {
		
			window.debug.warn ("Connected to API Websocket ...");
			$html.addClass ('api-connected');
			/*var connectPayload = {
				code: 200,
				message: "Thanks for letting me connect."
			};
			socket.send (JSON.stringify (connectPayload));*/
		};

		$socket.onmessage = function (evt) { 
			
			window.debug.warn ("Received a Message from API Websocket ...");
			try {
				
				var data = JSON.parse (evt.data);
			
				if (data.message == "success") {
					
					window.debug.warn ("API Websocket capture success ...");
				}
				if (data.message == "error") {
					
					window.debug.warn ("API Websocket capture error ...");
				}
				if (data.message == "shoot") {
					
					if (!$html.is ('.countdown')) {
					
						$.fn.startCountdown ();
					}
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

$.fn.detectionFx ();
$.fn.resizeFx ();

window.debug.warn ('Hi there');