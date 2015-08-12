var fs = require('fs');

function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var a =
    0.5 - Math.cos((lat2 - lat1) * Math.PI / 180) / 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    (1 - Math.cos((lon2 - lon1) * Math.PI / 180)) / 2;

  return R * 2 * Math.asin(Math.sqrt(a));
}
var attraction;

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
  var dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  } // Don't do anything for N or E
  return dd;
}

function numSort(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}
var ExifImage = require('exif').ExifImage;
var names = [];
var dist = [];
var attractions = JSON.parse(fs.readFileSync('data/disneyland-rides.json',
  'utf8'));
module.exports.parser = function(photo, callback) {
  new ExifImage({
    image: photo
  }, function(error, exifData) {
    if (error) {
      console.log('Error: ' + error.message);
    } else {
      //  console.log(exifData);
      attractions.rides.forEach(function(val, index, arr) {
        dist[dist.length] = getDistanceFromLatLon(val.lat, val.long,
          ConvertDMSToDD(exifData.gps.GPSLatitude[0], exifData.gps.GPSLatitude[
            1], exifData.gps.GPSLatitude[2], exifData.gps.GPSLatitudeRef),
          ConvertDMSToDD(exifData.gps.GPSLongitude[0], exifData.gps
            .GPSLongitude[
              1], exifData.gps.GPSLongitude[2], exifData.gps.GPSLongitudeRef
          )
        );
        names[names.length] = {
          name: val.name,
          dist: dist[dist.length - 1]
        };
        //  console.log(dist);
      });
      dist = dist.sort(numSort);
      //console.log(dist);
      names.forEach(function(val, index, arr) {
        //console.log(val.name);
        if (val.dist === dist[0]) {
          attraction = val;
          callback(val);
          //console.log(val.name.toUpperCase());
        }
      });
      //    console.log(attraction.name);
    }
  });
};
