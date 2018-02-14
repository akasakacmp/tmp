var gulp = require('gulp');  //gulp大本必須
var sass = require('gulp-sass');  //sassをcssに変換
var autoprefixer = require("gulp-autoprefixer");  //cssにベンダープレフィックス付与
var cleanCSS = require('gulp-clean-css');  //css圧縮
var uglify = require('gulp-uglify');  //js圧縮
var concat = require('gulp-concat');  //ファイル結合
var imagemin = require('gulp-imagemin');  //画像圧縮
var pngquant = require('imagemin-pngquant');  //画像圧縮png用
var changed  = require('gulp-changed');  //ファイルの差を確認（画像圧縮で使用）
var connect = require('gulp-connect');  //localhost:8080でページを確認できるように
var connectSsi = require('gulp-connect-ssi');  //localhost:8080でssiが使用できるように
var plumber = require('gulp-plumber');  //エラーが出てもgulpが止まらないように
var notify  = require('gulp-notify');  //エラー内容をポップアップで知らせる

//ディレクトリ設定
var dir = {
  src : '_src', //元データ格納用
  dist : './' //納品用ディレクトリ
};
var js = {
  src : './_src/common/js/*.js', //元データ格納用
  dist : './common/js' //納品用ディレクトリ
};

//scssの設定
gulp.task('sass', function() {
  gulp.src([dir.dist + '/{,**/}*.scss', '!node_modules/**/*.scss']) //作業対象
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sass()) //cssに変換
    .pipe(autoprefixer({
      grid: true
    })) //ベンダープレフィックス付与
    .pipe(cleanCSS())  //コード縮小
    .pipe(gulp.dest(dir.dist)) //css書き出し
    .pipe(connect.reload());  //ブラウザリロード
});

//jsの設定
gulp.task('common_min_js', function() {
  gulp.src(js.src) //作業対象
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(concat('common.min.js')) //結合後のファイル名
    .pipe(uglify()) //js圧縮
    .pipe(gulp.dest(js.dist)); //納品用ディレクトリにjs書き出し
});

//imageの設定
gulp.task('imagemin_jpg_gif_svg', function() {
  var srcGlob = dir.src + '/{,**/}*.+(jpg|jpeg|gif|svg)'; //作業用ディレクトリ
  var dstGlob = dir.dist; //納品用ディレクトリ
  var imageminOptions = {
    optimizationLevel: 7
  };
  gulp.src(srcGlob) //作業対象
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(changed(dstGlob)) //作業用ディレクトリのファイルが納品用ディレクトリのファイルより新しいか確認
    .pipe(imagemin(imageminOptions)) //オプションに合わせて画像圧縮
    .pipe(gulp.dest(dstGlob)); //納品用ディレクトリにimage書き出し
});

gulp.task('imagemin_png', function() {
  var srcGlob = dir.src + '/{,**/}*.png'; //作業用ディレクトリ
  var dstGlob = dir.dist; //納品用ディレクトリ
  return gulp.src(srcGlob) //作業対象
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(changed(dstGlob)) //作業用ディレクトリのファイルが納品用ディレクトリのファイルより新しいか確認
    .pipe(imagemin([pngquant({quality: '70-95', speed: 4})])) //オプションに合わせて画像圧縮
    .pipe(gulp.dest(dstGlob)); //納品用ディレクトリにimage書き出し
});

//localhost:8080を有効化
gulp.task('connect', function() {
  connect.server({
    root: '', //ローカルサーバー立ち上げ時のルートディレクトリ
    livereload: true,
    middleware: function(){
      return [connectSsi({
        ext: '.html',
        method: 'readOnLineIfNotExist',
      })];
    }
  });
});

//監視対象を設定
gulp.task('watch', function () {
  return gulp.src([dir.dist + '/{,**/}*.scss', '!node_modules/**/*.scss'], function () {
    return gulp.start(['sass']);
  });
  return gulp.src(js.src, function () {
    return gulp.start(['common_min_js']);
  });
});

gulp.task('default', ['watch', 'sass', 'common_min_js', 'imagemin_jpg_gif_svg', 'imagemin_png', 'connect'], function(){
  gulp.watch(dir.dist + '/{,**/}*.scss', ['sass']);
  gulp.watch(js.src, ['common_min_js']);
});