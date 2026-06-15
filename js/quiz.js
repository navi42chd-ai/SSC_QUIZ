// QUIZ ENGINE — Free Navigation + Go To Question

let state = {
  screen: 'subject',
  subject: null,
  chapter: null,
  questions: [],
  current: 0,
  answered: [],   // chosen answer index per question (null = unattempted)
  startTime: null
};

// ── SCREEN NAVIGATION ────────────────────────────────────────

function goTo(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + screen).classList.add('active');
  state.screen = screen;
  window.scrollTo(0, 0);
}

function goSubjects() {
  state.subject = null;
  state.chapter = null;
  renderSubjects();
  goTo('subject');
}

function goChapters() {
  state.chapter = null;
  renderChapters(state.subject);
  goTo('chapter');
}

// ── SUBJECT SCREEN ───────────────────────────────────────────

function renderSubjects() {
  const grid = document.getElementById('subject-grid');
  grid.innerHTML = '';
  SUBJECTS.forEach(sub => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.setProperty('--accent', sub.color);
    card.style.setProperty('--accent-light', sub.colorLight);
    card.innerHTML = `
      <div class="card-icon">${sub.icon}</div>
      <div class="card-title">${sub.label}</div>
      <div class="card-meta">${sub.chapters.length} chapter${sub.chapters.length > 1 ? 's' : ''}</div>
      <div class="card-arrow">→</div>`;
    card.addEventListener('click', () => selectSubject(sub.id));
    grid.appendChild(card);
  });
}

function selectSubject(subjectId) {
  state.subject = SUBJECTS.find(s => s.id === subjectId);
  renderChapters(state.subject);
  goTo('chapter');
}

// ── CHAPTER SCREEN ───────────────────────────────────────────

function renderChapters(subject) {
  document.getElementById('chapter-subject-title').textContent = subject.label;
  document.getElementById('chapter-subject-icon').textContent = subject.icon;
  const grid = document.getElementById('chapter-grid');
  grid.innerHTML = '';
  subject.chapters.forEach(ch => {
    const data = window[ch.dataVar];
    const card = document.createElement('div');
    card.className = 'card';
    card.style.setProperty('--accent', subject.color);
    card.style.setProperty('--accent-light', subject.colorLight);
    card.innerHTML = `
      <div class="card-icon">${subject.icon}</div>
      <div class="card-title">${ch.label}</div>
      <div class="card-meta">${data ? data.questions.length + ' questions' : 'No data'}</div>
      <div class="card-arrow">→</div>`;
    card.addEventListener('click', () => selectChapter(ch));
    grid.appendChild(card);
  });
}

function selectChapter(chapter) {
  const data = window[chapter.dataVar];
  if (!data) { alert('Chapter data not found.'); return; }
  state.chapter = chapter;
  state.questions = [...data.questions];
  state.current = 0;
  state.answered = new Array(state.questions.length).fill(null);
  state.startTime = Date.now();
  renderQuestion();
  goTo('quiz');
}

// ── QUIZ SCREEN ──────────────────────────────────────────────

function renderQuestion() {
  const q     = state.questions[state.current];
  const total = state.questions.length;
  const idx   = state.current;

  // breadcrumb
  document.getElementById('quiz-breadcrumb').innerHTML =
    `<span class="bc-link" onclick="goSubjects()">Subjects</span>
     <span class="bc-sep">/</span>
     <span class="bc-link" onclick="goChapters()">${state.subject.label}</span>
     <span class="bc-sep">/</span>
     <span class="bc-current">${state.chapter.label}</span>`;

  // progress
  const attempted = state.answered.filter(a => a !== null).length;
  document.getElementById('prog-bar').style.width = Math.round(((idx + 1) / total) * 100) + '%';
  document.getElementById('prog-text').textContent = `Q ${idx + 1} / ${total}`;
  document.getElementById('prog-attempted').textContent = `${attempted} attempted`;

  // question
  document.getElementById('q-text').textContent = q.q;

  // options — always clickable (free navigation)
  const labels  = ['A', 'B', 'C', 'D'];
  const optsEl  = document.getElementById('options');
  optsEl.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="opt-label">${labels[i]}</span><span class="opt-text">${opt}</span>`;
    btn.addEventListener('click', () => answer(i));
    optsEl.appendChild(btn);
  });

  // restore previous answer state if already answered
  const prev = state.answered[idx];
  const fb   = document.getElementById('feedback-box');
  if (prev !== null) {
    showAnswer(prev, q.ans, q.exp, false);
  } else {
    fb.className = 'feedback-box';
    fb.innerHTML = '';
  }

  updateNavButtons();
}

function answer(chosen) {
  const q = state.questions[state.current];
  state.answered[state.current] = chosen;
  showAnswer(chosen, q.ans, q.exp, true);
  updateNavButtons();
  // update attempted counter
  const attempted = state.answered.filter(a => a !== null).length;
  document.getElementById('prog-attempted').textContent = `${attempted} attempted`;
}

function showAnswer(chosen, correct, exp, animate) {
  const btns = document.querySelectorAll('.option-btn');
  btns.forEach(b => { b.disabled = true; b.classList.remove('correct','wrong','reveal'); });
  const isCorrect = chosen === correct;
  btns[chosen].classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect) btns[correct].classList.add('reveal');
  const fb = document.getElementById('feedback-box');
  fb.className = 'feedback-box show ' + (isCorrect ? 'correct' : 'wrong');
  fb.innerHTML = `<strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong> ${exp}`;
}

function updateNavButtons() {
  const idx   = state.current;
  const total = state.questions.length;
  document.getElementById('btn-prev').style.display = idx > 0 ? 'inline-flex' : 'none';
  document.getElementById('btn-next').style.display = idx < total - 1 ? 'inline-flex' : 'none';
  document.getElementById('btn-end').style.display  = idx === total - 1 ? 'inline-flex' : 'none';
}

function prevQuestion() {
  if (state.current > 0) { state.current--; renderQuestion(); }
}

function nextQuestion() {
  if (state.current < state.questions.length - 1) { state.current++; renderQuestion(); }
}

// ── GO TO QUESTION ───────────────────────────────────────────

function openGotoModal() {
  const total = state.questions.length;
  document.getElementById('goto-range').textContent = `Enter a number between 1 and ${total}`;
  document.getElementById('goto-modal').classList.add('open');
  document.getElementById('goto-input').value = '';
  document.getElementById('goto-input').focus();
  document.getElementById('goto-error').textContent = '';
}

function closeGotoModal() {
  document.getElementById('goto-modal').classList.remove('open');
}

function submitGoto() {
  const input = document.getElementById('goto-input');
  const err   = document.getElementById('goto-error');
  const val   = parseInt(input.value, 10);
  const total = state.questions.length;
  if (isNaN(val) || val < 1 || val > total) {
    err.textContent = `Enter a number between 1 and ${total}`;
    return;
  }
  state.current = val - 1;
  closeGotoModal();
  renderQuestion();
}

// allow Enter key in goto input
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('goto-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') submitGoto();
    if (e.key === 'Escape') closeGotoModal();
  });
  // close modal on backdrop click
  document.getElementById('goto-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('goto-modal')) closeGotoModal();
  });
  renderSubjects();
  goTo('subject');
});

// ── RESULT SCREEN ────────────────────────────────────────────

function endQuiz() {
  const total     = state.questions.length;
  const correct   = state.answered.filter((a, i) => a === state.questions[i].ans).length;
  const attempted = state.answered.filter(a => a !== null).length;
  const pct       = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const elapsed   = Math.round((Date.now() - state.startTime) / 1000);
  const mins = Math.floor(elapsed / 60), secs = elapsed % 60;

  const grade =
    pct >= 90 ? { label: 'Excellent!',        color: '#0F6E56' } :
    pct >= 75 ? { label: 'Good work!',         color: '#185FA5' } :
    pct >= 50 ? { label: 'Keep revising',      color: '#BA7517' } :
                { label: 'Needs more practice',color: '#A32D2D' };

  document.getElementById('result-breadcrumb').innerHTML =
    `<span class="bc-link" onclick="goSubjects()">Subjects</span>
     <span class="bc-sep">/</span>
     <span class="bc-link" onclick="goChapters()">${state.subject.label}</span>
     <span class="bc-sep">/</span>
     <span class="bc-current">Results</span>`;

  document.getElementById('res-pct').textContent       = pct + '%';
  document.getElementById('res-grade').textContent     = grade.label;
  document.getElementById('res-grade').style.color     = grade.color;
  document.getElementById('res-chapter').textContent   = `${state.chapter.label}`;
  document.getElementById('res-correct').textContent   = correct;
  document.getElementById('res-wrong').textContent     = attempted - correct;
  document.getElementById('res-skipped').textContent   = total - attempted;
  document.getElementById('res-attempted').textContent = attempted;
  document.getElementById('res-total').textContent     = total;
  document.getElementById('res-time').textContent      = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  goTo('result');
}

function retryQuiz() { selectChapter(state.chapter); }
