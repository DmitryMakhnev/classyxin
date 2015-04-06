var gulp = require('gulp');
var karma = require('karma').server;
var gulpWebpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config');
var runSequence = require('gulp-run-sequence');
var bowerConfig = require('./bower.json');
var bump = require('gulp-bump');
var argv = require('yargs').argv;
var shell = require('gulp-shell');
var git = require('gulp-git');

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


function getBuildTasks () {
    return [
        'build.test',
        ['build.dist', 'build.bump']
    ];
}

gulp.task('build', function () {
    return runSequence.apply(this, getBuildTasks());
});


var packageVersion;
var commitMessageFromArgs;
var commitMessage;

gulp.task('git.commit', function () {
    var gitmodified = require('gulp-gitmodified');

    packageVersion = bowerConfig.version;
    commitMessage = 'v' + packageVersion + ' ';

    if (argv.m) {
        commitMessageFromArgs = argv.m;
        commitMessage += commitMessageFromArgs;
    } else {
        commitMessage += 'update';
    }

    return gulp.src([
            "./**/*",
            '!./node_modules/**/*',
            '!./bower_components/**/*'
        ])
        .pipe(gitmodified('modified'))
        .pipe(git.add())
        .pipe(git.commit(commitMessage));
});

gulp.task('git.tag', function () {
    if (commitMessageFromArgs) {
        commitMessage = commitMessageFromArgs;
    }
    return git.tag(packageVersion, commitMessage);
});

gulp.task('git.push', function () {
    return git.push('origin', 'master', {args: '--tags'});
});

function getCommitTasks () {
    var tasksList = ['git.commit'];
    if (argv.t) {
        tasksList.push('git.tag');
    }
    tasksList.push('git.push');
    return tasksList;
}

gulp.task('commit', function () {
    return runSequence.apply(this, getCommitTasks());
});

gulp.task('publish', shell.task([
    'npm publish',
    'bower register ' + bowerConfig.name + ' ' + bowerConfig.repository.url
]));

gulp.task('version', function () {
    var tasks = [].concat(getBuildTasks(), getCommitTasks(), 'publish');
    runSequence.apply(this, tasks);
});



