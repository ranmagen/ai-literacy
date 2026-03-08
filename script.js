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

    // Draw connections
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

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 188, 212, ${p.alpha})`;
      ctx.fill();

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
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

  // Pause when tab hidden
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
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


// ===== COUNTER ANIMATION =====
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
})();


// ===== NAVBAR =====
(function initNavbar() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });

    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Highlight active section
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
    { threshold: 0.4 }
  );

  sections.forEach(s => sectionObserver.observe(s));
})();


// ===== FLIP CARDS =====
(function initFlipCards() {
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
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

      // Update tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update panels
      panels.forEach(p => p.classList.remove('active'));
      const target = document.getElementById(`panel-${domain}`);
      if (target) target.classList.add('active');
    });
  });
})();


// ===== ACCORDION =====
(function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');

      // Close all siblings in same accordion group
      const siblings = item.closest('.competencies-accordion').querySelectorAll('.accordion-item');
      siblings.forEach(sib => {
        if (sib !== item) {
          sib.classList.remove('open');
          sib.querySelector('.accordion-body').classList.remove('open');
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      body.classList.toggle('open', !isOpen);
    });
  });
})();


// ===== COMPETENCY GRID FILTER =====
(function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.comp-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.domain === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          // Trigger reflow
          void card.offsetWidth;
          card.style.animation = 'fade-card-in 0.3s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Inject keyframe if not present
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fade-card-in {
      from { opacity: 0; transform: scale(0.95) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();


// ===== QUIZ =====
(function initQuiz() {
  const questions = [
    {
      q: 'מה כולל המושג "אוריינות AI" לפי מסגרת AILit?',
      opts: [
        'רק ידע טכני על תכנות ואלגוריתמים',
        'ידע, מיומנויות ועמדות הנוגעים לבינה מלאכותית',
        'רק שימוש בכלי AI כמו ChatGPT',
        'הבנה מתמטית מעמיקה של מודלים'
      ],
      correct: 1
    },
    {
      q: 'כמה תחומי ליבה כוללת מסגרת AILit?',
      opts: ['2 תחומים', '3 תחומים', '4 תחומים', '6 תחומים'],
      correct: 2
    },
    {
      q: 'מה עיקר תחום "יצירה עם AI"?',
      opts: [
        'עיצוב אלגוריתמים ממחשב',
        'ניהול מערכות AI בארגונים',
        'שיתוף פעולה עם AI לרעיונות ופתרון בעיות',
        'הכשרת מודלי למידת מכונה'
      ],
      correct: 2
    },
    {
      q: 'מהי "הזיה" (Hallucination) בהקשר של מודלי AI?',
      opts: [
        'תופעה ויזואלית בממשק המשתמש',
        'עדכון אוטומטי של המודל',
        'כאשר AI מייצר מידע שגוי בביטחון מלא',
        'שגיאה בתשתית החישובית'
      ],
      correct: 2
    },
    {
      q: 'למה חשוב לשמור על "פיקוח אנושי" על מערכות AI?',
      opts: [
        'כדי להאט את קצב הפיתוח הטכנולוגי',
        'כדי לוודא שהחלטות AI עולות בקנה אחד עם ערכים ואחריות אנושית',
        'כדי להחליף AI בעובדים אנושיים',
        'כדי להקטין עלויות תפעוליות'
      ],
      correct: 1
    },
    {
      q: 'מהו "Prompt" בהקשר של מודלי שפה גדולים (LLMs)?',
      opts: [
        'סוג מיוחד של מחשב',
        'שגיאה בקוד התוכנה',
        'הנחיה, שאלה או קלט הניתן למערכת AI לקבלת תגובה',
        'כלי לאימון מחדש של מודל'
      ],
      correct: 2
    },
    {
      q: 'כיצד הטיות בנתוני אימון משפיעות על מערכות AI?',
      opts: [
        'הן משפרות את ביצועי המודל',
        'הן עלולות לגרום לתוצאות לא הוגנות כלפי קבוצות מסוימות',
        'הן אינן משפיעות על הפלטים',
        'הן רלוונטיות רק במערכות ישנות'
      ],
      correct: 1
    },
    {
      q: 'מה ההבדל העיקרי בין תחום "ניהול AI" לתחום "עיצוב AI"?',
      opts: [
        'אין הבדל מהותי בין השניים',
        'עיצוב מיועד רק לאנשי טכנולוגיה',
        'ניהול עוסק בהאצלת משימות ופיקוח; עיצוב עוסק בהבנת עקרונות ובנייה',
        'ניהול כולל כתיבת קוד בלבד'
      ],
      correct: 2
    }
  ];

  const letters = ['א', 'ב', 'ג', 'ד'];
  let current = 0;
  let score = 0;
  let answered = false;

  const container = document.getElementById('quizContainer');
  const content = document.getElementById('quizContent');
  const nextBtn = document.getElementById('quizNextBtn');
  const resultDiv = document.getElementById('quizResult');
  const progressFill = document.getElementById('quizProgress');
  const questionNum = document.getElementById('questionNum');

  if (!container) return;

  function showQuestion(index) {
    answered = false;
    nextBtn.style.display = 'none';
    resultDiv.style.display = 'none';
    content.style.display = 'block';

    const q = questions[index];
    const progress = (index / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    questionNum.textContent = index + 1;

    content.innerHTML = `
      <div class="quiz-question">
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

    // Attach handlers
    content.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => selectAnswer(btn, q.correct));
    });
  }

  function selectAnswer(btn, correct) {
    if (answered) return;
    answered = true;

    const selected = parseInt(btn.dataset.index, 10);
    const allOptions = content.querySelectorAll('.quiz-option');

    allOptions.forEach(opt => {
      opt.disabled = true;
      const idx = parseInt(opt.dataset.index, 10);
      if (idx === correct) opt.classList.add('correct');
      else if (opt === btn && selected !== correct) opt.classList.add('wrong');
    });

    if (selected === correct) score++;

    nextBtn.style.display = 'inline-flex';
    nextBtn.textContent = current < questions.length - 1 ? 'הבא ←' : 'סיום ✓';
  }

  function showResult() {
    content.style.display = 'none';
    nextBtn.style.display = 'none';
    progressFill.style.width = '100%';
    questionNum.textContent = questions.length;

    const pct = Math.round((score / questions.length) * 100);
    let icon, title, desc, levelText, levelBg;

    if (score <= 3) {
      icon = '🌱';
      title = 'מתחיל — יש לאן לצמוח!';
      desc = 'אוריינות AI היא מיומנות חדשה — וזה בסדר גמור להתחיל מהבסיס. המסגרת כאן בדיוק בשבילך! חקור את ה-4 תחומים ו-22 הכישורים כדי להתחיל את המסע.';
      levelText = '🌱 מתחיל';
      levelBg = 'background: rgba(46,125,50,0.2); color: #4caf50; border: 1px solid #4caf50;';
    } else if (score <= 6) {
      icon = '🚀';
      title = 'מתקדם — ידע טוב!';
      desc = 'יש לך בסיס טוב! אתה מבין את עקרונות האוריינות ב-AI ויכול להרחיב את הידע בתחומים ספציפיים — בעיקר בניהול ועיצוב מערכות AI.';
      levelText = '🚀 מתקדם';
      levelBg = 'background: rgba(2,136,209,0.2); color: #29b6f6; border: 1px solid #29b6f6;';
    } else {
      icon = '🌟';
      title = 'מומחה — כל הכבוד!';
      desc = 'ידע מרשים! אתה מבין לעומק את מסגרת אוריינות ה-AI. המשך לחקור, ושתף את הידע עם אחרים — האוריינות מתחזקת כשמלמדים אותה!';
      levelText = '🌟 מומחה';
      levelBg = 'background: rgba(230,81,0,0.2); color: #ff9800; border: 1px solid #ff9800;';
    }

    document.getElementById('resultIcon').textContent = icon;
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultScore').textContent = `${score} / ${questions.length}`;
    document.getElementById('resultDesc').textContent = desc;

    const levelEl = document.getElementById('resultLevel');
    levelEl.textContent = levelText;
    levelEl.style.cssText = levelBg + ' padding: 10px 32px; border-radius: 100px; font-size: 1.1rem; font-weight: 700; margin-bottom: 24px; display: inline-block;';

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

  document.getElementById('quizRetryBtn').addEventListener('click', () => {
    current = 0;
    score = 0;
    answered = false;
    showQuestion(0);
  });

  // Init
  showQuestion(0);
})();


// ===== TIMELINE DRAG SCROLL =====
(function initTimelineDrag() {
  const slider = document.querySelector('.timeline-scroll');
  if (!slider) return;

  let isDown = false;
  let startX;
  let scrollLeft;

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


// ===== SMOOTH SCROLL FOR NAV LINKS =====
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


// ===== KEYBOARD ACCESSIBILITY =====
(function initKeyboard() {
  // Allow Enter/Space on accordion headers
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  // Allow Enter on flip cards
  document.querySelectorAll('.flip-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'לחץ להפוך כרטיס');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
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

  // Close on Escape
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

  // Auto-resize textarea
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
        buffer = lines.pop(); // keep incomplete last line

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

// ===== DOMAIN TAB KEYBOARD NAV =====
(function initTabKeyboard() {
  const tabs = document.querySelectorAll('.domain-tab');
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
