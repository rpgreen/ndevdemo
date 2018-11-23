# ndevdemo

A silly demo application built for a talk on "Serverless Design Patterns" at NDev meetup  ov 26, 2018.

[Live sample](http://ndev-demo-site.s3-website-us-east-1.amazonaws.com)

## Pre-requisites

* [Install and configure AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html)
* [Install AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Install [Go](https://golang.org/doc/install)

## Deploy

* Update SITE_BUCKET deploy.sh and SiteS3BucketName in cloudformation/template.yaml
* Run `./deploy.sh`
* Visit site at http://$SITE_BUCKET.s3-website-us-east-1.amazonaws.com