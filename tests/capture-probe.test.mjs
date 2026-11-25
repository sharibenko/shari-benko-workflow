import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { saveReceipt } from '../scripts/capture-probe.mjs';

test('preserves exact bytes and distinct receipts for submissions sharing a turn', () => {
  const directory = mkdtempSync(join(tmpdir(), 'sbw-synthetic-'));
  try {
    const raw = Buffer.from(JSON.stringify({ session_id: 'synthetic-session',
      turn_id: 'same-turn', hook_event_name: 'UserPromptSubmit', prompt: '  café\nchange direction  ' }));
    const options = { directory, sessionId: 'synthetic-session' };
    const first = saveReceipt(raw, options);
    const second = saveReceipt(raw, options);
    assert.notEqual(first, second);
    const receipt = JSON.parse(readFileSync(first, 'utf8'));
    assert.deepEqual(Buffer.from(receipt.raw_base64, 'base64'), raw);
    assert.equal(receipt.payload.prompt, '  café\nchange direction  ');
    assert.equal(receipt.source_timestamp, null);
    assert.equal(receipt.synthetic_only, true);
  } finally { rmSync(directory, { recursive: true }); }
});

test('rejects wrong sessions and malformed input without writing records', () => {
  const directory = mkdtempSync(join(tmpdir(), 'sbw-synthetic-'));
  try {
    const options = { directory, sessionId: 'allowed' };
    assert.throws(() => saveReceipt(Buffer.from('{'), options));
    assert.throws(() => saveReceipt(Buffer.from('{"session_id":"other"}'), options));
    assert.deepEqual(readdirSync(directory), []);
  } finally { rmSync(directory, { recursive: true }); }
});

test('rejects repository storage and emits no raw diagnostics on failure', () => {
  const raw = '{"session_id":"synthetic-session","hook_event_name":"PostCompact","secret":"SYNTHETIC-MARKER"}';
  const repository = fileURLToPath(new URL('../', import.meta.url));
  assert.throws(() => saveReceipt(Buffer.from(raw), { directory: repository, sessionId: 'synthetic-session' }));
  const result = spawnSync(process.execPath,
    ['scripts/capture-probe.mjs', '--synthetic', repository, 'synthetic-session'],
    { cwd: repository, input: raw, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr.includes('SYNTHETIC-MARKER'), false);
});
