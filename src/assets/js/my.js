(function(){

  'use strict';

  //// TEST PARSEUR
  var filePath = 'assets/data/cross_section2.txt';
  (function(){
    readData.readBolsigFile( filePath, function( a ){
      graphAPI.addTraces( a );
    });

  })();

  ///// Input buttons.
  var inpGrid = document.getElementById('inp-grid');
  var inpDisplayPoint = document.getElementById('display-point');
  var inpDisplayLinear = document.getElementById('display-linear');

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

 inpDisplayLinear.onchange = function( e ){
    // Get linear radio value.
    var value, state = this.querySelector('input[name="displayLinearRadio"]:checked').value;

    switch ( state ) {
      case 'log':
        value = {
          'xaxis.type': 'log',
          'xaxis.dtick': "D1",
          'yaxis.type': 'log',
          'yaxis.dtick': "D1"
        };
        break;
      case 'linear':
        value = {
          'xaxis.type': 'auto',
          'yaxis.type': 'auto',
          'xaxis.dtick': 0,
          'yaxis.dtick': 0,
          'xaxis.ntick': 10,
          'yaxis.ntick': 10,
          'xaxis.tick0': 0,
          'yaxis.tick0': 0,
          // dtick: 100,
          // tick0: 0
        };
        break;
      default:
        value = {
          'xaxis.type': 'log',
          'xaxis.dtick': "D1",
          'yaxis.type': 'log',
          'yaxis.dtick': "D1"
        };
        break;
    }
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
  

})();