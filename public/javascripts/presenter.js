var Deck = {

	init : function( ) {
		$.deck( '.slide' );
		
		// Current slide reporting
		$( document ).bind('deck.change', function( event, from, to ) {
			Chat.socket.emit( 'deck/change', { "from":from, "to":to  } );		
		});
	},

	change : function( msg ) {
		Chat.announce( msg );
	}

};

$( function( ) {

	Deck.init();
	
});


