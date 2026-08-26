import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import {
  BASELINE_BUNDLE_PATHS,
  evaluateBlockedPath,
} from './repo-hygiene-baseline.mjs';

export const EMPTY_TREE_SHA = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';
export const MAX_RESULTING_BLOB_BYTES = 2 * 1024 * 1024;

const SHA_40_RE = /^[0-9a-f]{40}$/u;
const POSITIVE_DECIMAL_RE = /^[1-9][0-9]*$/u;
const textDecoder = new TextDecoder('utf-8', { fatal: true });

class GuardError extends Error {
  constructor(code) {
    super(code);
    this.name = 'GuardError';
    this.code = code;
  }
}

function guardError(code) {
  throw new GuardError(code);
}

function decodeUtf8Fatal(bytes) {
  try {
    const decoded = textDecoder.decode(bytes);
    if (!Buffer.from(decoded, 'utf8').equals(bytes)) guardError('INVALID_UTF8_PATH');
    return decoded;
  } catch (error) {
    if (error instanceof GuardError) throw error;
    guardError('INVALID_UTF8_PATH');
  }
}

function splitNulStrict(buffer) {
  if (!Buffer.isBuffer(buffer)) guardError('INVALID_NUL_STREAM');
  if (buffer.length === 0) return [];
  if (buffer[buffer.length - 1] !== 0) guardError('TRUNCATED_NUL_STREAM');

  const tokens = [];
  let start = 0;
  for (let index = 0; index < buffer.length; index += 1) {
    if (buffer[index] !== 0) continue;
    tokens.push(buffer.subarray(start, index));
    start = index + 1;
  }
  return tokens;
}

function decodeStatusToken(bytes) {
  if (bytes.length === 0) guardError('EMPTY_DIFF_STATUS');
  for (const byte of bytes) {
    if (byte < 0x20 || byte > 0x7e) guardError('INVALID_DIFF_STATUS');
  }
  return bytes.toString('ascii');
}

export function parseNameStatusZ(buffer) {
  const tokens = splitNulStrict(buffer);
  const changes = [];

  for (let index = 0; index < tokens.length; ) {
    const status = decodeStatusToken(tokens[index]);
    index += 1;
    const kind = status[0];

    if (kind === 'A' || kind === 'M' || kind === 'D') {
      if (status.length !== 1 || index >= tokens.length) guardError('MALFORMED_NAME_STATUS');
      const pathBytes = tokens[index];
      index += 1;
      changes.push(Object.freeze({
        status,
        kind,
        oldPath: null,
        resultingPath: kind === 'D' ? null : decodeUtf8Fatal(pathBytes),
        deletedPath: kind === 'D' ? decodeUtf8Fatal(pathBytes) : null,
      }));
      continue;
    }

    if (kind === 'R' || kind === 'C') {
      if (!/^[RC][0-9]{1,3}$/u.test(status) || index + 1 >= tokens.length) {
        guardError('MALFORMED_RENAME_COPY_STATUS');
      }
      const oldPath = decodeUtf8Fatal(tokens[index]);
      const resultingPath = decodeUtf8Fatal(tokens[index + 1]);
      index += 2;
      changes.push(Object.freeze({ status, kind, oldPath, resultingPath, deletedPath: null }));
      continue;
    }

    guardError('UNSUPPORTED_DIFF_STATUS');
  }

  return Object.freeze(changes);
}

export function parseLsTreeZ(buffer) {
  const records = splitNulStrict(buffer);
  if (records.length !== 1) guardError(records.length === 0 ? 'LS_TREE_ZERO_RECORDS' : 'LS_TREE_MULTIPLE_RECORDS');

  const record = records[0];
  const tabIndex = record.indexOf(0x09);
  if (tabIndex <= 0) guardError('LS_TREE_MALFORMED_RECORD');

  const metadataBytes = record.subarray(0, tabIndex);
  const pathBytes = record.subarray(tabIndex + 1);
  const metadata = metadataBytes.toString('ascii');
  const match = /^([0-7]{6}) (blob|tree|commit) ([0-9a-f]{40})$/u.exec(metadata);
  if (!match) guardError('LS_TREE_MALFORMED_METADATA');

  return Object.freeze({
    mode: match[1],
    type: match[2],
    sha: match[3],
    path: decodeUtf8Fatal(pathBytes),
    pathBytes: Buffer.from(pathBytes),
  });
}

export function renderPath(path) {
  return JSON.stringify(path);
}

export function buildDiffArgs({ eventName, baseSha, headSha, beforeSha, afterSha }) {
  if (eventName === 'pull_request_target') {
    requireSha(baseSha, 'INVALID_BASE_SHA');
    requireSha(headSha, 'INVALID_HEAD_SHA');
    return Object.freeze([
      'diff', '--name-status', '-z', '--no-ext-diff', '--no-textconv', `${baseSha}...${headSha}`,
    ]);
  }

  if (eventName === 'push') {
    requireSha(beforeSha, 'INVALID_BEFORE_SHA');
    requireSha(afterSha, 'INVALID_AFTER_SHA');
    const effectiveBefore = beforeSha === '0'.repeat(40) ? EMPTY_TREE_SHA : beforeSha;
    return Object.freeze([
      'diff', '--name-status', '-z', '--no-ext-diff', '--no-textconv', effectiveBefore, afterSha,
    ]);
  }

  guardError('UNSUPPORTED_EVENT');
}

function requireSha(value, code) {
  if (typeof value !== 'string' || !SHA_40_RE.test(value)) guardError(code);
  return value;
}

function requirePositiveDecimal(value, code) {
  if (typeof value !== 'string' || !POSITIVE_DECIMAL_RE.test(value)) guardError(code);
  return value;
}

function sanitizedGitEnv(extra = {}) {
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (
      key === 'GIT_CONFIG_COUNT'
      || key.startsWith('GIT_CONFIG_KEY_')
      || key.startsWith('GIT_CONFIG_VALUE_')
      || key === 'GIT_ASKPASS'
      || key === 'SSH_ASKPASS'
      || key === 'GIT_SSH_COMMAND'
      || key === 'GIT_EXTERNAL_DIFF'
      || key === 'GIT_DIFF_OPTS'
    ) {
      delete env[key];
    }
  }
  return { ...env, ...extra };
}

function runGit(args, options = {}) {
  const result = spawnSync(
    'git',
    ['-c', 'core.hooksPath=/dev/null', ...args],
    {
      cwd: process.cwd(),
      env: options.env ?? sanitizedGitEnv(),
      encoding: null,
      maxBuffer: 32 * 1024 * 1024,
      input: options.input,
    },
  );

  if (result.error) guardError(options.errorCode ?? 'GIT_EXECUTION_ERROR');
  if (result.status !== 0 && !options.allowFailure) guardError(options.errorCode ?? 'GIT_COMMAND_FAILED');
  return result;
}

function gitStdout(args, errorCode) {
  return runGit(args, { errorCode }).stdout ?? Buffer.alloc(0);
}

function verifyCommitObject(sha, code) {
  requireSha(sha, code);
  const result = runGit(['cat-file', '-e', `${sha}^{commit}`], { allowFailure: true, errorCode: code });
  if (result.status !== 0) guardError(code);
}

function currentHeadSha() {
  const raw = gitStdout(['rev-parse', '--verify', 'HEAD^{commit}'], 'HEAD_RESOLUTION_ERROR').toString('ascii').trim();
  return requireSha(raw, 'HEAD_RESOLUTION_ERROR');
}

function verifyEmptyTreeSha() {
  const raw = runGit(['hash-object', '-t', 'tree', '--stdin'], {
    input: Buffer.alloc(0),
    errorCode: 'EMPTY_TREE_RESOLUTION_ERROR',
  }).stdout.toString('ascii').trim();
  if (raw !== EMPTY_TREE_SHA) guardError('EMPTY_TREE_OBJECT_FORMAT_MISMATCH');
}

function validateRepositoryIdentity(repository) {
  if (typeof repository !== 'string' || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u.test(repository)) {
    guardError('INVALID_REPOSITORY_IDENTITY');
  }
  return repository;
}

function getAndValidateOrigin(repository) {
  const raw = gitStdout(['remote', 'get-url', 'origin'], 'ORIGIN_RESOLUTION_ERROR').toString('utf8').trim();
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    guardError('UNEXPECTED_ORIGIN_IDENTITY');
  }

  const expectedPath = `/${repository}`;
  if (
    parsed.protocol !== 'https:'
    || parsed.hostname !== 'github.com'
    || parsed.username !== ''
    || parsed.password !== ''
    || (parsed.pathname !== expectedPath && parsed.pathname !== `${expectedPath}.git`)
  ) {
    guardError('UNEXPECTED_ORIGIN_IDENTITY');
  }
  return raw;
}

function assertNoPersistedAuth(repository) {
  getAndValidateOrigin(repository);

  const extraHeader = runGit(
    ['config', '--local', '--get-regexp', '^http\\..*\\.extraheader$'],
    { allowFailure: true, errorCode: 'AUTH_CONFIG_CHECK_ERROR' },
  );
  if (extraHeader.status === 0 && (extraHeader.stdout?.length ?? 0) > 0) {
    guardError('PERSISTED_AUTH_HEADER_DETECTED');
  }
  if (extraHeader.status !== 0 && extraHeader.status !== 1) guardError('AUTH_CONFIG_CHECK_ERROR');

  const credentialHelper = runGit(
    ['config', '--local', '--get-all', 'credential.helper'],
    { allowFailure: true, errorCode: 'AUTH_CONFIG_CHECK_ERROR' },
  );
  if (credentialHelper.status === 0 && (credentialHelper.stdout?.length ?? 0) > 0) {
    guardError('PERSISTED_CREDENTIAL_HELPER_DETECTED');
  }
  if (credentialHelper.status !== 0 && credentialHelper.status !== 1) guardError('AUTH_CONFIG_CHECK_ERROR');
}

function fetchPullRequestHead({ prNumber, expectedHeadSha, repository, token }) {
  requirePositiveDecimal(prNumber, 'INVALID_PR_NUMBER');
  requireSha(expectedHeadSha, 'INVALID_HEAD_SHA');
  validateRepositoryIdentity(repository);
  if (typeof token !== 'string' || token.length === 0 || /[\r\n]/u.test(token)) guardError('MISSING_GITHUB_TOKEN');

  assertNoPersistedAuth(repository);

  const sourceRef = `refs/pull/${prNumber}/head`;
  const destinationRef = `refs/repo-hygiene/pr/${prNumber}/head`;
  const authorization = `AUTHORIZATION: basic ${Buffer.from(`x-access-token:${token}`, 'utf8').toString('base64')}`;
  const childEnv = sanitizedGitEnv({
    GIT_CONFIG_COUNT: '2',
    GIT_CONFIG_KEY_0: 'credential.helper',
    GIT_CONFIG_VALUE_0: '',
    GIT_CONFIG_KEY_1: 'http.https://github.com/.extraheader',
    GIT_CONFIG_VALUE_1: authorization,
  });

  const fetchResult = runGit(
    [
      'fetch', '--no-tags', '--force', '--no-recurse-submodules', 'origin',
      `+${sourceRef}:${destinationRef}`,
    ],
    { env: childEnv, allowFailure: true, errorCode: 'PR_HEAD_FETCH_ERROR' },
  );

  delete process.env.GITHUB_TOKEN;
  if (fetchResult.status !== 0) guardError('PR_HEAD_FETCH_ERROR');

  assertNoPersistedAuth(repository);

  const resolved = gitStdout(
    ['rev-parse', '--verify', `${destinationRef}^{commit}`],
    'PR_HEAD_RESOLUTION_ERROR',
  ).toString('ascii').trim();
  requireSha(resolved, 'PR_HEAD_RESOLUTION_ERROR');
  if (resolved !== expectedHeadSha) guardError('PR_HEAD_IDENTITY_MISMATCH');
  return resolved;
}

function resolveResultingBlob(diffHead, path) {
  requireSha(diffHead, 'INVALID_DIFF_HEAD');
  const stdout = gitStdout(
    ['--literal-pathspecs', 'ls-tree', '-z', diffHead, '--', path],
    'LS_TREE_LOOKUP_ERROR',
  );
  const record = parseLsTreeZ(stdout);
  const requestedBytes = Buffer.from(path, 'utf8');
  if (!record.pathBytes.equals(requestedBytes) || record.path !== path) guardError('LS_TREE_PATH_MISMATCH');
  if (record.type !== 'blob') guardError('LS_TREE_NON_BLOB');

  const sizeRaw = gitStdout(['cat-file', '-s', record.sha], 'CAT_FILE_SIZE_ERROR').toString('ascii').trim();
  if (!/^(0|[1-9][0-9]*)$/u.test(sizeRaw)) guardError('CAT_FILE_INVALID_SIZE');
  const size = Number(sizeRaw);
  if (!Number.isSafeInteger(size) || size < 0) guardError('CAT_FILE_INVALID_SIZE');

  return Object.freeze({ sha: record.sha, size });
}

function parsePackSizeKiB() {
  const raw = gitStdout(['count-objects', '-v'], 'COUNT_OBJECTS_ERROR').toString('ascii');
  const line = raw.split('\n').find((entry) => entry.startsWith('size-pack: '));
  if (!line) guardError('COUNT_OBJECTS_PARSE_ERROR');
  const value = line.slice('size-pack: '.length).trim();
  if (!/^(0|[1-9][0-9]*)$/u.test(value)) guardError('COUNT_OBJECTS_PARSE_ERROR');
  const kib = Number(value);
  if (!Number.isSafeInteger(kib) || kib < 0) guardError('COUNT_OBJECTS_PARSE_ERROR');
  return kib;
}

function loadContext() {
  const eventName = process.env.RH_EVENT_NAME ?? '';
  const policySourceSha = requireSha(process.env.RH_POLICY_SOURCE_SHA ?? '', 'INVALID_POLICY_SOURCE_SHA');
  if (currentHeadSha() !== policySourceSha) guardError('POLICY_SOURCE_HEAD_MISMATCH');

  if (eventName === 'pull_request_target') {
    const baseSha = requireSha(process.env.RH_BASE_SHA ?? '', 'INVALID_BASE_SHA');
    const headSha = requireSha(process.env.RH_HEAD_SHA ?? '', 'INVALID_HEAD_SHA');
    const prNumber = requirePositiveDecimal(process.env.RH_PR_NUMBER ?? '', 'INVALID_PR_NUMBER');
    const repository = validateRepositoryIdentity(process.env.RH_REPOSITORY ?? '');
    if (policySourceSha !== baseSha) guardError('POLICY_SOURCE_BASE_MISMATCH');
    verifyCommitObject(baseSha, 'BASE_COMMIT_UNAVAILABLE');
    return Object.freeze({ eventName, policySourceSha, baseSha, headSha, prNumber, repository });
  }

  if (eventName === 'push') {
    const beforeSha = requireSha(process.env.RH_BEFORE_SHA ?? '', 'INVALID_BEFORE_SHA');
    const afterSha = requireSha(process.env.RH_AFTER_SHA ?? '', 'INVALID_AFTER_SHA');
    if (policySourceSha !== afterSha) guardError('POLICY_SOURCE_AFTER_MISMATCH');
    verifyCommitObject(afterSha, 'AFTER_COMMIT_UNAVAILABLE');
    if (beforeSha === '0'.repeat(40)) {
      verifyEmptyTreeSha();
    } else {
      verifyCommitObject(beforeSha, 'BEFORE_COMMIT_UNAVAILABLE');
    }
    return Object.freeze({ eventName, policySourceSha, beforeSha, afterSha });
  }

  guardError('UNSUPPORTED_EVENT');
}

function emitPackObservation(kib) {
  const mib = kib / 1024;
  if (kib > 25 * 1024) {
    console.log(`REPO_HYGIENE_PACK observation=WARN_ESCALATED sizeMiB=${mib.toFixed(2)}`);
  } else if (kib > 10 * 1024) {
    console.log(`REPO_HYGIENE_PACK observation=WARN sizeMiB=${mib.toFixed(2)}`);
  } else {
    console.log(`REPO_HYGIENE_PACK observation=PASS_INFORMATIONAL sizeMiB=${mib.toFixed(2)}`);
  }
}

export async function main() {
  const context = loadContext();
  let diffHead;

  if (context.eventName === 'pull_request_target') {
    const token = process.env.GITHUB_TOKEN ?? '';
    fetchPullRequestHead({
      prNumber: context.prNumber,
      expectedHeadSha: context.headSha,
      repository: context.repository,
      token,
    });
    diffHead = context.headSha;
    verifyCommitObject(diffHead, 'HEAD_COMMIT_UNAVAILABLE');
  } else {
    delete process.env.GITHUB_TOKEN;
    diffHead = context.afterSha;
  }

  const diffArgs = buildDiffArgs(context);
  const diffOutput = gitStdout(diffArgs, 'DIFF_EXECUTION_ERROR');
  const changes = parseNameStatusZ(diffOutput);
  const failures = [];

  for (const change of changes) {
    if (change.kind === 'D') continue;

    const path = change.resultingPath;
    const blob = resolveResultingBlob(diffHead, path);
    const pathPolicy = evaluateBlockedPath(path);

    if (pathPolicy.blocked) {
      failures.push(Object.freeze({
        kind: 'BLOCKED_PATH',
        path,
        classification: pathPolicy.classification,
        pattern: pathPolicy.pattern,
      }));
    }

    if (blob.size > MAX_RESULTING_BLOB_BYTES) {
      failures.push(Object.freeze({
        kind: 'OVERSIZED_BLOB',
        path,
        size: blob.size,
      }));
    }
  }

  for (const failure of failures) {
    if (failure.kind === 'BLOCKED_PATH') {
      console.log(
        `REPO_HYGIENE_FINDING kind=BLOCKED_PATH path=${renderPath(failure.path)} classification=${failure.classification} pattern=${JSON.stringify(failure.pattern)}`,
      );
    } else {
      console.log(
        `REPO_HYGIENE_FINDING kind=OVERSIZED_BLOB path=${renderPath(failure.path)} sizeBytes=${failure.size} limitBytes=${MAX_RESULTING_BLOB_BYTES}`,
      );
    }
  }

  emitPackObservation(parsePackSizeKiB());

  if (context.eventName === 'pull_request_target') {
    console.log(
      `REPO_HYGIENE_IDENTITY policySourceSha=${context.policySourceSha} evaluatedBaseSha=${context.baseSha} evaluatedHeadSha=${context.headSha}`,
    );
  } else {
    console.log(
      `REPO_HYGIENE_IDENTITY policySourceSha=${context.policySourceSha} beforeSha=${context.beforeSha} afterSha=${context.afterSha}`,
    );
  }

  if (failures.length > 0) {
    console.log(`REPO_HYGIENE_RESULT verdict=POLICY_FAIL findings=${failures.length}`);
    process.exitCode = 1;
    return;
  }

  console.log(`REPO_HYGIENE_RESULT verdict=PASS findings=0 baselineBundlePaths=${BASELINE_BUNDLE_PATHS.length}`);
  process.exitCode = 0;
}

function isEntrypoint() {
  if (!process.argv[1]) return false;
  return import.meta.url === pathToFileURL(process.argv[1]).href;
}

if (isEntrypoint()) {
  main().catch((error) => {
    const code = error instanceof GuardError ? error.code : 'UNEXPECTED_GUARD_ERROR';
    console.error(`REPO_HYGIENE_GUARD_ERROR code=${code}`);
    console.error('REPO_HYGIENE_RESULT verdict=GUARD_ERROR');
    process.exitCode = 2;
  });
}
