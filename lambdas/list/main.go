package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"os"
)

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	tableName := os.Getenv("LikesTableName")

	sess := session.Must(session.NewSession())
	ddb := dynamodb.New(sess, &aws.Config{Region: aws.String("us-east-1")})

	result, err := ddb.Scan(&dynamodb.ScanInput{ // don't use Scan in production :)
		TableName: aws.String(tableName),
	})

	var items []LikeData
	for _, item := range result.Items {
		user := *item["User"].S
		time := *item["Time"].S

		items = append(items, LikeData{Time: time, User: user})
	}

	fmt.Printf("Items: %+v", items)
	resultJson, err := json.Marshal(items)

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(resultJson),
		Headers: map[string]string{
			"X-Requested-With":             "*",
			"Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with",
			"Access-Control-Allow-Origin":  "*",
			"Access-Control-Allow-Methods": "POST,GET,OPTIONS",
		},
	}, err
}

func main() {
	lambda.Start(handler)
}

type LikeData struct {
	User string
	Time string
}
