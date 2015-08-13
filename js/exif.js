var fs = require('fs');
var ExifImage = require('exif').ExifImage;

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
  }
  return dd;
}
var attractions = JSON.parse(fs.readFileSync('data/disneyland-rides.json',
  'utf8'));
module.exports.parser = function(photo, callback) {
  var attraction = {
    "name": "",
    "dist": undefined,
    "land": ""
  };
  new ExifImage({
    image: photo
  }, function(err, exifData) {
    if (err) {
      console.log('Error: ' + err.message);
      return callback(err);
    }
    attractions.rides.forEach(function(val, index, arr) {
      curDist = getDistanceFromLatLon(val.lat, val.long,
        ConvertDMSToDD(exifData.gps.GPSLatitude[0], exifData.gps.GPSLatitude[
          1], exifData.gps.GPSLatitude[2], exifData.gps.GPSLatitudeRef),
        ConvertDMSToDD(exifData.gps.GPSLongitude[0], exifData.gps
          .GPSLongitude[1], exifData.gps.GPSLongitude[2], exifData.gps
          .GPSLongitudeRef
        )
      );
      if (attraction.dist > curDist || attraction.dist === null ||
        attraction.dist === undefined) {
        attraction = {
          'name': val.name,
          'dist': curDist,
          'land': val.land
        };
      }


    });
    callback(attraction);
  });
};
