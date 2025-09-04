// Contact form: EmailJS send
(function () {
  const form = document.getElementById('lead-form');
  const submitBtn = document.getElementById('lead-submit');
  const statusEl = document.getElementById('form-status');
  if (!form) return;

  // TODO: replace with your EmailJS IDs
  const PUBLIC_KEY  = 'xfmvZl2ruF14JI0-U';
  const SERVICE_ID  = 'service_kgswvp4';
  const TEMPLATE_ID = 'template_5ffy788';

  try { emailjs.init({ publicKey: PUBLIC_KEY }); } catch (e) {}

  const setLoading = (on) => {
    submitBtn.classList.toggle('is-loading', on);
    submitBtn.disabled = on;
  };

  const validate = () => {
    let ok = true;
    statusEl.textContent = '';
    const fields = ['name','email','phone'];
    fields.forEach(n => {
      const el = form.elements[n];
      if (!el) return;
      el.classList.remove('is-invalid');
      if (!el.value.trim()) { el.classList.add('is-invalid'); ok = false; }
    });
    // simple email / phone check
    const email = form.elements.email.value.trim();
    const phone = form.elements.phone.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { form.elements.email.classList.add('is-invalid'); ok = false; }
    if (!/^[0-9+\-\s()]{7,}$/.test(phone)) { form.elements.phone.classList.add('is-invalid'); ok = false; }
    return ok;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: ignore bots
    if (form.elements.website && form.elements.website.value) return;

    if (!validate()) {
      statusEl.textContent = 'Please fix the highlighted fields.';
      return;
    }

    const payload = {
      name: form.elements.name.value.trim(),
      company: form.elements.company.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      service: form.elements.service.value,
      message: form.elements.message.value.trim(),
      audit: form.elements.audit.checked ? 'Yes' : 'No',
      page_url: location.href
    };

    setLoading(true);
    try {
      // If EmailJS keys are filled, send via EmailJS
      if (PUBLIC_KEY && SERVICE_ID && TEMPLATE_ID && typeof emailjs !== 'undefined') {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, payload);
      } else {
        // Fallback: open mail client prefilled (remove if not desired)
        const subject = encodeURIComponent(`New enquiry: ${payload.service} — ${payload.name}`);
        const body = encodeURIComponent(
          `Name: ${payload.name}\nCompany: ${payload.company}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nService: ${payload.service}\nAudit: ${payload.audit}\nMessage:\n${payload.message}\n\nFrom: ${payload.page_url}`
        );
        window.location.href = `mailto:info.ainats@gmail.com?subject=${subject}&body=${body}`;
      }

      form.reset();
      statusEl.textContent = 'Thanks! We’ll get back to you within 1 business day.';
    } catch (err) {
      statusEl.textContent = 'Could not send just now. Please email info.ainats@gmail.com or call 8200770942 / 9725519485.';
      console.error(err);
    } finally {
      setLoading(false);
    }
  });
})();
