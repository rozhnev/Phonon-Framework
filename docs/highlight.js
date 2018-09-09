var codes = document.querySelectorAll('pre code');

function addButton(id) {
  var btn = document.createElement('button');
  btn.classList.add('btn');
  btn.classList.add('btn-sm');
  btn.classList.add('btn-secondary');
  btn.classList.add('float-right');

  btn.setAttribute('id', id);

  btn.style.width = '60px';

  btn.innerHTML = 'Copy';

  return btn;
}

function setPosition(btn) {
  var rect = btn.getBoundingClientRect();
  var el = btn;

  el.style.marginLeft = '-' + rect.width + 'px';
}

function setListener(btnId, code) {
  new ClipboardJS(btnId, {
    target: function(trigger) {
      return code;
    }
  });

  document.querySelector(btnId).addEventListener('click', function (event) {
    var text = event.target.innerHTML;
    event.target.innerHTML = 'Copied';
    setTimeout(function () {
      event.target.innerHTML = text;
    }, 1000);
  });
}

if (codes) {
  codes.forEach(function (code) {
    hljs.highlightBlock(code);

    var btnId = Math.random().toString(36).substring(0, 20).replace(/[0-9.]/g, '');
    var page = code.parentNode.parentNode;

    page.insertBefore(addButton(btnId), code.parentNode.previousSibling);
    setPosition(document.querySelector('#' + btnId));
    setListener('#' + btnId, code);
  });
}
