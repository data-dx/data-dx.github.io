// js/gtag.js

// Google tag (gtag.js)
(function () {
  var gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-DEKCKDRLSN';
  document.head.appendChild(gtagScript);
})();

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-DEKCKDRLSN');
