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

//�f�B���N�g���ݒ�
var dir = {
  src : '_src', //��Ɨp�f�B���N�g��
  dist : 'dist' //�[�i�p�f�B���N�g��
}

//scss�̐ݒ�
gulp.task('sass', function() {
  gulp.src(dir.src + '/{,**/}*.scss') //��ƑΏ�
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sass()) //css�ɕϊ�
    .pipe(autoprefixer()) //�x���_�[�v���t�B�b�N�X�t�^
    .pipe(cleanCSS()) //�R�[�h�k��
    .pipe(gulp.dest(dir.src)) //��Ɨp�f�B���N�g����css�����o��
    .pipe(gulp.dest(dir.dist)) //�[�i�p�f�B���N�g����css�����o��
    .pipe(connect.reload());  //�u���E�U�����[�h
});

//aigis�̐ݒ�
gulp.task('aigis', function() {
  return gulp.src('./aigis_config.yml') //aigis�ݒ�t�@�C���i�ǂݍ��ݑΏۂƂ������̃t�@�C���Ŏw��j
    .pipe(plumber({
      errorHandler: notify.onError('rror: <%= error.message %>')
    }))
    .pipe(aigis());
});

//js�̐ݒ�
gulp.task('minify-js', function() {
  return gulp.src(dir.src + '/{,**/}*.js') //��ƑΏ�
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(uglify()) //�R�[�h�k��
    .pipe(gulp.dest(dir.dist)); //�[�i�p�f�B���N�g����css�����o��
});

//image�̐ݒ�
gulp.task('imagemin', function() {
  var srcGlob = dir.src + '/{,**/}*.+(jpg|jpeg|png|gif|svg)'; //��Ɨp�f�B���N�g��
  var dstGlob = dir.dist; //�[�i�p�f�B���N�g��
  return gulp.src(srcGlob) //��ƑΏ�
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(changed(dstGlob)) //��Ɨp�f�B���N�g���̃t�@�C�����[�i�p�f�B���N�g���̃t�@�C�����V�������m�F
    .pipe(imagemin([ //�I�v�V�����ɍ��킹�ĉ摜���k
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
  .pipe(gulp.dest(dstGlob)); //�[�i�p�f�B���N�g����image�����o��
});

//html�t�@�C���R�s�[
gulp.task('copy', function () {
  return gulp.src(dir.src + '/{,**/}*.html') //��Ɨp�f�B���N�g��
    .pipe(gulp.dest( dir.dist )) //�[�i�p�f�B���N�g����html�����o��
    .pipe(connect.reload());  //�u���E�U�����[�h
});

//localhost:8080��L����
gulp.task('connect', function() {
  connect.server({
    root: './dist', //���[�J���T�[�o�[�����グ���̃��[�g�f�B���N�g��
    livereload: true
  });
});

//�Ď��Ώۂ�ݒ�
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