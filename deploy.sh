#!/bin/sh

cd home/node &&
envsubst '\$PORT' < ./etc/nginx/conf.d/default.conf.template > ./etc/nginx/conf.d/default.conf && 
nginx -g 'daemon off;' &&
cd ../maven &&
java -jar ./jar/moneytree.jar