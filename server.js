// Pathing
require.paths.unshift('./node_modules');

var appdir = { "root"   : __dirname };
    appdir[ 'public' ]  = appdir.root + "/public";
    appdir.views        = appdir.root + "/views";

// Module dependencies.
var express = require('express'),
    stylus = require( 'stylus' ),
    crypto = require( 'crypto' ),
    nib = require( 'nib' )();

var app = module.exports = express.createServer(),
    basicAuth = express.basicAuth;

var Security = {
  auth_title: "Ah, ah ah... you didn't say the magic word...",
  simple_auth : express.basicAuth( function( user, pass ) { 
      return ( user=='pass' && pass=="pass" ) ? true : false;
    }, 'Restricted to current presenter' )
};

var compile = function( str, path ) {
  return stylus( str )
    .set( 'filename', path )
    .set( 'warn', false )
    .set( 'compress', false )
    .set( 'firebug', false )
    .set( 'lineos', true )
    .use( nib )
    ['import']( 'nib' )
    ['import']( appdir['public']+'/stylesheets/src/common.styl' );
};


// Configuration

app.configure(function(){
  app.set( 'views', appdir.views );
  app.set( 'view engine', 'jade' );
  app.set( 'view options', { pretty: true } );
  app.use( express.bodyParser() );
  app.use( express.methodOverride() );
  app.use( express.cookieParser() );
  app.use( express.session({ secret: 'your secret here' }) );
  app.use( stylus.middleware({ 
      src: appdir['public'],
      compile: compile 
    })); 
  app.use( app.router );
  app.use( express['static'](appdir['public']) );
});

app.configure( 'development', function( ) {
  app.use( express.errorHandler({ dumpExceptions: true, showStack: true }) ); 
});

app.configure( 'production', function( ) {
  app.set( 'view options', { pretty: false });
  //app.use( express.errorHandler() ); 
  app.use( express.errorHandler({ dumpExceptions: true, showStack: true }) ); 
});

// Helpers

  // dynamic view helpers  
  app.dynamicHelpers({

    request: function( req ) {
      return req;
    }

  });


// Routes
  // General routes
  app.all( '/remote(/*)?', Security.simple_auth );
  app.all( '/presenter(/*)?', Security.simple_auth );

  // General User
  app.get( '/', function( req, res ) {
    res.render( 'presentation/node', {
      title: 'Node - PEEEYYYAAAAAHHH'
    });
  });

  // Remote view
  app.get( '/remote', function( req, res ) {
    res.render( 'presentation/node', {
      title: 'Node Remote - Upfront',
      layout: 'layouts/remote'
    });
  });

  // Presenter / projector view
  app.get( '/presenter', function( req, res ) {
    res.render( 'presentation/node', {
      title: 'Node - PEEEYYYAAAAAHHH'
    });
  });

// Start Servers

  // Express
  app.listen( 12772 );
  console.log( "Express server listening on port %d in %s mode", app.address().port, app.settings.env );

  // Socket.io
  require( './push_server.js' )( app );
