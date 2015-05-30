var container = document.createElement('div');
container.setAttribute('style', 'display:block;position:fixed;top:10px;left:'+(window.innerWidth-(192+10))+'px;z-index:2147483647;padding:5px;border:1px solid rgba(0,0,0,0.3);background-color:#eee;box-shadow:0 0 10px rgba(0,0,0,0.7);opacity:0;transition:opacity 0.5s ease');

container.addEventListener('transitionend', function(){
  if (container.style.opacity == 0) {
    if (container.parentNode != null) {
      container.parentNode.removeChild(container);
    }
  }
});

var element_contents = document.createElement('div');
element_contents.setAttribute('style', 'display:block;width:180px;height:180px;margin:0;padding:0;border:0;background-color:#fff');
container.appendChild(element_contents);

var element_a = document.createElement('a');
element_a.setAttribute('style', 'display:none;width:100%;height:100%;margin:0;padding:0;border:0');
element_a.target = '_new';
element_contents.appendChild(element_a);

var element_loading = document.createElement('div');
element_loading.setAttribute('style', 'display:none;width:auto;height:auto;margin:0;padding:70px;border:0;background-color:#eee');
element_loading.innerHTML = '<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>';
element_contents.appendChild(element_loading);

var element_p = document.createElement('p');
element_p.setAttribute('style', 'display:block;width:180px;height:auto;margin:3px 0 0 0;padding:0;border:0;background-color:#eee;color:#333;font-family:sans-serif;font-size:12px;font-style:normal;font-weight:normal;line-height:normal;text-align:center');
container.appendChild(element_p);

var timeout_id = null;
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(){
  if (xhr.readyState == 4) {
    if (xhr.status == 200) {
      var dom = new DOMParser().parseFromString(xhr.responseText, 'text/html');
      var res = dom.evaluate('//script', dom, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      for (var i=0; i<res.snapshotLength; i++) {
        if (res.snapshotItem(i).textContent.substr(12, 9) == 'var data=') {
          var arr = [];
          var str = res.snapshotItem(i).textContent;
          var regex = /"(data:image.+)"/g;
          while (match = regex.exec(str)) {
            arr.push('<img src="' + match[1].replace(/\\u003d/g, '=') + '" style="display:inline;width:90px;height:90px;margin:0;padding:0;border:0;vertical-align:bottom">');
            if (arr.length >= 4) break;
          }
          element_a.innerHTML = arr.join('');
          break;
        }
      }
    }

    element_loading.style.display = 'none';
    element_a.style.display       = 'block';

    timeout_id = setTimeout(function(){
      container.style.opacity = 0;
    }, 5000);
  }
};

var search_word = null;
document.addEventListener('mouseup', function(){
  if (window.getSelection().toString() == search_word) return;
  search_word = window.getSelection().toString();
  if (search_word) {
    clearTimeout(timeout_id);

    var search_url = 'https://www.google.com/search?q='+search_word+'&tbm=isch';
    element_p.innerText = search_word;
    element_a.href      = search_url;
    element_a.innerHTML = '';

    element_a.style.display       = 'none';
    element_loading.style.display = 'block';

    if (container.parentNode == null) {
      document.body.appendChild(container);
      container.style.opacity = 1;
    }

    xhr.open('GET', search_url);
    xhr.send();
  }
});
