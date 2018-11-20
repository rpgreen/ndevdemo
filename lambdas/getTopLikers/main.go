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
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"os"
	"time"
)

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	headers := map[string]string{
		"X-Requested-With":             "*",
		"Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with",
		"Access-Control-Allow-Origin":  "*",
		"Access-Control-Allow-Methods": "POST,GET,OPTIONS",
	}

	topLikersTableName := os.Getenv("TopLikersTableName")

	sess := session.Must(session.NewSession())
	ddb := dynamodb.New(sess, &aws.Config{Region: aws.String("us-east-1")})

	// round down to most recent 5-minute interval
	now := time.Now().UTC()
	minute := now.Minute() - (now.Minute() % 5)
	now = time.Date(
		now.Year(), now.Month(), now.Day(), now.Hour(),
		minute, 0, 0, time.UTC)

	result, err := ddb.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String(topLikersTableName),
		Key: map[string]*dynamodb.AttributeValue{
			"Time": {
				S: aws.String(now.String()),
			},
		},
	})

	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       string(err.Error()),
			Headers:    headers,
		}, err
	}
	fmt.Printf("Item: %+v", result.Item)

	topLikers := TopLikers{
		Time:   *result.Item["Time"].S,
		Counts: make(map[string]string),
	}
	dynamodbattribute.UnmarshalMap(result.Item["Counts"].M, &topLikers.Counts)

	resultJson, err := json.Marshal(topLikers)

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(resultJson),
		Headers:    headers,
	}, err
}

func main() {
	lambda.Start(handler)
}

type TopLikers struct {
	Time   string
	Counts map[string]string
}
