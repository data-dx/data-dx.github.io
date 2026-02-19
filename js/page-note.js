(function(){
  document.addEventListener('DOMContentLoaded', function () {
    // iframe 內不插提示
    if (window.top !== window.self) return;

    var body = document.body;
    if (!body || !body.classList.contains('ir-page')) return;

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
