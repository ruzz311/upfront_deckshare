
/**
 * Socket.IO server (single process only)
 */
var sio = require( 'socket.io' ),
		sanitizer = require( 'sanitizer' ),
		cfg = require( './couch_cfg' ),
		db = require( 'nano' )( cfg.url+'/deckshare' );


//This tracks chat activity to couchDB, comment it out or
//create your own config (install nano and look at ~/nano/cfg/couch.example.js)
var trackActivity = function ( obj ){

	db.insert( obj, function(e,b,h){
		if(e) { throw e; }
		console.log( "message saved to DB" );
	});

};


module.exports = function( app ) {

	var io = sio.listen( app ), 
			nicknames = {};

	io.sockets.on('connection', function( socket ) {

		socket.on('chat/user message', function( msg ) {
			msg = sanitizer.sanitize( msg );
			if( msg.length < 0 )
				msg = "I tried to do something dirty - WATCH OUT - I'm bad news";
			socket.broadcast.emit( 'chat/user message', socket.nickname, msg );
			trackActivity({
					"action" : "chat/message",
					"nick" : socket.nickname,
					"msg" : msg,
					"timestamp" : new Date()
				});
		});

		socket.on('chat/nickname', function( nick, fn ) {
			if ( nicknames[ nick ] ) {
				fn( true );
			} else {
				fn( false );
				nicknames[ nick ] = socket.nickname = nick;
				socket.broadcast.emit( 'chat/announcement', nick + ' connected');
				io.sockets.emit( 'chat/nicknames', nicknames );
				trackActivity({
					"action":"chat/join",
					"nick":nick,
					"timestamp": new Date()
				});
			}
		});

		// Slide change from presenter or remote
		socket.on( 'deck/change', function( slide ) {
			var msg = '<a href="#" class="goto" rel="'+slide.to+'">Viewing slide '+slide.to+'</a>';
			socket.broadcast.emit( 'chat/announcement', msg );
			socket.broadcast.emit( 'deck/slide change', slide.to );
			trackActivity({
					"action":"deck/change",
					"slide": 
						{
							"raw" : slide.to,
							"formatted" : msg
						},
					"timestamp": new Date()
				});
		});
		
		//user disconnect
		socket.on('disconnect', function () {
			if (!socket.nickname) return;

			delete nicknames[socket.nickname];
			socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
			socket.broadcast.emit('nicknames', nicknames);
			trackActivity({
					"action":"chat/disconnect",
					"nick":socket.nickname,
					"timestamp": new Date()
				});
		});

		// history
		socket.on( 'chat/history', function( fn ) {

			data = db.view( "chat", "activity", {"include_docs":"false"}, function (_,data) {
				fn( data.rows );
			});

		});

	});
	return io;
};