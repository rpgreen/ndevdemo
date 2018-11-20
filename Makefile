build:
	go get github.com/aws/aws-lambda-go/lambda
	env GOOS=linux go build -ldflags="-s -w" -o bin/consumer lambdas/consumer/main.go
	env GOOS=linux go build -ldflags="-s -w" -o bin/list lambdas/list/main.go
	env GOOS=linux go build -ldflags="-s -w" -o bin/buildTopLikers lambdas/buildTopLikers/main.go
	env GOOS=linux go build -ldflags="-s -w" -o bin/getTopLikers lambdas/getTopLikers/main.go