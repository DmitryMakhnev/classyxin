var gulp = require('gulp');
var karma = require('karma').server;
var gulpWebpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config');
var runSequence = require('gulp-run-sequence');
var bowerConfig = require('./bower.json');
var bump = require('gulp-bump');
var argv = require('yargs').argv;

var bumpConfig;
function createBumpConfig (type) {
    bumpConfig = {type: type};
}

if (argv.v) {
    switch (argv.v) {
        case 'major':
        case 'minor':
            createBumpConfig(argv.v);
            break;
    }
}


gulp.task('build', function (callback) {
    runSequence(
        'build.test',
        ['build.dist', 'build.bump']
    );
});

/**
 * Run test once and exit
 */
gulp.task('build.test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});


gulp.task('build.dist', function () {

    return gulp.src(bowerConfig.main)
        .pipe(gulpWebpack(webpackConfig))
        .pipe(gulp.dest(bowerConfig.dist));
});

gulp.task('build.bump', function () {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(bump(bumpConfig))
        .pipe(gulp.dest('./'));
});


