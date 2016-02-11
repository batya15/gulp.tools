var gulp = require('gulp'),
    watch = require('gulp-watch'),
    manifest = require('gulp-manifest'),
    config = {
        src: null,
        dst: null,
        manifestFileName: null
    };

var generationManifest = function manifestBuild(files, done) {
    done = (typeof done === 'function')? done : files;
    return gulp.src(config.src, {base: config.dst})
        .pipe(manifest({
            hash: true,
            preferOnline: true,
            timestamp: true,
            network: ['http://*', 'https://*', '*'],
            filename: config.manifestFileName,
            exclude: [config.manifestFileName, "*.gz"]
        }))
        .pipe(gulp.dest(config.dst))
        .on('end', done);
};

generationManifest.configuration = function (params) {
    config.src = params.src;
    config.dst = params.dst;
    config.manifestFileName = params.manifestFileName;
};

generationManifest.watch = function () {
    if (process.argv.indexOf('-wManifest') + 1) {
        console.info('\x1b[34m','-wManifest skip watcher', '\x1b[0m');
    } else {
        console.info('\x1b[33m','register watcher manifest (skip watcher: run with params -wManifest)', '\x1b[0m');
        watch(config.src, {verbose: true}, generationManifest);
    }
};

module.exports = generationManifest;