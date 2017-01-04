var readData = (function(){


  function readBolsigFileLineByLine(allLines, callback){
    // By lines
    var lines = allLines.split('\n');
    var linesLength = lines.length;

    var datas = [];

    var state = {
      db:null,
      type:null,
      process:null,
      axisName:{x:null,y:null}
    };


    for(var line = 0 ; line < linesLength ; line++){

      // finding DATABASE
      function db(){
        for (line ; line < linesLength ; line++){
          if (lines[line].substring(0, 8) === 'DATABASE') {
            state.db = lines[line].slice(9).trim();
            line++;
            //console.log('Start DB : ' + (line - 1));
            console.log('Db name : ' + state.db);
            break;
          }
        }
        // Finding end of comment of DATABASE
        for (line ; line < linesLength ; line++){
          if (lines[line].substring(0, 15) === 'xxxxxxxxxxxxxxx') {
            line++;
            //console.log('End DB : ' + line);
            break;
          }
        }
      }

      // Finding specie in db
      function comment(){
        for (line ; line < linesLength ; line++){
          if (lines[line].substring(0, 15) === '***************') {
            line++;
            //console.log('Start of comment : ' + line);
            break;
          }
        }

        // Finding end of comment and Specie
        for (line ; line < linesLength ; line++){
          if (lines[line].substring(0, 15) === '***************') {
            // Specie name
            var deb = lines[line].indexOf('* ') + 2 ;
            var end = lines[line].lastIndexOf(' *');
            state.specie = lines[line].substring(deb,end);
            console.log('Specie name : ' + state.specie);

            line++;
            //console.log('End of comment : ' + line);
            break;
          }
        }
      }


      function readingProcess(){
        // Process name
        for (line ; line < linesLength ; line++){
          if (lines[line].substring(0, 8) === 'PROCESS:') {
            state.process = lines[line].slice(8);
            console.log('Process name : ' + state.process);
            console.log('Process Line : ' + line);
            line++;
            break;
          }
        }

        // Finding axis name
        var axisName;
        for (line ; line < linesLength ; line++){
          if (lines[line].substring(0, 8) === 'COLUMNS:' && lines[line].substring(0, 15) !== '---------------') {
            axisName = lines[line].slice(8).split('|');
            state.axisName.x = axisName[0].trim();
            state.axisName.y = axisName[1].trim();
            console.log('Axis name x : ' + state.axisName.x);
            console.log('Axis name y : ' + state.axisName.y);
            line++;
            break;
          }
        }

        // Finding start of Process Data
        for (line ; line < linesLength ; line++){
          if (lines[line].substring(0, 15) === '---------------') {
            //console.log('Start of process data : ' + line);
            line++;
            break;
          }
        }

        // Reading Data
        var data = {
          x:[],
          y:[],
          name:state.process,
          text:state.process+'<br />'+state.db,
          axisName:state.axisName,
          hoverinfo:'x+y+text'
        }, num;

        do{
          num = lines[line].trim().replace(/\s/g, '*!*!*').split('*!*!*');
          data.x.push(parseFloat(num[0]));
          data.y.push(parseFloat(num[1]));
          line++;
        } while(line < linesLength && lines[line].substring(0, 15) !== '---------------');
        //console.log('End of process data : ' + line);
        line++;
        datas.push(data);
      }


      try {
        db();
        comment();
        readingProcess();

        // At this point it can be :
        // - the begging of new process (no marker is present)
        // - the end of current specie (marker : ********)
        // - the end of the db  (marker : xxxxxx)
        // - the end of the file
        while (line < linesLength) {
          // Empty line go next line and re-test
          if (lines[line].replace(/\s/g, '') === '') {
            line++;
          }
          // End of current specie (marker : ********)
          else if (lines[line].substring(0, 15) === '***************') {
            //console.log('**************************');
            //console.log('Change Specie');
            comment();
            readingProcess();
          }
          // End of the db  (marker : xxxxxx)
          else if (lines[line].substring(0, 15) === 'xxxxxxxxxxxxxxx') {
            if (line + 1 >= linesLength) {
              //console.log('End of file');
              if (typeof callback === 'function') {
                callback(datas);
              }
              return datas;
            } else {
              //console.log('xxxxxxxxxxxxxxxxxxx');
              //console.log('Change Db');
              db();
              comment();
              readingProcess();
            }
          }
          // New process
          else {
            readingProcess();
          }
        }
      } catch(e) {
        alert('Error when reading file');
        console.log(e);
      }
    }
  }

  function readBolsigFileFormServeur(file, callback){
    if (!file) {
      console.log('You must specify a file');
      return false;
    }

    var datas = null;

    var jsonFile = new XMLHttpRequest();
    jsonFile.open('GET',file,true);
    jsonFile.send();

    jsonFile.onreadystatechange = function(){
      if (jsonFile.readyState == 4 && jsonFile.status == 200){
        datas = readBolsigFileLineByLine(this.responseText);
        if (datas && typeof callback === 'function'){
          callback(datas);
        }
      }
    };
  }

  return {
    readBolsigFileLineByLine: readBolsigFileLineByLine,
    readBolsigFileFormServeur: readBolsigFileFormServeur
  };


})();

