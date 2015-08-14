var parser = require('./exif.js').parser;
var fs = require('fs');
fs.readdir('./tests', function(err, files) {
  console.log(files);
  files.forEach(function(val, index, arr) {
    parser('./tests/' + val, function(attraction) {
      console.log(attraction);
    });
  });
});
