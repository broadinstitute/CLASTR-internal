#!/bin/bash
set -ex

# download cellosaurus.xml if it's been updated
if [ -e resources/cellosaurus.xml ]; then
    curl_opts="-z resources/cellosaurus.xml"
else
    curl_opts=""
fi
curl -k -o resources/cellosaurus.xml $curl_opts https://ftp.expasy.org/databases/cellosaurus/cellosaurus.xml

docker build scripts -t clastr-internal-scripts
docker run -v $PWD:/work -w /work/scripts clastr-internal-scripts python make_database_xml.py
