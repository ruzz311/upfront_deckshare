var Deck = {

	init : function( ) {
		
		$.deck( '.slide' );
		$.deck( 'showMenu' );

		// Current slide reporting
		$( document ).bind('deck.change', function( event, from, to ) {
			Chat.socket.emit( 'deck/change', { "from":from, "to":to  } );
			Chat.announcement( msg );
		});
	},

	change : function( msg ) {
		$.deck( 'go', slide );
	}
};

$( function( ) {

	Deck.init();

});
