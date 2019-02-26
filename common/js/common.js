// JavaScript Document
var winHeight = $(window).innerHeight();
var winWidth = $(window).innerWidth();
var noScroll = '.noScrl';//カンマ区切りで除外するクラスを設定

$(document).ready(function() {
  proc_scroll();
  fixed_menu();
  hamburger_menu();
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

var fixed_menu = function() {
  //headmenuをfixedするときの#pageHead高さ調整
  var menuHeight = $('#pageHead .fixed').innerHeight();
  $('#pageHead').css({height: menuHeight});
}

var hamburger_menu = function() {
  //ハンバーガーメニュー
  $('.hamburger').click(function () {
    $(this).toggleClass('active');
    $(this).next().animate({height:'toggle', opacity:'toggle'}, 'swing');
    $('body').toggleClass('overlay');
  });
}

var pop_image = function() {
  //画像拡大
  $('.popImage').click(function(){
    var href = $(this).attr('href');
    var cap = $(this).data('title');
    var popImage_no_cap = $('<div id="popImage" style="display: none;"><div class="inner"><img src="' + href + '"></div></div>');
    var popImage_cap = $('<div id="popImage" style="display: none;"><div class="inner"><img src="' + href + '"><div class="popCaption">'+ cap +'</div></div></div>')
    if (cap == undefined) {
      $('body').prepend(popImage_no_cap);
      popImage_no_cap.ready(function(){
        $(popImage_no_cap).fadeIn();
      })
    } else {
      $('body').prepend(popImage_cap);
      popImage_cap.ready(function(){
        $(popImage_cap).fadeIn();
      });
    }
    return false;
  });
  //拡大画像閉じる
  $(document).on('click','#popImage',function(){
    $('#popImage').fadeOut().queue(function(){
      $('#popImage').remove().dequeue();
    });
  });
}

var accordion = function() {
  //アコーディオン
  $('.accordion .item').removeClass('active');
  $('.accordion .title').on('click', function(){
    $(this).parent('.item').toggleClass('active');
  });
}
