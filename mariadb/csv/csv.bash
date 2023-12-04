#!/usr/bin/env bash

url="https://docs.google.com/spreadsheets/d/1se0mW-L847L_au24e4OS4VHkSJ1NuTPL/gviz/tq?tqx=out:csv&sheet"

for target in payment; do
    printf "%s\\n" "$target"
    curl --silent "$url=$target" > "$target.csv"
done

ls -l -- *.csv
file -- *.csv