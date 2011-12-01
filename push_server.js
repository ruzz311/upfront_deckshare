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
      var invalid_nick =  ( nick == "Russell" || nick == "System" || nick == "upfront" );
      if( invalid_nick ){
        fn( true );
      } else if ( nicknames[ nick ] ) {
        fn( true );
      } else {
        fn( false );
        nicknames[ nick ] = socket.nickname = nick;
        socket.broadcast.emit( 'chat/announcement', nick + ' connected');
        io.sockets.emit( 'chat/nicknames', nicknames );
      }
    });

    // Slide change from presenter or remote
    socket.on( 'deck/change', function( slide ) {
      var msg = '<a href="#" class="goto" rel="'+slide.to+'">Viewing slide '+slide.to+'</a>';
      socket.broadcast.emit( 'chat/announcement', msg );
      socket.broadcast.emit( 'deck/slide change', slide.to );
    });
    
    socket.on('disconnect', function () {
      if (!socket.nickname) return;

      delete nicknames[socket.nickname];
      socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
      socket.broadcast.emit('nicknames', nicknames);
    });
    
  });
  return io;
};