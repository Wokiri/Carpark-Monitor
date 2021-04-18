const toDegree = rad => rad * 180 / Math.PI

const toRadian = deg => deg * Math.PI / 180

const km_Meters = distInKMs => distInKMs * 1000

const km_Miles = distInKMs => distInKMs * 0.62137

const meters_KMs = distInMeters => distInMeters / 1000

const meters_Miles = distInMeters => distInMeters / 1000 * 0.62137

const miles_KMs = distInMiles => distInMiles / 0.62137

const miles_Meters = distInMiles => distInMiles / 0.62137 * 1000

const roundoff = (num, dp) => Number(Math.round(num + 'e' + dp) + 'e-' + dp)

const a = 6378137.00

const geo_webMercator = (long, lat) => {

    const longRads = toRadian(long)
    const latRads = toRadian(lat)

    const easting = a * longRads
    const northing = a * Math.atanh(Math.sin(latRads))

    return [easting, northing]
}

// The formulas used to derive ellipsoid Latitude and Longitude from the Spherical Web Mercator coordinates:
const weMercator_geo = (easting, northing) => {

    const longRads = easting / a
    const latRads = Math.tanh(Math.asin((northing / a)))

    return [toDegree(longRads), toDegree(latRads)]
}


// This formula gives you the distance in meters for the radius
const Radial_Distance = (cent, angle) => {

    const pointA = geo_webMercator(cent.lng, cent.lat)
    const pointB = geo_webMercator(cent.lng + angle, cent.lat + angle)

    const dx = Math.abs(pointA[0] - pointB[0])
    const dy = Math.abs(pointA[1] - pointB[1])

    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
}

// GeoJSON generator
const CircleGeoJson = cent => {

    const segments = 360

    const XOrigin = cent['lng']
    const YOrigin = cent['lat']
    const R = cent['radius']

    const linear_Polar = () => {
        const center = geo_webMercator(XOrigin, YOrigin)
        const Ecent = center[0]
        const Ncent = center[1]
        const dxy = R * Math.sin(toRadian(45))
        const Evertex = Ecent + dxy
        const Nvertex = Ncent + dxy
        const coordinates2 = weMercator_geo(Evertex, Nvertex)
        const long2 = coordinates2[0]
        const lat2 = coordinates2[1]
        const dlong = Math.abs(XOrigin - long2)
        const dlat = Math.abs(YOrigin - lat2)
        return Math.sqrt(Math.pow(dlong, 2) + Math.pow(dlat, 2))
    }

    const Rm = linear_Polar()

    let circularArea = {
        type: "Polygon",
        coordinates: [
            []
        ]
    }

    let theCoordinates = circularArea['coordinates'][0]

    for (let i = 0; i <= segments; i++) {

        let xi, yi, dx, dy, degCent, degVert

        degCent = i
        degVert = 180 - (degCent + 90)

        dx = Rm * Math.sin(toRadian(degCent))
        dy = Rm * Math.sin(toRadian(degVert))

        xi = XOrigin + dx
        yi = YOrigin + dy

        // Vertex Points coordinates Rounded off to 5 dp
        theCoordinates[i] = [roundoff(xi, 5), roundoff(yi, 5)]

    }

    return JSON.stringify(circularArea, null)
}

const mapTime = timezoneOffset => {

    const pad = num => num < 10 ? "0" + num : num

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednessday', 'Thursday', 'Friday', 'Saturday']

    let D = new Date()
    let day = D.getDay()
    let hours = D.getHours()
    let minutes = D.getMinutes()
    let seconds = D.getSeconds()
    let localTimezone = -1 * (D.getTimezoneOffset()) / 60

    let mapTimezoneSeconds, totalmapminutes, mapminutes, mapseconds, maphours, theDay

    if (timezoneOffset >= localTimezone) {

        mapTimezoneSeconds = (timezoneOffset - localTimezone) * 3600
        mapseconds = (seconds + mapTimezoneSeconds) % 60

        totalmapminutes = minutes + (((seconds + mapTimezoneSeconds) - mapseconds) / 60)
        mapminutes = totalmapminutes % 60

        maphours = hours + ((totalmapminutes - mapminutes) / 60)

        if (maphours >= 24) {
            day += 1
            maphours -= 24
            day = (day > 6) ? day - 7 : day
        }

    } else {

        mapTimezoneSeconds = (localTimezone - timezoneOffset) * 3600

        maphours = hours - ((mapTimezoneSeconds / 3600) - (mapTimezoneSeconds % 3600) / 3600)

        if (maphours < 0) {
            day -= 1
            maphours += 24
            day = (day < 0) ? day + 7 : day
        }

        totalmapminutes = minutes - ((mapTimezoneSeconds % 3600) / 3600) * 60
        mapminutes = totalmapminutes % 60

        mapseconds = seconds
    }

    theDay = weekdays[day]

    return {
        D: theDay,
        H: pad(maphours),
        M: pad(mapminutes),
        S: pad(mapseconds)
    }

}

export {
    toDegree,
    toRadian,
    km_Meters,
    km_Miles,
    meters_KMs,
    meters_Miles,
    miles_KMs,
    miles_Meters,
    roundoff,
    geo_webMercator,
    weMercator_geo,
    Radial_Distance,
    CircleGeoJson,
    mapTime
}