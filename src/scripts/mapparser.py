import json, sys, math
from math import sin, cos, sqrt, atan2, radians

# VARIABLES
fname = "LocationHistory.json"
outName = 'aggregate.json'
startTime = 1506841200000 # Oct 1st 2017.  Both in ms since epoch
endTime =   1530428400000 # July 1st 2018
aggregateDistance = 1.0 # Aggregate locations less than 1 km apart
aggregateMinimum = 80 # Minimum of 80 data entries to keep

# CONSTANTS
R = 6373.0 # approximate radius of earth in km
DAY_MS = 86400000 # Day in milliseconds
DEBUG = True

#Filter out entries out of our range
def keep(loc):
    date = int(loc["timestampMs"])
    if startTime < date and date < endTime:
        # Only bother transforming lat/lng data for good entries.
        loc['lat'] = loc["latitudeE7"] / 1e7
        loc['lng'] = loc["longitudeE7"] / 1e7
        loc['date'] = date
        return True
    return False


# Math from https://stackoverflow.com/questions/19412462/getting-distance-between-two-points-based-on-latitude-longitude
# Calculates the distance between two lat,lng points in kilometers.  
# Not quite accurate due to the Earth being a funny shape, but good enough for this.
def distanceKM(p1, p2):
    lat1 = radians(p1["lat"])
    lon1 = radians(p1["lng"])
    lat2 = radians(p2["lat"])
    lon2 = radians(p2["lng"])

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    # That's some crazy math

    distance = R * c
    return distance 


# Combines a list of similar location data points into a single entry.
# Result: the average lat/lng, as well as the time range these points cover.
def aggregateLocations(similar):
    if similar is None or len(similar) == 0:
        print("This wasn't supposed to happen")
        return None

    latSum = 0;
    lngSum = 0;
    timeLow = int(similar[0]["timestampMs"])
    timeHigh = timeLow

    for loc in similar:
        time = loc["date"]
        latSum += loc["lat"]
        lngSum += loc["lng"]
        timeLow = min(timeLow, time)
        timeHigh = max(timeHigh, time)

    return {
        "lat": latSum / len(similar),
        "lng": lngSum / len(similar),
        "timeStartMs": timeLow,
        "timeEndMs": timeHigh,
        "count": len(similar)
    }

# Aggregates consecutive entries if they are close enough.
# Returns a new list of aggregated data.
def aggregate(filtered):
    last = filtered[0]
    result = []
    similar = []

    for location in filtered:
        delta = distanceKM(location, last)

        if delta > aggregateDistance:
            if len(similar) > aggregateMinimum:
                spot = aggregateLocations(similar)
                result.append(spot)
            similar = []

        similar.append(location)
        last = location
    return result



def main():
    with open(fname) as data_file: 
        data = json.load(data_file)
        if DEBUG: print("Input length %s" % len(data["locations"]))

    filtered = list(filter(keep, data["locations"]))
    if DEBUG: print("Timerange length %s" % len(filtered))
  
    aggregateResult = aggregate(filtered)
    if DEBUG: print("Aggregated length %s" % len(aggregateResult))

    with open(outName, "w") as out_file:
        json.dump(aggregateResult, out_file, indent=2)

main() 