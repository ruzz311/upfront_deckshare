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
    });

    socket.on('chat/nickname', function( nick, fn ) {
      if ( nicknames[ nick ] ) {
        fn( true );
      } else {
        fn( false );
        nicknames[ nick ] = socket.nickname = nick;
        socket.broadcast.emit( 'chat/announcement', nick + ' connected');
        io.sockets.emit( 'chat/nicknames', nicknames );
      }
    });

    socket.on( 'chat/disconnect', function( ) {
      if ( !socket.nickname ) return;
      delete nicknames[ socket.nickname ];

      socket.broadcast.emit( 'chat/announcement', socket.nickname + ' disconnected' );
      socket.broadcast.emit( 'chat/nicknames', nicknames );
    });

    socket.on( 'deck/change', function( slideinfo ) {
      socket.broadcast.emit( 'chat/announcement', slideinfo.msg );
      socket.broadcast.emit( 'deck/slide change', slideinfo.to );
    });
    
  });

  return io;

};