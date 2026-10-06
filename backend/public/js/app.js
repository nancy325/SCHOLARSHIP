// ScholarHub — small progressive enhancements (the site works without JS)
document.addEventListener('DOMContentLoaded', function () {
  // Public header mobile menu
  document.querySelectorAll('[data-nav-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var header = btn.closest('.site-header');
      var open = header.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // Dashboard sidebar: hamburger hides/shows it on desktop (remembered), opens a drawer on mobile
  var shell = document.querySelector('.admin-shell');
  var isDesktop = function () { return window.innerWidth > 1024; };
  document.querySelectorAll('[data-sidebar-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (isDesktop() && !btn.classList.contains('sidebar-backdrop')) {
        var collapsed = document.documentElement.classList.toggle('sb-collapsed');
        try { localStorage.setItem('sidebar', collapsed ? 'collapsed' : 'open'); } catch (e) {}
      } else if (shell) {
        shell.classList.toggle('open');
      }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && shell && shell.classList.contains('open')) shell.classList.remove('open');
  });

  // Confirm before destructive actions: <form data-confirm="...">
  document.querySelectorAll('form[data-confirm]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (!window.confirm(form.getAttribute('data-confirm'))) e.preventDefault();
    });
  });

  // Dismiss flash messages
  document.querySelectorAll('[data-dismiss]').forEach(function (btn) {
    btn.addEventListener('click', function () { btn.closest('.alert').remove(); });
  });

  // Close user dropdown when clicking elsewhere
  document.addEventListener('click', function (e) {
    document.querySelectorAll('details.user-menu[open]').forEach(function (d) {
      if (!d.contains(e.target)) d.removeAttribute('open');
    });
  });

  // Show/hide dependent fields: <div data-show-when="type=university,institute">
  document.querySelectorAll('[data-show-when]').forEach(function (el) {
    var parts = el.getAttribute('data-show-when').split('=');
    var source = document.querySelector('[name="' + parts[0] + '"]');
    var values = parts[1].split(',');
    if (!source) return;
    var sync = function () {
      var show = values.indexOf(source.value) !== -1;
      el.style.display = show ? '' : 'none';
      el.querySelectorAll('select, input').forEach(function (i) { i.disabled = !show; });
    };
    source.addEventListener('change', sync);
    sync();
  });

  // Character counter: <textarea data-counter="#id">
  document.querySelectorAll('textarea[data-counter]').forEach(function (ta) {
    var out = document.querySelector(ta.getAttribute('data-counter'));
    var sync = function () { out.textContent = ta.value.length; };
    ta.addEventListener('input', sync);
    sync();
  });
});
