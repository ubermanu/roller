#!/usr/bin/env bash
for x in 16 32 48 128 ; do inkscape --export-filename public/icons/icon${x}.png -w ${x} src/images/roller-skate.svg ; done
