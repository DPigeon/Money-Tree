#!/bin/sh

envsubst '\$PORT' < /node/etc/nginx/conf.d/default.conf.template > /node/etc/nginx/conf.d/default.conf && 
nginx -g 'daemon off;' &&
java -jar /maven/jar/moneytree.jar