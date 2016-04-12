import csv
import time
# import pandas as pd
from geopy.geocoders import Nominatim

geolocator = Nominatim()

with open('public/data/master.csv', 'rb') as csvinput:
    with open('public/data/master_latlong.csv', 'w') as csvoutput:
        writer = csv.writer(csvoutput, lineterminator='\n')
        reader = csv.reader(csvinput)

        all = []
        row = next(reader)
        row.append('latitude')
        row.append('longitude')
        all.append(row)

        for row in reader:
            location = geolocator.geocode(row[2])
            row.append(location.latitude)
            row.append(location.longitude)
            all.append(row)

        writer.writerows(all)