// Portal behaviour: agent adapter tabs (the real argv from the registry),
// copy-to-clipboard with a toast, and the UI Elements section rendered from
// the exported run's foundation inventory.

const AGENTS = {
  codex: {
    label: 'codex exec',
    argv: 'codex exec -C <worktree> -s workspace-write --json -o agent-last-message.md -',
    note: 'Prompt 走 stdin；仓库文件一律当作数据，不当作指令。',
    copy: 'codex exec -C <worktree> -s workspace-write --json -o agent-last-message.md -'
  },
  'claude-code': {
    label: 'claude -p',
    argv: 'claude -p --output-format stream-json --verbose --permission-mode acceptEdits \\\n  --bare --disallowed-tools "Bash(git push:*) Bash(git remote:*) Bash(git config:*) WebFetch"',
    note: '--bare 跳过 CLAUDE.md 自动加载：被审仓库无法通过记忆文件给 agent 下指令。',
    copy: 'claude -p --output-format stream-json --verbose --permission-mode acceptEdits --bare --disallowed-tools "Bash(git push:*) Bash(git remote:*) Bash(git config:*) WebFetch"'
  }
};

const argvPre = document.getElementById('agent-argv');
const noteP = document.getElementById('agent-note');
const labelSpan = document.getElementById('agent-label');
const copyButton = document.getElementById('agent-copy');

function selectAgent(id) {
  const agent = AGENTS[id];
  if (!agent || !argvPre) return;
  labelSpan.textContent = agent.label;
  argvPre.textContent = agent.argv;
  noteP.textContent = agent.note;
  copyButton.dataset.copy = agent.copy;
}

for (const tab of document.querySelectorAll('.pd-tab')) {
  tab.addEventListener('click', () => {
    for (const other of document.querySelectorAll('.pd-tab')) other.setAttribute('aria-selected', String(other === tab));
    selectAgent(tab.dataset.agent);
  });
}
selectAgent('codex');

/* ---- UI Elements: render the real foundation inventory from the exported
   run (foundation-extractor skill result). Observed entries only — the
   portal states the distinction because the harness enforces it. ---- */
async function renderFoundation() {
  const tokenRoot = document.getElementById('pd-tokens');
  const componentRoot = document.getElementById('pd-components');
  if (!tokenRoot || !componentRoot) return;
  try {
    const response = await fetch('/runs/06dabc2c/skills/foundation-extractor.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    const update = result.proposedUpdates.find(item => item.type === 'design-foundation');
    if (!update) throw new Error('no foundation update in the skill result');

    document.getElementById('pd-token-count').textContent = String(update.tokens.length);
    document.getElementById('pd-component-count').textContent = String(update.components.length);

    for (const token of update.tokens) {
      const chip = document.createElement('span');
      chip.className = 'pd-token-chip font-mono';
      chip.textContent = token.name;
      chip.title = `${token.sourceCount} 个文件引用 · ${token.sources[0] || ''}`;
      tokenRoot.appendChild(chip);
    }

    for (const component of update.components) {
      const card = document.createElement('div');
      card.className = 'pd-card rounded-2xl border border-sep bg-surface p-5';
      const name = document.createElement('h3');
      name.className = 'text-[15px] font-semibold text-label-primary';
      name.textContent = component.name;
      const source = document.createElement('p');
      source.className = 'font-mono mt-1 text-[11px] text-label-quaternary';
      source.textContent = component.source;
      const status = document.createElement('span');
      status.className = 'font-mono mt-3 inline-block rounded-full border border-sep px-2.5 py-0.5 text-[10px] tracking-[0.14em] text-label-tertiary';
      status.textContent = `STATUS · ${component.status.toUpperCase()}`;
      card.append(name, source, status);
      componentRoot.appendChild(card);
    }
  } catch (error) {
    const note = document.createElement('p');
    note.className = 'text-[13.5px] text-label-tertiary';
    note.textContent = `设计基础数据未加载（${error.message}）。本地运行 harness export 后此处会显示真实盘点。`;
    tokenRoot.appendChild(note);
  }
}
renderFoundation();

/* ---- Copy to clipboard with their button treatment as the toast. ---- */
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toast-text').textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(1rem)';
  }, 1800);
}

for (const button of document.querySelectorAll('[data-copy]')) {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      showToast('已复制到剪贴板');
    } catch {
      showToast('复制失败：浏览器拒绝了剪贴板访问');
    }
  });
}
