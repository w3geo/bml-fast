import csv from 'csvtojson';
import fs from 'fs';

async function getJson(csvfile) {
  const jsonArray = await csv({ trim: true, delimiter: ';' }).fromFile(csvfile);
  return jsonArray;
}

// 1. Kulturen
// @ts-ignore
let work = await getJson('data/csv/kulturen.csv');
const keys = Object.keys(work[0]);
const kulturen = {};
for (let e = 0; e < work.length; e++) {
  for (let k = 0; k < keys.length; k++) {
    if (kulturen[keys[k]]) {
      if (work[e][keys[k]].length > 0) {
        kulturen[keys[k]].push(work[e][keys[k]]);
      }
    } else {
      if (work[e][keys[k]].length > 0) {
        kulturen[keys[k]] = [work[e][keys[k]]];
      }
    }
  }
}
let out = JSON.stringify(kulturen);
fs.writeFileSync('data/kulturen.json', out, { encoding: 'utf-8' });

// 2. Handelsdünger
// @ts-ignore
work = await getJson('data/csv/handelsdünger.csv');
for (let e = 0; e < work.length; e++) {
  work[e]['stabilisierte N-Dünger'] =
    work[e]['stabilisierte N-Dünger'].toString().toLowerCase() == 'x' ? true : false;
}
fs.writeFileSync('data/handelsdünger.json', JSON.stringify(work), { encoding: 'utf-8' });

// 3. Wirtschaftsdünger
// @ts-ignore
work = await getJson('data/csv/wirtschaftsdünger.csv');
fs.writeFileSync('data/wirtschaftsdünger.json', JSON.stringify(work), { encoding: 'utf-8' });

// 4. Sekundärrohstoffe
// @ts-ignore
work = await getJson('data/csv/sekundärrohstoffe.csv');
fs.writeFileSync('data/sekundärrohstoffe.json', JSON.stringify(work), { encoding: 'utf-8' });

// 5. Bodenarten - Bodenschwere
// @ts-ignore
work = await getJson('data/csv/bodenarten-bodenschwere.csv');
fs.writeFileSync('data/bodenarten-bodenschwere.json', JSON.stringify(work), { encoding: 'utf-8' });

// 6. Schlagnutzungsarten
// @ts-ignore
work = await getJson('data/csv/schlagnutzungsarten.csv');
fs.writeFileSync('data/schlagnutzungsarten.json', JSON.stringify(work), { encoding: 'utf-8' });

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

fs.writeFileSync('data/kgliste.json', JSON.stringify(kgliste), { encoding: 'utf-8' });
