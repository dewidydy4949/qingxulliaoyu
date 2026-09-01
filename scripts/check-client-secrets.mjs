import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

const defaultTargets = [
  'src',
  'public',
  'vite.config.ts',
  'vercel.json',
  'index.html',
  '.env.example',
  'package.json',
  'package-lock.json',
  'dist',
];

const textExtensions = new Set([
  '.css',
  '.env',
  '.html',
  '.js',
  '.jsx',
  '.json',
  '.map',
  '.mjs',
  '.svg',
  '.ts',
  '.tsx',
  '.txt',
]);

const forbiddenPatterns = [
  { name: 'Groq API key literal', pattern: /\bgsk_[A-Za-z0-9_-]{20,}\b/ },
  { name: 'browser-exposed Groq key variable', pattern: /\bVITE_GROQ_API_KEY\b/ },
  { name: 'browser-enabled Groq SDK', pattern: /\bdangerouslyAllowBrowser\b/ },
  { name: 'browser Groq SDK dependency', pattern: /["']groq-sdk["']/ },
  { name: 'direct Groq API host in browser code', pattern: /\bapi\.groq\.com\b/ },
  { name: 'legacy direct-client Groq proxy', pattern: /\/api\/groq\b/ },
];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

async function collectFiles(target, forceFile = false) {
  const targetStat = await stat(target);
  if (targetStat.isFile()) {
    return forceFile || textExtensions.has(extname(target).toLowerCase()) ? [target] : [];
  }
  if (!targetStat.isDirectory()) return [];

  const entries = await readdir(target, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isSymbolicLink()) continue;
    const entryPath = resolve(target, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(entryPath));
    } else if (entry.isFile() && textExtensions.has(extname(entry.name).toLowerCase())) {
      files.push(entryPath);
    }
  }
  return files;
}

export async function scanClientPaths(targets) {
  const findings = [];

  for (const requestedTarget of targets) {
    const target = resolve(requestedTarget);
    if (!await exists(target)) continue;

    const targetStat = await stat(target);
    const files = await collectFiles(target, targetStat.isFile());
    for (const file of files) {
      const content = await readFile(file, 'utf8');
      for (const rule of forbiddenPatterns) {
        if (rule.pattern.test(content)) {
          findings.push({ file: relative(repositoryRoot, file), rule: rule.name });
        }
      }
    }
  }

  return findings;
}

async function main() {
  const requestedTargets = process.argv.slice(2);
  const targets = (requestedTargets.length ? requestedTargets : defaultTargets)
    .map((target) => resolve(repositoryRoot, target));
  const findings = await scanClientPaths(targets);

  if (findings.length === 0) {
    console.log('Client secret scan passed.');
    return;
  }

  console.error('Client secret scan failed:');
  for (const finding of findings) {
    console.error(`- ${finding.file}: ${finding.rule}`);
  }
  process.exitCode = 1;
}

const isMain = process.argv[1]
  && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isMain) {
  await main();
}
