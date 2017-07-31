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
var changed  = require('gulp-changed');
var connect = require('gulp-connect');
var plumber = require('gulp-plumber');
var notify  = require('gulp-notify');

//ディレクトリ設定
var dir = {
  src : '_src', //作業用ディレクトリ
  dist : 'dist' //納品用ディレクトリ
}

//scssの設定
gulp.task('sass', function() {
  gulp.src(dir.src + '/{,**/}*.scss') //作業対象
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sass()) //cssに変換
    .pipe(autoprefixer()) //ベンダープレフィックス付与
    .pipe(cleanCSS()) //コード縮小
    .pipe(gulp.dest(dir.src)) //作業用ディレクトリにcss書き出し
    .pipe(gulp.dest(dir.dist)) //納品用ディレクトリにcss書き出し
    .pipe(connect.reload());  //ブラウザリロード
});

//aigisの設定
gulp.task('aigis', function() {
  return gulp.src('./aigis_config.yml') //aigis設定ファイル（読み込み対象とかここのファイルで指定）
    .pipe(plumber({
      errorHandler: notify.onError('rror: <%= error.message %>')
    }))
    .pipe(aigis());
});

//jsの設定
gulp.task('minify-js', function() {
  return gulp.src(dir.src + '/{,**/}*.js') //作業対象
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(uglify()) //コード縮小
    .pipe(gulp.dest(dir.dist)); //納品用ディレクトリにcss書き出し
});

//imageの設定
gulp.task('imagemin', function() {
  var srcGlob = dir.src + '/{,**/}*.+(jpg|jpeg|png|gif|svg)'; //作業用ディレクトリ
  var dstGlob = dir.dist; //納品用ディレクトリ
  return gulp.src(srcGlob) //作業対象
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(changed(dstGlob)) //作業用ディレクトリのファイルが納品用ディレクトリのファイルより新しいか確認
    .pipe(imagemin([ //オプションに合わせて画像圧縮
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
  .pipe(gulp.dest(dstGlob)); //納品用ディレクトリにimage書き出し
});

//htmlファイルコピー
gulp.task('copy', function () {
  return gulp.src(dir.src + '/{,**/}*.html') //作業用ディレクトリ
    .pipe(gulp.dest( dir.dist )) //納品用ディレクトリにhtml書き出し
    .pipe(connect.reload());  //ブラウザリロード
});

//localhost:8080を有効化
gulp.task('connect', function() {
  connect.server({
    root: './dist', //ローカルサーバー立ち上げ時のルートディレクトリ
    livereload: true
  });
});

//監視対象を設定
gulp.task('watch', () => {
  return gulp.src([dir.src + '/{,**/}*.scss'], function () {
    return gulp.start(['sass', 'aigis']);
  });
  return gulp.src([dir.src + '/{,**/}*.js'], function () {
    return gulp.start(['minify-js']);
  });
  return gulp.src([dir.src + '/{,**/}*.+(jpg|jpeg|png|gif|svg)'], function () {
    return gulp.start(['imagemin']);
  });
  return gulp.src([dir.src + '/{,**/}*.html'], function () {
    return gulp.start(['copy']);
  });
});

gulp.task('default', ['sass', 'aigis', 'minify-js', 'imagemin', 'copy', 'connect', 'watch'], function(){
  gulp.watch(dir.src + '/{,**/}*.scss', ['sass', 'aigis']);
  gulp.watch(dir.src + '/{,**/}*.js', ['minify-js']);
  gulp.watch(dir.src + '/{,**/}*.html', ['copy']);
  gulp.watch(dir.src + '/{,**/}*.+(jpg|jpeg|png|gif|svg)', ['imagemin']);
});