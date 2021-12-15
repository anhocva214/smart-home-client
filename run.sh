#!/bin/bash
docker stop smart-home-client
docker rm smart-home-client
docker image rm smart-home-client:latest
docker build -t smart-home-client:latest -f Dockerfile .
docker run -d -p 3001:3000 --name smart-home-client smart-home-client:latest