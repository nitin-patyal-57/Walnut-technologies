(function () {
  var p = location.pathname;
  if (p !== '/' && p !== '/index.html' && p !== '') return;
  var l = document.createElement('link');
  l.rel = 'preload';
  l.as = 'image';
  l.type = 'image/avif';
  l.setAttribute('imagesizes', '100vw');
  l.setAttribute('imagesrcset', '/home-background-480.avif 480w, /home-background-768.avif 768w, /home-background-1280.avif 1280w');
  document.head.appendChild(l);
})();
