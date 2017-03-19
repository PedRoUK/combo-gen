// - - - - - - - - - - - - - - - - - - - -
// Script via https://github.com/spite/ConcatSoundLoader
// - - - - - - - - - - - - - - - - - - - -

var ConcatSoundLoader = function( logCallback, progressCallback ) {

   var sounds = [];
   var toLoad = loaded = 0;
   var onComplete = null;

   function log( msg ) {
      if( logCallback ) logCallback( msg );
   }

   function extractBuffer( src, start, length ) {

      var dstU8 = new Uint8Array( length );
      var srcU8 = new Uint8Array( src, start, length );
      dstU8.set( srcU8 );
      return dstU8;

   } 

   function loadPackedSounds( url, callback ) {

      log( 'Loading...' );

      onComplete = callback;
      var request = new XMLHttpRequest();
      var context = null;
      if( 'webkitAudioContext' in window ) context = new webkitAudioContext();
      if( 'AudioContext' in window ) context = new AudioContext();
      if( !context ) {
         log( 'ERROR: No AudioContext available. Try Chrome, Safari of Firefox Nightly.' );
         return;
      }

      request.open( 'GET', url, true );
      request.responseType = 'arraybuffer';

      function createSoundWithBuffer( buffer, n ) {

         log( 'Decoding sound ' + n + '...' );
         var audioSource = context.createBufferSource();
         audioSource.connect( context.destination );

         context.decodeAudioData( buffer, function( res ) {
            log( 'Sound ' + n + ' decoded.' );
            audioSource.buffer = res;
            audioSource.playbackRate.value = 1;
            sounds[ n ] = audioSource;
            loaded++;
            if( loaded == toLoad ) {
               if( onComplete ) onComplete();
               log( 'Completed' );
            }
         } );

      }

      function processConcatenatedFile( data ) {

         log( 'Loaded. Process...' );

         var bb = new DataView( data );
         var offset = 0;

         while( offset < bb.byteLength ) {

            var length = bb.getUint32( offset, true );
            offset += 4;
            var mp3 = extractBuffer( data, offset, length );
            offset += length;

            toLoad++;
            createSoundWithBuffer( mp3.buffer, toLoad );

         }

      };

      request.onload = function() {
         processConcatenatedFile( request.response );
      }

      request.onprogress = function( e ) {
         progressCallback( e.loaded * 100 / e.total );
      }

      request.send();


   }

   return {
      load: loadPackedSounds,
      sounds: sounds
   }

}

window.addEventListener( 'load', init, false );

function init() {

   var loaderDiv = document.getElementById( 'progress' );
   var logDiv = document.getElementById( 'log' );
   var loader = new ConcatSoundLoader( logMessage, updateProgress );

   var filename = 'file.ogg';
   if( ( new Audio() ).canPlayType( 'audio/mp3' ) ) filename = 'file.mp3';
   loader.load( filename, onComplete );

   function logMessage( msg ) {

      var p = document.createElement( 'p' );
      p.textContent = msg;
      logDiv.appendChild( p );

   }

   function updateProgress( p ) {

      progress.style.width = Math.round( p ) + '%';

   }

   function onComplete() {

      var ul = document.querySelector( '#container ul' );
      for( var j in loader.sounds ) {

         var li = document.createElement( 'li' );

         var a = document.createElement( 'a' );
         ( function( s ) { a.addEventListener( 'click', function( e ) {
            if( s.noteOn ) s.noteOn( 0 ); else s.start( 0 );
            e.preventDefault();
         } ) } ) ( loader.sounds[ j ] );
         a.href = '#';
         a.textContent = 'Play Sound ' + j;
         a.className = 'button';
         li.appendChild( a );

         var a = document.createElement( 'a' );
         ( function( s ) { a.addEventListener( 'click', function( e ) {
            if( s.noteOff ) s.noteOff( 0 ); else s.stop( 0 );
            e.preventDefault();
         } ) } ) ( loader.sounds[ j ] );
         a.href = '#';
         a.textContent = 'Stop Sound ' + j;
         a.className = 'button';
         li.appendChild( a );

         ul.appendChild( li );

      }

   }

}