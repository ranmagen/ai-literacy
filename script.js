/* ===== AI LITERACY FRAMEWORK — INTERACTIVE SCRIPT ===== */

// ===== PARTICLE CANVAS =====
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animId;
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: randomBetween(-0.4, 0.4),
      vy: randomBetween(-0.4, 0.4),
      r: randomBetween(2, 4),
      alpha: randomBetween(0.3, 0.9),
    };
  }

  function init() {
    resize();
    particles = [];
    const count = Math.min(80, Math.floor((W * H) / 12000));
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const alpha = (1 - dist / 140) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 188, 212, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 188, 212, ${p.alpha})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    animId = requestAnimationFrame(draw);
  }

  init();
  draw();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    init();
    draw();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });
})();


// ===== SCROLL REVEAL =====
(function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


// ===== NAVBAR =====
(function initNavbar() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('active'));
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(s => sectionObserver.observe(s));
})();


// ===== FLIP CARDS =====
(function initFlipCards() {
  document.querySelectorAll('.flip-card').forEach(card => {
    // Only flip on desktop (where we have the 3D flip)
    const isMobile = window.innerWidth <= 900;
    if (isMobile) return;

    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });

    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'לחץ להצגת פרטים');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
})();


// ===== DOMAIN TABS =====
(function initDomainTabs() {
  const tabs = document.querySelectorAll('.domain-tab');
  const panels = document.querySelectorAll('.domain-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const domain = tab.dataset.domain;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach(p => p.classList.remove('active'));
      const target = document.getElementById(`panel-${domain}`);
      if (target) target.classList.add('active');
    });
  });

  // Keyboard nav
  tabs.forEach((tab, i) => {
    tab.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const next = tabs[(i + 1) % tabs.length];
        next.focus();
        next.click();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const prev = tabs[(i - 1 + tabs.length) % tabs.length];
        prev.focus();
        prev.click();
      }
    });
  });
})();


// ===== PISA COMPETENCY NODES =====
(function initPisaCompNodes() {
  const nodes = document.querySelectorAll('.pisa-comp-node');
  const details = document.querySelectorAll('.pisa-comp-detail');

  if (!nodes.length) return;

  // Init first as active
  nodes[0].classList.add('active');

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const comp = node.dataset.comp;

      nodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      details.forEach(d => d.classList.remove('active'));
      const target = document.getElementById(`detail-${comp}`);
      if (target) {
        target.classList.add('active');
        // Smooth scroll on mobile
        if (window.innerWidth <= 900) {
          target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });

    node.setAttribute('tabindex', '0');
    node.setAttribute('role', 'button');
    node.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        node.click();
      }
    });
  });
})();


// ===== TIMELINE DRAG SCROLL =====
(function initTimelineDrag() {
  const slider = document.querySelector('.timeline-scroll');
  if (!slider) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  slider.style.cursor = 'grab';

  slider.addEventListener('mousedown', e => {
    isDown = true;
    slider.style.cursor = 'grabbing';
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.style.cursor = 'grab';
  });

  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.style.cursor = 'grab';
  });

  slider.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
  });
})();


// ===== SMOOTH SCROLL =====
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


// ===== QUIZ =====
(function initQuiz() {
  const ALL_QUESTIONS = [
    // AILit questions
    {
      source: 'ailit',
      q: 'מה כולל המושג "אוריינות AI" לפי מסגרת AILit?',
      opts: [
        'רק ידע טכני על תכנות ואלגוריתמים',
        'ידע, מיומנויות ועמדות הנוגעים לבינה מלאכותית',
        'רק שימוש בכלי AI כמו ChatGPT',
        'הבנה מתמטית מעמיקה של מודלים'
      ],
      correct: 1,
      explanation: 'מסגרת AILit מגדירה אוריינות AI כשילוב של ידע, מיומנויות ועמדות – לא רק מיומנות טכנית.'
    },
    {
      source: 'ailit',
      q: 'כמה תחומי ליבה כוללת מסגרת AILit?',
      opts: ['2 תחומים', '3 תחומים', '4 תחומים', '6 תחומים'],
      correct: 2,
      explanation: 'מסגרת AILit כוללת 4 תחומים: מעורבות עם AI, יצירה עם AI, ניהול AI ועיצוב AI.'
    },
    {
      source: 'ailit',
      q: 'מה עיקר תחום "יצירה עם AI"?',
      opts: [
        'עיצוב אלגוריתמים ממחשב',
        'ניהול מערכות AI בארגונים',
        'שיתוף פעולה עם AI לרעיונות ופתרון בעיות',
        'הכשרת מודלי למידת מכונה'
      ],
      correct: 2,
      explanation: 'תחום היצירה עוסק בשיתוף פעולה עם AI לרעיונות, תוכן ופתרון בעיות, תוך שמירה על מקוריות.'
    },
    {
      source: 'ailit',
      q: 'מהי "הזיה" (Hallucination) בהקשר של מודלי AI?',
      opts: [
        'תופעה ויזואלית בממשק המשתמש',
        'עדכון אוטומטי של המודל',
        'כאשר AI מייצר מידע שגוי בביטחון מלא',
        'שגיאה בתשתית החישובית'
      ],
      correct: 2,
      explanation: 'הזיה (Hallucination) היא כאשר מודל AI מציג מידע שגוי או בדוי כאילו הוא עובדה. זה כלול בתחום ניהול AI.'
    },
    {
      source: 'ailit',
      q: 'כיצד הטיות בנתוני אימון משפיעות על מערכות AI?',
      opts: [
        'הן משפרות את ביצועי המודל',
        'הן עלולות לגרום לתוצאות לא הוגנות כלפי קבוצות מסוימות',
        'הן אינן משפיעות על הפלטים',
        'הן רלוונטיות רק במערכות ישנות'
      ],
      correct: 1,
      explanation: 'הטיות בנתוני אימון עלולות להוביל לתוצאות מפלות ולא הוגנות. זה כלול בתחום עיצוב AI.'
    },
    // PISA 2029 MAIL questions
    {
      source: 'pisa',
      q: 'מהם 3 מושגי המפתח של מסגרת PISA 2029 MAIL?',
      opts: [
        'נתונים, אלגוריתמים ומודלים',
        'יוצרים וקהלים, מסרים ומשמעויות, ייצוגים ומציאות',
        'למידה, בידור ואזרחות',
        'פרטיות, אבטחה ואמינות'
      ],
      correct: 1,
      explanation: 'PISA 2029 MAIL מבוסס על 3 מושגי מפתח: Authors & Audiences, Messages & Meanings, Representations & Realities.'
    },
    {
      source: 'pisa',
      q: 'מהו כישור העוגן ב-PISA 2029 MAIL?',
      opts: [
        'גישה ושימוש',
        'ניתוח והערכה',
        'השתקפות ופעולה אתית ואחראית',
        'יצירה'
      ],
      correct: 2,
      explanation: '"השתקפות ופעולה אתית ואחראית" הוא כישור העוגן המשתרע על כל 5 הכישורים האחרים.'
    },
    {
      source: 'pisa',
      q: 'כמה אחוז מזמן ההערכה ב-PISA MAIL מוקדש לכישורי "ניתוח" ו-"יצירה"?',
      opts: ['25%', '50%', '75%', '100%'],
      correct: 1,
      explanation: 'קבוצת המומחים ממליצה להקדיש 25% לניתוח ו-25% ליצירה – סך הכל 50% מזמן ההערכה.'
    },
    {
      source: 'pisa',
      q: 'כיצד AI משנה את הממד "יוצרים וקהלים" של מסגרת PISA MAIL?',
      opts: [
        'AI אינו משפיע על מימד זה',
        'AI יוצר מסרים בשיתוף פעולה בין אדם-מכונה, כאשר נתונים ועיצוב מעצבים מטרה וקהל',
        'AI מחליף לחלוטין את היוצר האנושי',
        'AI משפיע רק על הממד הכלכלי של יצירת מסרים'
      ],
      correct: 1,
      explanation: 'לפי PISA MAIL, AI שינה את מממד היוצרים: מסרים AI-גנרטיביים נוצרים בשיתוף בין אדם למכונה, כאשר נתוני אימון ובחירות עיצוב מעצבים את התוצר.'
    },
    {
      source: 'pisa',
      q: 'מהם 5 הקשרי ההערכה ב-PISA 2029 MAIL?',
      opts: [
        'בית ספר, עבודה, מדע, פוליטיקה ותרבות',
        'יחסים, למידה, בידור, שכנוע ואזרחות',
        'מדיה, AI, מחשוב, תקשורת ועיתונאות',
        'ידע, מיומנות, עמדה, אתיקה ויצירה'
      ],
      correct: 1,
      explanation: 'PISA MAIL מעגן הערכות ב-5 הקשרים: Relationships, Learning, Entertainment, Persuasion, Citizenship.'
    },
  ];

  const letters = ['א', 'ב', 'ג', 'ד'];
  let questions = [...ALL_QUESTIONS];
  let current = 0;
  let score = 0;
  let scoreAILit = 0;
  let scorePISA = 0;
  let answered = false;
  let activeFilter = 'all';

  const container = document.getElementById('quizContainer');
  const content = document.getElementById('quizContent');
  const nextBtn = document.getElementById('quizNextBtn');
  const resultDiv = document.getElementById('quizResult');
  const progressFill = document.getElementById('quizProgress');
  const questionNum = document.getElementById('questionNum');
  const totalQuestionsEl = document.getElementById('totalQuestions');

  if (!container) return;

  // Filter buttons
  const allBtn = document.getElementById('quizDocAll');
  const ailBtn = document.getElementById('quizDocAILit');
  const pisaBtn = document.getElementById('quizDocPISA');

  function setFilter(filter) {
    activeFilter = filter;
    if (filter === 'all') questions = [...ALL_QUESTIONS];
    else questions = ALL_QUESTIONS.filter(q => q.source === filter);

    allBtn.classList.toggle('active', filter === 'all');
    ailBtn.classList.toggle('active', filter === 'ailit');
    pisaBtn.classList.toggle('active', filter === 'pisa');

    resetQuiz();
  }

  if (allBtn) allBtn.addEventListener('click', () => setFilter('all'));
  if (ailBtn) ailBtn.addEventListener('click', () => setFilter('ailit'));
  if (pisaBtn) pisaBtn.addEventListener('click', () => setFilter('pisa'));

  function resetQuiz() {
    current = 0;
    score = 0;
    scoreAILit = 0;
    scorePISA = 0;
    answered = false;
    resultDiv.style.display = 'none';
    showQuestion(0);
  }

  function showQuestion(index) {
    answered = false;
    nextBtn.style.display = 'none';
    resultDiv.style.display = 'none';
    content.style.display = 'block';

    const q = questions[index];
    const progress = (index / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    questionNum.textContent = index + 1;
    totalQuestionsEl.textContent = questions.length;

    const sourceLabel = q.source === 'ailit'
      ? '<span class="quiz-source-tag ailit-q">📚 AILit</span>'
      : '<span class="quiz-source-tag pisa-q">📊 PISA 2029 MAIL</span>';

    content.innerHTML = `
      <div class="quiz-question">
        ${sourceLabel}
        <h3>${q.q}</h3>
        <div class="quiz-options">
          ${q.opts.map((opt, i) => `
            <button class="quiz-option" data-index="${i}">
              <span class="quiz-option-letter">${letters[i]}</span>
              ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    content.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => selectAnswer(btn, q.correct, q.explanation));
    });
  }

  function selectAnswer(btn, correct, explanation) {
    if (answered) return;
    answered = true;

    const selected = parseInt(btn.dataset.index, 10);
    const allOptions = content.querySelectorAll('.quiz-option');
    const q = questions[current];

    allOptions.forEach(opt => {
      opt.disabled = true;
      const idx = parseInt(opt.dataset.index, 10);
      if (idx === correct) opt.classList.add('correct');
      else if (opt === btn && selected !== correct) opt.classList.add('wrong');
    });

    if (selected === correct) {
      score++;
      if (q.source === 'ailit') scoreAILit++;
      else scorePISA++;
    }

    // Show explanation
    if (explanation) {
      const expEl = document.createElement('div');
      expEl.style.cssText = 'margin-top:12px;padding:12px 16px;background:rgba(255,255,255,0.06);border-radius:8px;font-size:0.82rem;color:rgba(255,255,255,0.7);line-height:1.6;border:1px solid rgba(255,255,255,0.08);';
      expEl.innerHTML = `💡 ${explanation}`;
      content.querySelector('.quiz-question').appendChild(expEl);
    }

    nextBtn.style.display = 'inline-flex';
    nextBtn.textContent = current < questions.length - 1 ? 'הבא ←' : 'סיום ✓';
  }

  function showResult() {
    content.style.display = 'none';
    nextBtn.style.display = 'none';
    progressFill.style.width = '100%';
    questionNum.textContent = questions.length;

    const pct = Math.round((score / questions.length) * 100);
    let icon, title, desc, levelText, levelColor;

    if (pct < 50) {
      icon = '🌱';
      title = 'מתחיל — יש לאן לצמוח!';
      desc = 'אוריינות AI ומדיה הן מיומנויות חדשות — מגיע לך לחקור את שני המסמכים לעומק. חזור ועיין בסעיפים הרלוונטיים.';
      levelText = '🌱 מתחיל';
      levelColor = '#4caf50';
    } else if (pct < 80) {
      icon = '🚀';
      title = 'מתקדם — ידע טוב!';
      desc = 'יש לך הבנה טובה של שני המסמכים. כדאי לחזק את הידע בנושאים שלא ענית נכון עליהם.';
      levelText = '🚀 מתקדם';
      levelColor = '#29b6f6';
    } else {
      icon = '🌟';
      title = 'מומחה — כל הכבוד!';
      desc = 'הבנה מרשימה של מסגרת AILit ו-PISA 2029 MAIL! אתה מוכן לשלב את הידע בפרקטיקה.';
      levelText = '🌟 מומחה';
      levelColor = '#ff9800';
    }

    document.getElementById('resultIcon').textContent = icon;
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultScore').textContent = `${score} / ${questions.length} (${pct}%)`;
    document.getElementById('resultDesc').textContent = desc;

    const levelEl = document.getElementById('resultLevel');
    levelEl.textContent = levelText;
    levelEl.style.cssText = `background:rgba(255,255,255,0.1);color:${levelColor};border:1px solid ${levelColor};padding:8px 28px;border-radius:100px;font-size:1rem;font-weight:700;display:inline-block;`;

    // Breakdown
    const breakdownEl = document.getElementById('resultBreakdown');
    if (activeFilter === 'all') {
      const ailTotal = ALL_QUESTIONS.filter(q => q.source === 'ailit').length;
      const pisaTotal = ALL_QUESTIONS.filter(q => q.source === 'pisa').length;
      breakdownEl.innerHTML = `
        <div class="breakdown-item">
          <span>📚 AILit</span>
          <strong>${scoreAILit}/${ailTotal}</strong>
        </div>
        <div class="breakdown-item">
          <span>📊 PISA MAIL</span>
          <strong>${scorePISA}/${pisaTotal}</strong>
        </div>
      `;
    } else {
      breakdownEl.innerHTML = '';
    }

    resultDiv.style.display = 'block';
  }

  nextBtn.addEventListener('click', () => {
    current++;
    if (current < questions.length) {
      showQuestion(current);
    } else {
      showResult();
    }
  });

  document.getElementById('quizRetryBtn').addEventListener('click', resetQuiz);

  showQuestion(0);
})();


// ===== CHAT WIDGET =====
(function initChat() {
  const toggle   = document.getElementById('chat-toggle');
  const panel    = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const input    = document.getElementById('chat-input');
  const sendBtn  = document.getElementById('chat-send');
  const msgsEl   = document.getElementById('chat-messages');

  if (!toggle) return;

  let history   = [];
  let isLoading = false;
  let isOpen    = false;

  function openChat() {
    isOpen = true;
    panel.classList.add('open');
    toggle.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    input.focus();
  }

  function closeChat() {
    isOpen = false;
    panel.classList.remove('open');
    toggle.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }

  toggle.addEventListener('click', () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  function appendMessage(role, text) {
    const msgEl = document.createElement('div');
    msgEl.className = `msg msg-${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.textContent = text;
    msgEl.appendChild(bubble);
    msgsEl.appendChild(msgEl);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return bubble;
  }

  function showTyping() {
    const msgEl = document.createElement('div');
    msgEl.className = 'msg msg-assistant typing-indicator';
    msgEl.innerHTML =
      '<div class="msg-bubble">' +
      '<span class="typing-dot"></span>' +
      '<span class="typing-dot"></span>' +
      '<span class="typing-dot"></span>' +
      '</div>';
    msgsEl.appendChild(msgEl);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return msgEl;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isLoading) return;

    appendMessage('user', text);
    history.push({ role: 'user', content: text });
    input.value = '';
    input.style.height = 'auto';

    const typingEl = showTyping();
    isLoading = true;
    sendBtn.disabled = true;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      typingEl.remove();

      if (!res.ok) {
        appendMessage('assistant', 'מצטער, אירעה שגיאה בשרת. אנא נסה שוב.');
        return;
      }

      const bubble = appendMessage('assistant', '');
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let buffer   = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            const delta  = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullText += delta;
              bubble.textContent = fullText;
              msgsEl.scrollTop = msgsEl.scrollHeight;
            }
          } catch { /* skip malformed chunks */ }
        }
      }

      if (fullText) history.push({ role: 'assistant', content: fullText });

    } catch {
      typingEl?.remove();
      appendMessage('assistant', 'מצטער, לא ניתן להתחבר לשרת. בדוק את החיבור לאינטרנט.');
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }
})();


// ===== AGE BAND ANIMATION =====
(function initAgeBands() {
  const bands = document.querySelectorAll('.band-bar');
  if (!bands.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger CSS width transition
          const el = entry.target;
          const targetWidth = el.style.width;
          el.style.width = '0%';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.width = targetWidth;
            });
          });
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  bands.forEach(band => {
    const originalWidth = band.style.width;
    band.dataset.width = originalWidth;
    observer.observe(band);
  });
})();
