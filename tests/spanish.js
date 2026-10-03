// Validates the Spanish deck: structure, duplicates, punctuation, and that
// each example sentence actually uses its word. Usage: node tests/spanish.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'decks', 'spanish', 'index.js'), 'utf8'), ctx);
const deck = ctx.window.SPANISH500;
const errs = [], warns = [];
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,;:"—()]/g, ' ');
const seen = new Map();
deck.problems.forEach((p, i) => {
  const id = `#${i + 1} ${p.es}`;
  for (const f of ['es', 'esSentence', 'en', 'enSentence']) if (!p[f]) errs.push(`${id}: missing ${f}`);
  if (seen.has(p.es)) errs.push(`${id}: duplicate of #${seen.get(p.es)}`); else seen.set(p.es, i + 1);
  for (const f of ['esSentence', 'enSentence']) if (p[f] && !/[.?!")]$/.test(p[f])) errs.push(`${id}: ${f} lacks final punctuation`);
  if (p.k < 0) errs.push(`${id}: no topic`);
  // Does the sentence use the word? Compare the first 4 letters of each word of the headword (minus article).
  const words = norm(p.es).split(/\s+/).filter((w) => w && !['el', 'la', 'los', 'las'].includes(w));
  const sent = ' ' + norm(p.esSentence) + ' ';
  const hit = words.every((w) => sent.includes(w.length <= 4 ? ' ' + w : w.slice(0, Math.max(3, w.length - 3))));
  if (!hit) warns.push(`${id}: "${p.esSentence}"`);
});
const perTopic = deck.topics.map((t, k) => `${t}: ${deck.problems.filter((p) => p.k === k).length}`);
console.log(perTopic.join('\n'));
console.log(`\ntopics: ${deck.topics.length}, words: ${deck.problems.length}`);
if (warns.length) console.log(`\nCheck by hand (sentence may not contain the word, e.g. a conjugated verb):\n` + warns.join('\n'));
if (errs.length) { console.log('\nERRORS:\n' + errs.join('\n')); process.exit(1); }
if (deck.problems.length < 500) { console.log('too few words'); process.exit(1); }
console.log('\nOK');
