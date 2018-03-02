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

var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');

var browserSync = require('browser-sync').create(); // create a browser sync server

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

gulp.task('sass-styles', function() {
  return gulp.src('src/client/styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.stream());
});

gulp.task('less-styles', ['clean-styles'], function() {
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
  gulp.watch([config.less], ['less-styles']);
});

gulp.task('images', function() {
  return gulp.src('src/client/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('copy', function() {
  return gulp.src('src/client/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task('sass-watcher', ['browserSync', 'sass-styles'], function() {
  gulp.watch('src/client/styles/**/*.scss', ['sass-styles']);
  gulp.watch('src/client/*.html', ['copy']);
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