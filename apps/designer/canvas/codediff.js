// Code Diff view: renders diff.patch hunk by hunk (B2/D4).
// Old runs without a patch degrade to the changed-file list, labelled honestly.

export async function renderCodeDiff(container, run, base) {
  container.replaceChildren();

  const execution = run.manifest.execution;
  if (!execution) {
    const empty = document.createElement('p');
    empty.className = 'pd-codediff-empty';
    empty.textContent = '此 run 没有 agent 执行记录。';
    container.appendChild(empty);
    return;
  }

  // try to fetch the patch
  let patchText = null;
  try {
    const response = await fetch(`${base}/diff.patch`, { cache: 'no-store' });
    if (response.ok) patchText = await response.text();
  } catch { /* no patch file */ }

  const header = document.createElement('div');
  header.className = 'pd-codediff-header';

  if (patchText && patchText.trim()) {
    header.textContent = `${execution.changedFiles.length} files changed · ${execution.branch}`;
    container.appendChild(header);
    for (const file of parsePatch(patchText)) {
      container.appendChild(renderFile(file));
    }
  } else {
    header.textContent = '此 run 未存 patch 全文（旧格式 run）';
    const notice = document.createElement('p');
    notice.className = 'pd-codediff-notice';
    notice.textContent = '降级为变更文件清单。';
    container.append(header, notice);

    const list = document.createElement('ul');
    list.className = 'pd-codediff-files';
    for (const f of execution.changedFiles || []) {
      const li = document.createElement('li');
      li.className = 'font-mono';
      li.textContent = f;
      list.appendChild(li);
    }
    container.appendChild(list);
    if (execution.diffStat) {
      const pre = document.createElement('pre');
      pre.className = 'font-mono pd-codediff-stat';
      pre.textContent = execution.diffStat;
      container.appendChild(pre);
    }
  }
}

function parsePatch(patch) {
  const files = [];
  let current = null;
  for (const line of patch.split('\n')) {
    if (line.startsWith('diff --git')) {
      current = { hunks: [], name: line.replace(/diff --git a\/(\S+) b\/\S+/, '$1') };
      files.push(current);
    } else if (line.startsWith('@@') && current) {
      current.hunks.push({ header: line, lines: [] });
    } else if (current && current.hunks.length) {
      current.hunks[current.hunks.length - 1].lines.push(line);
    }
  }
  return files;
}

function renderFile(file) {
  const el = document.createElement('details');
  el.className = 'pd-codediff-file';
  const summary = document.createElement('summary');
  summary.className = 'font-mono';
  summary.textContent = file.name;
  el.appendChild(summary);

  for (const hunk of file.hunks) {
    const hunkEl = document.createElement('div');
    hunkEl.className = 'pd-codediff-hunk';
    const header = document.createElement('div');
    header.className = 'font-mono pd-codediff-hunk-header';
    header.textContent = hunk.header;
    hunkEl.appendChild(header);
    for (const line of hunk.lines) {
      const lineEl = document.createElement('div');
      lineEl.className = 'pd-codediff-line ' + (line.startsWith('+') ? 'add' : line.startsWith('-') ? 'del' : '');
      lineEl.textContent = line || ' ';
      hunkEl.appendChild(lineEl);
    }
    el.appendChild(hunkEl);
  }
  return el;
}
