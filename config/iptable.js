var fs = require('fs');
var path = require('path');

var configPath = path.join(path.dirname(__dirname),'config/iptable.json');

exports.getIp = function(service) {
    var iptable = JSON.parse(fs.readFileSync(configPath));

    if(iptable[service] != null) {
        return iptable[service]['ip'];
    } else {
        return null;
    }
};

exports.getPort = function(service) {
    var iptable = JSON.parse(fs.readFileSync(configPath));

    if(iptable[service] != null) {
        return iptable[service]['port'];
    } else {
        return null;
    }
};