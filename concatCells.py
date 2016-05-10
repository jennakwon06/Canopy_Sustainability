import csv

f1 = file('public/data/master.csv', 'r')
f2 = file('public/data/master1.csv', 'r')
f3 = file('public/data/master_concat.csv', 'w')

c1 = csv.reader(f1)
c2 = csv.reader(f2)
c3 = csv.writer(f3)

masterlist = list(c2)

for master_row1 in c1:
    print master_row1
    row = 1
    for master_row2 in masterlist:
        print master_row2
        results_row = master_row1
        print master_row1[0]
        print master_row2[0]
        if master_row1[0] == master_row2[0]:
            results_row.append(master_row2[11])
            results_row.append(master_row2[10])
            results_row.append(master_row2[9])
            results_row.append(master_row2[5])
            results_row.append(master_row2[6])
            break
        row = row + 1
    c3.writerow(results_row)
f1.close()
f2.close()
f3.close()
# row.append('Tot Wtr Use:Y')
# row.append('Waste Recycl:Y ')
# row.append('Total Waste:Y ')
# row.append('Energy Consump:Y ')
# row.append('Wste Sent to Ldflls:Y ')