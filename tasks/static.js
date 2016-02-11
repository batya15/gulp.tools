var gulp = require('gulp'),
    watch = require('gulp-watch'),
    config = {
        src: null,
        dst: null
    };

var staticFile = function copyStatic(files, done) {
    var head = (typeof done === 'function') ? files: gulp.src(config.src);
    done = (typeof done === 'function')? done : files;
    return head
        .pipe(gulp.dest(config.dst))
        .on('end', done);
}

staticFile.configuration = function (params) {
    config.src = params.src;
    config.dst = params.dst;
};

staticFile.watch = function () {
    console.info('\x1b[33m','register watcher static files', '\x1b[0m');
    watch(config.src, {verbose: true}, staticFile);
}

staticFile.onceRun = function (param) {
    return function staticFileSetRun (cb) {
        var cache = JSON.parse(JSON.stringify(config));
        staticFile.configuration(param);
        return staticFile(function () {
            staticFile.configuration(cache);
            cb();
        });
    };
}

module.exports = staticFile;