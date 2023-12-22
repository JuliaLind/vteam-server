#!/usr/bin/env bash

url="https://docs.google.com/spreadsheets/d/1baRwW0aX855K7FRKgYLS9FawCvkRy1JN/gviz/tq?tqx=out:csv&sheet"

for target in user user_card; do
    printf "%s\\n" "$target"
    curl --silent "$url=$target" > "$target.csv"
done

ls -l -- *.csv
file -- *.csv