// JavaScript Document
var winHeight = $(window).innerHeight();
var winWidth = $(window).innerWidth();
var noScroll = '.noScrl';//カンマ区切りで除外するクラスを設定

$(function(){
	
  //スムーススクロール
  $('a[href^="#"]').not(noScroll).click(function() {
    var speed = 400;
    var href = $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    $('body,html').animate({scrollTop:position}, speed, 'swing');
    return false;
  });
  
  //ハンバーガーメニュー
  $('.hamburger').click(function(){
    $(this).next().fadeToggle("500", "swing");
  });
  
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
  
});
