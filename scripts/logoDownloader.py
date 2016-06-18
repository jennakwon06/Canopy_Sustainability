import csv
import io
import urllib


with io.open("master.csv", encoding='utf8', errors='ignore') as csvfile:
    reader = csv.DictReader(csvfile)
    count = 0
    for row in reader:
        if row['URL'] != '' :
            url = row['URL']
            print(company)
            # urllib.urlretrieve("http://www.digimouth.com/news/media/2011/09/google-logo.jpg", "local-filename.jpg")