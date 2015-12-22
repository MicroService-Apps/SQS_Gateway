var fs = require('fs');
var path = require('path');

var configPath = path.join(path.dirname(__dirname),'config/url.json');

// used for get queue name
function getQueKey(key, inOrOut) {
    var retVal;

    switch(key) {
        case 'K12':
            if(inOrOut) {
                retVal = 'K12InputQueue';
            } else {
                retVal = 'K12ResponseQueue';
            }

            break;
        case 'Finance':
            if(inOrOut) {
                retVal = 'FinanceInputQueue';
            } else {
                retVal = 'FinanceResponseQueue';
            }

            break;
        default:
            retVal = 'null';

            break;
    }

    return retVal;
}

exports.getInQueUrl = function(key) {
    var urls = JSON.parse(fs.readFileSync(configPath));
    var queKey = getQueKey(key, true);

    if(urls[key]) {
        return urls[key][queKey];
    } else {
        return null;
    }
};

exports.getResQueUrl = function(key) {
    var urls = JSON.parse(fs.readFileSync(configPath));
    var queKey = getQueKey(key, false);

    if(urls[key]) {
        return urls[key][queKey];
    } else {
        return null;
    }
};
