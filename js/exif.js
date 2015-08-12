function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}
var attraction;

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
  var dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  } // Don't do anything for N or E
  return dd;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
var ExifImage = require('exif').ExifImage;
var names = [];
var attractions = {
  "rides": [{
    "lat": 33.812046,
    "long": -117.917891,
    "name": "Star Tours"
  }]
};

var fs = require('fs');
var dist = [];
new ExifImage({
  image: 'tests/castle.jpg'
}, function(error, exifData) {
  if (error) {
    console.log('Error: ' + error.message);
  } else {
    console.log(exifData);
    attractions.rides.forEach(function(val, index, arr) {
      dist[dist.length] = getDistanceFromLatLon(val.lat, val.long,
        ConvertDMSToDD(exifData.gps.GPSLatitude[0], exifData.gps.GPSLatitude[
          1], exifData.gps.GPSLatitude[2], exifData.gps.GPSLatitudeRef),
        ConvertDMSToDD(exifData.gps.GPSLatitude[0], exifData.gps.GPSLatitude[
          1], exifData.gps.GPSLatitude[2], exifData.gps.GPSLatitudeRef)
      );
      names[names.length] = {
        name: val.name,
        dist: dist[dist.length - 1]
      };
      console.log(dist);
    });
    dist = dist.sort();
    names.forEach(function(val, index, arr) {
      if (val.dist === dist[0]) {
        attraction = val;
        console.log(val.name);
      }
    });
    //    console.log(attraction.name);
  }
});
