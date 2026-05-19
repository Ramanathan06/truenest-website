/* TrueNest shared interactions — nav scroll state + scroll reveal.
   Page-specific behaviour (gallery, tours, ROI, forms) stays inline per page. */
(function () {
  // Nav scrolled state
  var n = document.getElementById('nav');
  if (n) {
    var u = function () { n.classList.toggle('scrolled', window.scrollY > 50); };
    addEventListener('scroll', u, { passive: true });
    u();
  }

  // Scroll reveal
  var e = document.querySelectorAll('.reveal,.reveal-clip-up,.reveal-pop,.reveal-zoom');
  if (!('IntersectionObserver' in window)) {
    e.forEach(function (x) { x.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (x.isIntersecting) { x.target.classList.add('visible'); io.unobserve(x.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    e.forEach(function (x) { io.observe(x); });
  }
})();
