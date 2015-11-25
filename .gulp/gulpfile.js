var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    stylish = require('gulp-jscs-stylish'),
    csslint = require('gulp-csslint'),
    path = require('path'),
    shell = require('gulp-shell');

var srcs = {
    jslint: [
        '!./../.meteor/**/*.js',
        '!./../packages/**/*.js',
        '!./../**/node_modules',
        '!./../public/*.js',
        '!./../public/**/*.js',
        './../*.js',
        './../**/*.js'
    ],
    csslint: [
        '!./../.meteor/**/*.css',
        '!./../packages/**/*.css',
        '!./../**/node_modules',
        '!./../public/*.css',
        '!./../public/**/*.css',
        './../*.css',
        './../**/*.css'
    ],
    contracts: [
        './../contracts/**/*.sol',
        './../contracts/**/*.se'
    ]
};

gulp.task('jslint', function () {
    return watch(srcs.jslint, function () {
        gulp.src(srcs.jslint)
            .pipe(plumber())
            .pipe(jshint('.jshintrc'))
            .pipe(jscs('.jscsrc'))
            .pipe(stylish.combineWithHintResults())
            .pipe(jshint.reporter('jshint-stylish'));
    });
});

gulp.task('csslint', function () {
    return watch(srcs.csslint, function () {
        gulp.src(srcs.csslint)
            .pipe(csslint('.csslintrc'))
            .pipe(csslint.reporter('jshint-stylish'));
    });
});

gulp.task('contracts', function () {
    return watch(srcs.contracts, function () {
        gulp.src(srcs.contracts, {read: false})
            .pipe(shell([
                'embark deploy'
            ], {
                cwd: path.resolve(process.cwd(), '..')
            }))
    })
});

gulp.task('default', ['jslint', 'csslint', 'contracts']);