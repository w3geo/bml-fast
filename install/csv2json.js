import csv from 'csvtojson';
import fs from 'fs';

async function getJson(csvfile) {
  const jsonArray = await csv({ trim: true, delimiter: ';' }).fromFile(csvfile);
  return jsonArray;
}

// 1. Kulturen
// @ts-ignore
let work = await getJson('data/csv/kulturen.csv');
fs.writeFileSync('public/data/kulturen.json', JSON.stringify(work), { encoding: 'utf-8' });

// 2. Handelsdünger
// @ts-ignore
work = await getJson('data/csv/handelsdünger.csv');
for (let e = 0; e < work.length; e++) {
  work[e]['stabilisierte N-Dünger'] =
    work[e]['stabilisierte N-Dünger'].toString().toLowerCase() == 'x' ? true : false;
  work[e]['BIO'] = work[e]['BIO'].toString().toLowerCase() == 'x' ? true : false;
}
fs.writeFileSync('public/data/handelsdünger.json', JSON.stringify(work), { encoding: 'utf-8' });

// 3. Wirtschaftsdünger
// @ts-ignore
work = await getJson('data/csv/wirtschaftsdünger.csv');
fs.writeFileSync('public/data/wirtschaftsdünger.json', JSON.stringify(work), { encoding: 'utf-8' });

// 4. Sekundärrohstoffe
// @ts-ignore
work = await getJson('data/csv/sekundärrohstoffe.csv');
fs.writeFileSync('public/data/sekundärrohstoffe.json', JSON.stringify(work), { encoding: 'utf-8' });

// 5. Bodenarten - Bodenschwere
// @ts-ignore
work = await getJson('data/csv/bodenartenbodenschwere.csv');
const outputbs = [];
for (let e = 0; e < work.length; e++) {
  outputbs.push({
    value: work[e].Bodenart,
    title: work[e].Bodenart,
    schwere: work[e].Bodenschwere,
  });
}
fs.writeFileSync('public/data/bodenartenbodenschwere.json', JSON.stringify(outputbs), {
  encoding: 'utf-8',
});

// 6. Feldstücknutzungsarten
// @ts-ignore
work = await getJson('data/csv/feldstücknutzungsarten.csv');
const outputsn = {};
for (let e = 0; e < work.length; e++) {
  outputsn[work[e].Abkürzung] = work[e].Feldstücknutzungsarten;
}
fs.writeFileSync('public/data/feldstücknutzungsarten.json', JSON.stringify(outputsn), {
  encoding: 'utf-8',
});

// 7. Entzugstabelle Weizen
// @ts-ignore
work = await getJson('data/csv/entzugstabelle-weizen.csv');
const outputetw = { 12: {}, 13: {}, 14: {}, 15: {}, 16: {} };
for (let e = 0; e < work.length; e++) {
  for (let f = 12; f < 17; f++) {
    outputetw[f][work[e]['field1']] = work[e][f];
  }
}
fs.writeFileSync('public/data/entzugstabelle-weizen.json', JSON.stringify(outputetw), {
  encoding: 'utf-8',
});

// 8. Entzugstabelle Braugerste
// @ts-ignore
work = await getJson('data/csv/entzugstabelle-braugerste.csv');
const outputetb = { 12: {}, 13: {}, 14: {}, 15: {}, 16: {} };
for (let e = 0; e < work.length; e++) {
  for (let f = 12; f < 17; f++) {
    outputetb[f][work[e]['field1']] = work[e][f];
  }
}
fs.writeFileSync('public/data/entzugstabelle-braugerste.json', JSON.stringify(outputetb), {
  encoding: 'utf-8',
});
