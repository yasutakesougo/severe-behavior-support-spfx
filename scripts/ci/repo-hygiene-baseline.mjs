const BASELINE_BUNDLE_PATHS_LITERAL = [
  'spfx/src/sbs-domain/cancellation-persist.bundle.js',
  'spfx/src/sbs-domain/cancellation-persist.bundle.d.ts',
  'spfx/src/sbs-domain/correction-persist.bundle.js',
  'spfx/src/sbs-domain/correction-persist.bundle.d.ts',
  'spfx/src/sbs-domain/kiosk-read-model.bundle.js',
  'spfx/src/sbs-domain/kiosk-read-model.bundle.d.ts',
  'spfx/src/sbs-domain/lifecycle-cancellation-storage.bundle.js',
  'spfx/src/sbs-domain/lifecycle-cancellation-storage.bundle.d.ts',
  'spfx/src/sbs-domain/staff-persist.bundle.js',
  'spfx/src/sbs-domain/staff-persist.bundle.d.ts',
];

const BLOCKED_PATTERNS_LITERAL = [
  '**/*.sppkg',
  '**/*.sqlite3',
  '**/*.sqlite',
  '**/*.db',
  '**/node_modules/**',
  '.worktrees/**',
  'tmp/**',
  'output/**',
  '**/smoke-bundle.js',
  '**/smoke-report.json',
  'spfx/smoke/**/smoke-production.css',
];

const SBS_DOMAIN_BUNDLE_PATTERNS_LITERAL = [
  'spfx/src/sbs-domain/*.bundle.js',
  'spfx/src/sbs-domain/*.bundle.d.ts',
];

export const BASELINE_BUNDLE_PATHS = Object.freeze([...BASELINE_BUNDLE_PATHS_LITERAL]);
export const BLOCKED_PATTERNS = Object.freeze([...BLOCKED_PATTERNS_LITERAL]);
export const SBS_DOMAIN_BUNDLE_PATTERNS = Object.freeze([...SBS_DOMAIN_BUNDLE_PATTERNS_LITERAL]);

const BASELINE_BUNDLE_SET = new Set(BASELINE_BUNDLE_PATHS);

function assertConfiguredPattern(pattern) {
  if (typeof pattern !== 'string' || pattern.length === 0) {
    throw new TypeError('repo-hygiene pattern must be a non-empty string');
  }
  if (!pattern.includes('/')) {
    throw new Error(`repo-hygiene bare-basename pattern is forbidden: ${JSON.stringify(pattern)}`);
  }
  if (pattern.startsWith('/') || pattern.includes('\\') || pattern.includes('\0')) {
    throw new Error(`repo-hygiene pattern is not repository-relative POSIX form: ${JSON.stringify(pattern)}`);
  }
}

function escapeRegexChar(char) {
  return /[\\^$.*+?()[\]{}|]/u.test(char) ? `\\${char}` : char;
}

export function compilePolicyPattern(pattern) {
  assertConfiguredPattern(pattern);

  let source = '^';
  for (let index = 0; index < pattern.length; ) {
    if (pattern.startsWith('**/', index)) {
      source += '(?:.*/)?';
      index += 3;
      continue;
    }
    if (pattern.startsWith('**', index)) {
      source += '.*';
      index += 2;
      continue;
    }

    const char = pattern[index];
    if (char === '*') {
      source += '[^/]*';
    } else {
      source += escapeRegexChar(char);
    }
    index += 1;
  }

  source += '$';
  return new RegExp(source, 'su');
}

const COMPILED_BLOCKED_PATTERNS = Object.freeze(
  BLOCKED_PATTERNS.map((pattern) => Object.freeze({ pattern, regex: compilePolicyPattern(pattern) })),
);
const COMPILED_BUNDLE_PATTERNS = Object.freeze(
  SBS_DOMAIN_BUNDLE_PATTERNS.map((pattern) => Object.freeze({ pattern, regex: compilePolicyPattern(pattern) })),
);

export function assertRepositoryRelativePath(path) {
  if (typeof path !== 'string' || path.length === 0) {
    throw new TypeError('repo-hygiene path must be a non-empty string');
  }
  if (path.startsWith('/') || path.includes('\0')) {
    throw new Error('repo-hygiene path must be repository-relative');
  }
  return path;
}

export function matchesPolicyPattern(path, pattern) {
  assertRepositoryRelativePath(path);
  return compilePolicyPattern(pattern).test(path);
}

export function evaluateBlockedPath(path) {
  assertRepositoryRelativePath(path);

  for (const entry of COMPILED_BUNDLE_PATTERNS) {
    if (!entry.regex.test(path)) continue;

    if (BASELINE_BUNDLE_SET.has(path)) {
      return Object.freeze({
        blocked: false,
        classification: 'BASELINE_BUNDLE_ALLOWED',
        pattern: entry.pattern,
      });
    }

    return Object.freeze({
      blocked: true,
      classification: 'NON_BASELINE_SBS_DOMAIN_BUNDLE',
      pattern: entry.pattern,
    });
  }

  for (const entry of COMPILED_BLOCKED_PATTERNS) {
    if (!entry.regex.test(path)) continue;
    return Object.freeze({
      blocked: true,
      classification: 'BLOCKED_PATTERN',
      pattern: entry.pattern,
    });
  }

  return Object.freeze({
    blocked: false,
    classification: 'ALLOWED_PATH',
    pattern: null,
  });
}

export function isFrozenBaselineBundlePath(path) {
  assertRepositoryRelativePath(path);
  return BASELINE_BUNDLE_SET.has(path);
}

// Fail at module load if policy configuration is malformed. This is deliberate:
// policy configuration errors must fail the trusted configuration test before guard execution.
for (const pattern of [...BLOCKED_PATTERNS, ...SBS_DOMAIN_BUNDLE_PATTERNS]) {
  assertConfiguredPattern(pattern);
}

if (BASELINE_BUNDLE_PATHS.length !== 10 || new Set(BASELINE_BUNDLE_PATHS).size !== 10) {
  throw new Error('repo-hygiene frozen sbs-domain bundle baseline must contain exactly 10 unique literal paths');
}
