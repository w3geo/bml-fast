import { expect, test } from 'vitest';
import { updateBilanz } from './useBalanceCalculator.js';
import { entry } from './useDataEntries.js';
import { dirname, join } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const fixturesDir = join(__dirname, '..', '..', 'fixtures');
const files = readdirSync(fixturesDir);
const fixtures = files.filter((f) => f.endsWith('.json'));

for (let i = 0; i < fixtures.length; ++i) {
  const fixture = fixtures[i];
  const data = readFileSync(join(fixturesDir, fixture), 'utf-8');
  const json = JSON.parse(data);
  test(json.name || fixture, () => {
    entry.value = json.input;
    expect(updateBilanz()).toStrictEqual(json.output);
  });
}
