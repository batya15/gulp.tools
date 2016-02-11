var gulp = require('gulp'),
    watch = require('gulp-watch'),
    gulpif = require('gulp-if'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber');

var isWatcher = false,
    MASK = '/**/*.scss',
    config = {
        src: null,
        dst: null
    };

var scssToCSS = function compileScss(files, done) {
    var head = (typeof done === 'function') ? files: gulp.src(config.src + MASK);
    done = (typeof done === 'function')? done : files;
    return head
        .pipe(gulpif(isWatcher, plumber()))
        .pipe(sass({quiet: true, includePaths: [config.src]}))
        .pipe(gulp.dest(config.dst))
        .on('end', done);
};

scssToCSS.configuration = function (params) {
    config = {
        src: params.src,
        dst: params.dst
    };
};

scssToCSS.watch = function () {
    console.info('\x1b[33m', 'register watcher scss', '\x1b[0m');
    isWatcher = true;
    watch(config.src + MASK, {verbose: true}, scssToCSS);
};

module.exports = scssToCSS;