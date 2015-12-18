var fs = require('fs');
var path = require('path');

var configPath = path.join(path.dirname(__dirname),'config/url.json');

exports.getUrl = function(key) {
    var urls = JSON.parse(fs.readFileSync(configPath));
    return urls[key];
};
