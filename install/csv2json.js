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
