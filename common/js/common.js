// JavaScript Document
var winHeight = $(window).innerHeight();
var winWidth = $(window).innerWidth();
var noScroll = '.noScrl';//カンマ区切りで除外するクラスを設定

$(document).ready(function() {
  proc_scroll();
  hamburger_menu();
  pop_image();
  accordion();
});

$(window).on('load', function() {
});

var proc_scroll = function() {
  //スムーススクロール
  $('a[href^="#"]').not(noScroll).click(function() {
    var speed = 400;
    var href = $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    $('body,html').animate({scrollTop:position}, speed, 'swing');
    return false;
  });
}

var hamburger_menu = function() {
  //ハンバーガーメニュー
  $('.hamburger').click(function () {
    $(this).toggleClass('active');
    $(this).next().animate({height:'toggle', opacity:'toggle'}, 'swing');
  });
}

var pop_image = function() {
  //画像拡大
  $('.popImage').click(function(){
    var href = $(this).attr('href');
    var cap = $(this).data('title');
    if (cap == undefined) {
      $('body').prepend('<div id="popImage"><div class="inner"><img src="' + href + '"></div></div>');
    } else {
      $('body').prepend('<div id="popImage"><div class="inner"><img src="' + href + '"><div class="popCaption">'+ cap +'</div></div></div>');
    }
    return false;
  });
  //拡大画像閉じる
  $(document).on('click','#popImage',function(){
    $('#popImage').remove();
  });
}

var accordion = function() {
  //アコーディオン
  $('.accordion .item').removeClass('active');
  $('.accordion .title').on('click', function(){
    $(this).parent('.item').toggleClass('active');
  });
}
