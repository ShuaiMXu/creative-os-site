const VERSION = /^[0-9]+\.[0-9]+\.[0-9]+(?:-[A-Za-z0-9.-]+)?$/;
const DECISIONS = new Set(['approved', 'deprecated']);

function requiredText(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} is required.`);
  return value.trim();
}

function assertDecided(entries, label) {
  for (const entry of entries || []) {
    if (!DECISIONS.has(entry.status)) {
      throw new Error(`${label} "${entry.name || 'unnamed'}" must be approved or deprecated; observed entries cannot constrain generation.`);
    }
  }
}

export function assertFoundationApproval(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Foundation approval must be a JSON object.');
  if (input.schemaVersion !== '0.1') throw new Error('Foundation approval schemaVersion must be 0.1.');
  if (!VERSION.test(String(input.foundationVersion || ''))) throw new Error('foundationVersion must be a semantic version such as 1.0.0.');
  requiredText(input.reviewer?.name, 'Foundation reviewer name');
  if (!['human', 'team'].includes(input.reviewer?.type)) throw new Error('Foundation reviewer type must be human or team.');
  requiredText(input.reason, 'Foundation approval reason');
  const foundation = input.foundation;
  if (!foundation || typeof foundation !== 'object') throw new Error('Foundation approval must include a complete foundation snapshot.');
  for (const key of ['brand', 'tokens', 'components', 'patterns']) if (!(key in foundation)) throw new Error(`Foundation snapshot is missing ${key}.`);
  if (!Array.isArray(foundation.brand?.principles) || !Array.isArray(foundation.brand?.voice) || !Array.isArray(foundation.brand?.assets)) {
    throw new Error('Foundation brand must include principles, voice and assets arrays.');
  }
  for (const [entries, label] of [[foundation.brand.assets, 'Brand asset'], [foundation.tokens, 'Token'], [foundation.components, 'Component'], [foundation.patterns, 'Pattern']]) {
    if (!Array.isArray(entries)) throw new Error(`${label} collection must be an array.`);
    assertDecided(entries, label);
  }
  const usable = [...foundation.tokens, ...foundation.components, ...foundation.patterns].filter(entry => entry.status === 'approved');
  if (!usable.length) throw new Error('Foundation approval needs at least one approved token, component or pattern.');
  return input;
}

export function approvedFoundationFrom(input) {
  assertFoundationApproval(input);
  return { ...structuredClone(input.foundation), status: 'approved' };
}

export function foundationApprovalReference(input) {
  assertFoundationApproval(input);
  return {
    schemaVersion: input.schemaVersion,
    foundationVersion: input.foundationVersion,
    reviewer: structuredClone(input.reviewer),
    reason: input.reason.trim(),
    reviewedAt: input.reviewedAt || new Date().toISOString()
  };
}
