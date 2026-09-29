const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// En móvil los menús desplegables se abren con un toque.
document.querySelectorAll('.nav-dropdown > .nav-dropdown-trigger').forEach(trigger => {
  trigger.addEventListener('click', event => {
    if (window.innerWidth <= 680) {
      event.preventDefault();
      trigger.parentElement.classList.toggle('mobile-open');
    }
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function showToast(message, title = 'OROSTACK') {
  let backdrop = document.querySelector('.toast-backdrop');
  let toast = document.querySelector('.toast-notification');

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'toast-backdrop';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', hideToast);
  }
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.setAttribute('role', 'dialog');
    toast.setAttribute('aria-modal', 'true');
    toast.innerHTML = '<strong class="toast-title"></strong><p></p><button type="button">Entendido</button>';
    document.body.appendChild(toast);
    toast.querySelector('button').addEventListener('click', hideToast);
  }

  toast.querySelector('.toast-title').textContent = title;
  toast.querySelector('p').textContent = message;
  requestAnimationFrame(() => {
    backdrop.classList.add('show');
    toast.classList.add('show');
  });
}

function hideToast() {
  document.querySelector('.toast-notification')?.classList.remove('show');
  document.querySelector('.toast-backdrop')?.classList.remove('show');
}

window.OroStackToast = showToast;

// Ninguna demo usa alert(); todas usan esta notificación.
document.querySelectorAll('[data-notify]').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    showToast(button.dataset.notify || 'Esta acción es una demostración.');
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') hideToast();
});
