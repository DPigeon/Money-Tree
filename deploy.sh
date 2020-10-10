#!/bin/sh

apt-get install gettext-base &&
envsubst '\$PORT' < /home/node/etc/nginx/conf.d/default.conf.template > /home/node/etc/nginx/conf.d/default.conf && 
nginx -g 'daemon off;' &&
java -jar /home/maven/jar/moneytree.jar