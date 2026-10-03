// Compiles and runs every LC150 solution against its example test.
// Usage: node tests/run.js [problemNumber ...]
const fs = require('fs'), path = require('path'), cp = require('child_process'), vm = require('vm'), os = require('os');
const root = path.join(__dirname, '..', 'decks', 'lc150');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'index.js'), 'utf8'), ctx);
vm.runInContext('var LC150 = window.LC150;', ctx);
for (const p of ctx.window.LC150.parts) {
  const f = path.join(root, p);
  if (fs.existsSync(f)) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: p });
}
let probs = ctx.window.LC150.problems;
const only = process.argv.slice(2).map(Number);
if (only.length) probs = probs.filter((p) => only.includes(p.n));
// Readability rules for the solutions shown on the cards:
// - no ++/-- inside an index or expression (only as a statement of its own, or in a for header)
// - if/else/for/while bodies always in braces on their own lines
// - one statement per line
function styleIssues(code) {
  const issues = [];
  code.split('\n').forEach((raw, idx) => {
    let t = raw.replace(/"(?:\\.|[^"\\])*"/g, '""').replace(/'(?:\\.|[^'\\])*'/g, "''");
    t = t.replace(/\/\/.*$/, '').trim();
    if (!t) return;
    const where = `line ${idx}: ${raw.trim()}`;
    let rest = t;
    if (/^for\s*\(/.test(t)) {
      let depth = 0, end = -1;
      for (let i = t.indexOf('('); i < t.length; i++) {
        if (t[i] === '(') depth++;
        if (t[i] === ')') { depth--; if (depth === 0) { end = i; break; } }
      }
      rest = t.slice(end + 1);
    }
    if (/^(\}\s*)?(else\b|if\b|for\b|while\b|switch\b|do\b)/.test(t) && !t.endsWith('{')) issues.push('control statement without a braced block: ' + where);
    if (/(\+\+|--)/.test(rest)) {
      const ok = /^[^=;?]*[^\s;](\+\+|--);$/.test(rest) && (rest.match(/\+\+|--/g) || []).length === 1;
      if (!ok) issues.push('++/-- inside an expression: ' + where);
    }
    if ((rest.match(/;/g) || []).length > 1) issues.push('more than one statement on a line: ' + where);
    if (/\)\s*(const\s*)?\{[^}]*;/.test(rest)) issues.push('body on the same line as its header: ' + where);
  });
  return issues;
}
for (const p of probs) {
  const issues = styleIssues(p.cpp);
  if (issues.length) console.log(`STYLE #${p.n} ${p.t}\n  ` + issues.join('\n  '));
}
const styleBad = probs.filter((p) => styleIssues(p.cpp).length).length;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lc150-'));
const prelude = fs.readFileSync(path.join(__dirname, 'prelude.h'), 'utf8');
const jobs = probs.map((p) => () => new Promise((resolve) => {
  if (!p.test) return resolve({ p, ok: false, msg: 'no test' });
  const src = path.join(tmp, `p${p.n}.cpp`), bin = path.join(tmp, `p${p.n}`);
  fs.writeFileSync(src, `${prelude}\n${p.pre || ''}\n${p.cpp}\nint main(){\n${p.test}\nputs("ok");\nreturn 0;}\n`);
  cp.exec(`g++ -std=c++17 -O1 -g -Wall -Wno-unused-variable -Wno-sign-compare -fsanitize=address,undefined -fno-sanitize-recover=all -o ${bin} ${src} && ASAN_OPTIONS=detect_leaks=0 timeout 20 ${bin}`,
    { maxBuffer: 1 << 24 }, (err, stdout, stderr) => {
      const ok = !err && stdout.trim().endsWith('ok');
      const warn = /warning:/.test(stderr) ? stderr.split('\n').filter((l) => /warning:/.test(l)).join('\n') : '';
      resolve({ p, ok, msg: ok ? warn : (stderr || stdout || String(err)).slice(0, 3000) });
    });
}));
(async () => {
  const results = []; let i = 0;
  const workers = Array.from({ length: Math.max(2, os.cpus().length) }, async () => {
    while (i < jobs.length) results.push(await jobs[i++]());
  });
  await Promise.all(workers);
  results.sort((a, b) => a.p.n - b.p.n);
  const bad = results.filter((r) => !r.ok), warns = results.filter((r) => r.ok && r.msg);
  warns.forEach((r) => console.log(`WARN #${r.p.n} ${r.p.t}\n${r.msg}`));
  bad.forEach((r) => console.log(`FAIL #${r.p.n} ${r.p.t}\n${r.msg}\n`));
  // deck-level checks
  const all = ctx.window.LC150.problems, nums = all.map((p) => p.n);
  const dup = nums.filter((n, k) => nums.indexOf(n) !== k);
  console.log(`problems: ${all.length}, duplicates: ${JSON.stringify(dup)}`);
  const EXPECTED = [88,27,26,80,169,189,121,122,55,45,274,380,238,134,135,42,13,12,58,14,151,6,28,68,
    125,392,167,11,15, 209,3,30,76, 36,54,48,73,289, 383,205,290,242,49,1,202,219,128, 228,56,57,452,
    20,71,155,150,224, 141,2,21,138,92,25,19,82,61,86,146, 104,100,226,101,105,106,117,114,112,129,124,173,222,236,
    199,637,102,103, 530,230,98, 200,130,133,399,207,210, 909,433,127, 208,211,212, 17,77,46,39,52,22,79,
    108,148,427,23, 53,918, 35,74,162,33,34,153,4, 215,502,373,295, 67,190,191,136,137,201,
    9,66,172,69,50,149, 70,198,139,322,300, 120,64,63,5,97,72,123,188,221];
  if (!only.length) {
    const have = new Set(nums), exp = new Set(EXPECTED);
    console.log(`expected list size: ${exp.size}; missing: ${JSON.stringify(EXPECTED.filter((n) => !have.has(n)))}; extra: ${JSON.stringify(nums.filter((n) => !exp.has(n)))}`);
    if (exp.size !== 150 || nums.length !== 150 || EXPECTED.some((n) => !have.has(n))) bad.push({ p: { n: 0, t: 'deck list' }, msg: 'problem list mismatch' });
  }
  for (const p of all) for (const f of ['n','t','d','s','i','o','a','why','ps','cpp','tc','sc','test'])
    if (p[f] === undefined || p[f] === '') console.log(`MISSING #${p.n} field ${f}`);
  console.log(`${results.length - bad.filter((b) => b.p.n).length}/${results.length} passed`);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`style: ${probs.length - styleBad}/${probs.length} solutions pass the readability rules`);
  process.exit(bad.length || styleBad ? 1 : 0);
})();
