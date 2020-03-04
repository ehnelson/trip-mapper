#!/usr/bin/python

import json, sys, math
from math import sin, cos, sqrt, atan2, radians

# VARIABLES
fname = "LocationHistory.json"
outName = 'aggregate.json'
startTime = 1507705200000 # Oct 11th 2017.  Both in ms since epoch
endTime =   1529650800000 # June 22 2018
aggregateDistance = 1.0 # Aggregate locations less than 1 km apart
aggregateMinimum = 80 # Minimum of 80 data entries to keep
furtherAggregateDistance = 5.0 #Area aggregate

# Points east of this median will be displayed west of the western hemisphere.
# I want East Asia displayed across the Pacific :)
flipMedianDegree = 50

chapterFName = "chapters.json"
imageMetadataFileName = "image_metadata.json"


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

    latSum = 0
    lngSum = 0
    timeLow = int(similar[0]["timestampMs"])
    timeHigh = timeLow
    count = len(similar)

    for loc in similar:
        time = loc["date"]
        latSum += loc["lat"]
        lngSum += loc["lng"]
        timeLow = min(timeLow, time)
        timeHigh = max(timeHigh, time)

    return {
        "lat": latSum / count,
        "lng": lngSum / count,
        "timeStartMs": timeLow,
        "timeEndMs": timeHigh,
        "count": count
    }

# Aggregates consecutive entries if they are close enough.
# Returns a new list of aggregated data.
def aggregateConsecutive(filtered):
    last = filtered[0]
    result = []
    similar = []

    for location in filtered:
        delta = distanceKM(location, last)

        if delta > aggregateDistance:
            # Starting a new location.  If the old one had enough data points, save it.
            if len(similar) > aggregateMinimum:
                spot = aggregateLocations(similar)
                result.append(spot)
            similar = []

        similar.append(location)
        last = location

    # Return list from oldest to newest data
    result.reverse()
    return result


# Combines two aggregate data points, expands time range to the min/max of both.
# Returns a new dict
def combineResults(first, second):
    firstCount = first["count"]
    secondCount = second["count"]
    total = firstCount + secondCount

    avgLat = (first["lat"] * firstCount + second["lat"] * secondCount) / total
    avgLng = (first["lng"] * firstCount + second["lng"] * secondCount) / total

    return {
        "lat": avgLat,
        "lng":  avgLng,
        "timeStartMs": min(first["timeStartMs"], second["timeStartMs"]),
        "timeEndMs": max(first["timeEndMs"], second["timeEndMs"]),
        "count": total
    }

# Finds and combines data points that weren't consecutive, but are still close in location
# IE two nights at a hostel become a single point.
# input toggles for distance and time.
def aggregateFurther(data, distance, timeThreshold):
    result = []

    for index in range(len(data)):
        x = data[index]
        added = False

        # For each data point, compare it with ones we've already processed.
        for i in range(len(result)):
            y = result[i]

            # if we're close enough and within the given time range, combine and continue
            if not added and distanceKM(x, y) < distance and (abs(y["timeStartMs"] - x["timeEndMs"]) < timeThreshold or  abs(x["timeStartMs"] - y["timeEndMs"]) < timeThreshold):
                result[i] = combineResults(x, y)
                added = True

        # If we didn't find something to add this data point to, add it individualy to results.
        if not added:
            result.append(x)

    return result

# Rotating certain data points around the map.
def flipDataPoints(data):
    for entry in data:
        if entry["lng"] > flipMedianDegree:
            entry["lng"] -= 360


# Reads in a chapter file, and organizes our data points into custom chapters.
def chapterGrouping(data):
    with open(chapterFName) as data_file: 
        chapters = json.load(data_file)

    for chap in chapters:
        
        start = int(chap["start"])
        end = int(chap["end"])

        children = []

        for date in data:
            if date["timeStartMs"] >= start and date["timeEndMs"] <= end:
                children.append(date)
        chap["children"] = children
        chap["images"] = []

    return chapters

def addImageMetadata(data):
    with open(imageMetadataFileName) as data_file: 
        images = json.load(data_file)
    
    if DEBUG: print("Images loaded %s" % len(images))
    flipDataPoints(images)

    for image in images:
        timeStamp = int(image["timestamp"])

        for chapter in data:
            if int(chapter["start"]) <= timeStamp and timeStamp <= int(chapter["end"]):
                chapter["images"].append(image)

    return data



def main():
    with open(fname) as data_file: 
        data = json.load(data_file)["locations"]
        if DEBUG: print("Input length %s" % len(data))

    data = list(filter(keep, data))
    if DEBUG: print("Timerange length %s" % len(data))
  
    data = aggregateConsecutive(data)
    if DEBUG: print("Aggregated length %s" % len(data))

    data = aggregateFurther(data, furtherAggregateDistance, DAY_MS)
    if DEBUG: print("Final length %s" % len(data))

    flipDataPoints(data)

    data = chapterGrouping(data)
    if DEBUG: print("Chapter count %s" % len(data))

    data = addImageMetadata(data)

    # TODO - Unique ID tag to everything
    # TODO - Curate Data.  Further aggregate in specific locations (but keeping existing data in a list)
    #           IE returning PARIS, but you can expand.  Waiting until we start integrating photo info. 
    # TODO - Blacklist of unwanted locations.  Some personal, some random road trip data.
    # TODO - Blacklist Seattle?  

    with open(outName, "w") as out_file:
        json.dump(data, out_file, indent=2)

main() 