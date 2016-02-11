var gulp = require('gulp'),
    watch = require('gulp-watch'),
    stylish = require('jshint-stylish'),
    jshint = require('gulp-jshint'),
    config = {
        src: null
    };

var codestyle = function codestyleCheck(files, done) {
    var head = (typeof done === 'function') ? files: gulp.src(config.src);
    done = (typeof done === 'function')? done : files;
    return head
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .on('error', function (error) {
            console.error(String(error));
        })
        .on('end', done);
}

codestyle.configuration = function (params) {
    config.src = params.src;
};

codestyle.watch = function () {
    console.info('\x1b[33m','register watcher codestyle', '\x1b[0m');
    watch(config.src, {verbose: true}, codestyle);
}

module.exports = codestyle;