// JavaScript Document
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require("gulp-autoprefixer");
var cleanCSS = require('gulp-clean-css');
var aigis = require('gulp-aigis');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');

gulp.task('sass', function() {
  gulp.src('./common/scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest('./common/dist/css'));
});

gulp.task('aigis', function() {
  return gulp.src('./aigis_config.yml')
    .pipe(aigis());
});

gulp.task('minify-js', function() {
  return gulp.src("./common/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest('./common/dist/js'));
});

gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true
  });
});

gulp.task('default', ['sass', 'aigis', 'minify-js', 'connect'], function(){
  gulp.watch('./common/scss/*.scss', ['sass', 'aigis']);
  gulp.watch('./common/js/*.js', ['minify-js']);
});