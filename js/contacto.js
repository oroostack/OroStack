const params = new URLSearchParams(window.location.search);
const service = params.get('servicio');
const sent = params.get('enviado');
const serviceSelect = document.querySelector('#servicio');

if (service && serviceSelect) serviceSelect.value = service;

if (sent === '1') {
  window.OroStackToast?.(
    'Tu consulta se ha enviado correctamente. Te responderé lo antes posible.',
    'CONSULTA ENVIADA'
  );
  window.history.replaceState({}, document.title, window.location.pathname);
}

const contactForm = document.querySelector('#contactForm');
const phoneInput = document.querySelector('#telefono');

function phoneDigits(value) {
  return (value || '').replace(/\D/g, '');
}

function validatePhoneField() {
  if (!phoneInput) return true;
  const digits = phoneDigits(phoneInput.value);

  if (!digits) {
    phoneInput.setCustomValidity('El teléfono es obligatorio.');
    return false;
  }
  if (digits.length < 7) {
    phoneInput.setCustomValidity('Introduce al menos 7 dígitos en el teléfono.');
    return false;
  }
  if (digits.length > 15) {
    phoneInput.setCustomValidity('Un teléfono internacional puede tener como máximo 15 dígitos.');
    return false;
  }

  phoneInput.setCustomValidity('');
  return true;
}

phoneInput?.addEventListener('input', validatePhoneField);
phoneInput?.addEventListener('blur', validatePhoneField);

if (contactForm) {
  contactForm.addEventListener('submit', event => {
    validatePhoneField();

    if (!contactForm.checkValidity()) {
      event.preventDefault();
      contactForm.reportValidity();
      return;
    }

    const submitButton = contactForm.querySelector('.submit-btn');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = 'Enviando…';
    }
  });
}
