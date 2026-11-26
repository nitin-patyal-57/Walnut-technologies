(function () {
  var p = location.pathname;
  if (p !== '/' && p !== '/index.html' && p !== '') return;
  var l = document.createElement('link');
  l.rel = 'preload';
  l.as = 'image';
  l.type = 'image/avif';
  l.setAttribute('imagesizes', '100vw');
  l.setAttribute('imagesrcset', '/images/backgrounds/home-background-96.avif?v=6 96w, /images/backgrounds/home-background-160.avif?v=6 160w, /images/backgrounds/home-background-320.avif?v=6 320w, /images/backgrounds/home-background-480.avif?v=6 480w, /images/backgrounds/home-background-768.avif?v=6 768w, /images/backgrounds/home-background-1280.avif?v=6 1280w');
  document.head.appendChild(l);
})();
