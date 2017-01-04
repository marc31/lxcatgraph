var graphAPI = (function(){

'use strict';

  var graph = document.getElementById('graph');

  var data = [];
  var layout;

  /**
   * 
   * Defaults settings.
   * 
   */
  var conf = {
    displayModeBar: true, 
    displaylogo: false, 
    scrollZoom: true, 
    modeBarButtonsToRemove: ['sendDataToCloud', 'zoomIn2d', 'zoomOut2d', 'lasso2d', 'select2d']
  };

  var tracePattern = {
    type: 'scatter',
    mode: 'lines+markers',
    line: {
      width: 1
    },
    marker: {
      size: 5
    }
  };

  var defaultLayout = {
    autosize: false,
    width: 1000,
    height: 800,
    hovermode:'closest',
  };

  var defaultAxis = {
      type: 'log',
      ticks: "inside",
      dtick: "D1", // En mode log, affiche les 10+ small digits.
      exponentformat: 'e',
      showexponent: 'All',
      tickcolor: "#333",
      gridcolor: "#ddd",
      // showgrid: false,
      // showticklabels: false
      autorange: true,
      linecolor: '#333',
      linewidth: 1,
      mirror: true
  };

  /**
   * 
   * Privates methods.
   * 
   */

  function setLayoutSize(){
    var s = uf.getViewport();
    layout.width = Math.max( s.w * ( 2/3 ), 500);
    layout.height = Math.max( s.h * ( 4/5 ), 500);
  }

  function constructAxis( options ){
    var result = Object.assign( {}, defaultAxis, options );
    return result;
  }

  function constructLayout( layoutname, xaxisname, yaxisname ){
    var result = Object.assign( {}, defaultLayout );
    result.title = layoutname;
    result.xaxis = constructAxis( {title: xaxisname} );
    result.yaxis = constructAxis( {title: yaxisname} );
    return result;
  }

  function setAxisRangeValue( ax, pos, value ){

    var v, update = {flag:true};
    var p = ( pos === 'start' ) ? 0 : 1;

    var path = ax + '.range[' + p + ']';
    //update[path].range = layout[ax].range;

    if ( layout[ax].type === "log" ) {
      //var test =  Number( value );
      v = Math.log10( Number( value ) );
      update[path] = v;
      Plotly.relayout( graph, update );

    } else {

      update[path] = Number( value );
      Plotly.relayout( graph, update );

    }
  }

  function getAxisRangeValue( ax, pos ){

    var p = ( pos === 'start' ) ? 0 : 1;

    if ( layout[ax].type === "log" ) {

      return Math.pow( 10, layout[ax].range[p] ).toExponential();

    } else {

      return layout[ax].range[p];

    }
  }

  function init( layoutname, xaxisname, yaxisname ){
    var l = layoutname || '', x = xaxisname || '', y = yaxisname || '';
    // Create the layout.
    layout = constructLayout( l, x, y );
    // Resize layout according device viewport.
    setLayoutSize( layout );
    // Create the Plot instance.
    Plotly.newPlot( graph, data, layout, conf );
  }


  /**
   * 
   * Public Methods.
   * 
   */

  return {

    getAxisRangeValue: getAxisRangeValue,
    setAxisRangeValue: setAxisRangeValue,

    init: function () {
      init();
      return graph;
    },

    addTraces: function( input ){
      var value;
      // If input is array, must be multiple traces to add.
      if ( Array.isArray( input ) ) {

        var i, l = input.length, value = [], v;
        for ( i = 0; i < l; i++ ) {
          v = Object.assign( {}, tracePattern, input[i] );
          value.push( v );
        }
      } else {
        value = Object.assign( {}, tracePattern, input );
      }
      Plotly.addTraces(graph, value);
    },

    deleteAllTraces: function(){
      var delTab = [];
      for (var i = 0, l = data.length ; i < l ; i++){
        delTab[i] = i;
      }

      Plotly.deleteTraces(graph, delTab) ;
    },


    updateDataStyle: function( update ){
      // restyle all traces using attribute strings
      Plotly.restyle( graph, update );
    },

    updateLayout: function( update ){
      // Apply changes.
      Plotly.relayout( graph, update );
    },

    redrawGraph: function( update ){
      // Merge with new values.
      uf.simpleExtend( graph, update );
      // Apply changes.
      Plotly.relayout( graph, update );
    },
  
    getLayout: function(){
      return layout;
    }

  }

})();