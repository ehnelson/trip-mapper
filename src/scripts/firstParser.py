#!/usr/bin/python

import json

fname = "LocationHistory.json"
outName = "FilteredLocationHistory.json"

startTime = 1507705200000 # Oct 11th 2017.  Both in ms since epoch
endTime =   1529650800000 # June 22 2018
DEBUG = True

#This first step takes forever to run and will probably never change, 
# I'll run it seperate while developing.

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

def main():
    with open(fname) as data_file: 
        data = json.load(data_file)["locations"]
        if DEBUG: print("Input length %s" % len(data))

    data = list(filter(keep, data))
    if DEBUG: print("Timerange length %s" % len(data))

    with open(outName, "w") as out_file:
        json.dump(data, out_file, indent=2)

main()