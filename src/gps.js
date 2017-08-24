const GoogleMapApi = window.google.maps;

function calculateGaps(coords) {

  const distances = [];
  coords.slice(1).reduce(function (prevCoord, coord) {
    const distance = getDistanceFromLatLonInKm(
      prevCoord.lat,
      prevCoord.lng,
      coord.lat,
      coord.lng
    );
    distances.push(distance * 1000);
    return coord;
  }, coords[0]);

  return distances;

}

function extractCoords(data) {
  const arrayOfLines = data.match(/[^\r\n]+/g);

  return arrayOfLines.map(line => {
    const values = line.split(',');
    return {
      lat: parseFloat(values[0]),
      lng: parseFloat(values[1])
    }
  });

}

function convertToMarkers(coords) {
  return coords.map(coord => {
    return {
      position: {
        ...coord
      }
    };
  });
}

function fitBounds(mapInstance, coords) {
  var latlngbounds = new GoogleMapApi.LatLngBounds();
  for (var i = 0; i < coords.length; i++) {
    latlngbounds.extend(new GoogleMapApi.LatLng(coords[i].lat, coords[i].lng));
  }

  mapInstance.fitBounds(latlngbounds);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

export default {
  extractCoords,
  calculateGaps,
  convertToMarkers,
  fitBounds,
}
