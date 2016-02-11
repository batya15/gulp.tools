var gulp = require('gulp'),
    watch = require('gulp-watch'),
    jade = require('gulp-jade'),
    gulpif = require('gulp-if'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    copyLibraryElements = require('../util/copyLibraryElements'),
    path = require('path');

var isWatcher = false,
    config = {
        src: null,
        dst: null,
        libelPath: null,
        locals: {}
    };

var jadeToHTMLCompile = function jadeToHTML(files, done) {
    done = (typeof done === 'function') ? done : files;
    return gulp.src(config.src)
        .pipe(gulpif(isWatcher, plumber()))
        .pipe(copyLibraryElements(config))
        .pipe(jade({client: false, pretty: true, locals: config.locals}))
        .pipe(rename({extname: ''}))
        .pipe(gulp.dest(config.dst))
        .on('end', done);
};

jadeToHTMLCompile.configuration = function (params) {
    config = {
        src: params.src,
        dst: params.dst,
        libelPath: params.libelPath,
        locals: params.locals || {}
    };
};

jadeToHTMLCompile.watch = function () {
    console.info('\x1b[33m', 'register watcher jadeToHTML', '\x1b[0m');
    isWatcher = true;
    watch(config.src, {verbose: true}, function (files, done) {
        var d = Date.now();
        console.log('\x1b[32m', 'Start jadeToHTML', '\x1b[0m');
        jadeToHTMLCompile(function () {
            console.log('\x1b[32m', 'Finish jadeToHTML', Date.now() - d + ' ms', '\x1b[0m');
            done();
        });
    });
};

module.exports = jadeToHTMLCompile;