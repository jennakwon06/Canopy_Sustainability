import os, os.path
import csv

csvfile = '../public/data/master.csv'
csvfile_new = '../public/data/master_temp.csv'

with open(csvfile, 'r+') as csvinput:
    with open(csvfile_new, 'w') as csvoutput:
        reader = csv.reader(csvinput)
        writer = csv.writer(csvoutput, lineterminator='\n')

        all = []
        row = reader.next()
        row.append('# Available Reports')
        all.append(row)

        for row in reader:
            if row[1].strip():
                path = '../public/reports/' + row[1]
                d = os.path.dirname(path)
                print d
                print os.path.exists(path)
                if not os.path.exists(path):
                    os.makedirs(path)

                try:
                    # folders = ([name for name in os.listdir(path) if os.path.isdir(os.path.join(path, name)) ])
                    # for folder in folders:
                    contents = os.listdir(path) # get list of contents
                    print(path, len(contents))
                    row.append(len(contents))
                    all.append(row)

                except IndexError:
                    print "IND EXRROR HAPPENED"
                    continue
            else: # append 0
                row.append(0)
                all.append(row)

        writer.writerows(all)

os.remove(csvfile) # not needed on unix
os.rename(csvfile_new, csvfile)
