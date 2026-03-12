(function () {
  'use strict';

  function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

  function setYear(){
    var el = document.getElementById('siteYear');
    if(el) el.textContent = new Date().getFullYear();
  }

  function setIframeSrc(src){
    var iframe = document.getElementById('contentFrame');
    if(!iframe || !src) return;
    iframe.src = src;
  }

  function closeOffcanvasIfOpen(){
    try{
      var offEl = document.getElementById('navOffcanvas');
      if(offEl && window.bootstrap && bootstrap.Offcanvas){
        var inst = bootstrap.Offcanvas.getInstance(offEl);
        if(inst) inst.hide();
      }
    }catch(e){}
  }

function setFocus(on){
  var btn = document.getElementById('btnFocus');

  if (on)
    document.body.classList.add('ir-focus');
  else
    document.body.classList.remove('ir-focus');

  if (btn) {
    if (document.body.classList.contains('ir-focus')) {
      btn.textContent = '離開專注閱讀（顯示介紹）';
    } else {
      btn.textContent = '專注閱讀（放大內容）';
    }
  }
}


  function bindFocusButton(){
    var btn = document.getElementById('btnFocus');
    if(!btn) return;
    btn.addEventListener('click', function(){
      setFocus(!document.body.classList.contains('ir-focus'));
    });
  }

  function shouldAutoFocus(src){
    // 你提到 Download/基本操作/範例特別需要大一點，就自動進入專注模式
    if(!src) return false;
    return (
      src.indexOf('download.html') >= 0 ||
      src.indexOf('use/') === 0 ||
      src.indexOf('sample/') === 0
    );
  }

  function bindNav(){
    $all('[data-iframe-src]').forEach(function(a){
      a.addEventListener('click', function(ev){
        var src = a.getAttribute('data-iframe-src');
        if(!src) return;

        ev.preventDefault();
        setIframeSrc(src);

        try{ location.hash = encodeURIComponent(src); }catch(e){}
        closeOffcanvasIfOpen();

        // ✅ 自動專注閱讀：Download / use / sample
        setFocus(false);

        // ✅ 滾到內容區（避免覺得沒反應）
        try{
          var area = document.getElementById('contentArea');
          if(area) area.scrollIntoView({ behavior:'smooth', block:'start' });
        }catch(e){}
      });
    });
  }

function initFromHash(){
  try{
    if(location.hash && location.hash.length > 1){
      var src = decodeURIComponent(location.hash.substring(1));
      if(src){
        setIframeSrc(src);
        setFocus(false); // ✅ 這裡也固定 false
      }
    }
  }catch(e){}
}


document.addEventListener('DOMContentLoaded', function(){
  setFocus(false);   // ✅ 強制預設不專注（先關掉再說）
  setYear();
  initFromHash();
  bindNav();
  bindFocusButton();
});

})();

(function(){
  document.addEventListener('DOMContentLoaded', function () {
    // 在 iframe 裡就不要顯示
    if (window.top !== window.self) return;

    var body = document.body;
    if (!body || !body.classList.contains('ir-page')) return;

    // 找第一個 h1，插在它後面
    var h1 = body.querySelector('h1');
    if (!h1) return;

    var note = document.createElement('div');
    note.className = 'ir-outside-note';
    note.innerHTML =
      '本頁為 InfoRec 說明文件的一部分。' +
      '<a href="/index.html">回 InfoRec 首頁</a>';

    h1.insertAdjacentElement('afterend', note);
  });
})();




