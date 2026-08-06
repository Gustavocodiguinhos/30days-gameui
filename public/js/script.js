const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');
const storedTheme = localStorage.getItem('theme');

if (storedTheme) {
  root.setAttribute('data-theme', storedTheme);
}

toggle.addEventListener('click', function () {
  const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  toggle.textContent = next === 'light' ? '🌙' : '☀️';
  localStorage.setItem('theme', next);
});

if (root.getAttribute('data-theme') === 'light') {
  toggle.textContent = '🌙';
}

const animated = document.querySelectorAll('.animate');
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

animated.forEach(function (el, i) {
  if (el.parentElement.classList.contains('steps')) {
    el.style.transitionDelay = i * 120 + 'ms';
  }
  observer.observe(el);
});

const header = document.querySelector('header');
window.addEventListener('scroll', function () {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

const form = document.getElementById('signup-form');
const emailInput = form ? document.getElementById('email') : null;
const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

function showMessage(text, { autoHide = false } = {}) {
  if (!form) return;
  const old = document.getElementById('signup-msg');
  if (old) old.remove();
  const msg = document.createElement('p');
  msg.id = 'signup-msg';
  msg.textContent = text;
  form.insertAdjacentElement('afterend', msg);
  if (autoHide) {
    setTimeout(() => {
      if (msg.parentNode) msg.remove();
    }, 4000);
  }
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const email = emailInput.value.trim();

  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  submitBtn.textContent = 'Sending…';

  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();

    if (!res.ok) {
      showMessage(data.error || 'Something went wrong. Try again.');
      emailInput.value = '';
      emailInput.focus();
      return;
    }

    if (data.message === 'already subscribed') {
      showMessage('You are already subscribed. The next challenge is on the way!', { autoHide: true });
    } else {
      showMessage('Almost there! Check your inbox and confirm your subscription.', { autoHide: true });
    }
    emailInput.value = '';
    emailInput.focus();
  } catch (err) {
    showMessage('Could not reach the server. Please try again.');
    emailInput.value = '';
    emailInput.focus();
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    submitBtn.textContent = 'Start the Challenge';
  }
});

if (new URLSearchParams(window.location.search).get('subscribed') === '1') {
  showMessage('Subscription confirmed! Your first challenge arrives tomorrow at 8:00 AM.');
}
