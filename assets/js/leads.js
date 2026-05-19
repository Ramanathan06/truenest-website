/* TrueNest — progressive lead capture for the static site.
 *
 * Enhances any <form data-lead-form> to POST to the deployed leads API.
 * Falls back to a thank-you-only message when the endpoint is not yet
 * configured (see leads-config.js), so the site never breaks pre-deploy.
 *
 * Per-form data attributes:
 *   data-lead-form              mark the form for enhancement
 *   data-lead-source="inquire"  where the lead came from
 *   data-lead-intent="inquiry"  inquiry | brochure | callback | careers
 *   data-lead-msg="#ctaMsg"     selector of the element to show messages in
 *
 * Standard field names mapped directly: name, email, phone, project, message.
 * Any other named fields (role, portfolio, pref, ...) are folded into the
 * message as "Label: value" lines so the API schema stays simple.
 */
(function () {
  var STD = ['name', 'email', 'phone', 'project', 'message'];

  function endpoint() {
    var e = window.TRUENEST_LEADS_ENDPOINT;
    if (typeof e !== 'string') return '';
    e = e.trim();
    if (!e || e.indexOf('REPLACE') !== -1) return '';
    return e;
  }

  function msgEl(form) {
    var sel = form.getAttribute('data-lead-msg');
    return sel ? document.querySelector(sel) : null;
  }

  function show(el, text, kind) {
    if (!el) return;
    el.textContent = text;
    el.classList.add('show');
    el.classList.remove('ok', 'err');
    if (kind) el.classList.add(kind);
  }

  function collect(form) {
    var fd = new FormData(form);
    var std = {};
    var extraLines = [];
    fd.forEach(function (value, key) {
      var v = String(value).trim();
      if (!v) return;
      if (STD.indexOf(key) !== -1) {
        std[key] = std[key] ? std[key] + ', ' + v : v;
      } else {
        var label = key.charAt(0).toUpperCase() + key.slice(1);
        extraLines.push(label + ': ' + v);
      }
    });
    if (extraLines.length) {
      std.message = (std.message ? std.message + '\n\n' : '') +
        extraLines.join('\n');
    }
    std.source = form.getAttribute('data-lead-source') || 'static-site';
    std.intent = form.getAttribute('data-lead-intent') || 'inquiry';
    return std;
  }

  function firstName(n) {
    return (n || '').split(' ')[0] || 'there';
  }

  function enhance(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = msgEl(form);
      var data = collect(form);

      if (!data.name || !data.email) {
        show(m, 'Please enter your name and email.', 'err');
        return;
      }

      var url = endpoint();
      if (!url) {
        // Backend not wired yet — preserve the original UX.
        show(
          m,
          'Thank you, ' + firstName(data.name) +
            '. A TrueNest advisor will be in touch shortly.',
          'ok'
        );
        form.reset();
        return;
      }

      var btn = form.querySelector('[type="submit"], button:not([type])');
      var btnText;
      if (btn) {
        btnText = btn.textContent;
        btn.disabled = true;
      }
      show(m, 'Sending…', '');

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (res) {
          return res.json().then(function (j) {
            return { ok: res.ok, body: j };
          });
        })
        .then(function (r) {
          if (!r.ok) {
            show(
              m,
              (r.body && r.body.error) ||
                'Something went wrong. Please try again.',
              'err'
            );
            return;
          }
          show(
            m,
            'Thank you, ' + firstName(data.name) +
              '. A TrueNest advisor will be in touch shortly.',
            'ok'
          );
          form.reset();
        })
        .catch(function () {
          show(m, 'Network error. Please try again.', 'err');
        })
        .finally(function () {
          if (btn) {
            btn.disabled = false;
            btn.textContent = btnText;
          }
        });
    });
  }

  function init() {
    var forms = document.querySelectorAll('form[data-lead-form]');
    for (var i = 0; i < forms.length; i++) enhance(forms[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
