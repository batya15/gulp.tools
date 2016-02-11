var gulp = require('gulp'),
    spritesmith = require('gulp.spritesmith'),
    concat = require('gulp-concat'),
    config = {
        src: null,
        dstImg: null,
        variables: null
    };

var NAME_TASK = 'sprite';

function generateSprite(done, filePrefix, algorithm) {
    var img = config.dstImg,
        scss = config.variables;

    var spriteData = gulp.src(config.src + '/**/' + filePrefix + '-*.png')
        .pipe(spritesmith({
            algorithm: algorithm,
            imgName: 'sprite-' + filePrefix + '.png',
            cssName: 'sprite-' + filePrefix + '.scss',
            cssFormat: 'scss',
            cssOpts: {functions: false}
        }));

    spriteData.img.pipe(gulp.dest(img));
    return spriteData.css.pipe(gulp.dest(scss));
}


function mergeSprites() {
    return gulp.src(config.src + '/scss/sprite/**/*.scss')
        .pipe(concat('sprite.scss'))
        .pipe(gulp.dest(config.src + '/scss/'));
}

gulp.task(NAME_TASK, gulp.series(
    function spriteC(done) {return generateSprite(done, 'c', 'binary-tree')},
    function spriteD(done) {return generateSprite(done, 'd', 'diagonal')},
    function spriteX(done) {return generateSprite(done, 'x', 'top-down')},
    function spriteY(done) {return generateSprite(done, 'y', 'left-right')},
    mergeSprites
));

var spriteCompile = new String(NAME_TASK);

spriteCompile.configuration = function (params) {
    config = {
        src: params.src,
        dstImg: params.dstImg,
        variables: params.variables
    }
};

module.exports = spriteCompile;