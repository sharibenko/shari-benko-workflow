import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ignored = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', 'tmp']);
const textExtensions = new Set(['.md', '.json', '.mjs', '.js', '.yml', '.yaml', '.css', '.html', '.txt']);

export function validateText(text) {
  const errors = [];
  if (text && !text.endsWith('\n')) errors.push('Missing final newline');
  if (text.includes('\r')) errors.push('Use LF line endings');
  if (text.includes('\t')) errors.push('Use spaces instead of tabs');
  if (/ +$/m.test(text)) errors.push('Remove trailing whitespace');
  if (/^(<{7}|={7}|>{7})(?: |$)/m.test(text)) errors.push('Unresolved merge conflict');
  return errors;
}

export function validateLinks(text, file, root, exists = existsSync) {
  const errors = [];
  // Starter scope: inline Markdown links; remote URLs and heading anchors are not checked.
  const prose = text.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '');
  for (const match of prose.matchAll(/!?\[[^\]\n]*\]\((<[^>\n]+>|[^\s)]+)(?:\s+"[^"\n]*")?\)/g)) {
    let href = match[1].replace(/^<|>$/g, '');
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) continue;
    href = href.split(/[?#]/)[0];
    if (!href) continue;
    try {
      const target = resolve(dirname(file), decodeURIComponent(href));
      const inside = relative(root, target);
      if (inside === '..' || inside.startsWith(`..${sep}`) || resolve(root, inside) !== target) {
        errors.push(`Link leaves repository: ${href}`);
      } else if (!exists(target)) {
        errors.push(`Broken local link: ${href}`);
      }
    } catch {
      errors.push(`Invalid link encoding: ${href}`);
    }
  }
  return errors;
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignored.has(entry.name) || entry.isSymbolicLink()) return [];
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function main() {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const errors = [];
  let checked = 0;
  for (const file of walk(root)) {
    if (!textExtensions.has(extname(file)) && !relative(root, file).split(sep).at(-1).startsWith('.')) continue;
    const text = readFileSync(file, 'utf8');
    const found = validateText(text);
    if (extname(file) === '.md') found.push(...validateLinks(text, file, root));
    if (extname(file) === '.json') {
      try { JSON.parse(text); } catch { found.push('Invalid JSON'); }
    }
    if (['.mjs', '.js'].includes(extname(file))) {
      const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
      if (result.status !== 0) found.push(result.stderr || result.error?.message || 'JavaScript syntax check failed');
    }
    errors.push(...found.map((error) => `${relative(root, file)}: ${error}`));
    checked += 1;
  }
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`Checked ${checked} files: formatting, inline local Markdown links, JSON, and JavaScript syntax passed.`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
