import exifread, time, json
import os
import glob
import operator

img_dir = "../../public/" # Enter Directory of all images 
outName = "image_metadata.json"


# Stolen very rudely from https://gist.github.com/snakeye/fdc372dbf11370fe29eb
# based on https://gist.github.com/erans/983821
def _get_if_exist(data, key):
    if key in data:
        return data[key]

    return None


def _convert_to_degress(value):
    """
    Helper function to convert the GPS coordinates stored in the EXIF to degress in float format
    :param value:
    :type value: exifread.utils.Ratio
    :rtype: float
    """
    d = float(value.values[0].num) / float(value.values[0].den)
    m = float(value.values[1].num) / float(value.values[1].den)
    s = float(value.values[2].num) / float(value.values[2].den)

    return d + (m / 60.0) + (s / 3600.0)
    
def get_exif_location(exif_data):
    """
    Returns the latitude and longitude, if available, from the provided exif_data (obtained through get_exif_data above)
    """
    lat = None
    lon = None

    gps_latitude = _get_if_exist(exif_data, 'GPS GPSLatitude')
    gps_latitude_ref = _get_if_exist(exif_data, 'GPS GPSLatitudeRef')
    gps_longitude = _get_if_exist(exif_data, 'GPS GPSLongitude')
    gps_longitude_ref = _get_if_exist(exif_data, 'GPS GPSLongitudeRef')

    if gps_latitude and gps_latitude_ref and gps_longitude and gps_longitude_ref:
        lat = _convert_to_degress(gps_latitude)
        if gps_latitude_ref.values[0] != 'N':
            lat = 0 - lat

        lon = _convert_to_degress(gps_longitude)
        if gps_longitude_ref.values[0] != 'E':
            lon = 0 - lon

    return lat, lon

# Returns the timestamp of the image, if it exists
def get_exif_time(exif_data):
    raw_time = _get_if_exist(exif_data, 'Image DateTime')
    if raw_time:
        """changes EXIF date ('2005:10:20 23:22:28') to number of seconds since 1970-01-01"""
        tpl = time.strptime(str(raw_time) + 'UTC', '%Y:%m:%d %H:%M:%S%Z')
        return int(time.mktime(tpl) * 1000)
    return None



def main():
    data_path = os.path.join(img_dir,'*g')
    files = glob.glob(data_path)
    results = []
    for path in files:
        f = open(path, 'rb')

        tags = exifread.process_file(f, details=False)
        location =  get_exif_location(tags)
        timestamp = get_exif_time(tags)
        fileName = os.path.basename(path)

        result = {
        	"lat": location[0],
        	"lng": location[1],
        	"fileName": fileName,
        	"timestamp": timestamp
        }
        results.append(result)

    results.sort(key=operator.itemgetter('timestamp'))

    with open(outName, "w") as out_file:
        json.dump(results, out_file, indent=2)

main()