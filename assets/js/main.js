/* phi docs — progressive enhancement. Safe to disable: content stays readable. */
(function () {
  'use strict';

  var docEl = document.documentElement;

  // ---------------------------------------------------------------- theme
  var themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = docEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      docEl.setAttribute('data-theme', next);
      try { localStorage.setItem('phi-theme', next); } catch (e) { /* noop */ }
    });
  }

  // ------------------------------------------------------ install tabs (home)
  var tabs = document.querySelectorAll('.install-tab');
  if (tabs.length) {
    tabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var key = btn.getAttribute('data-tab');
        document.querySelectorAll('.install-panel .term').forEach(function (term) {
          term.hidden = term.getAttribute('data-term') !== key;
        });
      });
    });
  }

  // ------------------------------------------------------- mobile sidebar
  var navToggle = document.querySelector('.nav-toggle');
  var sidebar = document.getElementById('sidebar');
  var scrim = document.querySelector('.scrim');

  function closeNav() {
    document.body.classList.remove('nav-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && sidebar) {
    navToggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    if (scrim) scrim.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
    sidebar.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
  }

  // ------------------------------------------------- heading anchors
  var article = document.querySelector('.doc-article');
  if (article) {
    article.querySelectorAll('h2, h3, h4').forEach(function (h) {
      if (!h.id) return;
      var a = document.createElement('a');
      a.className = 'anchor';
      a.href = '#' + h.id;
      a.textContent = '#';
      a.setAttribute('aria-label', 'Link to ' + h.textContent.trim());
      h.appendChild(a);
    });
  }

  // -------------------------------------------------- table scroll wrap
  document.querySelectorAll('.doc-article table').forEach(function (t) {
    var wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    t.parentNode.insertBefore(wrap, t);
    wrap.appendChild(t);
  });

  // --------------------------------------------------- code block chrome
  function langOf(block) {
    var wrapper = block.closest('.highlighter-rouge') || block.parentElement;
    var m = (wrapper.className || '').match(/language-([\w+-]+)/);
    return m ? m[1] : 'text';
  }

  document.querySelectorAll('.doc-article pre, .hero pre').forEach(function (pre) {
    var code = pre.querySelector('code');
    if (!code) return;

    var head = document.createElement('div');
    head.className = 'code-head';

    var lang = document.createElement('span');
    lang.className = 'code-lang';
    lang.textContent = langOf(pre);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');

    btn.addEventListener('click', function () {
      var text = code.innerText;
      function done() {
        btn.textContent = 'Copied';
        btn.setAttribute('data-copied', '');
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.removeAttribute('data-copied');
        }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallback(text); });
      } else {
        fallback(text);
      }
      function fallback(txt) {
        var ta = document.createElement('textarea');
        ta.value = txt;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { /* noop */ }
        document.body.removeChild(ta);
      }
    });

    head.appendChild(lang);
    head.appendChild(btn);
    pre.parentNode.insertBefore(head, pre);
  });

  // -------------------------------------------------------- TOC + scrollspy
  var toc = document.getElementById('toc');
  if (toc && article) {
    var headings = Array.prototype.slice.call(
      article.querySelectorAll('h2, h3')
    ).filter(function (h) { return h.id; });

    if (headings.length < 2) {
      var shell = toc.closest('.docs-shell');
      if (shell) shell.classList.add('no-toc');
    }

    if (headings.length > 1) {
      var title = document.createElement('p');
      title.className = 'toc-title';
      title.textContent = 'On this page';
      var list = document.createElement('ul');
      toc.appendChild(title);
      toc.appendChild(list);

      var links = [];
      headings.forEach(function (h) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent.trim();
        if (h.tagName === 'H3') a.className = 'toc-h3';
        li.appendChild(a);
        list.appendChild(li);
        links.push(a);
      });

      function setActive(id) {
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      }

      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) setActive(en.target.id);
          });
        }, { rootMargin: '-80px 0px -70% 0px' });
        headings.forEach(function (h) { io.observe(h); });
      }

      toc.addEventListener('click', function (e) {
        var a = e.target.closest('a');
        if (a && a.getAttribute('href').charAt(0) === '#') {
          var id = a.getAttribute('href').slice(1);
          var target = document.getElementById(id);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }
})();
