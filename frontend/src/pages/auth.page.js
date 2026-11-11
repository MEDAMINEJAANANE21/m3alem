import '../components/layout.component.js';
import { apiClient } from '../api/api.client.js';
import { clearAlert, describeError, setBusy, showAlert } from '../utils/dom.util.js';
import { session } from '../stores/session.store.js';

const DEFAULT_REDIRECT = '/account.html';

const forms = {
  login: document.getElementById('login-form'),
  register: document.getElementById('register-form'),
};
const tabs = document.querySelectorAll('[data-tab]');
const feedback = document.getElementById('auth-feedback');

// Only same-site paths are accepted, so ?next= cannot redirect users to another website.
function getRedirectTarget() {
  const next = new URLSearchParams(window.location.search).get('next');
  return next?.startsWith('/') && !next.startsWith('//') ? next : DEFAULT_REDIRECT;
}

function showTab(name) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === name;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });
  Object.entries(forms).forEach(([formName, form]) => {
    form.hidden = formName !== name;
  });
  clearAlert(feedback);
}

function readLoginForm(form) {
  const data = new FormData(form);
  return { email: data.get('email'), password: data.get('password') };
}

function readRegisterForm(form) {
  const data = new FormData(form);
  if (data.get('password') !== data.get('confirmPassword')) {
    throw new Error('Les mots de passe ne correspondent pas');
  }
  return {
    name: data.get('name'),
    email: data.get('email'),
    phone: data.get('phone') || undefined,
    role: data.get('role'),
    password: data.get('password'),
  };
}

// Pattern: Template Method (functional form) — same submit flow, different reader and API call.
function handleSubmit(form, readForm, callApi) {
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    setBusy(button, true);
    try {
      session.save(await callApi(readForm(form)));
      window.location.assign(getRedirectTarget());
    } catch (error) {
      showAlert(feedback, describeError(error));
      setBusy(button, false);
    }
  });
}

if (session.isLoggedIn()) window.location.replace(getRedirectTarget());

tabs.forEach((tab) => tab.addEventListener('click', () => showTab(tab.dataset.tab)));
handleSubmit(forms.login, readLoginForm, apiClient.login);
handleSubmit(forms.register, readRegisterForm, apiClient.register);
