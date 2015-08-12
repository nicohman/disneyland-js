var parser = require('./exif.js').parser;
parser('tests/astro.JPG', function(attraction) {
  console.log(attraction);
});
