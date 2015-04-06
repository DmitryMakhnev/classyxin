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
var isVersionTask = false;

gulp.task('version.read', function (cb) {
    var fs = require('fs');
    fs.readFile('./bower.json', function (error, data) {
        if (error) {
            return cb(error);
        }
        packageVersion = JSON.parse(data.toString()).version;

        cb();
    });
});

gulp.task('git.commit', function () {
    var gitmodified = require('gulp-gitmodified');

    commitMessage = 'v' + packageVersion + ' ';

    if (argv.m) {
        commitMessageFromArgs = argv.m;
        commitMessage += commitMessageFromArgs;
    } else if (isVersionTask) {
        commitMessage += 'version';
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

function getGitTasks () {
    var tasksList = [
        'version.read', 
        'git.commit'
    ];
    
    if (argv.t || isVersionTask) {
        tasksList.push('git.tag');
    }
    tasksList.push('git.push');
    return tasksList;
}

gulp.task('commit', function () {
    return runSequence.apply(this, getGitTasks());
});

gulp.task('publish', shell.task([
    'npm publish'
]));

gulp.task('version', function () {
    isVersionTask = true;
    var tasks = [].concat(getBuildTasks(), getGitTasks(), 'publish');
    runSequence.apply(this, tasks);
});



