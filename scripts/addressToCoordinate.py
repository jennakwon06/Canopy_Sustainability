import csv
from geopy.geocoders import Photon

geolocator = Photon()

hdr = {}

with open('public/data/master.csv', 'rb') as csvinput:
    with open('public/data/master_latlong.csv', 'w') as csvoutput:
        writer = csv.writer(csvoutput, lineterminator='\n')
        reader = csv.reader(csvinput)

        all = []
        row = reader.next()
        row.append('latitude')
        row.append('longitude')
        all.append(row)

        for row in reader:
            try:
                location = geolocator.geocode(row[2], timeout=10)
                print location.latitude
                print location.longitude
                row.append(location.latitude)
                row.append(location.longitude)
                all.append(row)
            except IndexError:
                print "INDEXRROR HAPPENED"
                continue

        writer.writerows(all)