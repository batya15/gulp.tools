var fs = require('fs'),
    path = require('path'),
    config = {
        src: null,
        dst: null
    };

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

var concatApi = function concatAllFixtureToJSAMD(done) {
    var namespaces = getDirectories(config.src);
    var api = {};
    namespaces.forEach(function (val) {
        var files = fs.readdirSync(config.src + '/' + val);
        api[val] = {};
        files.forEach(function (file) {
            var nameMethod = path.basename(file, '.json');
            api[val][nameMethod] = JSON.parse(fs.readFileSync(config.src + '/' + val + '/' + file, 'utf-8'));
        });
    });
    var string = 'define([], function(){ return ' + JSON.stringify(api) + ' });';

    var dst = path.join(process.cwd(), config.dst);
    fs.writeFileSync(dst + '/api.js', string, 'utf-8');
    done();
}

concatApi.configuration = function (params) {
    config.src = params.src;
    config.dst = params.dst;
};

module.exports = concatApi