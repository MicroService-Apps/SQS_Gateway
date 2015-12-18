var fs = require('fs');
var path = require('path');

var configPath = path.join(path.dirname(__dirname),'config/serviceQuery.json');

exports.getQuery = function(service) {
    var queryArr = JSON.parse(fs.readFileSync(configPath));
    return queryArr[service];
};
