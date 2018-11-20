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
)

func handler(ctx context.Context, kinesisEvent events.KinesisEvent) error {

	for _, record := range kinesisEvent.Records {
		kinesisRecord := record.Kinesis
		dataBytes := kinesisRecord.Data
		dataText := string(dataBytes)

		fmt.Printf("%s Data = %s \n", record.EventName, dataText)

		err := saveToDynamoDb(record)
		if err != nil {
			return err
		}
	}

	return nil
}

func saveToDynamoDb(record events.KinesisEventRecord) error {
	tableName := os.Getenv("LikesTableName")

	sess := session.Must(session.NewSession())
	ddb := dynamodb.New(sess, &aws.Config{Region: aws.String("us-east-1")})

	recordData := string(record.Kinesis.Data[:])
	fmt.Printf("record.Kinesis.Data : %s\n", recordData)

	var likeData LikeData
	err := json.Unmarshal(record.Kinesis.Data, &likeData)
	if err != nil {
		return err
	}
	fmt.Printf("likeData: %+v\n", likeData)

	av, err := dynamodbattribute.MarshalMap(likeData)
	if err != nil {
		return err
	}
	av["Time"] = &dynamodb.AttributeValue{
		S: aws.String(likeData.Time),
	}
	fmt.Printf("item: %+v\n", av)

	_, err = ddb.PutItem(&dynamodb.PutItemInput{
		TableName: aws.String(tableName),
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

type LikeData struct {
	User string
	Time string
}
