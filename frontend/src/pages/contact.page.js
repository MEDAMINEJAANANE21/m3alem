import '../components/layout.component.js';
import { WEB3FORMS_ACCESS_KEY } from '../config/app.config.js';
import { setBusy, showAlert } from '../utils/dom.util.js';

const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

const form = document.getElementById('contact-form');
const feedback = document.getElementById('contact-feedback');
const submitButton = form.querySelector('button[type="submit"]');

async function sendMessage(formData) {
  formData.append('access_key', WEB3FORMS_ACCESS_KEY);
  formData.append('subject', 'Nouveau message depuis M3alem.ma');

  const response = await fetch(WEB3FORMS_URL, { method: 'POST', body: formData });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  setBusy(submitButton, true, 'Envoi…');
  try {
    await sendMessage(new FormData(form));
    form.reset();
    showAlert(feedback, 'Votre message a bien été envoyé. Merci !', 'success');
  } catch {
    showAlert(feedback, "Le message n'a pas pu être envoyé. Veuillez réessayer.");
  } finally {
    setBusy(submitButton, false);
  }
});
