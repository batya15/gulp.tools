var gulp = require('gulp'),
    watch = require('gulp-watch'),
    jade = require('gulp-jade'),
    wrap = require('gulp-wrap-amd'),
    gulpif = require('gulp-if'),
    through = require('through2'),
    async = require('async'),
    fs = require('fs'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    copyLibraryElements = require('../util/copyLibraryElements'),
    path = require('path');

var isWatcher = false,
    config = {
        src: null,
        dst: null,
        libelPath: null
    };

function scanJadeIncludes(jadeFileName, basePath, callback) {
    fs.readFile(jadeFileName, {"encoding": "utf-8"}, function (err, data) {
        if (err) {
            callback(err);
        } else {
            var res = [];
            var tasks = [];
            data = data.split("\n");
            data.forEach(function (line) {
                line = line.trim().split(/\s+/);
                if (line[0] === 'include') {
                    line = line[1];
                    if (line.indexOf('.jade') === -1) {
                        line += '.jade';
                    }
                    var fn = path.join(basePath, line);
                    res.push(fn);
                    line = path.join(path.dirname(jadeFileName), line);
                    tasks.push(function (cb) {
                        scanJadeIncludes(line, path.dirname(fn), cb);
                    });
                }
            });
            async.parallel(tasks, function (error, cbres) {
                if (error) {
                    console.log(error);
                }
                if (cbres && cbres.length) {
                    cbres.forEach(function (r) {
                        if (r && r.length) {
                            r.forEach(function (e) {
                                if (e && e.length) {
                                    res.push(e);
                                }
                            });
                        }
                    });
                }
                callback(error, res);
            });
        }
    });
}


var jadeToJadeCompile = function jadeToJs(files, done) {
    done = (typeof done === 'function') ? done : files;
    return gulp.src(config.src)
        .pipe(gulpif(isWatcher, plumber()))
        .pipe(copyLibraryElements(config))
        .pipe(jade({client: true, pretty: true}))
        .pipe(wrap({deps: ['lib/runtime', '{cssIncludePlaceholder}'], params: ['jade']}))
        .pipe(through.obj(function (file, enc, cb) {
            var fn = file.history[0];
            fn = fn.split(path.sep);
            fn = fn[fn.length - 1];
            var css = fn.split('.');
            css[css.length - 1] = 'css';
            css = css.join('.');
            var cssArr = [css];
            var self = this;
            var dirname = path.dirname(file.history[0]);
            scanJadeIncludes(file.history[0], '.', function (err, res) {
                if (err) {
                    console.log(err);
                }
                if (res && res.length) {
                    res.forEach(function (fn) {
                        cssArr.push(fn.replace(/\.jade$/, '.css').replace(/\\/g, '/'));
                    });
                }
                cssArr.forEach(function (val, i) {
                    var fnCss = dirname + '/' + val
                    var cssExists = fs.existsSync(fnCss)
                        || fs.existsSync(fnCss.replace(/.css$/, '.scss'));
                    if (!cssExists) {
                        cssArr.splice(i, 1)
                    }
                });
                file.contents = new Buffer(String(file.contents)
                    .replace("{cssIncludePlaceholder}", cssArr.length ? 'css!./' + cssArr.join('","css!') : "")
                );
                self.push(file);
                cb();
            });
        }))
        .pipe(rename({extname: ".jade.js"}))
        .pipe(gulp.dest(config.dst))
        .on('end', done);
};

jadeToJadeCompile.configuration = function (params) {
    config = {
        src: params.src,
        dst: params.dst,
        libelPath: params.libelPath
    };
};

jadeToJadeCompile.watch = function () {
    console.info('\x1b[33m', 'register watcher jadeToJS', '\x1b[0m');
    isWatcher = true;
    watch(config.src, {verbose: true}, function (files, done) {
        var d = Date.now();
        console.log('\x1b[32m', 'Start jadeToJS', '\x1b[0m');
        jadeToJadeCompile(function () {
            console.log('\x1b[32m', 'Finish jadeToJS', Date.now() - d + ' ms', '\x1b[0m');
            done();
        });
    });
};

module.exports = jadeToJadeCompile;