import happyclaw from '../../examples/happyclaw-site/experience.json' with { type: 'json' };
import sample from '../../examples/vibe-coded-app/experience.json' with { type: 'json' };
import { assertExperienceSpec, rankedFindings, priority, codexBrief, recordJudgment } from '../../packages/experience-core/index.js';
import { workflowState } from '../../packages/harness-core/workflow.js';

const $ = id => document.getElementById(id);
const cases = { happyclaw, sample };
const RUNS_BASE = '/runs';
const RUN_PREFIX = 'run:';

const params = new URLSearchParams(location.search);
let caseId = 'happyclaw';
let spec = null;
let selected = null;
let run = null; // Set when an exported harness run is open.

const isRun = id => id.startsWith(RUN_PREFIX);
const runIdOf = id => id.slice(RUN_PREFIX.length);

function loadExample(id) {
  const base = structuredClone(cases[id]);
  try {
    const stored = JSON.parse(localStorage.getItem(`pd-review-${id}`) || 'null');
    if (stored && stored.version === base.version && stored.project.source === base.project.source) {
      base.review.judgment = stored.review.judgment;
      base.review.reason = stored.review.reason;
    }
  } catch { /* Invalid local draft is ignored. */ }
  return assertExperienceSpec(base);
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    const error = new Error(`${path} returned HTTP ${response.status}`);
    error.absent = response.status === 404;
    throw error;
  }
  // The Vite dev server answers a missing file with the HTML shell and HTTP 200,
  // so a non-JSON body means "not there", not "corrupt".
  if (!(response.headers.get('content-type') || '').includes('json')) {
    const error = new Error(`${path} did not return JSON`);
    error.absent = true;
    throw error;
  }
  return response.json();
}

// Exported runs are optional, so a missing index is the ordinary state before
// anyone runs `pnpm harness export`. Anything else — a wrong base path, a
// corrupt index — is reported, because a silent empty list looks identical to
// "no runs exported" and hides the real cause.
async function loadRunIndex() {
  try {
    const index = await fetchJson(`${RUNS_BASE}/index.json`);
    if (!Array.isArray(index.runs)) throw new Error('its "runs" field is not an array');
    return { runs: index.runs, problem: null };
  } catch (error) {
    if (error.absent) return { runs: [], problem: null };
    return { runs: [], problem: `Could not read ${RUNS_BASE}/index.json: ${error.message}. Exported runs are not listed.` };
  }
}

// `experience.json` is schema-checked by assertExperienceSpec; `run.json` has no
// schema, so check the shape this page dereferences before rendering it.
function assertRunManifest(manifest) {
  const fail = reason => { throw new Error(`Unusable run.json: ${reason}.`); };
  if (!manifest || typeof manifest !== 'object') fail('it is not an object');
  if (typeof manifest.id !== 'string') fail('it has no id');
  if (!manifest.captures || typeof manifest.captures !== 'object') fail('it has no captures');
  if (!Array.isArray(manifest.skills)) manifest.skills = [];
  if (manifest.judgment && typeof manifest.judgment.decision !== 'string') fail('the judgment has no decision');
  if (manifest.confirmation && typeof manifest.confirmation.verdict !== 'string') fail('the confirmation has no verdict');
  if (manifest.baseline && typeof manifest.baseline.reason !== 'string') fail('the recorded baseline has no reason');
  if (manifest.evaluation && (!manifest.evaluation.views || typeof manifest.evaluation.views !== 'object')) fail('the evaluation has no views');
  if (!Array.isArray(manifest.visualReviews)) manifest.visualReviews = [];
  return manifest;
}

const SAFE_REVIEW = /^reviews\/[a-z0-9-]+\.json$/;

async function loadReviews(manifest, base) {
  return Promise.all(manifest.visualReviews.map(async item => {
    if (!SAFE_REVIEW.test(item.path || '')) return { ...item, document: null, problem: 'Invalid review artifact path.' };
    try { return { ...item, document: await fetchJson(`${base}/${item.path}`), problem: null }; }
    catch (error) { return { ...item, document: null, problem: error.message }; }
  }));
}

async function loadBrief(manifest, base) {
  if (manifest.plan?.path !== 'codex-brief.md') return null;
  try {
    const response = await fetch(`${base}/codex-brief.md`, { cache: 'no-store' });
    return response.ok ? await response.text() : null;
  } catch { return null; }
}

async function loadRun(id) {
  const base = `${RUNS_BASE}/${encodeURIComponent(id)}`;
  const [manifest, runSpec] = await Promise.all([
    fetchJson(`${base}/run.json`),
    fetchJson(`${base}/experience.json`)
  ]);
  // A run before `harness diagnose` has no diagnosis; the page falls back to the
  // spec's authored findings rather than showing nothing.
  let diagnosis = null;
  if (manifest.diagnosis) {
    try {
      diagnosis = await fetchJson(`${base}/${manifest.diagnosis.path || 'diagnosis.json'}`);
    } catch { /* The ledger names it but the file was not published; fall back. */ }
  }
  assertRunManifest(manifest);
  const [reviews, brief] = await Promise.all([loadReviews(manifest, base), loadBrief(manifest, base)]);
  return { manifest, spec: assertExperienceSpec(runSpec), diagnosis, reviews, brief, base };
}

// The two sources describe a finding differently. Render from one shape so the
// list, the brief and the selection keep working whichever is present.
const LOOP_STEPS = [
  ['needs-baseline', 'Baseline captured'],
  ['needs-diagnosis', 'Evidence diagnosed'],
  ['awaiting-confirmation', 'Finding confirmed by a person'],
  ['needs-plan', 'Scope planned'],
  ['needs-execution', 'Agent edit executed'],
  ['needs-after-capture', 'Result re-rendered'],
  ['needs-structural-evaluation', 'Structural checks run'],
  ['needs-visual-qa', 'Independent Visual QA'],
  ['awaiting-judgment', 'Human decision']
];

function normalisedFindings(spec, diagnosis) {
  if (!diagnosis) {
    return rankedFindings(spec).map(item => ({
      id: item.id,
      title: item.title,
      priority: priority(item),
      status: 'authored-candidate',
      evidence: item.evidenceIds,
      proposal: item.proposal,
      impact: item.impact, confidence: item.confidence, effort: item.effort,
      inSpec: true
    }));
  }
  return diagnosis.findings.map(item => ({
    id: item.id,
    title: item.title,
    priority: item.priority,
    status: item.verificationStatus,
    evidence: item.evidenceRefs,
    proposal: item.proposal,
    impact: item.impact, confidence: item.confidence, effort: item.effort,
    inSpec: spec.findings.some(entry => entry.id === item.id)
  }));
}

function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function stage(manifest) {
  if (manifest.judgment) return `JUDGED / ${manifest.judgment.decision.toUpperCase()}`;
  const qa = manifest.visualReviews?.find(item => item.skillId === 'visual-qa-evaluator');
  if (qa) return `VISUAL QA / ${qa.verdict.toUpperCase()}`;
  if (manifest.evaluation) return 'EVALUATED';
  if (manifest.captures.after) return 'AFTER CAPTURED';
  if (manifest.execution) return 'EXECUTED';
  if (manifest.plan) return 'PLANNED';
  if (manifest.confirmation) return `CONFIRMED / ${manifest.confirmation.verdict.toUpperCase()}`;
  return 'BASELINE ONLY';
}

// Mirrors the export guard: a reference that does not name a file inside this
// run's own capture folder is treated as missing rather than requested. The ID
// alphabet matches captureKey, underscores included.
const SAFE_SHOT = /^(before|after)\/[a-z0-9_-]+\.png$/;

function captureItems(capture) {
  if (Array.isArray(capture?.states)) return capture.states;
  return Object.entries(capture?.viewports || {}).map(([configurationId, view]) => ({
    stateId: 'page', configurationId, legacy: true, reached: true, ...view
  }));
}

function shot(base, phase, entry) {
  const figure = document.createElement('figure');
  const caption = document.createElement('figcaption');
  const state = entry?.stateId || 'page';
  const configuration = entry?.configurationId || 'unknown';
  caption.textContent = `${phase} · ${state} · ${configuration}`;
  let reference = entry?.screenshot;
  if (reference && !SAFE_SHOT.test(reference)) reference = null;
  if (!reference) {
    const missing = document.createElement('p');
    missing.className = 'run-missing';
    missing.dataset.error = entry?.reached === false ? 'true' : 'false';
    missing.textContent = entry?.reached === false
      ? `State not reached: ${entry.error || 'replay failed'}`
      : 'Not captured';
    figure.append(missing, caption);
    return figure;
  }
  const image = document.createElement('img');
  image.loading = 'lazy';
  image.decoding = 'async';
  image.alt = `${phase} screenshot of ${state} in ${configuration}`;
  image.src = `${base}/${reference}`;
  figure.append(image, caption);
  return figure;
}

function renderReviews() {
  const root = $('run-reviews');
  root.replaceChildren();
  for (const item of run?.reviews || []) {
    const card = document.createElement('article');
    card.className = 'run-review';
    const title = document.createElement('strong');
    title.textContent = `${item.skillId} · ${(item.verdict || 'unknown').toUpperCase()}`;
    const rationale = document.createElement('p');
    rationale.textContent = item.problem || item.document?.rationale || 'No rationale was exported.';
    card.append(title, rationale);
    for (const finding of item.document?.findings || []) {
      const row = document.createElement('p');
      row.textContent = `${finding.title}: ${finding.observation}`;
      card.append(row);
    }
    root.append(card);
  }
}

function renderLoop() {
  const panel = $('loop-panel');
  if (!run) {
    panel.hidden = true;
    return;
  }
  panel.hidden = false;
  const state = workflowState(run.manifest);
  $('loop-stage').textContent = state.stage.replace(/-/g, ' ').toUpperCase();
  $('loop-next').textContent = state.next
    ? `Next: ${state.next}`
    : 'This run is complete. Every stage has a recorded artifact.';
  const reason = $('loop-reason');
  reason.hidden = !state.reason;
  reason.textContent = state.reason || '';
  reason.dataset.blocked = state.blocked ? 'true' : 'false';

  // A stage earlier in the order than the current one has produced its artifact.
  const current = LOOP_STEPS.findIndex(([id]) => id === state.stage);
  const track = $('loop-track');
  track.replaceChildren();
  for (const [index, [, label]] of LOOP_STEPS.entries()) {
    const item = document.createElement('li');
    const done = state.stage === 'complete' || (current !== -1 && index < current);
    item.dataset.state = done ? 'done' : (current === index ? 'current' : 'pending');
    item.textContent = label;
    track.append(item);
  }
}

function renderScore() {
  const box = $('score');
  const score = run?.diagnosis?.experienceScore;
  if (!score) {
    box.hidden = true;
    return;
  }
  box.hidden = false;
  box.replaceChildren();
  const headline = document.createElement('p');
  headline.className = 'score-headline';
  headline.textContent = score.status === 'scored'
    ? `Experience Score ${score.score} / 100 · ${score.evaluator?.name || 'evaluator'}@${score.evaluator?.version || '?'}`
    : 'Experience Score withheld — insufficient evidence';
  box.append(headline);
  const detail = document.createElement('p');
  detail.className = 'score-detail';
  detail.textContent = score.status === 'scored'
    ? `Evidence coverage ${Math.round((score.evidenceCoverage || 0) * 100)}%. A score is a heuristic quality signal, not conversion or user research.`
    : (score.missing || []).join(' ') || 'No rubric supplied.';
  box.append(detail);
}

function renderRun() {
  const panel = $('run-panel');
  if (!run) {
    panel.hidden = true;
    return;
  }
  panel.hidden = false;
  const { manifest, base } = run;
  $('run-id').textContent = manifest.id;
  $('run-stage').textContent = stage(manifest);

  const shots = $('run-shots');
  shots.replaceChildren();
  // Union both phases: a state captured only after a change still has to be
  // visible, rather than silently dropped because the baseline lacks it.
  const before = new Map(captureItems(manifest.captures.before).map(item => [`${item.stateId}--${item.configurationId}`, item]));
  const after = new Map(captureItems(manifest.captures.after).map(item => [`${item.stateId}--${item.configurationId}`, item]));
  const keys = [...new Set([...before.keys(), ...after.keys()])];
  for (const key of keys) {
    const beforeEntry = before.get(key);
    const afterEntry = after.get(key);
    const identity = beforeEntry || afterEntry;
    const pair = document.createElement('div');
    pair.className = 'run-pair';
    pair.append(
      shot(base, 'Before', beforeEntry || { stateId: identity.stateId, configurationId: identity.configurationId }),
      shot(base, 'After', afterEntry || { stateId: identity.stateId, configurationId: identity.configurationId })
    );
    shots.append(pair);
  }
  renderReviews();

  const rows = [];
  if (manifest.confirmation) {
    rows.push([`Finding ${manifest.confirmation.findingId}`, `${manifest.confirmation.verdict} — ${manifest.confirmation.note}`]);
  }
  if (manifest.execution) {
    rows.push(['Agent execution', `branch ${manifest.execution.branch} · log ${manifest.execution.logRetained ? 'retained locally, not published' : 'not retained'}`]);
  }
  for (const skill of manifest.skills) {
    rows.push([`Skill ${skill.id}`, `${skill.status} · v${skill.version}`]);
  }
  if (manifest.evaluation) {
    for (const [viewport, view] of Object.entries(manifest.evaluation.views)) {
      const failed = Object.entries(view.checks).filter(([, ok]) => !ok).map(([name]) => name);
      rows.push([`Checks ${viewport}`, failed.length ? `failed: ${failed.join(', ')}` : 'page responded, heading present, no horizontal overflow']);
    }
  }
  if (manifest.judgment) {
    rows.push(['Recorded decision', `${manifest.judgment.decision} — ${manifest.judgment.reason}`]);
  }
  const checks = $('run-checks');
  checks.replaceChildren();
  for (const [label, value] of rows) {
    const row = document.createElement('div');
    row.className = 'run-check';
    const name = document.createElement('span');
    name.textContent = label;
    const detail = document.createElement('p');
    detail.textContent = value;
    row.append(name, detail);
    checks.append(row);
  }

  const missing = [];
  if (!manifest.captures.after) missing.push('no after capture');
  if (!manifest.execution) missing.push('no agent execution in this run');
  if (!manifest.evaluation) missing.push('not evaluated');
  if (!manifest.judgment) missing.push('no human decision yet');
  $('run-note').textContent = missing.length
    ? `Incomplete run: ${missing.join('; ')}. Structural checks alone cannot show that the user task improved.`
    : 'Complete run. The decision above was recorded by a person against these screenshots, not derived from the structural checks.';
}

function renderFoundation() {
  const foundation = spec.designFoundation;
  const root = $('foundation-groups');
  root.replaceChildren();
  if (!foundation) {
    $('foundation-status').textContent = 'NOT INVENTORIED';
    $('foundation-summary').textContent = '0 artifacts';
    const empty = document.createElement('p');
    empty.className = 'foundation-empty';
    empty.textContent = 'This case has no brand, token, component or pattern inventory yet.';
    root.append(empty);
    return;
  }
  $('foundation-status').textContent = foundation.status.toUpperCase();
  const groups = [
    ['Brand', [...foundation.brand.principles.map(name => ({ name, status: foundation.status })), ...foundation.brand.assets]],
    ['Tokens', foundation.tokens],
    ['Components', foundation.components],
    ['Patterns', foundation.patterns]
  ];
  const total = groups.reduce((count, [, items]) => count + items.length, 0);
  $('foundation-summary').textContent = `${total} artifacts`;
  for (const [label, items] of groups) {
    const group = document.createElement('article');
    const title = document.createElement('h3');
    title.textContent = `${label} · ${items.length}`;
    group.append(title);
    if (!items.length) {
      const empty = document.createElement('p');
      empty.textContent = 'Not documented';
      group.append(empty);
    }
    for (const item of items.slice(0, 5)) {
      const row = document.createElement('div');
      row.className = 'foundation-item';
      const name = document.createElement('span');
      name.textContent = item.name;
      const status = document.createElement('small');
      status.dataset.status = item.status;
      status.textContent = item.status;
      row.append(name, status);
      group.append(row);
    }
    root.append(group);
  }
}

function noticeFor() {
  if (run) {
    const target = run.manifest.url ? `captured ${run.manifest.url}` : 'built a surface that had no address when the run started';
    return `Harness run ${run.manifest.id} ${target}. A run's decision is recorded with "pnpm harness judge"; this page shows what was saved on disk.`;
  }
  return caseId === 'happyclaw'
    ? 'Repository-based review. The live site currently has different content; exportable before/after artifacts and real user-task validation are still needed.'
    : 'Fictional walkthrough. This illustrates the workflow; it is not evidence from a real product.';
}

function render() {
  $('case-select').value = caseId;
  $('notice').textContent = noticeFor();
  $('project-name').textContent = spec.project.name;
  $('project-source').textContent = spec.project.source;
  $('project-goal').textContent = spec.project.goal;
  $('project-audience').textContent = spec.project.audience;
  $('project-task').textContent = spec.project.task;
  renderFoundation();
  renderLoop();
  renderRun();
  renderScore();
  const list = normalisedFindings(spec, run?.diagnosis);
  if (!list.some(item => item.id === selected)) selected = list[0]?.id ?? null;
  $('finding-count').textContent = `${list.length} FINDINGS`;
  $('findings-source').textContent = run?.diagnosis
    ? `From ${run.manifest.diagnosis.evaluatorVersion || 'the run diagnosis'}, merging Experience Spec observations with completed Skill results. Priority is impact × confidence ÷ effort; confirm it against a real user task before acting.`
    : 'Priority is an explicit draft calculation: impact × confidence ÷ effort. Confirm it with a real user task before acting.';
  const evidenceList = $('evidence-list');
  evidenceList.replaceChildren();
  for (const evidence of spec.evidence) {
    const item = document.createElement('div');
    item.className = 'evidence-item';
    const label = document.createElement('span');
    label.textContent = `${evidence.id} / ${evidence.state}`;
    const observation = document.createElement('p');
    observation.textContent = evidence.observation;
    item.append(label, observation);
    evidenceList.append(item);
  }
  const findings = $('findings');
  findings.replaceChildren();
  for (const item of list) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'finding';
    button.dataset.status = item.status;
    button.setAttribute('aria-pressed', item.id === selected ? 'true' : 'false');
    const top = document.createElement('span');
    top.className = 'finding-top';
    top.textContent = `${item.id} · PRIORITY ${item.priority.toFixed(1)}`;
    const status = document.createElement('em');
    status.className = 'finding-status';
    status.textContent = item.status.replace(/-/g, ' ');
    top.append(status);
    const title = document.createElement('strong');
    title.textContent = item.title;
    const explanation = document.createElement('small');
    explanation.textContent = `Impact ${item.impact}/5 · Confidence ${item.confidence}/5 · Effort ${item.effort}/5 · ${item.evidence.length} evidence`;
    button.append(top, title, explanation);
    button.addEventListener('click', () => { selected = item.id; render(); });
    findings.append(button);
  }
  const finding = list.find(item => item.id === selected) || null;
  const firstRender = run?.manifest.plan?.kind === 'bootstrap';
  $('selected-title').textContent = finding?.title ?? (firstRender ? 'No finding: this run built the surface for the first time' : 'No findings in this run');
  $('selected-proposal').textContent = finding?.proposal ?? (firstRender
    ? 'With nothing rendered there was no evidence to diagnose, so the change was constrained by the approved design foundation.'
    : 'Run `harness diagnose` to build an evidence graph for this run.');
  $('selected-evidence').textContent = finding
    ? `Evidence: ${finding.evidence.join(', ')}. Status ${finding.status}; this is a proposed priority with no behavioural data attached.`
    : '';
  // A Skill-derived finding has no Experience Spec entry, so there is nothing to
  // write a scoped brief from. Say so instead of throwing.
  $('brief').textContent = finding?.inSpec
    ? codexBrief(spec, selected)
    : run?.brief || 'This finding came from a Skill result rather than the Experience Spec, so no scoped brief can be generated from it. Record it in the spec first.';
  $('download-brief').disabled = !finding?.inSpec && !run?.brief;
  $('review-before').textContent = `Before: ${spec.review.before}`;
  $('review-after').textContent = `After: ${spec.review.after}`;
  $('review-status').textContent = spec.review.status === 'needs-evidence'
    ? 'Needs deployment match and user-task validation'
    : spec.review.status === 'ready-for-human-review' ? 'Ready for human review' : 'Change not started';
  $('decision').value = spec.review.judgment;
  $('reason').value = spec.review.reason;
  // A page cannot write into .harness/runs; the CLI owns a run's judgment.
  const readOnly = Boolean(run);
  $('decision').disabled = readOnly;
  $('reason').disabled = readOnly;
  $('save-judgment').disabled = readOnly;
  $('save-judgment').textContent = readOnly ? 'Recorded by the harness CLI' : 'Save judgment';
}

async function select(id) {
  if (isRun(id)) {
    const loaded = await loadRun(runIdOf(id));
    run = loaded;
    spec = loaded.spec;
  } else {
    run = null;
    spec = loadExample(id);
  }
  caseId = id;
  selected = normalisedFindings(spec, run?.diagnosis)[0]?.id ?? null;
  history.replaceState(null, '', `?case=${encodeURIComponent(id)}`);
  render();
}

$('case-select').addEventListener('change', async event => {
  const next = event.target.value;
  try {
    await select(next);
  } catch (error) {
    event.target.value = caseId;
    $('notice').textContent = `Could not open ${next}: ${error.message}`;
  }
});

$('download-brief').addEventListener('click', () => {
  const finding = normalisedFindings(spec, run?.diagnosis).find(item => item.id === selected);
  const brief = finding?.inSpec ? codexBrief(spec, selected) : run?.brief;
  if (!brief) return;
  download(`${caseId.replace(':', '-')}-agent-brief.md`, brief, 'text/markdown');
  $('notice').textContent = 'Agent brief downloaded. Review the real app and confirm the diagnosis before applying an edit.';
});

$('save-judgment').addEventListener('click', () => {
  try {
    if (run) throw new Error('Use "pnpm harness judge" to record a decision for a harness run.');
    const judgment = $('decision').value;
    if (judgment === 'pending') throw new Error('Choose accept or reject before saving.');
    spec = recordJudgment(spec, judgment, $('reason').value);
    localStorage.setItem(`pd-review-${caseId}`, JSON.stringify(spec));
    $('notice').textContent = `Your ${judgment} decision and reason were saved in this browser. Export the Experience Spec to keep a portable copy.`;
  } catch (error) {
    $('notice').textContent = error.message;
  }
});

$('download-spec').addEventListener('click', () => {
  download(`${caseId.replace(':', '-')}-experience.json`, JSON.stringify(spec, null, 2), 'application/json');
});

async function start() {
  const picker = $('case-select');
  const { runs, problem } = await loadRunIndex();
  for (const summary of runs) {
    const option = document.createElement('option');
    option.value = `${RUN_PREFIX}${summary.id}`;
    const when = summary.createdAt ? summary.createdAt.slice(0, 10) : 'undated';
    option.textContent = `Run ${summary.id} / ${summary.project} · ${when}`;
    picker.append(option);
  }
  const requested = params.get('case');
  const available = [...picker.options].map(option => option.value);
  try {
    await select(available.includes(requested) ? requested : 'happyclaw');
  } catch (error) {
    await select('happyclaw');
    $('notice').textContent = `Could not open ${requested}: ${error.message}`;
    return;
  }
  // render() has just written the case notice; append the index problem so a
  // failed listing is visible rather than looking like "nothing exported yet".
  if (problem) $('notice').textContent = `${problem} ${$('notice').textContent}`;
}

start();
