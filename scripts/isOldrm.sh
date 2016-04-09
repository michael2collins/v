#!/bin/bash

fileName=$1
numDays=$2

fileDt=$(echo $fileName | sed 's/^[^-]*-\([^.]*\)\..*$/\1/')
d1=$(date '+%s')
d2=$(date -d $fileDt '+%s')
diff=$((d1-d2))
seconds=$((numDays * 24 * 60 * 60))
[[ diff -ge seconds ]] && echo $filename &&  rm -f $fileName
