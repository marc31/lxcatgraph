var readData = (function(){

  function handleFileSelect(evt) {
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

        // By lines
        var lines = this.result.split('\n');

        var state = {
          db:null,
          type:null,
          process:null
        };

        for(var line = 0; line < lines.length; line++){

          do{
            if (line.substring(0, 8) === 'DATABASE') { state.db = line.slice(9)}
          } while (state.db === null);

          console.log(state.db);
        }
      };
      reader.readAsText(files[i]);
    }


    // Add list File.
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }


  document.getElementById('files').addEventListener('change', handleFileSelect, false);


  function readBolsigFile(file, callback){

    if (!file) {
      console.log('Must specified file');
      return false;
    }

    var datas = [];

    var jsonFile = new XMLHttpRequest();
    jsonFile.open('GET',file,true);
    jsonFile.send();

    jsonFile.onreadystatechange = function(){
      if (jsonFile.readyState == 4 && jsonFile.status == 200){

        // By lines
        var lines = this.responseText.split('\n');
        var linesLength = lines.length;

        var state = {
          db:null,
          type:null,
          process:null
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

            // Finding start of Process Data
            for (line ; line < linesLength ; line++){
              if (lines[line].substring(0, 15) === '---------------') {
                //console.log('Start of process data : ' + line);
                line++;
                break;
              }
            }

            // Reading Data
            var data = {x:[],y:[],name:state.process}, num;
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


          db();
          comment();
          readingProcess();


          // At this point it can be :
          // - the begging of new process (no marker is present)
          // - the end of current specie (marker : ********)
          // - the end of the db  (marker : xxxxxx)
          // - the end of the file
          while(line < linesLength) {
            // Empty line go next line and re-test
            if (lines[line].replace(/\s/g, '') === '') {
              line++;
            }
            // End of current specie (marker : ********)
            else if (lines[line].substring(0, 15) === '***************') {
              console.log('**************************');
              console.log('Change Specie');
              comment();
              readingProcess();
            }
            // End of the db  (marker : xxxxxx)
            else if (lines[line].substring(0, 15) === 'xxxxxxxxxxxxxxx') {
              if (line + 1 >= linesLength){
                console.log('End of file');
                if (typeof callback === 'function'){
                  callback(datas);
                }
                return datas;
              } else {
                console.log('xxxxxxxxxxxxxxxxxxx');
                console.log('Change Db');
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
        }
      }
    };
  }

  return {
    readBolsigFile: readBolsigFile
  };


})();

