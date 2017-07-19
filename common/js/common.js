// JavaScript Document
var winHeight = $(window).innerHeight();
var winWidth = $(window).innerWidth();
var noScroll = '.noScrl';//カンマ区切りで除外するクラスを設定

$(function(){
	
  //スムーススクロール
  $('a[href^="#"]').not(noScroll).click(function() {
    var speed = 400;
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    $('body,html').animate({scrollTop:position}, speed, 'swing');
    return false;
  });
  
  //ハンバーガーメニュー
  $('.hamburger').click(function(){
    $(this).next().fadeToggle("500", "swing");
  });
  
});
