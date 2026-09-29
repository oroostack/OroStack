const params = new URLSearchParams(window.location.search);
const service = params.get('servicio');
const serviceSelect = document.querySelector('#servicio');
if (service && serviceSelect) serviceSelect.value = service;

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
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    validatePhoneField();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const submitButton = contactForm.querySelector('.submit-btn');
    const originalButton = submitButton?.innerHTML;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = 'Enviando…';
    }

    const data = new FormData(contactForm);
    const servicio = data.get('servicio');
    const subject = `Nueva consulta OroStack — ${servicio}`;
    data.append('_subject', subject);
    data.append('_template', 'table');
    data.append('_captcha', 'true');

    try {
      // FormSubmit permite enviar formularios estáticos por AJAX, sin abrir Outlook.
      const response = await fetch('https://formsubmit.co/ajax/oroostack@gmail.com', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        throw new Error('No se pudo enviar la consulta.');
      }

      contactForm.reset();
      window.OroStackToast?.('Tu consulta se ha enviado correctamente. Te responderé lo antes posible.', 'CONSULTA ENVIADA');
    } catch (error) {
      window.OroStackToast?.('No hemos podido enviar la consulta. Comprueba tu conexión e inténtalo de nuevo.', 'NO SE HA PODIDO ENVIAR');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButton || 'Enviar consulta ↗';
      }
    }
  });
}
