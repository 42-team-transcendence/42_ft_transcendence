#!/bin/bash

docker stop $(docker ps -qa) >/dev/null 2>&1
docker rmi -f $(docker images -qa) >/dev/null 2>&1
docker rm $(docker volume ls -q) >/dev/null 2>&1
docker system prune -af >/dev/null 2>&1
docker volume rm $(docker volume ls -q) >/dev/null 2>&1
echo "Docker cleared of all images and containers."