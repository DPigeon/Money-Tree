#!/bin/bash

docker rm -f frontend &>/dev/null && echo 'Removed old frontend container.'
docker rm -f backend &>/dev/null && echo 'Removed old frontend container.'
docker login docker.pkg.github.com -u $1 -p $2
docker pull docker.pkg.github.com/dpigeon/money-tree/frontend:latest
docker pull docker.pkg.github.com/dpigeon/money-tree/backend:latest
docker run -dit -p 80:80 --name frontend docker.pkg.github.com/dpigeon/money-tree/frontend:latest
docker run -dit -p 8080:8080 --name backend docker.pkg.github.com/dpigeon/money-tree/backend:latest