// QUIZ ENGINE — Free Navigation, No Scoring

let state = {
  screen: 'subject',
  subject: null,
  chapter: null,
  questions: [],
  current: 0,
  answered: [],   // array of chosen answer index per question (null if not answered)
  startTime: null
};

// ── NAVIGATION ──────────────────────────────────────────────

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

// ── SUBJECT SCREEN ──────────────────────────────────────────

function renderSubjects() {
  const grid = document.getElementById('subject-grid');
  grid.innerHTML = '';
  SUBJECTS.forEach(sub => {
    const card = document.createElement('div');
    card.className = 'card subject-card';
    card.style.setProperty('--accent', sub.color);
    card.style.setProperty('--accent-light', sub.colorLight);
    card.innerHTML = `
      <div class="card-icon">${sub.icon}</div>
      <div class="card-title">${sub.label}</div>
      <div class="card-meta">${sub.chapters.length} chapter${sub.chapters.length > 1 ? 's' : ''}</div>
      <div class="card-arrow">→</div>
    `;
    card.addEventListener('click', () => selectSubject(sub.id));
    grid.appendChild(card);
  });
}

function selectSubject(subjectId) {
  state.subject = SUBJECTS.find(s => s.id === subjectId);
  renderChapters(state.subject);
  goTo('chapter');
}

// ── CHAPTER SCREEN ──────────────────────────────────────────

function renderChapters(subject) {
  document.getElementById('chapter-subject-title').textContent = subject.label;
  document.getElementById('chapter-subject-icon').textContent = subject.icon;

  const grid = document.getElementById('chapter-grid');
  grid.innerHTML = '';
  subject.chapters.forEach(ch => {
    const data = getChapterData(ch.dataVar);
    const card = document.createElement('div');
    card.className = 'card chapter-card';
    card.style.setProperty('--accent', subject.color);
    card.style.setProperty('--accent-light', subject.colorLight);
    card.innerHTML = `
      <div class="chapter-number">${subject.icon}</div>
      <div class="card-title">${ch.label}</div>
      <div class="card-meta">${data ? data.questions.length : '?'} questions</div>
      <div class="card-arrow">→</div>
    `;
    card.addEventListener('click', () => selectChapter(ch));
    grid.appendChild(card);
  });
}

function getChapterData(varName) {
  return window[varName] || null;
}

function selectChapter(chapter) {
  const data = getChapterData(chapter.dataVar);
  if (!data) {
    alert('Chapter data not found. Make sure all data files are loaded.');
    return;
  }
  state.chapter = chapter;
  state.questions = [...data.questions];   // no shuffle — keep order
  state.current = 0;
  state.answered = new Array(state.questions.length).fill(null);
  state.startTime = Date.now();
  renderQuestion();
  goTo('quiz');
}

// ── QUIZ SCREEN ─────────────────────────────────────────────

function renderQuestion() {
  const q = state.questions[state.current];
  const total = state.questions.length;
  const idx = state.current;
  const pct = Math.round(((idx + 1) / total) * 100);

  // breadcrumb
  document.getElementById('quiz-breadcrumb').innerHTML =
    `<span class="bc-link" onclick="goSubjects()">Subjects</span>
     <span class="bc-sep">/</span>
     <span class="bc-link" onclick="goChapters()">${state.subject.label}</span>
     <span class="bc-sep">/</span>
     <span class="bc-current">${state.chapter.label}</span>`;

  // progress
  document.getElementById('prog-bar').style.width = pct + '%';
  document.getElementById('prog-text').textContent = `${idx + 1} / ${total}`;

  // question
  document.getElementById('q-text').textContent = q.q;

  // options
  const labels = ['A', 'B', 'C', 'D'];
  const optsEl = document.getElementById('options');
  optsEl.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="opt-label">${labels[i]}</span><span class="opt-text">${opt}</span>`;
    btn.addEventListener('click', () => answer(i));
    optsEl.appendChild(btn);
  });

  // restore previous answer if navigated back
  const prevAnswer = state.answered[idx];
  if (prevAnswer !== null) {
    showAnswer(prevAnswer, q.ans, q.exp);
  } else {
    // hide feedback
    const fb = document.getElementById('feedback-box');
    fb.className = 'feedback-box';
    fb.innerHTML = '';
  }

  // nav buttons
  updateNavButtons();
}

function answer(chosen) {
  // allow re-answering — just update
  const q = state.questions[state.current];
  state.answered[state.current] = chosen;
  showAnswer(chosen, q.ans, q.exp);
  updateNavButtons();
}

function showAnswer(chosen, correct, exp) {
  const labels = ['A', 'B', 'C', 'D'];
  const btns = document.querySelectorAll('.option-btn');
  btns.forEach(b => {
    b.disabled = true;
    b.classList.remove('correct', 'wrong', 'reveal');
  });

  const isCorrect = chosen === correct;
  btns[chosen].classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect) btns[correct].classList.add('reveal');

  const fb = document.getElementById('feedback-box');
  fb.className = 'feedback-box show ' + (isCorrect ? 'correct' : 'wrong');
  fb.innerHTML = `<strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong> ${exp}`;
}

function updateNavButtons() {
  const idx = state.current;
  const total = state.questions.length;
  const answered = state.answered[idx] !== null;

  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const endBtn  = document.getElementById('btn-end');

  // prev: always show except on first question
  prevBtn.style.display = idx > 0 ? 'inline-flex' : 'none';

  // next/end: only show after answering
  if (answered) {
    if (idx < total - 1) {
      nextBtn.style.display = 'inline-flex';
      endBtn.style.display = 'none';
    } else {
      nextBtn.style.display = 'none';
      endBtn.style.display = 'inline-flex';
    }
  } else {
    nextBtn.style.display = 'none';
    endBtn.style.display = 'none';
  }
}

function prevQuestion() {
  if (state.current > 0) {
    state.current--;
    renderQuestion();
  }
}

function nextQuestion() {
  if (state.current < state.questions.length - 1) {
    state.current++;
    renderQuestion();
  }
}

function endQuiz() {
  showResult();
}

// ── RESULT SCREEN ────────────────────────────────────────────

function showResult() {
  const total = state.questions.length;
  const correct = state.answered.filter((a, i) => a === state.questions[i].ans).length;
  const attempted = state.answered.filter(a => a !== null).length;
  const pct = Math.round((correct / total) * 100);
  const elapsed = Math.round((Date.now() - state.startTime) / 1000);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  const grade =
    pct >= 90 ? { label: 'Excellent!', color: '#0F6E56' } :
    pct >= 75 ? { label: 'Good work!', color: '#185FA5' } :
    pct >= 50 ? { label: 'Keep revising', color: '#BA7517' } :
                { label: 'Needs more practice', color: '#A32D2D' };

  document.getElementById('result-breadcrumb').innerHTML =
    `<span class="bc-link" onclick="goSubjects()">Subjects</span>
     <span class="bc-sep">/</span>
     <span class="bc-link" onclick="goChapters()">${state.subject.label}</span>
     <span class="bc-sep">/</span>
     <span class="bc-current">Results</span>`;

  document.getElementById('res-pct').textContent = pct + '%';
  document.getElementById('res-grade').textContent = grade.label;
  document.getElementById('res-grade').style.color = grade.color;
  document.getElementById('res-chapter').textContent = `${state.subject.label} · ${state.chapter.label}`;
  document.getElementById('res-correct').textContent = correct;
  document.getElementById('res-wrong').textContent = attempted - correct;
  document.getElementById('res-attempted').textContent = attempted;
  document.getElementById('res-total').textContent = total;
  document.getElementById('res-time').textContent = timeStr;

  goTo('result');
}

function retryQuiz() {
  selectChapter(state.chapter);
}

// ── INIT ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  renderSubjects();
  goTo('subject');
});
