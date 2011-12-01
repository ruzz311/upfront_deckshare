var Deck = {

	init : function( ) {
		$.deck( '.slide' );

		Deck.videos();

		// Current slide reporting
		$( document ).bind( 'deck.change', function( event, from, to ) {
			Chat.socket.emit( 'deck/change', { "from":from, "to":to  } );	
		});
	},

	change : function( msg ) {
		Chat.announce( msg );
	},

	videos : function( ) {
		var flashvars = { };
		var params = { };
		var attributes = { };
		var howieLink = "http://www.youtube.com/v/g1ycCFVKSg4?enablejsapi=1&amp;version=3&amp;border=0&amp;autoplay=1&amp;start=20";
		swfobject.embedSWF(howieLink, "howieVid", "100%", "100%", "9.0.0", "expressInstall.swf", flashvars, params, attributes);
	}

};

$( function( ) {

	Deck.init();
	
});


