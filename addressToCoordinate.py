import csv
import pandas as pd
from geopy.geocoders import Nominatim

geolocator = Nominatim()

with open('public/data/master.csv', 'rb') as csvfile:
     reader = csv.reader(csvfile, delimiter=',')
     for row in reader:
     	location  = geolocator.geocode(row[2])
     	print row[2]
     	print 'printing coordinates'
     	print((location.latitude, location.longitude))


# http://pandas.pydata.org/pandas-docs/stable/indexing.html

# import pandas as pd
# df = pd.read_csv(csv_file)
# saved_column = df.column_name #you can also use df['column_name']

# http://stackoverflow.com/questions/17530542/how-to-add-pandas-data-to-an-existing-csv-file