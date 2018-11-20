package main

import (
	"context"
	"fmt"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"os"
	"time"
)

func handler(ctx context.Context) error {

	likesTableName := os.Getenv("LikesTableName")
	topLikersTableName := os.Getenv("TopLikersTableName")

	sess := session.Must(session.NewSession())
	ddb := dynamodb.New(sess, &aws.Config{Region: aws.String("us-east-1")})

	params := &dynamodb.ScanInput{
		TableName: aws.String(likesTableName),
	}

	result, err := ddb.Scan(params)

	// aggregate likes by user Id
	var counts = make(map[string]int)
	for _, item := range result.Items {
		user := *item["User"].S
		counts[user] = counts[user] + 1
	}

	fmt.Printf("Counts: %+v", counts)

	var topLikers TopLikers

	// floor current time to nearest minute
	now := time.Now().UTC()
	now = time.Date(
		now.Year(), now.Month(), now.Day(), now.Hour(),
		now.Minute(), 0, 0, time.UTC)

	topLikers.Time = now.UTC().String()
	topLikers.Counts = counts
	av, err := dynamodbattribute.MarshalMap(topLikers)
	if err != nil {
		return err
	}
	_, err = ddb.PutItem(&dynamodb.PutItemInput{
		TableName: aws.String(topLikersTableName),
		Item:      av,
	})
	if err != nil {
		return err
	}
	return nil
}

func main() {
	lambda.Start(handler)
}

type TopLikers struct {
	Time   string
	Counts map[string]int
}
