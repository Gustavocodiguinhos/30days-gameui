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

animated.forEach(function (el) {
  observer.observe(el);
});

const form = document.getElementById('signup-form');
const emailInput = document.getElementById('email');

function showMessage(text) {
  const old = document.getElementById('signup-msg');
  if (old) old.remove();
  const msg = document.createElement('p');
  msg.id = 'signup-msg';
  msg.textContent = text;
  form.appendChild(msg);
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const email = emailInput.value.trim();

  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();

    if (!res.ok) {
      showMessage(data.error || 'Something went wrong. Try again.');
      return;
    }

    if (data.message === 'already subscribed') {
      showMessage('You are already subscribed. The next challenge is on the way!');
    } else {
      showMessage('Almost there! Check your inbox and confirm your subscription.');
    }
    form.reset();
  } catch (err) {
    showMessage('Could not reach the server. Please try again.');
  }
});

if (new URLSearchParams(window.location.search).get('subscribed') === '1') {
  showMessage('Subscription confirmed! Your first challenge arrives tomorrow at 8:00 AM.');
}
