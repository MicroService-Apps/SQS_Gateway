var request = require('request');
var iptable = require('../config/iptable');
var serviceQuery = require('../config/serviceQuery');
var sqsSender = require('./sqsSender');
var service = process.argv[2];

// send http request to service
exports.sendHTTP = function(data) {
    // get all parameters
    var message = JSON.parse(data)['Req'];
    var operation = message['Header']['OP'];
    var uni = message['Header']['ID'];
    var responseQue = message['Header']['RQ'];
    var correlationId = message['Header']['CID'];
    var body = message['Body'];

    var urlStr = serviceQuery.getQuery(service);
    var url = urlStr.replace('<uni>', uni);
    var method;

    switch(operation) {
        case 'create' :
            method = 'PUT';
            break;
        case 'read':
            method = 'GET';
            break;
        case 'update':
            method = 'POST';
            break;
        case 'delete':
            method = 'DELETE';
            break;
        case 'patch':
            method = 'PATCH';
            break;
        default:
            // send to response queue
            var response = "Operation not correct";
            sqsSender.respondToQue(response, correlationId);

            break;
    }

    var ip = iptable.getIp(service);
    var port = iptable.getPort(service);
    url = 'http://'+ip+':'+port+url;

    // encode body to x-message_router-form-urlencoded form
    var encodedBody = '';
    for(var key in body) {
        encodedBody += (key + '=' + body[key] + '&');
    }

    if(encodedBody.length > 0) {
        encodedBody = encodedBody.substr(0, encodedBody.length-1);
    }

    // send http request
    request({
        headers: {
            'Content-Type': 'application/x-message_router-form-urlencoded'
        },
        uri: url,
        body: encodedBody,
        method: method
    }, function (err, response, body) {
        // send to response queue
        if(err) {
            var response = "request error";
            sqsSender.respondToQue(response, correlationId);
            return;
        }

        sqsSender.respondToQue(body, correlationId);
    });
};