import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { scanClientPaths } from './check-client-secrets.mjs';

async function withFixture(content, run) {
  const directory = await mkdtemp(join(tmpdir(), 'qingxulliaoyu-secret-scan-'));
  const file = join(directory, 'fixture.txt');
  try {
    await writeFile(file, content, 'utf8');
    await run(file);
  } finally {
    await rm(directory, { force: true, recursive: true });
  }
}

test('accepts browser-safe configuration', async () => {
  await withFixture('VITE_API_BASE_URL=http://localhost:3001/api\n', async (file) => {
    assert.deepEqual(await scanClientPaths([file]), []);
  });
});

test('rejects a Groq key without returning its value', async () => {
  const exposedKey = `gsk_${'a'.repeat(40)}`;
  await withFixture(`const key = '${exposedKey}';\n`, async (file) => {
    const findings = await scanClientPaths([file]);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].rule, 'Groq API key literal');
    assert.equal(JSON.stringify(findings).includes(exposedKey), false);
  });
});

test('rejects browser-side Groq configuration paths', async () => {
  const unsafeValues = [
    'VITE_GROQ_API_KEY=placeholder',
    'dangerouslyAllowBrowser: true',
    '"groq-sdk": "latest"',
    'https://api.groq.com/openai/v1/chat/completions',
    '/api/groq/openai/v1',
  ];

  for (const value of unsafeValues) {
    await withFixture(value, async (file) => {
      assert.equal((await scanClientPaths([file])).length, 1);
    });
  }
});
