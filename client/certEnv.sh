#!/bin/bash

echo $1
mkdir ssl

if [[ $1 =~ "--configuration=uat" ]]; then
    mv ./certs/uat/cert.pem ./certs/uat/key.pem ./ssl
    echo "UAT"
else 
    mv ./certs/prod/cert.pem ./certs/prod/key.pem ./ssl
    echo "PROD" 
fi