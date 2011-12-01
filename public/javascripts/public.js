var Deck = {
	
	init : function(){
		$.deck( '.slide' );

		// it's for your own protection... I swear
		$( document ).unbind('keydown.deck');

		// Additional Socket.io for this view ( see chat.js for init )
		Chat.socket.on( 'deck/slide change', Deck.change );
	},

	change : function( slide ) {
		$.deck( 'go', slide );
	}

};

$( function( ) {

	Deck.init();

});