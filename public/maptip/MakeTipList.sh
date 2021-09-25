#!/bin/sh
files=`ls -C *.png | tr -s ' ' ','`
echo ${files} > TipList.csv
