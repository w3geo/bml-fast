#! /usr/bin/env node
import { dirname, join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { entry } from '../src/composables/useDataEntries.js';
import { updateBilanz } from '../src/composables/useBalanceCalculator.js';
import { fileURLToPath } from 'url';
import yargs from 'yargs';
import process from 'node:process';
import { hideBin } from 'yargs/helpers';
import slug from 'slug';
import { format } from 'prettier';
import prettierrc from '../.prettierrc.json' with { type: 'json' };

(async () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const options = yargs(hideBin(process.argv))
    .option('input', {
      describe: '.txt file exported from the app',
    })
    .option('update', {
      describe: 'Update existing fixtures',
      type: 'boolean',
      default: false,
    })
    .demandOption('input')
    .parse();

  const fixturesDir = join(__dirname, '..', 'fixtures');

  const data = readFileSync(options.input, 'utf-8');
  const json = JSON.parse(data);
  for (let i = 0, ii = json.length; i < ii; ++i) {
    const input = json[i];
    const outfile = join(fixturesDir, `${slug(input.feldstuecksname)}.json`);
    if (options.update !== true && existsSync(outfile)) {
      continue;
    }
    entry.value = input;
    const fixture = {
      name: input.feldstuecksname,
      input,
      output: updateBilanz(),
    };
    const outJson = await format(JSON.stringify(fixture), { ...prettierrc, parser: 'json' });
    writeFileSync(outfile, outJson);
  }
})();
