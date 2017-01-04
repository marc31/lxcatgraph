var graphAPI = (function(){

'use strict';

  var graph = document.getElementById('graph');

  var trace1 = {
    x: [0.000000e+0,1.000000e-4,3.514000e-2,7.152000e-2,1.091700e-1,1.371370e+0,5.918310e+0,8.440610e+0,1.102264e+1,1.379108e+1,1.657924e+1,1.918366e+1,2.217395e+1,2.560725e+1,2.954921e+1,3.407519e+1,3.790451e+1,4.215191e+1,4.686301e+1,
        5.588529e+1,6.660830e+1,7.935261e+1,9.449926e+1,1.125011e+2,1.338963e+2,1.593245e+2,1.895461e+2,2.254644e+2,3.188895e+2,3.791894e+2,4.508559e+2,5.360318e+2,6.372635e+2,7.575776e+2,9.005711e+2],
    y: [4.903500e-20,4.903500e-20,5.501140e-20,5.747600e-20,5.896700e-20,6.938560e-20,6.025320e-20,5.209010e-20,4.444340e-20,3.734320e-20,3.184430e-20,2.766530e-20,2.383470e-20,
        1.998990e-20,1.667870e-20,1.385490e-20,1.190580e-20,1.024370e-20,8.806780e-21,6.702370e-21,5.073960e-21,3.808260e-21,2.878530e-21,2.204960e-21,1.622750e-21,1.224330e-21,9.142570e-22,6.756040e-22,4.949030e-22,3.701550e-22,
        2.748810e-22,2.023320e-22,1.477860e-22,1.101690e-22,8.165410e-23,5.983320e-23],
    type: 'scatter',
    name: 'Super courbe de la bdd 1',
    mode: 'lines+markers',
    line: {
      width: 1
    },
    marker: {
      size: 5
    }
  };

  var trace2 = {
    x: [0.000000e+0,1.000000e-3,2.000000e-3,3.000000e-3,5.000000e-3,7.000000e-3,8.500000e-3,1.000000e-2,1.500000e-2,2.000000e-2,3.000000e-2,4.000000e-2,5.000000e-2,7.000000e-2,1.000000e-1,1.200000e-1,1.500000e-1,1.700000e-1,2.000000e-1,2.500000e-1,3.000000e-1,
        3.500000e-1,4.000000e-1,5.000000e-1,7.000000e-1,1.000000e+0,1.200000e+0,1.300000e+0,1.500000e+0,1.700000e+0,1.900000e+0,2.100000e+0,2.200000e+0,2.500000e+0,2.800000e+0,3.000000e+0,3.300000e+0,3.600000e+0,4.000000e+0,4.500000e+0,5.000000e+0,6.000000e+0,7.000000e+0,8.000000e+0,1.000000e+1,1.200000e+1,1.500000e+1,1.700000e+1,2.000000e+1,2.500000e+1,3.000000e+1,5.000000e+1,7.500000e+1,1.000000e+2,1.500000e+2,2.000000e+2,3.000000e+2,5.000000e+2,7.500000e+2,1.000000e+3],
    y: [4.960000e-20,4.980000e-20,5.020000e-20,5.070000e-20,5.120000e-20,5.150000e-20,5.180000e-20,5.210000e-20,5.280000e-20,5.350000e-20,5.460000e-20,5.540000e-20,
        5.620000e-20,5.740000e-20,5.860000e-20,5.940000e-20,6.040000e-20,6.080000e-20,6.160000e-20,6.270000e-20,6.350000e-20,6.420000e-20,6.490000e-20,6.590000e-20,6.730000e-20,6.850000e-20,
        6.910000e-20,6.920000e-20,6.960000e-20,6.970000e-20,6.980000e-20,6.980000e-20,6.980000e-20,6.960000e-20,6.920000e-20,6.890000e-20,6.820000e-20,6.730000e-20,6.600000e-20,6.490000e-20,
        6.310000e-20,6.000000e-20,5.680000e-20,5.350000e-20,4.720000e-20,4.200000e-20,3.500000e-20,3.150000e-20,2.640000e-20,2.050000e-20,1.740000e-20,1.100000e-20,8.800000e-21,
        7.500000e-21,6.050000e-21,5.200000e-21,4.100000e-21,3.000000e-21,2.350000e-21,1.700000e-21],
    type: 'scatter',
    name: 'Super courbe de la bdd 2',
    mode: 'lines+markers',
    line: {
      width: 1
    },
    marker: {
      size: 5
    },
  };

  var data = [trace1, trace2];
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
    init: function () {
      init();
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