export default class Utils {
    static metersToMiles(meters) {
        return meters * 0.000621;
    }

    static async calculateRoute(journey) {
        // osrm expects long, lat
        let pickupCoords = [...journey[0]].reverse().join(',');
        let dropoffCoords = [...journey[1]].reverse().join(',');

        let resp = await fetch(`https://router.project-osrm.org/route/v1/driving/${pickupCoords};${dropoffCoords}?overview=false`);
        let data = await resp.json();

        console.log(data);

        if(data.code !== "Ok") return false; // failed

        return {
            duration: data.routes[0].duration, // seconds
            distance: data.routes[0].distance // meters
        }
    }

    static calculateRouteFallback(journey) {
        let distKm = Utils.calcCrow(journey[0][0], journey[0][1], journey[1][0], journey[1][1]);
        return {
            duration: 'unknown',
            distance: distKm / 1000 // return meters
        }
    }

    // This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    // Source: https://stackoverflow.com/a/18883819 @Derek
    static calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = Utils.toRad(lat2-lat1);
      var dLon = Utils.toRad(lon2-lon1);
      var lat1 = Utils.toRad(lat1);
      var lat2 = Utils.toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

    // Converts numeric degrees to radians
    // Source: https://stackoverflow.com/a/18883819 @Derek
    static toRad(Value) 
    {
        return Value * Math.PI / 180;
    }
}