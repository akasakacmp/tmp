// JavaScript Document
var gulp = require('gulp');
var sass = require('gulp-sass');
var aigis = require('gulp-aigis');

gulp.task('sass', function() {
  gulp.src('./common/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./common/css'));
});

gulp.task('aigis', function() {
  return gulp.src('./aigis_config.yml')
    .pipe(aigis());
});

gulp.task('watch', function() {
  gulp.watch('./common/scss/*.scss', ['sass']);
});

gulp.task('default', ['sass']);