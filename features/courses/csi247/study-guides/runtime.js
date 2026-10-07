// Shared by the website and offline files. Listeners are scoped and disposed.
export function initializeChapter(scope) {
  const listeners = [], timers = [];
  const on = (node, event, callback, options) => {
    if (!node) return;
    node.addEventListener(event, callback, options);
    listeners.push(() => node.removeEventListener(event, callback, options));
  };
  // Deep links and the site's own TOC must reveal their collapsed destination.
  const revealHash = () => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target || !scope.contains(target)) return;
    for (let node = target; node && node !== scope; node = node.parentElement) {
      if (node.tagName === 'DETAILS') node.open = true;
    }
    target.querySelector(':scope > details.lesson-detail')?.setAttribute('open', '');
  };
  on(window, 'hashchange', revealHash);
  revealHash();
  const themeButton = scope.querySelector('[data-theme-toggle]');
  if (themeButton) {
    const root = document.documentElement;
    const setTheme = theme => {
      root.dataset.theme = theme;
      themeButton.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
      try { localStorage.setItem('csi247-guide-theme', theme); } catch {}
    };
    let stored;
    try { stored = localStorage.getItem('csi247-guide-theme'); } catch {}
    setTheme(stored === 'dark' || stored === 'light' ? stored : 'light');
    on(themeButton, 'click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  }
  on(window, 'beforeprint', () => scope.querySelectorAll('details').forEach(node => { node.dataset.wasOpen = String(node.open); node.open = true; }));
  on(window, 'afterprint', () => scope.querySelectorAll('details').forEach(node => { if ('wasOpen' in node.dataset) node.open = node.dataset.wasOpen === 'true'; }));
  const toc = scope.querySelector('.toc'), tocButton = scope.querySelector('.toc-title');
  const setToc = open => {
    toc?.classList.toggle('open', open);
    tocButton?.setAttribute('aria-expanded', String(open));
    const mark = scope.querySelector('.toc-mark');
    if (mark) mark.textContent = open ? '−' : '+';
  };
  on(tocButton, 'click', () => setToc(!toc.classList.contains('open')));
  on(window, 'resize', () => setToc(innerWidth > 760));
  setToc(innerWidth > 760);
  scope.querySelectorAll('.toc a').forEach(link => on(link, 'click', () => { if (innerWidth <= 760) setToc(false); }));
  const progress = scope.querySelector('.progress');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  };
  on(window, 'scroll', updateProgress, { passive: true });
  updateProgress();
  scope.querySelectorAll('.copy-btn').forEach(button => on(button, 'click', async () => {
    const code = button.closest('.code-panel')?.querySelector('pre');
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = 'Copied';
      timers.push(setTimeout(() => { button.textContent = 'Copy code'; }, 1600));
    } catch {
      const range = document.createRange(); range.selectNodeContents(code);
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      button.textContent = 'Selected: press Ctrl+C';
    }
  }));
  scope.querySelectorAll('[data-player]').forEach(container => {
    const frames = [...container.querySelectorAll('[data-frame]')], rows = [...container.querySelectorAll('[data-row]')];
    let selected = 0;
    const select = index => {
      selected = Math.max(0, Math.min(frames.length - 1, index));
      frames.forEach((frame, i) => { frame.hidden = i !== selected; });
      rows.forEach((row, i) => { if (i === selected) row.setAttribute('aria-current', 'step'); else row.removeAttribute('aria-current'); });
      container.querySelector('[data-progress]').textContent = 'Step ' + (selected + 1) + ' of ' + frames.length;
      container.querySelector('[data-current]').textContent = 'Current step ' + (selected + 1) + ': ' + [...rows[selected].cells].slice(1).map(c => c.textContent).join(' | ');
      container.querySelector('[data-action=prev]').disabled = selected === 0;
      container.querySelector('[data-action=next]').disabled = selected === frames.length - 1;
    };
    on(container, 'click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.dataset.action === 'next') select(selected + 1);
      if (button.dataset.action === 'prev') select(selected - 1);
      if (button.dataset.action === 'reset') select(0);
      if (button.dataset.jump !== undefined) select(Number(button.dataset.jump));
    });
    select(0);
  });
  scope.querySelectorAll('[data-topic-quiz]').forEach(form => {
    const questions = [...form.querySelectorAll('.quiz-question')];
    const update = () => {
      let answered = 0, score = 0;
      questions.forEach(question => {
        const selected = question.querySelector('input:checked'), feedback = question.querySelector('.quiz-feedback');
        feedback.hidden = !selected;
        question.removeAttribute('data-correct');
        if (!selected) return;
        answered++;
        const correct = selected.value === question.dataset.answer;
        if (correct) score++;
        question.dataset.correct = String(correct);
        feedback.textContent = (correct ? 'Correct. ' : 'Try again. ') + question.querySelector('template').content.textContent;
      });
      form.querySelector('.quiz-score').textContent = 'Answered ' + answered + ' of ' + questions.length + ' · ' + score + ' correct';
    };
    on(form, 'change', update);
    on(form, 'submit', event => event.preventDefault());
    // A reset event fires before the browser clears checked controls. Defer
    // until the default action has run, not merely until the next microtask.
    on(form, 'reset', () => { timers.push(setTimeout(update, 0)); });
  });
  return () => { listeners.forEach(dispose => dispose()); timers.forEach(clearTimeout); };
}
