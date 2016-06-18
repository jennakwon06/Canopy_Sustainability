#!/usr/bin/env bash
ls ../reports/ > reportsList.txt

while read p; do
    name=$"../reports/$(printf %q "$p")"
    echo $name
    name="mongofiles put -d heroku_dhmzqr91 $name --host ds025419.mlab.com:25419 -u jkwon47 -p rnjs078@"
    eval $name
done < reportsList.txt


#mongofiles put -d pdfs ./reports/Aetna\ Inc46af4.pdf --host ds025419.mlab.com:25419 -u jkwon47 -p rnjs078@ --authenticationDatabase heroku_dhmzqr91
