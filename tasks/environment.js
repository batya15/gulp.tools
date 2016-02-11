var gulp = require('gulp'),
    wrap = require('gulp-wrap-amd'),
    rename = require('gulp-rename'),
    config = {
      src: null,
      dst: null
    };

var environmentTask = function environment_configuration (done) {
    if (config.src && config.dst) {
        return gulp.src(config.src)
            .pipe(wrap())
            .pipe(rename({extname: ".js"}))
            .pipe(gulp.dest(config.dst))
            .on('end', function () {
                if (typeof done === 'function') {
                    done();
                }
            });
    } else {
        done();
    }

};

environmentTask.configuration = function (params) {
    config = {
        src: params.src,
        dst: params.dst
    };
};

module.exports = environmentTask;