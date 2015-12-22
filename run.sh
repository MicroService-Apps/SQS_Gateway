echo SQS Gateway for service: $1
node ./sqs/sqsListener.js $1
