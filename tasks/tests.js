var shell = require('gulp-shell'),
    gulp = require('gulp'),
    watch = require('gulp-watch'),
    config = {
        src: null
    };

var tests = function testsRun(done) {
    return gulp.src(config.src)
        .pipe(shell([
            'phantomjs gulp/phantomRun.js build/client/game/test.html'
        ]))
        .on('end', done);
};

tests.configuration = function (params) {
    config.src = params.src;
    config.dst = params.dst;
};

module.exports = tests;