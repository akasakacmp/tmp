if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(function (img) {
    img.src = img.dataset.src;
  });
  const img_srcset = document.querySelectorAll("img[data-srcset]");
  img_srcset.forEach(function (img_srcset) {
    img_srcset.srcset = img_srcset.dataset.srcset;
  });
  const sources = document.querySelectorAll("source[data-srcset]");
  sources.forEach(function (source) {
    source.srcset = source.dataset.srcset;
  });
} else {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.0/lazysizes.min.js';
  document.body.appendChild(script);
}