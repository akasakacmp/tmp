var winHeight=$(window).innerHeight(),winWidth=$(window).innerWidth(),noScroll=".noScrl";$(function(){$('a[href^="#"]').not(noScroll).click(function(){var n=$(this).attr("href"),i=$("#"==n||""==n?"html":n).offset().top;return $("body,html").animate({scrollTop:i},400,"swing"),!1}),$(".hamburger").click(function(){$(this).next().fadeToggle("500","swing")})});