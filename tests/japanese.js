// Validates the Japanese travel deck. Usage: node tests/japanese.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'decks', 'japanese', 'index.js'), 'utf8'), ctx);
const deck = ctx.window.JAPANESE;
const errs = [];
const etiquette = deck.topics.indexOf('Etiquette');
const JP = /[぀-ヿ㐀-鿿＀-￯]/; // kana, kanji, full-width forms
const seen = new Set();
deck.problems.forEach((p) => {
  const id = `${deck.topics[p.k]} / ${p.en}`;
  if (!p.en || !p.romaji) errs.push(`${id}: missing English or answer`);
  const key = p.en + '|' + p.hint;
  if (seen.has(key)) errs.push(`${id}: duplicate`);
  seen.add(key);
  if (p.k !== etiquette) {
    if (!p.ja || !JP.test(p.ja)) errs.push(`${id}: Japanese text missing or not in Japanese script`);
    if (JP.test(p.romaji)) errs.push(`${id}: romaji contains Japanese characters`);
    if (!/^[A-Za-z0-9āīūēōĀĪŪĒŌ'’ ,.!?/()_\-+]+$/.test(p.romaji)) errs.push(`${id}: unexpected characters in romaji "${p.romaji}"`);
  }
  const c = deck.build(p);
  if (/^\s*[-•#]\s/m.test(c.front + '\n' + c.back)) errs.push(`${id}: a line would render as a list or heading`);
  if ((c.front.length >= 300) || (c.back.length >= 300)) errs.push(`${id}: too long for the centered layout`);
});
console.log(deck.topics.map((t, k) => `${t}: ${deck.problems.filter((p) => p.k === k).length}`).join('\n'));
console.log(`\ntopics: ${deck.topics.length}, cards: ${deck.problems.length}`);
if (errs.length) { console.log('ERRORS:\n' + errs.join('\n')); process.exit(1); }
console.log('OK');
