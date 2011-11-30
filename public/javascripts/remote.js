
$(function() {

	var socket = io.connect( 'http://localhost:3000/' );

	// Deck initialization
	$.deck( '.slide' );

	var x = $.deck( 'showMenu' );
	console.log( x );

	$( document ).bind('deck.change', function( event, from, to ) {
		console.log( 'Moving from slide ' + from + ' to ' + to );
		socket.emit( 'deckChange', { "from":from, "to":to  } );	
	});

});

