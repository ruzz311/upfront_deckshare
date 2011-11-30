var Deck = {
	init : function(){
		//onslidechange, DECK.notify_deck('Deck view updated');
	},
	change : function( slide ) {
		$.deck( 'go', slide );
	}
};

$( function( ) {

	// Deck initialization
	$.deck( '.slide' );

	// Sockets for Chat and Presenter control
	Chat.socket = io.connect( );
	//Chat.socket = new io.connect(null, {port: 80, rememberTransport: false}); 

	//Socket routing	
	Chat.socket.on( 'connect',			Chat.connect );
	Chat.socket.on( 'chat/announcement',Chat.announcement );
	Chat.socket.on( 'chat/nicknames',	Chat.print_nicks );
	Chat.socket.on( 'chat/user message',Chat.message );
	Chat.socket.on( 'chat/reconnect',	Chat.reconnect );
	Chat.socket.on( 'chat/reconnecting',Chat.reconnecting );
	Chat.socket.on( 'chat/error',		Chat.error );
	Chat.socket.on( 'deck/slide change',Deck.change );

	// dom manipulation
	$('#set-nickname').submit( Chat.set_nick );
	$('#send-message').submit( Chat.send_message );
	$('button.cancel').click( function(e) {
		e.preventDefault();
		Chat.clear();
		$('#chatmenu .toggle').trigger( 'click' );
	});

	$('#chatmenu .toggle').click( function( e ) { 
		e.preventDefault();
		$( '#chat' ).toggleClass( 'visible' );
		Chat.new_msg = 0;
		Chat.icon_notify();
	});

	$( '#chat a.goto' ).live( 'click', function(e){ 
		e.preventDefault();
		var slide = parseInt( $( this ).attr( 'rel' ), 10 );
		$.deck('go', slide);
	});

	$(document).unbind('keydown.deck');
});