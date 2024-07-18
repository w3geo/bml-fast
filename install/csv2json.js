import csv from 'csvtojson';
import fs from 'fs';

async function getJson(csvfile) {
  const jsonArray = await csv({ trim: true, delimiter: ';' }).fromFile(csvfile);
  return jsonArray;
}

// 1. Kulturen
// @ts-ignore
let work = await getJson('data/csv/kulturen.csv');
const outputk = [];
for (let e = 0; e < work.length; e++) {
  outputk.push({
    value: work[e].Kultur,
    title: work[e].Kultur,
  });
}
fs.writeFileSync('public/data/kulturen.json', JSON.stringify(outputk), {
  encoding: 'utf-8',
});

// 2. Handelsdünger
// @ts-ignore
work = await getJson('data/csv/handelsdünger.csv');
for (let e = 0; e < work.length; e++) {
  work[e]['stabilisierte N-Dünger'] =
    work[e]['stabilisierte N-Dünger'].toString().toLowerCase() == 'x' ? true : false;
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

// 6. Schlagnutzungsarten
// @ts-ignore
work = await getJson('data/csv/schlagnutzungsarten.csv');
const outputsn = {};
for (let e = 0; e < work.length; e++) {
  outputsn[work[e].Abkürzung] = work[e].Schlagnutzungsarten;
}
fs.writeFileSync('public/data/schlagnutzungsarten.json', JSON.stringify(outputsn), {
  encoding: 'utf-8',
});

// 7. KG-Liste
// @ts-ignore
work = await getJson('data/csv/kgliste.csv');
const kgliste = {};
let kgnr = 0;
for (let e = 0; e < work.length; e++) {
  work[e]['GWA'] = work[e]['GWA'].toString().toLowerCase() == 'x' ? true : false;
  work[e]['NAPV Anlage 5 Gebiet'] =
    work[e]['NAPV Anlage 5 Gebiet'].toString().toLowerCase() == 'x' ? true : false;
  work[e]['Feuchtgebiet'] = work[e]['Feuchtgebiet'].toString().toLowerCase() == 'x' ? true : false;
  work[e]['Trockengebiet'] =
    work[e]['Trockengebiet'].toString().toLowerCase() == 'x' ? true : false;
  kgnr = work[e]['Katastralgemeindenummer'];
  delete work[e]['Katastralgemeindenummer'];
  kgliste[kgnr] = work[e];
}

fs.writeFileSync('public/data/kgliste.json', JSON.stringify(kgliste), { encoding: 'utf-8' });
