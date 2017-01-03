(function(){

  'use strict';

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
    var state = this.querySelector('input[name="displayLinearRadio"]:checked').value;

    // Call graphAPI method to set changes.
    graphAPI.updateLayout({
      'xaxis.type': state,
      'yaxis.type': state
    });
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