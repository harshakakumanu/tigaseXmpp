/**
 * Created by harshavardhan on 15-08-12.
 */
var XMPP = require('stanza.io'); // if using browserify

var client = XMPP.createClient({
	jid: 'selva@rtc.harsha.com',
	password: 'selva',

	// If you have a .well-known/host-meta.json file for your
	// domain, the connection transport config can be skipped.

	transport: 'websocket',
	wsURL: 'ws://192.168.1.101:5290'
	// (or `boshURL` if using 'bosh' as the transport)
});

client.on('session:started', function () {
	client.getRoster();
	client.sendPresence();
});

client.on('chat', function (msg) {
	client.sendMessage({
		to: msg.from,
		body: 'You sent: ' + msg.body
	});
});

client.on('connected',function(){
	console.log("successfully connected");
});

client.connect();