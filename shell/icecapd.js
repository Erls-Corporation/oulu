/* icecapd */

var init = require('init'),
    fs = require('fs'),
    path = require('path'),
    config = {};

/* Read (optional) configuration file */
(function() {
	var home = process.env.HOME || __dirname,
	    dir = path.resolve(home, '.icecapd-js'),
	    file = path.resolve(dir, 'config.json');
	try {
		if(!path.existsSync(dir)) fs.mkdirSync(dir, 0700);
		if(path.existsSync(file)) {
			config = JSON.parse(fs.readFileSync(file, 'utf-8'));
		}
	} catch(e) {
		// Do nothing
	}
	
	if(!config.dir) config.dir = dir;
})();

/* Read (optional) configuration file */
(function() {
	
})();

/* Setup standard init CLI */
init.simple({
	pidfile : config.pidfile || path.resolve(config.dir, 'run.pid'),
	logfile : config.logfile,
	command : process.argv[3],
	run     : function () {
		
		var io = require('socket.io-client'),
		    sys = require('sys'),
		    util = require('util'),
		    website_socket = io.connect(config.iotarget || 'http://localhost:3000/shell'),
		    icecap = require('icecap').create();
		
		// Lets handle errors
		website_socket.on('error', function (msg) {
			console.error('Error: ' + msg);
		});
		
		// Let's log every icecap event
		icecap.on('event', function(name, tokens) {
			util.log("DEBUG: icecap.on(event): " + sys.inspect(name) + ": " + sys.inspect(tokens) );
		});
		
		// Lets handle succesful connection
		website_socket.on('connect', function () {
			util.log('Connected to website and sending our apikey');
			
			// Let's handle successful join
			website_socket.on('joined', function() {
				util.log('Joined to website');
				
				// Let's send each icecap event to the website
				icecap.on('event', function(name, tokens) {
					util.log('Sending icecap-event to website...');
					website_socket.emit('icecap-event', name, tokens);
				});
				
				// Let's receive icecap.commands and send them to the icecap
				website_socket.on('icecap.command', function(name, tokens) {
					util.log("DEBUG: website_socket.on(client-event): " + sys.inspect(name) + ": " + sys.inspect(tokens) );
					icecap.command(name, tokens);
				});
			});
			
			// Send join request with our apikey
			website_socket.emit('join', config.apikey);
			
		});
	}
});

/* EOF */
