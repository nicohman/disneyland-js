process.stdin.resume();
process.stdin.setEncoding('utf8');
var fs = require('fs');
var loop = function() {
  var toWrite = {};
  console.log('Name:');
  process.stdin.once('data', function(text) {
    text = text.slice(0, text.length - 1);
    toWrite.name = text;
    console.log('Lat:');
    process.stdin.once('data', function(lat) {
      lat = lat.slice(0, lat.length - 1);
      toWrite.lat = parseFloat(lat);
      console.log('Long:');
      process.stdin.once('data', function(long) {
        long = long.slice(0, long.length - 1);
        toWrite.long = parseFloat(long);
        console.log('Land:');
        process.stdin.once('data', function(land) {
          land = land.slice(0, land.length - 1);
          toWrite.land = land;
          var attractions = JSON.parse(fs.readFileSync(
            'data/disneyland-rides.json',
            'utf8'));
          attractions.rides[attractions.rides.length] =
            toWrite;
          fs.writeFile('data/disneyland-rides.json', JSON.stringify(
            attractions), function(err) {
            console.log('Restarting');
            loop();
          });
        });
      });
    });

  });
};
loop();
