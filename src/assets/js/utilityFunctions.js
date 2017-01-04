var uf = (function(){
  'use strict';
   
// Utility functions.
var 
oo = {},
getProto = Object.getPrototypeOf,
fn = {
  // Return viewport size.
  getViewport: function() {
    return {
      w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    };
  },

  // Append element in target.
  append: function ( target, element ) {
    if ( typeof target === 'string' ) {
      document.getElementById( target ).appendChild( element );
    }
    else {
      target.appendChild( element );
    }
  },

  // Test if target is plain object. Thank you jQuery 3+ !
  isPlainObject: function ( target ) {
    var proto, Ctor;
    // Detect obvious negatives
    // Use toString instead of jQuery.type to catch host objects
    if ( !target || oo.toString.call( target ) !== "[object Object]" ) {
      return false;
    }
    proto = getProto( target );
    // Objects with no prototype (e.g., `Object.create( null )`) are plain
    if ( !proto ) {
      return true;
    }
    // Objects with prototype are plain iff they were constructed by a global Object function
    Ctor = oo.hasOwnProperty.call( proto, "constructor" ) && proto.constructor;
    return typeof Ctor === "function" && oo.hasOwnProperty.call( Ctor.prototype, "isPrototypeOf");
  },

  // Deeply extend a object with b object properties.
  simpleExtend: function ( a, b ) {
    var clone, src, copy, isAnArray = false; 
    for( var key in b ) {

      src = a[ key ];
      copy = b[ key ];

      //Avoid infinite loop.
      if ( a === copy ) {
        continue;
      }

      if( b.hasOwnProperty( key ) ) {
        // If propertie is Array or Object.
        if( copy && ( fn.isPlainObject( copy ) || (isAnArray = Array.isArray.call( copy )))) {
          if ( isAnArray ) {
            isAnArray = false;
            clone = ( src && src.isArray ) ? src : [];
          } else {
            clone = ( src && fn.isPlainObject( src ) ) ? src : {};
          }
          // Create new Array or Object, never reference it.
          a[ key ] = fn.simpleExtend( clone, copy );

        } else {
            a[ key ] = copy;
        }
      }
    }
    return a;
  }
};

return {
  getViewport: fn.getViewport,
  append: fn.append,
  simpleExtend: fn.simpleExtend
};

})( window, document );

