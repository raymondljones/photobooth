<?php
	
	$_dir = DIRNAME (__FILE__);
	
	if (!is_dir ($_dir . '/log')) {
		
		mkdir ($_dir . '/log');
	}
	
	$bot = shell_exec ("ps aux | grep photo-booth.js | grep -v grep | awk  '{print $2}'");
	
	if ($bot != null && trim ($bot) != "") {
		
		exit;
	} else {
	
		shell_exec ('/usr/bin/node \'' . $_dir . '/photo-booth.js\' >> /dev/null &');
	}
?>