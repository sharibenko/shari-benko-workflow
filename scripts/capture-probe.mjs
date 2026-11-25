import { openSync, writeFileSync, fsyncSync, closeSync, realpathSync, statSync, existsSync } from 'node:fs';
import { resolve, relative, isAbsolute, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID, createHash } from 'node:crypto';

// Synthetic feasibility probe only. Never register against real research chats.
export function saveReceipt(raw, { directory, sessionId }) {
  const payload = JSON.parse(raw.toString('utf8'));
  if (!sessionId || payload.session_id !== sessionId) throw new Error('Session rejected');
  if (typeof payload.hook_event_name !== 'string') throw new Error('Missing event name');
  const destination = realpathSync(directory);
  if (!statSync(destination).isDirectory()) throw new Error('Not a directory');
  const repository = realpathSync(fileURLToPath(new URL('../', import.meta.url)));
  const inside = relative(repository, destination);
  if (!inside || (!inside.startsWith('..') && !isAbsolute(inside))) {
    throw new Error('Destination inside repository');
  }
  // Refuse any Git working tree, including linked worktrees.
  for (let parent = destination; ; parent = dirname(parent)) {
    if (existsSync(join(parent, '.git'))) throw new Error('Destination inside Git');
    if (parent === dirname(parent)) break;
  }
  const receiptId = randomUUID();
  const receipt = {
    schema_version: 1,
    synthetic_only: true,
    receipt_id: receiptId,
    received_at: new Date().toISOString(),
    source_timestamp: null,
    raw_sha256: createHash('sha256').update(raw).digest('hex'),
    raw_base64: raw.toString('base64'),
    payload,
  };
  const file = resolve(destination, `${receiptId}.json`);
  const descriptor = openSync(file, 'wx', 0o600);
  try {
    writeFileSync(descriptor, `${JSON.stringify(receipt)}\n`);
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
  return file;
}

async function main() {
  const [mode, directory, sessionId] = process.argv.slice(2);
  if (mode !== '--synthetic' || !directory || !sessionId) throw new Error('Arguments required');
  const chunks = [];
  let size = 0;
  const timer = setTimeout(() => {
    process.stderr.write('Capture probe failed: input timeout.\n');
    process.exit(1);
  }, 750);
  try {
    for await (const chunk of process.stdin) {
      size += chunk.length;
      if (size > 5 * 1024 * 1024) throw new Error('Input limit exceeded');
      chunks.push(chunk);
    }
    saveReceipt(Buffer.concat(chunks), { directory, sessionId });
  } finally {
    clearTimeout(timer);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(() => {
    // No payload, path, model context, or control instructions in diagnostics.
    process.stderr.write('Capture probe failed; inspect private test evidence.\n');
    process.exitCode = 1;
  });
}
