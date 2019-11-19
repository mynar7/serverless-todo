#!/bin/bash

docker run --rm -d -p 8000:8000 amazon/dynamodb-local

aws dynamodb --region localhost --endpoint-url http://localhost:8000 \
    create-table \
        --table-name todo-table \
        --attribute-definitions \
            AttributeName=name,AttributeType=S \
        --key-schema \
            AttributeName=name,KeyType=HASH \
        --provisioned-throughput \
            ReadCapacityUnits=10,WriteCapacityUnits=5

aws dynamodb --region localhost --endpoint-url http://localhost:8000 \
    batch-write-item --request-items file://todo.json