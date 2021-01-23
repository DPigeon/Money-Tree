#!/bin/bash

# arg 1: certificate
# arg 2: certificate's private key

mkdir ssl

echo "$1" > cert.pem
echo "$2" > key.pem

mv cert.pem key.pem ./ssl