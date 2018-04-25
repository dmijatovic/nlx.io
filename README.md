# nlx.io
This repository contains the static website [nlx.io](https://www.nlx.io).

## Developing
The site is generated using [Hugo](https://gohugo.io/). When developing locally, please make sure you have installed a version > 0.36. Run:

    yarn start

to have a live server running at http://localhost:1313. Or use Docker with:

    docker-compose up

## Building
To build a local static version of the site run:

    yarn run build

To build a new container run:

    docker build -t nlxio/nlxio .

This builds a new nginx container with the static files, listening on port 80.
