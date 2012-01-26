var Deck = {
	
	init : function( ) {
		$.deck( '.slide' );

		Deck.videos();

		// it's for your own protection... I swear
		$( document ).unbind( 'keydown.deck' );
		
		// Additional Socket.io for this view ( see chat.js for init )
		Chat.socket.on( 'deck/slide change', Deck.change );
	},

	change : function( slide ) {
		$.deck( 'go', slide );
	},

	videos : function( ) {
		var flashvars = { };
		var params = { };
		var attributes = { };
		var howieLink = "http://www.youtube.com/v/g1ycCFVKSg4?enablejsapi=1&amp;version=3&amp;border=0&amp;autoplay=1&amp;start=20";
		swfobject.embedSWF( howieLink, "howieVid", "100%", "100%", "9.0.0", "expressInstall.swf", flashvars, params, attributes );
	}
	
};

$( function( ) {
	Deck.init();
});