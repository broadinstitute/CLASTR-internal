#!/bin/bash

set -ex

# resources/database.xml should now be updated via jenkins job ( https://datascidev.broadinstitute.org/job/Update%20str-search/ ) 
# so skip it when copying files over

rsync --progress -rp ./ ubuntu@cds.team:/data1/str-search/ --exclude cellosaurus.xml --exclude .git --exclude resources/database.xml
ssh ubuntu@cds.team sudo systemctl restart str-search
