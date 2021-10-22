#!/bin/bash

set -ex

if [ ! -r resources/database.xml ] ; then
    echo "Missing resources/database.xml. This file is not part of the gitrepo because it contains patient information, so please get a copy and place in your local directory"
    exit 1
fi

rsync -rp ./ ubuntu@cds.team:/data1/str-search/
ssh cds.team sudo systemctl restart str-search
