// Validates the Conversions and Useful Facts decks. Usage: node tests/facts.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const load = (dir, g) => { const c = { window: {} }; vm.createContext(c); vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'decks', dir, 'index.js'), 'utf8'), c); return c.window[g]; };
const errs = [];
for (const [dir, g] of [['conversions', 'CONVERSIONS'], ['useful', 'USEFUL']]) {
  const d = load(dir, g), seen = new Set();
  d.problems.forEach((p, i) => {
    const id = `${g} #${i + 1} ${p.front}`;
    if (!p.front || !p.back) errs.push(`${id}: missing front/back`);
    const key = p.front + '|' + p.hint;
    if (seen.has(key)) errs.push(`${id}: duplicate`); seen.add(key);
    const c = d.build(p);
    if (/\n\n$|undefined/.test(c.front + c.back)) errs.push(`${id}: bad text`);
    if (/^\s*[-•#]\s/m.test(c.front + '\n' + c.back)) errs.push(`${id}: line would render as list/heading`);
    if ((c.front + c.back).length > 290) errs.push(`${id}: too long for the centered layout`);
  });
  console.log(`${d.name}: ${d.problems.length} cards in ${d.topics.length} topics (${d.topics.map((t, k) => `${t} ${d.problems.filter((p) => p.k === k).length}`).join(', ')})`);
}
// Numeric checks: recompute each conversion from exact factors and compare with the card.
const conv = load('conversions', 'CONVERSIONS').problems;
const num = (s) => parseFloat(String(s).replace(/(\d),(\d{3})/g, '$1$2').replace(/[^\d.−-]/g, ' ').trim().split(/\s+/)[0].replace('−', '-'));
const F = { in: 2.54, ft: 30.48, yd: 0.9144, mi: 1.609344, lb: 0.45359237, oz: 28.349523125, gal: 3.785411784, qt: 0.946352946, cup: 236.5882365, floz: 29.5735295625, tsp: 4.92892159375 };
const checks = [
  ['1 inch', 'in centimeters', F.in], ['1 foot', 'in centimeters', F.ft], ['1 yard', 'in meters', F.yd], ['1 mile', 'in kilometers', F.mi],
  ['3.1 miles', 'in kilometers', 3.1 * F.mi], ['6.2 miles', 'in kilometers', 6.2 * F.mi], ['26.2 miles', 'in kilometers', 26.2 * F.mi],
  ['6 feet', 'in meters', 6 * F.ft / 100], ['5 feet 6 inches', 'in centimeters', 66 * F.in],
  ['1 pound (lb)', 'in kilograms', F.lb], ['1 ounce (oz)', 'in grams', F.oz], ['1 stone', 'in pounds and kilograms', 14], ['1 US ton', 'in pounds and kilograms', 2000],
  ['100 lb', 'in kilograms', 100 * F.lb], ['150 lb', 'in kilograms', 150 * F.lb], ['1 gallon of water', 'weight', F.gal * 1000 / F.lb / 1000],
  ['1 gallon', 'in liters', F.gal], ['1 quart', 'in liters', F.qt], ['1 cup', 'in milliliters', F.cup], ['1 fluid ounce', 'in milliliters', F.floz], ['1 teaspoon', 'in milliliters', F.tsp],
  ['1 cubic foot', 'in liters', Math.pow(F.ft, 3) / 1000], ['100 °F', 'in Celsius', (100 - 32) * 5 / 9], ['350 °F', 'in Celsius', (350 - 32) * 5 / 9], ['98.6 °F', 'in Celsius', 37],
  ['1 acre', 'in square meters', 4046.8564224], ['1 square mile', 'in square kilometers', F.mi * F.mi], ['1 square foot', 'in square meters', Math.pow(F.ft / 100, 2)],
  ['60 mph', 'in km/h', 60 * F.mi], ['1 knot', 'in mph and km/h', 1.852 / F.mi], ['30 mpg', 'in metric', 30 * F.mi / F.gal], ['1 horsepower', 'in watts', 745.7],
];
for (const [front, hint, exact] of checks) {
  const p = conv.find((x) => x.front === front && x.hint === hint);
  if (!p) { errs.push(`no card ${front} / ${hint}`); continue; }
  const v = num(p.back), rel = Math.abs(v - exact) / Math.abs(exact);
  if (rel > 0.02) errs.push(`${front} ${hint}: card says ${p.back}, exact ${exact.toFixed(4)}`);
}
const s = conv.find((x) => x.front === '1 stone'); if (!/6\.35/.test(s.back)) errs.push('stone kg');
const t = conv.find((x) => x.front === '1 US ton'); if (!/907/.test(t.back)) errs.push('ton kg');
const nato = load('useful', 'USEFUL').problems.filter((p) => p.k === 0 && /^[A-Z]$/.test(p.front));
if (nato.map((p) => p.front).join('') !== 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') errs.push('NATO letters incomplete');
console.log(`numeric checks: ${checks.length}`);
if (errs.length) { console.log('ERRORS:\n' + errs.join('\n')); process.exit(1); }
console.log('OK');
