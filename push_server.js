/**
 * Socket.IO server (single process only)
 */
sio = require( 'socket.io' );

module.exports = function( app ) {

  var io = sio.listen( app ), 
      nicknames = {};

  io.sockets.on('connection', function( socket ) {

    socket.on('chat/user message', function( msg ) {
      socket.broadcast.emit( 'chat/user message', socket.nickname, msg );
      console.log( "   ===== User("+ socket.nickname +") sent message: \""+ msg +"\"");
    });

    socket.on('chat/nickname', function( nick, fn ) {
      if ( nicknames[ nick ] ) {
        fn( true );
      } else {
        fn( false );
        nicknames[ nick ] = socket.nickname = nick;
        socket.broadcast.emit( 'chat/announcement', nick + ' connected');
        io.sockets.emit( 'chat/nicknames', nicknames );
        console.log( "===== User logged on or reconnected.  Users online: \n" );
        console.log( nicknames );
        console.log( "" );
      }
    });

    socket.on('chat/change nickname', function( oldnick, newnick, fn ) {
      console.log( "===== chat/change nickname from "+oldnick+" to "+nick );
      if ( nicknames[ nick ] && ( socket.nickname == oldnick ) ) {
        fn( false );
        nicknames[ nick ] = socket.nickname = nick;
        socket.broadcast.emit( 'chat/announcement', nick + ' connected');
        io.sockets.emit( 'chat/nicknames', nicknames );
      } else {
        fn( true );
      }
    });

    socket.on( 'chat/disconnect', function( ) {
      if ( !socket.nickname ) return;
      delete nicknames[ socket.nickname ];

      console.log( "   ===== User("+ socket.nickname +") disconnected\n" );
      socket.broadcast.emit( 'chat/announcement', socket.nickname + ' disconnected' );
      socket.broadcast.emit( 'chat/nicknames', nicknames );
    });
    
  });

  return io;

};