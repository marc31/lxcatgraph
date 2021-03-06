(function(){

  'use strict';

  //// INITIALISATION
  var graph = graphAPI.init();

  ///// Input buttons.
  var inpGrid = document.getElementById('inp-grid');
  var inpDisplayPoint = document.getElementById('display-point');
  var inpDisplayLinearX = document.getElementById('display-linear-xaxis');
  var inpDisplayLinearY = document.getElementById('display-linear-yaxis');
  var inputFile = document.getElementById('input-file');
  var inputCleanGraph = document.getElementById('clear-graph');
  var inpXstart = document.getElementById('x-start');
  var inpXend = document.getElementById('x-end');
  var inpYstart = document.getElementById('y-start');
  var inpYend = document.getElementById('y-end');
  

  document.getElementById('mysuperform').reset();


  ///// Init Display courbe.
  (function(){
    // Set axis range inputs values.
    inpXstart.value = graphAPI.getAxisRangeValue( 'xaxis', 'start' );
    inpXend.value = graphAPI.getAxisRangeValue( 'xaxis', 'end' );
    inpYstart.value = graphAPI.getAxisRangeValue( 'yaxis', 'start' );
    inpYend.value = graphAPI.getAxisRangeValue( 'yaxis', 'end' );

  })();

  ///// Apply Events.

  graph.on('plotly_relayout', function( e ){
    // If event emit from setAxisRangeValue method, stop here.
    if ( e.flag ) return;
    // Else, update inputs axis range values.
    inpXstart.value = graphAPI.getAxisRangeValue( 'xaxis', 'start' );
    inpXend.value = graphAPI.getAxisRangeValue( 'xaxis', 'end' );
    inpYstart.value = graphAPI.getAxisRangeValue( 'yaxis', 'start' );
    inpYend.value = graphAPI.getAxisRangeValue( 'yaxis', 'end' );
  });

  inpXstart.onblur = function( e ) {
    graphAPI.setAxisRangeValue( 'xaxis', 'start', e.target.value );
  }
  inpXend.onblur = function( e ) {
    graphAPI.setAxisRangeValue( 'xaxis', 'end', e.target.value );
  }
  inpYstart.onblur = function( e ) {
    graphAPI.setAxisRangeValue( 'yaxis', 'start', e.target.value );
  }
  inpYend.onblur = function( e ) {
    graphAPI.setAxisRangeValue( 'yaxis', 'end', e.target.value );
  }

  inpGrid.onchange = function( e ){
    // Get checkbox state.
    var state = this.checked;

    // Call graphAPI method to set changes.
    graphAPI.updateLayout({
      'xaxis.showgrid': state,
      'yaxis.showgrid': state
    });
  };

  inputCleanGraph.addEventListener('click', function(evt){
    graphAPI.deleteAllTraces();
  },false);

  inputFile.addEventListener('change', function(evt){
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {

      // Only process text files.
      if (!f.type.match('text.*')) {
        alert('File must be a text');
        continue;
      }

      // List File
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
        f.size, ' bytes, last modified: ',
        f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
        '</li>');

      var reader = new FileReader();

      reader.onload = function(progressEvent){
        readData.readBolsigFileLineByLine(this.result,
          function( a ) {
            graphAPI.addTraces(a);
            graphAPI.updateLayout({
              title: '',
              'xaxis.title': a[0].axisName.x,
              'xaxis.autorange': false,
              'yaxis.title': a[0].axisName.y,
              'yaxis.autorange': false,
            });

          }
        );
      };
      reader.readAsText(files[i]);
    }


    // Add list File.
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

  }, false);



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
  
  //// Load exemple of data
  var filePath = 'assets/data/cross_section_he.txt';
  (function(){
    readData.readBolsigFileFormServeur(filePath, function( a ){
      graphAPI.addTraces( a );
      graphAPI.updateLayout({
        title: 'SIGLO database, e / He',
        'xaxis.title': a[0].axisName.x,
        'xaxis.autorange': false,
        'yaxis.title': 'Cross section (m<SUP>2</SUP>)',
        'yaxis.autorange': false,
      });
    });
  })();

})();