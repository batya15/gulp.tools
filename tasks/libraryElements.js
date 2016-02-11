var gulp = require('gulp'),
    watch = require('gulp-watch'),
    fs = require('fs'),
    el_commons = require('../util/commonsPath') + '/src/main/libElements/el-commons/**/*',
    config = {
        dst: null
    };

var libraryElements = function commons(files, done) {
    done = (typeof done === 'function')? done : files;
    return gulp.src(el_commons)
        .pipe(gulp.dest(config.dst))
        .on('end', done);
}

libraryElements.configuration = function (params) {
    config.dst = params.dst;
};

libraryElements.watch = function () {
    if (process.argv.indexOf('-wLibElements') + 1) {
        console.info('\x1b[34m','-wLibElements skip watcher', '\x1b[0m');
    } else {
        console.info('\x1b[33m','register watcher library commons elements  (skip watcher: run with params -wLibElements)', '\x1b[0m');
        watch(el_commons, {verbose: true}, libraryElements);
    }

}

module.exports = libraryElements;