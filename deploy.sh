#!/bin/sh

envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;' &&
java -jar /home/maven/jar/moneytree.jar