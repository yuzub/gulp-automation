// not Gulp plugins
var gulp = require('gulp');
var args = require('yargs').argv;
var del = require('del');
// Gulp plugins
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var util = require('gulp-util');
var gulpprint = require('gulp-print').default;
var gulpif = require('gulp-if');

var config = require('./gulp.config')();

var $ = require('gulp-load-plugins')({lazy: true});

gulp.task('hello-world', function() {
  console.log('First gulp task!');
});


// gulp vet
// gulp vet --verbose
gulp.task('vet', function() {
  log('Analyzing sorce with JSHint and JSCS');

    return gulp
      .src(config.alljs)
      .pipe($.if(args.verbose, $.print.default()))
      .pipe($.jscs())
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
      .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', ['clean-styles'], function() {
  log('Compiling LESS --> CSS');

  return gulp
    .src(config.less)
    .pipe($.less())
    .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', function(done) { 
    // there's no stream in here so it's not really getting the screen back, so use the callback function
    // done - is a callback function
  var files = config.temp + '**/*.css';
  clean(files, done);
});

gulp.task('less-watcher', function() {
  gulp.watch([config.less], ['styles']);
});

//////////////////////

function clean(path, done) {
  log('Cleaning: ' + $.util.colors.blue(path));
  del(path, done);
}

function log(msg) {
  if (typeof(msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.blue(msg));
  }
}