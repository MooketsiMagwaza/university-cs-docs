// Small offline runtime. No React, imports, fetch calls or external dependencies.
(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const setTheme = (theme) => {
    root.dataset.theme = theme;
    themeButton.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    try { localStorage.setItem('csi247-guide-theme', theme); } catch {}
  };
  let stored;
  try { stored = localStorage.getItem('csi247-guide-theme'); } catch {}
  setTheme(stored === 'dark' || stored === 'light' ? stored : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  themeButton.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  const openDetails = () => document.querySelectorAll('details').forEach((node) => { node.dataset.wasOpen = String(node.open); node.open = true; });
  const restoreDetails = () => document.querySelectorAll('details').forEach((node) => { if ('wasOpen' in node.dataset) node.open = node.dataset.wasOpen === 'true'; });
  addEventListener('beforeprint', openDetails);
  addEventListener('afterprint', restoreDetails);
  document.querySelector('[data-print]').addEventListener('click', () => window.print());
  document.querySelectorAll('[data-player]').forEach((container) => {
    const frames = [...container.querySelectorAll('[data-frame]')];
    const rows = [...container.querySelectorAll('[data-row]')];
    const prev = container.querySelector('[data-action=prev]');
    const next = container.querySelector('[data-action=next]');
    let selected = 0;
    function select(index) {
      selected = Math.max(0, Math.min(frames.length - 1, index));
      frames.forEach((frame, i) => { frame.hidden = i !== selected; });
      rows.forEach((row, i) => { if (i === selected) row.setAttribute('aria-current', 'step'); else row.removeAttribute('aria-current'); });
      container.querySelector('[data-progress]').textContent = `Step ${selected + 1} of ${frames.length}`;
      container.querySelector('[data-current]').textContent = `Current step ${selected + 1}: ${[...rows[selected].cells].slice(1).map((cell) => cell.textContent).join(' | ')}`;
      prev.disabled = selected === 0;
      next.disabled = selected === frames.length - 1;
      // Scroll only the local table pane; keep the visual and controls in place.
      const pane = container.querySelector('.full-trace .table-wrap');
      if (container.querySelector('.full-trace').open) {
        const row = rows[selected], rowTop = row.offsetTop - pane.querySelector('table').offsetTop;
        if (rowTop < pane.scrollTop || rowTop + row.offsetHeight > pane.scrollTop + pane.clientHeight) pane.scrollTop = Math.max(0, rowTop - pane.clientHeight / 3);
      }
    }
    container.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.dataset.action === 'next') select(selected + 1);
      if (button.dataset.action === 'prev') select(selected - 1);
      if (button.dataset.action === 'reset') select(0);
      if (button.dataset.jump !== undefined) select(Number(button.dataset.jump));
    });
    select(0);
  });
})();
