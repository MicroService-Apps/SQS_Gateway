var AWS = require('aws-sdk');
var URL = require('../config/url');
var serviceRequest = require('./serviceRequest');
var queUrl = URL.getUrl('FinanceInputQueue');

// configure AWS
AWS.config.update({
    "region": "us-east-1"
});

var sqs = new AWS.SQS();

// receive message params
var receiveMessageParams = {
    QueueUrl: queUrl,
    MaxNumberOfMessages: 1
};

function getMessages() {
    sqs.receiveMessage(receiveMessageParams, receiveMessageCallback);
}

// receive message callback function
function receiveMessageCallback(err, data) {
    if (data && data.Messages && data.Messages.length > 0) {
        for (var i=0; i < data.Messages.length; i++) {
            // handle message
            var message = data['Messages'][0]['Body'];
            serviceRequest.sendHTTP(message);
            console.log(message);

            // Delete the message when we've successfully processed it
            var deleteMessageParams = {
                QueueUrl: queUrl,
                ReceiptHandle: data.Messages[i].ReceiptHandle
            };

            sqs.deleteMessage(deleteMessageParams, deleteMessageCallback);
        }

        // listen on queue again
        getMessages();
    } else {
        setTimeout(getMessages(), 10000);
    }
}

function deleteMessageCallback(err, data) {
    //console.log("deleted message");
    //console.log(data);
}

setTimeout(getMessages(), 10000);

