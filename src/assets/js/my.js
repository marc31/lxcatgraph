(function(){

  'use strict';

  ///// Input buttons.
  var inpGrid = document.getElementById('inp-grid');
  var inpDisplayPoint = document.getElementById('display-point');
  var inpDisplayLinearX = document.getElementById('display-linear-xaxis');
  var inpDisplayLinearY = document.getElementById('display-linear-yaxis');

  ///// Apply Events.
  inpGrid.onchange = function( e ){
    // Get checkbox state.
    var state = this.checked;

    // Call graphAPI method to set changes.
    graphAPI.updateLayout({
      'xaxis.showgrid': state,
      'yaxis.showgrid': state
    });
  };

 inpDisplayLinearX.onchange = function( e ){
    // Get linear radio value.
    var state = this.querySelector('input[name="displayLinearRadioX"]:checked').value;
    // Get new layout value.
    var value = getAxisValue ( 'xaxis', state );
    // Call graphAPI method to set changes.
    graphAPI.updateLayout( value );
  };

   inpDisplayLinearY.onchange = function( e ){
    // Get linear radio value.
    var state = this.querySelector('input[name="displayLinearRadioY"]:checked').value;
    // Get new layout value.
    var value = getAxisValue ( 'yaxis', state );
    // Call graphAPI method to set changes.
    graphAPI.updateLayout( value );
  };


  inpDisplayPoint.onchange = function( e ){
    // Get radio value.
    var state = this.querySelector('input[name="displayPointRadio"]:checked').value;

    // Call graphAPI method to set changes on trace style.
    graphAPI.updateDataStyle({
        mode: state,
    });
  };

  // Axis event handler.
  function getAxisValue ( ax, state ) {
    var result = {};
    switch ( state ) {
      case 'log':
        var a = ax + '.type', 
            b = ax + '.dtick';
        result[a] = 'log';
        result[b] = 'D1';
        break;

      case 'linear':
      var a = ax + '.type', 
          b = ax + '.dtick',
          c = ax + '.tickmode',
          d = ax + '.autorange';

          result[a] = 'auto';
          result[b] = null;
          result[c] = 'auto';
          result[d] = true;
          break;

      default:
        var a = ax + '.type', 
            b = ax + '.dtick';
        result[a] = 'log';
        result[b] = 'D1';
        break;
    }
    return result;
  }
  

})();