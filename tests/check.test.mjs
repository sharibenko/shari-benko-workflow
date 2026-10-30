import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import test from 'node:test';
import { validateLinks, validateText } from '../scripts/check.mjs';

test('detects formatting problems and merge conflicts', () => {
  assert.deepEqual(validateText('Clean text\n'), []);
  assert.ok(validateText('Missing newline').includes('Missing final newline'));
  assert.ok(validateText('Trailing space \n').includes('Remove trailing whitespace'));
  assert.ok(validateText('\tIndent\r\n').includes('Use LF line endings'));
  assert.ok(validateText('<<<<<<< branch\n').includes('Unresolved merge conflict'));
});

test('resolves local links relative to their document and ignores remote links', () => {
  const root = resolve('fixture');
  const file = resolve(root, 'docs', 'guide.md');
  const exists = (path) => path === resolve(root, 'content', 'resume.md');
  assert.deepEqual(validateLinks('[Resume](../content/resume.md#experience) [Site](https://example.com)', file, root, exists), []);
  assert.match(validateLinks('[Missing](missing.md)', file, root, exists)[0], /Broken local link/);
  assert.match(validateLinks('[Outside](../../private.md)', file, root, exists)[0], /leaves repository/);
});

test('handles encoded paths, malformed encoding, anchors, and fenced examples', () => {
  const root = resolve('fixture');
  const file = resolve(root, 'README.md');
  assert.deepEqual(validateLinks('[Asset](assets/my%20image.png) [Section](#about)', file, root, (path) => path === resolve(root, 'assets', 'my image.png')), []);
  assert.match(validateLinks('[Invalid](bad%ZZ.md)', file, root)[0], /Invalid link encoding/);
  assert.deepEqual(validateLinks('```md\n[Example](missing.md)\n```\n', file, root, () => false), []);
});
