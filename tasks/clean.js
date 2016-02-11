var gulp = require('gulp'),
    fs = require('fs-extra'),
    dir = [];

var cleanTask = function clean (done) {
    dir.forEach(function(val){
        fs.removeSync(val);
    });
    done()
};

cleanTask.configuration = function (config) {
    if (Array.isArray(config)) {
        dir = config;
    }
};

module.exports = cleanTask;