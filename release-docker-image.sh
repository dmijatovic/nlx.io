#!/bin/bash

set -e # exit on error
set -x # echo commands

RELEASE_TAG=${RELEASE_TAG:-latest}

docker build \
	-t nlxio/nlxio:${RELEASE_TAG} \
	-f Dockerfile .

# TODO: only push the image when this script is ran in CI/CD or forced using env var (backup-plan for when CI/CD is down/unavailable)
docker push nlxio/nlxio:${RELEASE_TAG}
