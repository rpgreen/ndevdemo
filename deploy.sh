#!/bin/bash

set -e

SITE_BUCKET=ndev-demo-site

# build backend
make
rm -rf dist
mkdir dist
cd bin
zip -D ../dist/consumer.zip consumer
zip -D ../dist/list.zip list
zip -D ../dist/buildTopLikers.zip buildTopLikers
zip -D ../dist/getTopLikers.zip getTopLikers
cd ..

# build site
cd react-site
npm run build
cd ..

# deploy infra
sam package --template-file ./cloudformation/template.yaml --output-template-file ./cloudformation/packaged.yaml --s3-bucket ndevtest
aws cloudformation deploy --template-file ./cloudformation/packaged.yaml --stack-name ndev1 --region us-east-1 --capabilities CAPABILITY_IAM

# deploy site
aws s3 sync react-site/build s3://$SITE_BUCKET