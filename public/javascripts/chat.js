var Chat = {

	new_msg : 0,
	$el : function( ) { return $('#chat'); },
	icon_notify : function( ) {
		var msg = ( Chat.new_msg === 0 ) ? '' : Chat.new_msg;
		$('#chatmenu .toggle .count').text( msg );
	},
	print_nicks : function( nicknames ) {
		console.log( "nicknames = ", nicknames );
		var css_class="";
		
		$('#nicknames').empty().append( $( '<span>Currently Viewing: </span>' ) );

		for ( var i in nicknames ) {
			var newelm = $( '<b>' ).text( nicknames[i] );
			if( nicknames[i] == Chat.nickname )
				newelm.addClass( 'me' );
			$('#nicknames').append( newelm );
		}
	},
	set_nick : function( ev ) {
		ev.preventDefault();
		Chat.socket.emit('chat/nickname', $('#nick').val(), function ( set ) {
			if ( !set ) {
				Chat.nickname = $('#nick').val();
				Chat.clear();
				return $('#chat').addClass('nickname-set');
			}
			$('#nickname-err').css('visibility', 'visible');
		});
		return false;
	},
	generate_nick : function( ) {
		Chat.nickname = 'User_'+ Math.round( Math.random() * 9999  );
		$( '#nick' ).val( Chat.nickname );
		$( '#set-nickname' ).submit();
	},
	message : function( from, msg ) {
		if( $('#chat').is( ':hidden' ) ){
			Chat.new_msg++;
			Chat.icon_notify();
		}
		$('#lines').append( $('<p>').append( $('<b>').text(from), msg) );
	},
	send_message : function( ) {
		var msg = $( '#message' ).val();
		if( $( '#message' ).val().length > 0 ){
			Chat.socket.emit( 'chat/user message', msg );
			Chat.message( 'me', msg );
			Chat.clear();
			$( '#lines' ).get(0).scrollTop = 10000000;
		}
		return false;
	},
	clear : function() {
		$('#message').val( '' ).focus();
	},
	announcement : function( msg ) {
		$('#lines').append( $( '<p>' ).append( $( '<em>' ).html( msg ) ) );
		Chat.new_msg++;
		Chat.icon_notify();
	},
	connect : function() {
		$('#chat').addClass('connected');
		//if( Chat.nickname === undefined )
		//	Chat.generate_nick();
	},
	reconnect : function( nicknames ) {
		$('#lines').empty();
		print_nicks( nicknames );
		Chat.message('System', 'Reconnected to the server');
	},
	reconnecting : function() { Chat.message('System', 'Attempting to re-connect to the server'); },
	error : function( e ) { Chat.message('System', e ? e : 'A unknown error occurred'); }

};

$(function(){
	// Sockets for Chat and Presenter control
	Chat.socket = io.connect( );
	//Chat.socket = new io.connect(null, {port: 80, rememberTransport: false}); 
	Chat.socket.on( 'connect',			Chat.connect );
	Chat.socket.on( 'chat/announcement',Chat.announcement );
	Chat.socket.on( 'chat/nicknames',	Chat.print_nicks );
	Chat.socket.on( 'chat/user message',Chat.message );
	Chat.socket.on( 'chat/reconnect',	Chat.reconnect );
	Chat.socket.on( 'chat/reconnecting',Chat.reconnecting );
	Chat.socket.on( 'chat/error',		Chat.error );
	Chat.socket.on( 'deck/slide change',Deck.change );

	// Chat messaging
	$('#set-nickname').submit( Chat.set_nick );
	$('#send-message').submit( Chat.send_message );

	// Hide chat
	$('button.cancel').click( function(e) {
		e.preventDefault();
		Chat.clear();
		$('#chatmenu .toggle').trigger( 'click' );
	});

	// Hide/show chat window
	$('#chatmenu .toggle').click( function( e ) { 
		e.preventDefault();
		Chat.new_msg = 0;
		Chat.icon_notify( );
		$( '#chat' ).toggleClass( 'visible' );
	});

	// System
	$( '#chat a.goto' ).live( 'click', function(e){ 
		e.preventDefault();
		var slide = parseInt( $( this ).attr( 'rel' ), 10 );
		$.deck('go', slide);
	});
});