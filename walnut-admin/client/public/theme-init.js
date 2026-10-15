// Applies the saved theme before first paint (external file so CSP can stay strict).
(function () {
  try {
    var saved = localStorage.getItem('wa-theme');
    var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) { /* storage blocked: fall back to light */ }
})();
