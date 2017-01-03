(function(){

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
        for(var line = 0; line < lines.length; line++){
          console.log(lines[line]);
        }
      };

      reader.readAsText(file);



    }

    // Add list File.
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);


})();

