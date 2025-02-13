CLASTR: the Cellosaurus STR Similarity Search Tool
======

Publication
------
Robin, T., Capes‐Davis, A. and Bairoch, A., 2019. CLASTR: The Cellosaurus STR similarity search tool - A precious help for cell line authentication. *International journal of cancer*.  
**PubMed**: [31444973](https://www.ncbi.nlm.nih.gov/pubmed/31444973) **DOI**: [10.1002/IJC.32639](https://doi.org/10.1002/IJC.32639)

Deployment
------

CLASTR is  built and deployed using the Docker Compose tool. First, clone this GitHub repository and then execute the `docker-compose up -d --build` command in the root folder containing the `docker-compose.yml` file. By default, the application is accessed through the port `8081`, but it can easily be changed in the `docker-compose.yml` file.

Update
------

When a new Cellosaurus version is released, the Docker containers require to be restarted using the `docker-compose restart` command in the folder containing the `docker-compose.yml` file. Note that the tool uses the [Cellosaurus FTP](ftp://ftp.expasy.org/databases/cellosaurus) as source and the corresponding files need to be updated prior to the restart.

To make sure that CLASTR uses the latest Cellosaurus version, the [database GET method](https://web.expasy.org/str-search/api/database) can be used to check the current version.

Help
------

Help can be accessed on the CLASTR [Help page](https://web.expasy.org/str-search/help.html).

Repository Details
------

### backend

Java backend handling the similarity search and score computation.

### frontend

HTML/CSS/Javascript frontend handling the tool webpage.

### scripts

Python scripts showcasing examples of using the API.

### webapp

Java webapp handling the RESTful API and processing queries.

## CDS SPECIFIC

To make changes, make them locally and then copy the changes to cds.team
host by running:

```
./deploy.sh
```

This will copy the current working directory the cds.team and then restart
the service.

After copying changes over, it's probably best to also re-run the job which
regenerates the DB in case that script has changed.

You can do this by going to https://datascidev.broadinstitute.org/job/Update%20str-search/ 
Sign in (if not already) and then click "Build now"

Once it's done the changes should be visible.
