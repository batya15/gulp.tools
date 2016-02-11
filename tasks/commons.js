var gulp = require('gulp'),
    watch = require('gulp-watch'),
    fs = require('fs'),
    commonsMask = require('../util/commonsPath') + '/src/main/client/**/*',
    config = {
        dst: null
    };

var copyCommonComponents = function commons(files, done) {
    done = (typeof done === 'function')? done : files;
    return gulp.src(commonsMask)
        .pipe(gulp.dest(config.dst))
        .on('end', done);
}

copyCommonComponents.configuration = function (params) {
    config.dst = params.dst;
};

copyCommonComponents.watch = function () {
    console.info('\x1b[33m', 'register watcher commons file', '\x1b[0m');
    watch(commonsMask, {verbose: true}, copyCommonComponents);
};

module.exports = copyCommonComponents;