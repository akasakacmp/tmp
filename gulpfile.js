// JavaScript Document
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require("gulp-autoprefixer");
var aigis = require('gulp-aigis');
var connect = require('gulp-connect');

gulp.task('sass', function() {
  gulp.src('./common/scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./common/css'));
});

gulp.task('aigis', function() {
  return gulp.src('./aigis_config.yml')
    .pipe(aigis());
});

gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true
  });
});

gulp.task('default', ['sass', 'aigis', 'connect'], function(){
  gulp.watch('./common/scss/*.scss', ['sass', 'aigis']);
});