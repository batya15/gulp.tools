var gulp = require('gulp'),
    install = require('gulp-install'),
    mainBowerFiles = require('main-bower-files'),
    gulpFilter = require('gulp-filter'),
    async = require('async'),
    config = {
        bowerFile: null,
        bower_components: null,
        vendorPath: null
    };

var NAME_TASK = 'dependency';

function dependency_load(done) {
    return gulp.src(config.bowerFile)
        .pipe(gulp.dest(config.bower_components))
        .pipe(install())
}

function mainFiles(done) {
    var filterJS = gulpFilter('*.js', {restore: true}),
        filterCss = gulpFilter('*.css', {restore: true}),
        filterFont = gulpFilter(['*.eot', '*.svg', '*.ttf', '*.woff', '*.woff2'], {restore: true});

    return gulp
        .src(mainBowerFiles({paths: config.bower_components}))
        .pipe(filterJS)
        .pipe(gulp.dest(config.vendorPath + '/js'))
        .pipe(filterJS.restore)
        .pipe(filterCss)
        .pipe(gulp.dest(config.vendorPath + '/styles'))
        .pipe(filterCss.restore)
        .pipe(filterFont)
        .pipe(gulp.dest(config.vendorPath + '/fonts'))
        .pipe(filterFont.restore)
        .on('end', done);
}


gulp.task(NAME_TASK, gulp.series(dependency_load, mainFiles));

var dependencyInstall = new String(NAME_TASK);

dependencyInstall.configuration = function (params) {
    config = {
        bowerFile: params.bowerFile,
        bower_components: params.bower_components,
        vendorPath: params.vendorPath
    }
};

module.exports = dependencyInstall