var AWS = require('aws-sdk');
var URL = require('../config/url');

var resName = 'FinanceResponseQueue';
var queUrl = URL.getUrl(resName);

AWS.config.update({
    "region": "us-east-1"
});

var sqs = new AWS.SQS();

exports.respondToQue = function(body, correlationId) {
    var msg = {
        Res: {
            Header: {
                CID: correlationId
            },
            Body: body
        }
    };

    var sqsParams = {
        MessageBody: JSON.stringify(msg),
        QueueUrl: queUrl
    };

    sqs.sendMessage(sqsParams, function(err, data) {
        if (err) console.log('ERR', err);
    });
};



