// JavaScript Document
var gulp = require('gulp');  //gulp大本必須
var sass = require('gulp-sass');  //sassをcssに変換
var autoprefixer = require("gulp-autoprefixer");  //cssにベンダープレフィックス付与
var imagemin = require('gulp-imagemin');  //画像圧縮
var pngquant = require('imagemin-pngquant');  //画像圧縮png用
var mozjpeg  = require('imagemin-mozjpeg');  //画像圧縮jpg用
var changed  = require('gulp-changed');  //ファイルの差を確認（画像圧縮で使用）
var connect = require('gulp-connect');  //localhost:8080でページを確認できるように
var plumber = require('gulp-plumber');  //エラーが出てもgulpが止まらないように
var notify  = require('gulp-notify');  //エラー内容をポップアップで知らせる

//ディレクトリ設定
var dir = {
  src : '_src', //元画像格納用
  dist : './' //納品用ディレクトリ
}

//scssの設定
gulp.task('sass', function() {
  gulp.src([dir.dist + '/{,**/}*.scss', '!node_modules/**/*.scss']) //作業対象
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sass()) //cssに変換
    .pipe(autoprefixer()) //ベンダープレフィックス付与
    .pipe(gulp.dest(dir.dist)) //css書き出し
    .pipe(connect.reload());  //ブラウザリロード
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

//localhost:8080を有効化
gulp.task('connect', function() {
  connect.server({
    root: '', //ローカルサーバー立ち上げ時のルートディレクトリ
    livereload: true
  });
});

//監視対象を設定
gulp.task('watch', function () {
  return gulp.src([dir.dist + '/{,**/}*.scss', '!node_modules/**/*.scss'], function () {
    return gulp.start(['sass']);
  });
});

gulp.task('default', ['watch', 'sass', 'imagemin', 'connect'], function(){
  gulp.watch(dir.dist + '/{,**/}*.scss', ['sass']);
});
