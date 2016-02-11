var through = require('through2'),
    fsSync = require('fs-extra'),
    path = require('path'),
    commponsPath = require('../util/commonsPath'),
    fs = require('fs'),
    config = {};

//Копирование элементов из библиотеки элементов
function copyJadeIncludesElements(jadeFileName, basePath, callback) {
    fs.readFile(jadeFileName, {"encoding": "utf-8"}, function (err, data) {
        if (err) {
            callback(err)
        } else {
            var res = [];
            var tasks = [];
            data = data.split("\n");
            data.forEach(function (line) {
                line = line.trim().split(/\s+/);
                if (line[0] == 'include') {
                    line = line[1];
                    if (line.indexOf('.jade') == -1) {
                        line += '.jade';
                    }
                    if (line.indexOf('libel/') >= 0) {
                        if (!fs.existsSync(config.libelPath + path.basename(line, '.jade'))) {
                            fsSync.copySync(
                                commponsPath + '/src/main/libElements/elements/' + path.basename(line, '.jade'),
                                config.libelPath + path.basename(line, '.jade')
                            );
                        }
                    }
                }
            });
            callback();
        }
    });
}

module.exports = function (options) {
    config = options;
    return through.obj(function (file, enc, cb) {
        var self = this;
        copyJadeIncludesElements(file.history[0], '.', function (err) {
            if (err) {
                console.log(err);
            }
            self.push(file);
            cb();
        });
    })
}