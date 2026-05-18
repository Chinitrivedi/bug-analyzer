const API = 'http://localhost:5000/api';

// Tab switching
function showTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.add('hidden'));
  document.getElementById(`${tab}-form`).classList.remove('hidden');
  event.target.classList.add('active');
}

// Login
async function handleLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  if (!email || !password) {
    errorEl.textContent = 'Please fill all fields';
    return;
  }

  const btn = event.target;
  btn.disabled = true;
  btn.textContent = 'Logging in...';

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.message;
      btn.disabled = false;
      btn.textContent = 'Login';
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
    window.location.href = 'dashboard.html';

  } catch (err) {
    errorEl.textContent = 'Something went wrong. Try again.';
    btn.disabled = false;
    btn.textContent = 'Login';
  }
}

// Register
async function handleRegister() {
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const errorEl = document.getElementById('register-error');

  if (!name || !email || !password) {
    errorEl.textContent = 'Please fill all fields';
    return;
  }

  const btn = event.target;
  btn.disabled = true;
  btn.textContent = 'Creating account...';

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.message;
      btn.disabled = false;
      btn.textContent = 'Create Account';
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
    window.location.href = 'dashboard.html';

  } catch (err) {
    errorEl.textContent = 'Something went wrong. Try again.';
    btn.disabled = false;
    btn.textContent = 'Create Account';
  }
}