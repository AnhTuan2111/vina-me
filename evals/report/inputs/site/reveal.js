document.documentElement.classList.add('js');
document.addEventListener('DOMContentLoaded', function () {
  var items = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('shown'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  items.forEach(function (el) { io.observe(el); });
});
