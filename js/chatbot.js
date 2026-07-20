// ===== AI chat widget =====
// Talks to the Vercel-hosted /api/chat endpoint (see api/chat.py). Hostinger can't run
// that endpoint itself (static hosting only), so this points at wherever the backend
// ends up deployed -- UPDATE THIS after you deploy to Vercel.
//
// Example: 'https://harjeet-portfolio-chat.vercel.app/api/chat'
const CHAT_API_URL = 'https://portfolio-website-five-chi-57.vercel.app/api/chat';

(function () {
  const toggle = document.getElementById('chat-toggle');
  const panel = document.getElementById('chat-panel');
  const iconOpen = document.getElementById('chat-icon-open');
  const iconClose = document.getElementById('chat-icon-close');
  const messagesEl = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');

  if (!toggle || !panel || !form || !input) return;

  let history = []; // [{role: 'user'|'assistant', content: '...'}]
  let open = false;
  let sending = false;

  function setOpen(next) {
    open = next;
    panel.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    iconOpen.classList.toggle('hidden', open);
    iconClose.classList.toggle('hidden', !open);
    if (open) {
      toggle.classList.remove('chat-toggle-attention');
      setTimeout(() => input.focus(), 250);
    }
  }

  toggle.addEventListener('click', () => setOpen(!open));

  function addBubble(text, role) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble ' + (role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot');
    bubble.textContent = text; // textContent, never innerHTML -- no injected markup from either side
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  function addTypingIndicator() {
    const el = document.createElement('div');
    el.className = 'chat-bubble chat-bubble-bot chat-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  // ===== Contact-intent shortcut =====
  // If the visitor's message (or the bot's reply) signals they want to reach Harjeet,
  // surface real one-click actions right in the chat instead of the bot just telling
  // them to scroll down to the Connect section.
  const CONTACT_INTENT_RE = /\b(contact|reach( him| out)?|email|e-mail|whats ?app|phone|call him|get in touch|connect with|talk to him|speak (to|with) him|hire him|interview him|his number|his email)\b/i;

  function looksLikeContactIntent(userText, botText) {
    return CONTACT_INTENT_RE.test(userText) || CONTACT_INTENT_RE.test(botText || '');
  }

  function goToContactForm() {
    setOpen(false);
    const section = document.getElementById('connect');
    const nameInput = document.getElementById('name');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => nameInput && nameInput.focus(), 550);
  }

  function addContactActions() {
    const row = document.createElement('div');
    row.className = 'chat-action-row';

    const formBtn = document.createElement('button');
    formBtn.type = 'button';
    formBtn.className = 'chat-action-btn';
    formBtn.textContent = '📝 Open contact form';
    formBtn.addEventListener('click', goToContactForm);

    const waBtn = document.createElement('a');
    waBtn.className = 'chat-action-btn chat-action-btn-whatsapp';
    waBtn.href = 'https://wa.me/917259466505?text=Hi%20Harjeet%2C%20I%20explored%20your%20portfolio%20and%20profile%20and%20wanted%20to%20connect%20directly%21';
    waBtn.target = '_blank';
    waBtn.rel = 'noopener';
    waBtn.textContent = '💬 Message on WhatsApp';

    row.appendChild(formBtn);
    row.appendChild(waBtn);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage(text) {
    if (sending) return;
    sending = true;
    addBubble(text, 'user');
    history.push({ role: 'user', content: text });
    const typingEl = addTypingIndicator();

    try {
      if (CHAT_API_URL.includes('YOUR-VERCEL-PROJECT')) {
        throw new Error('NOT_CONFIGURED');
      }
      const res = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: history.slice(-8) }),
      });
      const data = await res.json();
      typingEl.remove();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      addBubble(data.reply, 'assistant');
      history.push({ role: 'assistant', content: data.reply });
      if (looksLikeContactIntent(text, data.reply)) addContactActions();
    } catch (err) {
      typingEl.remove();
      const message = err.message === 'NOT_CONFIGURED'
        ? "The chat backend isn't connected yet — this widget is ready to go once it's deployed. In the meantime, reach out via the Connect section below!"
        : "Sorry, I couldn't reach the assistant right now. Please try again shortly, or use the contact form below.";
      addBubble(message, 'assistant');
      if (looksLikeContactIntent(text, '')) addContactActions();
    } finally {
      sending = false;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    sendMessage(text);
  });

  // Draw attention once, a few seconds after page load, if the user hasn't opened it yet.
  setTimeout(() => {
    if (!open) toggle.classList.add('chat-toggle-attention');
  }, 4000);
})();
