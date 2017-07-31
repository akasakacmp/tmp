// JavaScript Document
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require("gulp-autoprefixer");
var cleanCSS = require('gulp-clean-css');
var aigis = require('gulp-aigis');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var mozjpeg  = require('imagemin-mozjpeg');
var connect = require('gulp-connect');
var plumber = require('gulp-plumber');
var notify  = require('gulp-notify');

gulp.task('sass', function() {
  gulp.src('./common/scss/*.scss')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest('./common/dist/css'));
});

gulp.task('aigis', function() {
  return gulp.src('./aigis_config.yml')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(aigis());
});

gulp.task('minify-js', function() {
  return gulp.src("./common/js/*.js")
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./common/dist/js'));
});

gulp.task('imagemin', function() {
  return gulp.src('./common/images/*')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(imagemin([
       pngquant({
         quality: '65-80',
         speed: 1,
         floyd:0
       }),
       mozjpeg({
         quality:85,
         progressive: true
       }),
       imagemin.svgo(),
       imagemin.optipng(),
       imagemin.gifsicle()
     ]
  ))
  .pipe(gulp.dest('./common/dist/images'));
});

gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true
  });
});

gulp.task('default', ['sass', 'aigis', 'minify-js', 'imagemin', 'connect'], function(){
  gulp.watch('./common/scss/*.scss', ['sass', 'aigis']);
  gulp.watch('./common/js/*.js', ['minify-js']);
  gulp.watch('./common/images/', ['imagemin']);
});