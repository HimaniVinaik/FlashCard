/* FlashCard — a simple, elegant flash card app for iPhone.
 * Plain JavaScript, no build step. Data is saved on the device in IndexedDB
 * (with a localStorage fallback) and can be exported/imported as a JSON backup.
 */
'use strict';

/* =====================================================================
 * Utilities
 * ===================================================================*/
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
const now = () => Date.now();
const MIN = 60 * 1000;
const clone = (o) => JSON.parse(JSON.stringify(o));
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (k === 'svg') el.innerHTML = v; // trusted, static icon markup only
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    }
  }
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

const svg = (body, vb = '0 0 24 24') =>
  `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const ICONS = {
  back: svg('<path d="M15 4l-8 8 8 8" stroke-width="2.6"/>'),
  chev: svg('<path d="M1.5 1.5l5 5-5 5" stroke-width="2"/>', '0 0 8 13'),
  folder: svg('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" stroke="none"/>'),
  folderPlus: svg('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 10.5v5M9.5 13h5"/>'),
  compose: svg('<path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/>'),
  settings: svg('<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>'),
  more: svg('<circle cx="12" cy="12" r="10" stroke-width="1.8"/><path d="M7.5 12h.01M12 12h.01M16.5 12h.01" stroke-width="2.8"/>'),
  pen: svg('<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>'),
  eraser: svg('<path d="M20 20H8l-5-5a2 2 0 0 1 0-2.8L13.2 2a2 2 0 0 1 2.8 0l5 5a2 2 0 0 1 0 2.8L11 20"/><path d="M6 11l7 7"/>'),
  undo: svg('<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>'),
  redo: svg('<path d="M15 14l5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>'),
  trash: svg('<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>'),
  cards: svg('<rect x="3" y="7" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>'),
  exportI: svg('<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>'),
  importI: svg('<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/>'),
  shield: svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
  info: svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'),
};
const icon = (name, cls) => h('span', { class: cls || 'icon', svg: ICONS[name] });

/* =====================================================================
 * Storage — IndexedDB with localStorage fallback
 * ===================================================================*/
const DB_NAME = 'flashcard';
const LS_KEY = 'flashcard-db';

function idbOpen() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('IndexedDB unavailable'));
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore('kv');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function idbReq(db, mode, fn) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('kv', mode);
    const r = fn(tx.objectStore('kv'));
    tx.oncomplete = () => resolve(r && r.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

const Store = {
  data: null,
  idb: null,
  timer: null,
  saving: Promise.resolve(),

  async load() {
    try {
      this.idb = await idbOpen();
      const d = await idbReq(this.idb, 'readonly', (s) => s.get('db'));
      if (d) this.data = d;
    } catch (e) {
      console.warn('IndexedDB failed, using localStorage', e);
      this.idb = null;
    }
    if (!this.data) {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) this.data = JSON.parse(raw);
      } catch (e) { /* ignore */ }
    }
    const firstRun = !this.data;
    this.data = normalizeData(this.data || {});
    if (firstRun) { seed(this.data); await this.flush(); }
    // Ask the browser to keep our data even when storage is low.
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persisted().then((p) => p || navigator.storage.persist()).catch(() => {});
    }
  },

  save() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), 300);
  },

  flush() {
    clearTimeout(this.timer);
    this.timer = null;
    const snapshot = this.data;
    this.saving = this.saving.then(async () => {
      if (this.idb) {
        try {
          await idbReq(this.idb, 'readwrite', (s) => s.put(snapshot, 'db'));
          return;
        } catch (e) { console.warn('IndexedDB write failed', e); }
      }
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(snapshot));
      } catch (e) {
        toast('Could not save — storage is full');
      }
    });
    return this.saving;
  },
};

// Make sure pending changes are written when the app is backgrounded/closed.
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && Store.timer) Store.flush(); });
window.addEventListener('pagehide', () => { if (Store.timer) Store.flush(); });

function emptySide() { return { text: '', strokes: [] }; }
function newSrs() { return { state: 'new', due: 0, interval: 0, ease: 2.5, reps: 0, lapses: 0, last: 0, history: [] }; }
function normalizeSrs(s) {
  const o = Object.assign(newSrs(), s && typeof s === 'object' ? s : {});
  o.history = Array.isArray(o.history) ? o.history.filter(Array.isArray).slice(-HISTORY_MAX) : [];
  return o;
}
const HISTORY_MAX = 30;
const DEFAULT_SETTINGS = { newPerDay: 9999 }; // 9999 = no limit

function normalizeSide(s) {
  s = s && typeof s === 'object' ? s : {};
  return {
    text: typeof s.text === 'string' ? s.text : '',
    strokes: Array.isArray(s.strokes) ? s.strokes.filter((st) => st && Array.isArray(st.points)) : [],
  };
}
function normalizeCard(c) {
  return {
    id: String(c.id || uid()),
    folderId: c.folderId != null ? String(c.folderId) : null,
    front: normalizeSide(c.front),
    back: normalizeSide(c.back),
    createdAt: Number(c.createdAt) || now(),
    updatedAt: Number(c.updatedAt) || now(),
    srs: normalizeSrs(c.srs),
    // Built-in deck cards remember where they came from ("deckId:key"), so deck updates can find them.
    deckRef: typeof c.deckRef === 'string' ? c.deckRef : undefined,
  };
}
function normalizeData(d) {
  const folders = (Array.isArray(d.folders) ? d.folders : [])
    .filter((f) => f && f.id)
    .map((f) => ({
      id: String(f.id),
      name: String(f.name || 'Untitled'),
      parentId: f.parentId != null ? String(f.parentId) : null,
      createdAt: Number(f.createdAt) || now(),
    }));
  const ids = new Set(folders.map((f) => f.id));
  folders.forEach((f) => { if (f.parentId && !ids.has(f.parentId)) f.parentId = null; });
  const cards = (Array.isArray(d.cards) ? d.cards : [])
    .filter((c) => c && c.id)
    .map(normalizeCard)
    .filter((c) => ids.has(c.folderId));
  const packs = Array.isArray(d.packs) ? d.packs.filter((p) => typeof p === 'string') : [];
  const settings = Object.assign({}, DEFAULT_SETTINGS, d.settings && typeof d.settings === 'object' ? d.settings : {});
  if (!(Number(settings.newPerDay) >= 0)) settings.newPerDay = DEFAULT_SETTINGS.newPerDay;
  // Studying is never limited by default. Older versions defaulted to 20 new cards a day; lift that once.
  if (!settings.noLimitDefault) { settings.newPerDay = 9999; settings.noLimitDefault = true; }
  const days = {};
  if (d.days && typeof d.days === 'object') {
    for (const [k, v] of Object.entries(d.days)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(k) && v && typeof v === 'object') {
        const newByRoot = {};
        if (v.newByRoot && typeof v.newByRoot === 'object') {
          for (const [rk, rv] of Object.entries(v.newByRoot)) newByRoot[rk] = Number(rv) || 0;
        }
        days[k] = { reviews: Number(v.reviews) || 0, newSeen: Number(v.newSeen) || 0, practice: Number(v.practice) || 0, newByRoot };
      }
    }
  }
  // Content version of each installed built-in deck.
  const packVersions = {};
  if (d.packVersions && typeof d.packVersions === 'object') {
    for (const [k, v] of Object.entries(d.packVersions)) packVersions[k] = Number(v) || 1;
  }
  return { version: 2, folders, cards, packs, packVersions, settings, days };
}

/* ----- Built-in decks (loaded on demand from /decks) ----- */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => { s.remove(); reject(new Error('Could not load ' + src)); };
    document.head.append(s);
  });
}
/** Built-in decks. Each is installed once, automatically, and can be re-added from Settings. */
const PACKS = [
  // version: bump when a deck's card text changes, so installed copies get updated in place.
  { id: 'lc150', global: 'LC150', base: 'decks/lc150/', count: 150, version: 2, label: 'LC 150', added: 'Added the LC deck: 150 interview problems',
    updated: 'Updated the LC cards with commented, easier-to-read C++ solutions',
    about: 'LeetCode Top Interview 150, as an LC folder grouped by topic' },
  { id: 'spanish500', global: 'SPANISH500', base: 'decks/spanish/', count: 529, label: 'Spanish', added: 'Added the Spanish deck: 529 beginner words',
    about: '529 beginner words with example sentences, as a Spanish folder' },
  { id: 'conversions', global: 'CONVERSIONS', base: 'decks/conversions/', count: 52, label: 'Conversions', added: 'Added the Conversions deck: 52 cards',
    about: 'Miles to km, pounds to kg, cups, gallons, °F to °C and more' },
  { id: 'useful', global: 'USEFUL', base: 'decks/useful/', count: 112, label: 'Useful Facts', added: 'Added the Useful Facts deck: 112 cards',
    about: 'NATO alphabet, Roman numerals, first aid, math, science and more' },
  { id: 'more-conversions', global: 'MORE_CONVERSIONS', base: 'decks/more-conversions/', count: 100, label: 'More Conversions',
    added: 'Added the More Conversions deck: 100 cards',
    about: 'Metric to US (liters to gallons, km to miles, °C to °F), metric prefixes, kitchen weights, everyday math' },
];
const PACK_COLORS = { lc150: '#ff9500', spanish500: '#ff2d55', conversions: '#30b0c7', useful: '#5856d6', 'more-conversions': '#34c759' };
const packPromises = {};
function loadPack(def) {
  if (!packPromises[def.id]) {
    packPromises[def.id] = (async () => {
      if (!window[def.global]) await loadScript(def.base + 'index.js');
      const deck = window[def.global];
      for (const part of deck.parts || []) await loadScript(def.base + part);
      if (deck.problems.length !== def.count) throw new Error(`${def.label} deck is incomplete`);
      return deck;
    })().catch((e) => {
      delete packPromises[def.id];
      window[def.global] = undefined;
      throw e;
    });
  }
  return packPromises[def.id];
}
/** Adds a deck's folder, one subfolder per topic, and all its cards. */
function installDeck(deck) {
  const t = now();
  const root = { id: uid(), name: deck.name, parentId: null, createdAt: t };
  Store.data.folders.push(root);
  const subs = deck.topics.map((name, i) => {
    const f = { id: uid(), name: `${String(i + 1).padStart(2, '0')} · ${name}`, parentId: root.id, createdAt: t + i };
    Store.data.folders.push(f);
    return f;
  });
  const ordered = deck.topics.flatMap((_, k) => deck.problems.filter((p) => p.k === k));
  ordered.forEach((p, i) => {
    const { front, back } = deck.build(p);
    Store.data.cards.push(normalizeCard({
      id: uid(), folderId: subs[p.k].id, front: { text: front }, back: { text: back }, createdAt: t + 1000 + i,
      deckRef: deck.key ? `${deck.id}:${deck.key(p)}` : undefined,
    }));
  });
  if (!Store.data.packs.includes(deck.id)) Store.data.packs.push(deck.id);
  Store.data.packVersions[deck.id] = Math.max(Store.data.packVersions[deck.id] || 1, deck.version || 1);
  return root;
}
/** Rewrites the text of already-installed cards from a newer version of a deck.
 *  Review progress and history are kept. Cards are matched by their stored deck
 *  reference, or (for cards installed before references existed) by their unchanged front. */
function refreshDeck(deck) {
  const byRef = new Map();
  const byFront = new Map();
  deck.problems.forEach((p) => {
    const built = deck.build(p);
    const ref = `${deck.id}:${deck.key(p)}`;
    byRef.set(ref, { built, ref });
    byFront.set(built.front, { built, ref });
  });
  let updated = 0;
  for (const card of Store.data.cards) {
    const match = (card.deckRef && byRef.get(card.deckRef)) || (!card.deckRef && byFront.get(card.front.text));
    if (!match) continue;
    if (card.back.text !== match.built.back || card.front.text !== match.built.front) {
      card.front.text = match.built.front;
      card.back.text = match.built.back;
      card.updatedAt = now();
      updated++;
    }
    card.deckRef = match.ref;
  }
  return updated;
}
/** Installs each built-in deck once, the first time the app runs with a version that has it. */
async function ensurePacks() {
  for (const def of PACKS) {
    if (Store.data.packs.includes(def.id)) {
      // Installed already: update its cards if this app has a newer version of the deck.
      const have = Store.data.packVersions[def.id] || 1;
      if (def.version && def.version > have) {
        try {
          const deck = await loadPack(def);
          const updated = refreshDeck(deck);
          Store.data.packVersions[def.id] = def.version;
          await Store.flush();
          if (updated) {
            render('none');
            toast(def.updated || `Updated the ${def.label} deck`);
          }
        } catch (e) {
          console.warn(`${def.label} deck not updated yet`, e);
        }
      }
      continue;
    }
    try {
      const deck = await loadPack(def);
      if (Store.data.packs.includes(def.id)) continue;
      installDeck(deck);
      await Store.flush();
      render('none');
      toast(def.added);
    } catch (e) {
      console.warn(`${def.label} deck not installed yet`, e);
    }
  }
}

function seed(d) {
  const f = { id: uid(), name: 'Getting Started', parentId: null, createdAt: now() };
  d.folders.push(f);
  const items = [
    ['Tap a card to flip it 👆', 'Then rate how well you knew it.\n\nCards you find hard come back sooner; easy ones come back later.'],
    ['How do I add a card?', 'Open a folder and tap the ✎ button in the bottom-right corner.'],
    ['Can I write by hand?', 'Yes! Each side of a card has a drawing pad. Use your finger or Apple Pencil.'],
    ['How do I edit or delete a card?', 'Tap a card in the folder list to edit it. Delete is at the bottom of the editor, or tap Edit in the folder.'],
    ['Where is my data saved?', 'Right here on your iPhone, automatically.\n\nUse Settings › Export Backup to keep a copy somewhere safe.'],
  ];
  items.forEach(([front, back], i) => {
    d.cards.push(normalizeCard({ id: uid(), folderId: f.id, front: { text: front }, back: { text: back }, createdAt: now() + i }));
  });
}

/* =====================================================================
 * Model
 * ===================================================================*/
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

const Model = {
  get folders() { return Store.data.folders; },
  get cards() { return Store.data.cards; },
  folder(id) { return this.folders.find((f) => f.id === id) || null; },
  card(id) { return this.cards.find((c) => c.id === id) || null; },
  childFolders(parentId) {
    return this.folders.filter((f) => f.parentId === parentId).sort((a, b) => collator.compare(a.name, b.name));
  },
  cardsIn(folderId) {
    return this.cards.filter((c) => c.folderId === folderId).sort((a, b) => a.createdAt - b.createdAt);
  },
  descendantIds(folderId) {
    const out = [folderId];
    for (let i = 0; i < out.length; i++) {
      this.folders.forEach((f) => { if (f.parentId === out[i]) out.push(f.id); });
    }
    return out;
  },
  cardsDeep(folderId) {
    const ids = new Set(this.descendantIds(folderId));
    return this.cards.filter((c) => ids.has(c.folderId));
  },
  path(folderId) {
    const parts = [];
    let f = this.folder(folderId);
    while (f) { parts.unshift(f.name); f = this.folder(f.parentId); }
    return parts.join(' › ');
  },
  /** All folders in tree order, for pickers. */
  tree(parentId = null, depth = 0, out = []) {
    this.childFolders(parentId).forEach((f) => { out.push({ folder: f, depth }); this.tree(f.id, depth + 1, out); });
    return out;
  },
  addFolder(name, parentId) {
    const f = { id: uid(), name, parentId: parentId || null, createdAt: now() };
    this.folders.push(f);
    Store.save();
    return f;
  },
  renameFolder(id, name) {
    const f = this.folder(id);
    if (f) { f.name = name; Store.save(); }
  },
  deleteFolder(id) {
    const ids = new Set(this.descendantIds(id));
    Store.data.folders = this.folders.filter((f) => !ids.has(f.id));
    Store.data.cards = this.cards.filter((c) => !ids.has(c.folderId));
    Store.save();
  },
  addCard(folderId, front, back) {
    const c = normalizeCard({ id: uid(), folderId, front, back });
    this.cards.push(c);
    Store.save();
    return c;
  },
  updateCard(id, patch) {
    const c = this.card(id);
    if (!c) return;
    Object.assign(c, patch, { updatedAt: now() });
    Store.save();
  },
  deleteCard(id) {
    Store.data.cards = this.cards.filter((c) => c.id !== id);
    Store.save();
  },
};

function sideIsEmpty(s) { return !s.text.trim() && !s.strokes.length; }
/** Text lines with formatting markers removed, for list previews. */
function plainLines(text) {
  return (text || '').split('\n')
    .filter((l) => !/^\s*```/.test(l))
    .map((l) => l.replace(/^#{1,3}\s+/, '').replace(/^\s*[-•]\s+/, '').replace(/\*\*|`/g, '').trim())
    .filter(Boolean);
}
function cardTitle(c) {
  return plainLines(c.front.text)[0] || (c.front.strokes.length ? 'Handwritten card' : 'Empty card');
}
function cardSubtitle(c) {
  const title = cardTitle(c);
  return plainLines(c.back.text).find((l) => l !== title) || (c.back.strokes.length ? '✎ Handwritten answer' : '—');
}

/* =====================================================================
 * Spaced repetition (simplified SM-2, Anki-style buttons)
 * ===================================================================*/
function startOfDayPlus(days) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.getTime();
}
function isDue(card, t = now()) { return card.srs.state !== 'new' && card.srs.due <= t; }

const DAY = 24 * 60 * MIN;
const MATURE_DAYS = 21;
const GRADES = ['again', 'hard', 'good', 'easy'];

/* ----- Daily study log: reviews done, new cards introduced, streak ----- */
function dayKey(t = now()) {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function dayLog(t) { return Store.data.days[dayKey(t)] || { reviews: 0, newSeen: 0, practice: 0, newByRoot: {} }; }
function logStudy(field, rootId) {
  const k = dayKey();
  const d = Store.data.days[k] || (Store.data.days[k] = { reviews: 0, newSeen: 0, practice: 0, newByRoot: {} });
  d[field] = (d[field] || 0) + 1;
  if (field === 'newSeen' && rootId) {
    d.newByRoot = d.newByRoot || {};
    d.newByRoot[rootId] = (d.newByRoot[rootId] || 0) + 1;
  }
}
/** The top-level folder (deck) that a folder belongs to. */
function rootOf(folderId) {
  let f = Model.folder(folderId);
  for (let guard = 0; f && f.parentId && guard < 100; guard++) f = Model.folder(f.parentId) || f;
  return f ? f.id : folderId;
}
/** New cards still allowed today. The limit applies to each top-level deck separately, like Anki. */
function newLeftToday(rootId) {
  const limit = Number(Store.data.settings.newPerDay);
  const seen = ((dayLog().newByRoot || {})[rootId]) || 0;
  return Math.max(0, limit - seen);
}
/** Consecutive days with any study, ending today (or yesterday if today has none yet). */
function studyStreak() {
  const studied = (d) => { const l = dayLog(d.getTime()); return l.reviews + l.practice > 0; };
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  if (!studied(d)) d.setDate(d.getDate() - 1);
  let n = 0;
  while (studied(d) && n < 3650) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

function stats(cards) {
  const t = now();
  let fresh = 0, due = 0, learning = 0, young = 0, mature = 0;
  const freshByRoot = new Map();
  const roots = new Map(); // folderId -> root id, cached for this call
  cards.forEach((c) => {
    const s = c.srs;
    if (s.state === 'new') {
      fresh++;
      if (!roots.has(c.folderId)) roots.set(c.folderId, rootOf(c.folderId));
      const r = roots.get(c.folderId);
      freshByRoot.set(r, (freshByRoot.get(r) || 0) + 1);
      return;
    }
    if (s.due <= t) due++;
    if (s.state === 'learn') learning++;
    else if (s.interval >= MATURE_DAYS) mature++;
    else young++;
  });
  let newToday = 0;
  freshByRoot.forEach((n, r) => { newToday += Math.min(n, newLeftToday(r)); });
  return { total: cards.length, new: fresh, newToday, due, learning, young, mature };
}

/** Number of cards due on each of the next `days` days (index 0 = today, including overdue). */
function forecast(cards, days = 7) {
  const today = startOfDayPlus(0);
  const out = new Array(days).fill(0);
  let later = 0;
  cards.forEach((c) => {
    if (c.srs.state === 'new') return;
    const dueDay = new Date(c.srs.due);
    dueDay.setHours(0, 0, 0, 0); // compare calendar days, so DST changes don't shift buckets
    const i = Math.max(0, Math.round((dueDay.getTime() - today) / DAY));
    if (i < days) out[i]++; else later++;
  });
  return { days: out, later };
}

function applyGrade(srs, grade) {
  const t = now();
  const prevLast = srs.last;
  // Reviewing a card before it's due (extra study sessions) must not wreck its schedule.
  const early = srs.state === 'review' && srs.due > t;
  srs.last = t;
  srs.reps++;
  srs.history = (srs.history || []).concat([[t, GRADES.indexOf(grade)]]).slice(-HISTORY_MAX);
  if (srs.state === 'new' || srs.state === 'learn') {
    if (grade === 'again') { srs.state = 'learn'; srs.due = t + 1 * MIN; }
    else if (grade === 'hard') { srs.state = 'learn'; srs.due = t + 6 * MIN; }
    else if (grade === 'good') { srs.state = 'review'; srs.interval = Math.max(1, srs.interval); srs.due = startOfDayPlus(srs.interval); }
    else { srs.state = 'review'; srs.interval = Math.max(4, srs.interval); srs.ease += 0.15; srs.due = startOfDayPlus(srs.interval); }
    return srs;
  }
  const oldInterval = srs.interval || 1;
  // For an early review, base the next gap on the time actually elapsed, not the planned interval.
  const iv = early && prevLast ? Math.max(1, Math.min(oldInterval, Math.round((t - prevLast) / DAY))) : oldInterval;
  if (grade === 'again') {
    srs.lapses++;
    srs.ease = Math.max(1.3, srs.ease - 0.2);
    srs.interval = Math.max(1, Math.round(iv * 0.5));
    srs.state = 'learn';
    srs.due = t + 10 * MIN;
    return srs;
  }
  if (grade === 'hard') { srs.interval = Math.max(iv + 1, Math.round(iv * 1.2)); srs.ease = Math.max(1.3, srs.ease - 0.15); }
  else if (grade === 'good') { srs.interval = Math.max(iv + 1, Math.round(iv * srs.ease)); }
  else { srs.interval = Math.max(iv + 2, Math.round(iv * srs.ease * 1.3)); srs.ease += 0.15; }
  if (early) srs.interval = Math.max(srs.interval, oldInterval); // studying early never shortens the gap
  srs.due = startOfDayPlus(srs.interval);
  return srs;
}

function fmtDays(d) {
  if (d < 30) return `${d}d`;
  if (d < 365) return `${+(d / 30).toFixed(d < 60 ? 1 : 0)}mo`;
  return `${+(d / 365).toFixed(1)}y`;
}
function fmtMs(ms) {
  const m = ms / MIN;
  if (m < 1) return '<1m';
  if (m < 60) return `${Math.round(m)}m`;
  const hr = m / 60;
  if (hr < 24) return `${Math.round(hr)}h`;
  return fmtDays(Math.round(hr / 24));
}
function gradeLabel(card, grade) {
  const s = applyGrade(clone(card.srs), grade);
  return s.state === 'learn' ? fmtMs(s.due - now()) : fmtDays(s.interval);
}
/** Human label for when a card is next due ("in 10m", "tomorrow", "in 5d"). */
function fmtDue(card) {
  const s = card.srs;
  if (s.state === 'learn') return 'in ' + fmtMs(Math.max(0, s.due - now()));
  const days = Math.round((s.due - startOfDayPlus(0)) / (24 * 60 * MIN));
  return days <= 1 ? 'tomorrow' : 'in ' + fmtDays(days);
}
function cardStatus(card) {
  const s = card.srs;
  if (s.state === 'new') return { label: 'New', cls: 'new' };
  if (s.due <= now()) return { label: s.state === 'learn' ? 'Learning' : 'Due', cls: 'due' };
  return { label: fmtDue(card), cls: '' };
}

/* =====================================================================
 * Light text formatting for cards
 *   **bold**   `code`   ## heading   - bullet   ```lang … ``` code block
 * Built with DOM nodes only (never innerHTML), so card text cannot inject markup.
 * ===================================================================*/
const RICH_RE = /```|^#{1,3}\s|\*\*|^\s*[-•]\s|`[^`\n]+`/m;
const isRich = (text) => RICH_RE.test(text || '');

function inlineNodes(text) {
  const out = [];
  const re = /\*\*(.+?)\*\*|`([^`]+)`/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(m[1] != null ? h('strong', null, inlineNodes(m[1])) : h('code', { class: 'rt-code' }, m[2]));
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const CPP_KEYWORDS = new Set(('alignas alignof and auto bool break case catch char class const constexpr continue ' +
  'decltype default delete do double else enum explicit extern false float for friend goto if inline int long ' +
  'mutable namespace new noexcept not nullptr operator or private protected public return short signed sizeof ' +
  'static static_cast struct switch template this throw true try typedef typename union unsigned using virtual ' +
  'void volatile while').split(' '));
const CPP_TYPES = new Set(('vector string unordered_map unordered_set map set multiset pair queue stack ' +
  'priority_queue deque list tuple array greater less istringstream stringstream function size_t uint32_t ' +
  'ListNode TreeNode Node Solution').split(' '));

function highlightCpp(code, el) {
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[uUlLfF]*\b)|(#\s*[a-z]+)|([A-Za-z_]\w*)/g;
  let last = 0, m;
  while ((m = re.exec(code))) {
    if (m.index > last) el.append(code.slice(last, m.index));
    let cls = null;
    if (m[1]) cls = 'tk-com';
    else if (m[2]) cls = 'tk-str';
    else if (m[3]) cls = 'tk-num';
    else if (m[4]) cls = 'tk-kw';
    else if (CPP_KEYWORDS.has(m[5])) cls = 'tk-kw';
    else if (CPP_TYPES.has(m[5])) cls = 'tk-type';
    else if (code[re.lastIndex] === '(') cls = 'tk-fn';
    el.append(cls ? h('span', { class: cls }, m[0]) : m[0]);
    last = re.lastIndex;
  }
  if (last < code.length) el.append(code.slice(last));
}

function codeBlock(code, lang) {
  const codeEl = h('code');
  if (/^(cpp|c\+\+|cc|c|h|hpp)$/.test(lang)) highlightCpp(code, codeEl);
  else codeEl.textContent = code;
  return h('pre', { class: 'rt-pre', 'data-lang': lang || null }, codeEl);
}

function renderRich(text) {
  const root = h('div', { class: 'rich' });
  const lines = String(text || '').replace(/\r\n?/g, '\n').split('\n');
  let para = [], list = null;
  const flushPara = () => {
    if (!para.length) return;
    const p = h('p');
    para.forEach((l, i) => { if (i) p.append(h('br')); p.append(...inlineNodes(l)); });
    root.append(p);
    para = [];
  };
  const flushList = () => { if (list) { root.append(list); list = null; } };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fence = line.match(/^\s*```\s*([\w+#-]*)\s*$/);
    if (fence) {
      flushPara(); flushList();
      const body = [];
      for (i++; i < lines.length && !/^\s*```\s*$/.test(lines[i]); i++) body.push(lines[i]);
      root.append(codeBlock(body.join('\n'), fence[1].toLowerCase()));
      continue;
    }
    const head = line.match(/^#{1,3}\s+(.*)$/);
    if (head) { flushPara(); flushList(); root.append(h('div', { class: 'rt-h' }, inlineNodes(head[1]))); continue; }
    const bullet = line.match(/^\s*[-•]\s+(.*)$/);
    if (bullet) { flushPara(); if (!list) list = h('ul'); list.append(h('li', null, inlineNodes(bullet[1]))); continue; }
    if (!line.trim()) { flushPara(); flushList(); continue; }
    flushList();
    para.push(line);
  }
  flushPara(); flushList();
  return root;
}

/* =====================================================================
 * Drawing (strokes stored as normalized points; canvas aspect 4:3)
 * ===================================================================*/
const ASPECT = 3 / 4; // height / width
const PEN_SIZES = [0.006, 0.012, 0.022];
const ERASER_SIZE = 0.06;
const COLORS = {
  ink: null, // theme text color
  red: '#ff3b30',
  blue: '#0a7aff',
  green: '#34c759',
  orange: '#ff9500',
};
function resolveColor(c) {
  if (!c || c === 'ink' || !(c in COLORS)) return getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#000';
  return COLORS[c];
}
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

function strokeStyle(ctx, s, w) {
  const eraser = s.tool === 'eraser';
  ctx.globalCompositeOperation = eraser ? 'destination-out' : 'source-over';
  ctx.strokeStyle = ctx.fillStyle = eraser ? '#000' : resolveColor(s.color);
  ctx.lineWidth = Math.max(1, s.size * w);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}
function drawDot(ctx, p, w) {
  ctx.beginPath();
  ctx.arc(p[0] * w, p[1] * w, ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.fill();
}
function renderStroke(ctx, s, w) {
  const p = s.points;
  if (!p.length) return;
  ctx.save();
  strokeStyle(ctx, s, w);
  if (p.length === 1) drawDot(ctx, p[0], w);
  else {
    ctx.beginPath();
    ctx.moveTo(p[0][0] * w, p[0][1] * w);
    const m = mid(p[0], p[1]);
    ctx.lineTo(m[0] * w, m[1] * w);
    for (let i = 1; i < p.length - 1; i++) {
      const m2 = mid(p[i], p[i + 1]);
      ctx.quadraticCurveTo(p[i][0] * w, p[i][1] * w, m2[0] * w, m2[1] * w);
    }
    const last = p[p.length - 1];
    ctx.lineTo(last[0] * w, last[1] * w);
    ctx.stroke();
  }
  ctx.restore();
}
/** Draws only the newest segment of a stroke in progress (matches renderStroke). */
function renderLastSegment(ctx, s, w) {
  const p = s.points, n = p.length;
  ctx.save();
  strokeStyle(ctx, s, w);
  if (n === 1) drawDot(ctx, p[0], w);
  else {
    ctx.beginPath();
    if (n === 2) {
      ctx.moveTo(p[0][0] * w, p[0][1] * w);
      const m = mid(p[0], p[1]);
      ctx.lineTo(m[0] * w, m[1] * w);
    } else {
      const a = mid(p[n - 3], p[n - 2]), b = mid(p[n - 2], p[n - 1]);
      ctx.moveTo(a[0] * w, a[1] * w);
      ctx.quadraticCurveTo(p[n - 2][0] * w, p[n - 2][1] * w, b[0] * w, b[1] * w);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function sizeCanvas(canvas, w) {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(w * ASPECT * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

/** Read-only view of a drawing that re-renders at whatever size it is laid out. */
function drawingView(strokes, cls) {
  const canvas = h('canvas');
  const wrap = h('div', { class: cls }, canvas);
  let lastW = 0;
  const paint = () => {
    const w = wrap.clientWidth;
    if (!w || w === lastW) return;
    lastW = w;
    const ctx = sizeCanvas(canvas, w);
    strokes.forEach((s) => renderStroke(ctx, s, w));
  };
  if ('ResizeObserver' in window) new ResizeObserver(paint).observe(wrap);
  requestAnimationFrame(paint);
  return wrap;
}

/** Interactive drawing pad. `strokes` is mutated in place. `tool` is shared state. */
function createDrawPad(strokes, tool) {
  const canvas = h('canvas', { 'aria-label': 'Drawing area' });
  const hint = h('div', { class: 'drawpad-hint' }, 'Write or draw here ✍️');
  const area = h('div', { class: 'drawpad-canvas-wrap' }, canvas, hint);
  const redoStack = [];
  let ctx = null, w = 0, cur = null, pointerId = null, penSeen = false;

  function redraw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, w * ASPECT);
    strokes.forEach((s) => renderStroke(ctx, s, w));
    hint.style.display = strokes.length ? 'none' : '';
    refreshTools();
  }
  function resize() {
    const nw = area.clientWidth;
    if (!nw || nw === w) return;
    w = nw;
    ctx = sizeCanvas(canvas, w);
    redraw();
  }
  const point = (e) => {
    const r = canvas.getBoundingClientRect();
    return [+((e.clientX - r.left) / r.width).toFixed(4), +((e.clientY - r.top) / r.width).toFixed(4)];
  };

  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'pen') penSeen = true;
    if (penSeen && e.pointerType === 'touch') return; // palm rejection once a pencil is used
    if (cur || !ctx) return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    pointerId = e.pointerId;
    cur = {
      tool: tool.mode,
      color: tool.color,
      size: tool.mode === 'eraser' ? ERASER_SIZE : tool.size,
      points: [point(e)],
    };
    strokes.push(cur);
    redoStack.length = 0;
    hint.style.display = 'none';
    renderLastSegment(ctx, cur, w);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!cur || e.pointerId !== pointerId) return;
    e.preventDefault();
    const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    (events.length ? events : [e]).forEach((ev) => {
      const p = point(ev);
      const last = cur.points[cur.points.length - 1];
      if (Math.abs(p[0] - last[0]) + Math.abs(p[1] - last[1]) < 0.0015) return;
      cur.points.push(p);
      renderLastSegment(ctx, cur, w);
    });
  });
  const end = (e) => {
    if (!cur || e.pointerId !== pointerId) return;
    cur = null;
    pointerId = null;
    redraw();
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  // Stop iOS from scrolling / showing the magnifier while drawing.
  canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
  canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

  // --- Toolbar ---
  const toolBtn = (name, label, onClick) => h('button', { class: 'tool', 'aria-label': label, title: label, svg: ICONS[name], onclick: onClick });
  const penBtn = toolBtn('pen', 'Pen', () => { tool.mode = 'pen'; refreshTools(); });
  const eraserBtn = toolBtn('eraser', 'Eraser', () => { tool.mode = 'eraser'; refreshTools(); });
  const undoBtn = toolBtn('undo', 'Undo', () => { if (strokes.length) { redoStack.push(strokes.pop()); redraw(); } });
  const redoBtn = toolBtn('redo', 'Redo', () => { if (redoStack.length) { strokes.push(redoStack.pop()); redraw(); } });
  const clearBtn = toolBtn('trash', 'Clear drawing', async () => {
    if (!strokes.length) return;
    if (await confirmDialog('Clear drawing?', 'This removes everything drawn on this side.', 'Clear', true)) {
      strokes.length = 0;
      redoStack.length = 0;
      redraw();
    }
  });
  const swatches = Object.keys(COLORS).map((c) =>
    h('button', {
      class: 'swatch',
      'aria-label': c === 'ink' ? 'Ink' : c,
      'data-color': c,
      style: { background: c === 'ink' ? 'var(--ink)' : COLORS[c] },
      onclick: () => { tool.color = c; tool.mode = 'pen'; refreshTools(); },
    })
  );
  const sizeDot = h('span', { class: 'size-dot' });
  const sizeBtn = h('button', {
    class: 'tool',
    'aria-label': 'Pen size',
    title: 'Pen size',
    onclick: () => {
      tool.size = PEN_SIZES[(PEN_SIZES.indexOf(tool.size) + 1) % PEN_SIZES.length];
      tool.mode = 'pen';
      refreshTools();
    },
  }, sizeDot);

  function refreshTools() {
    penBtn.classList.toggle('active', tool.mode === 'pen');
    eraserBtn.classList.toggle('active', tool.mode === 'eraser');
    swatches.forEach((s) => s.classList.toggle('active', tool.mode === 'pen' && s.dataset.color === tool.color));
    const d = [6, 10, 15][PEN_SIZES.indexOf(tool.size)] || 10;
    Object.assign(sizeDot.style, { width: d + 'px', height: d + 'px' });
    sizeBtn.style.color = resolveColor(tool.color);
    undoBtn.disabled = !strokes.length;
    redoBtn.disabled = !redoStack.length;
    clearBtn.disabled = !strokes.length;
  }

  const tools = h('div', { class: 'drawpad-tools' },
    penBtn, eraserBtn, h('span', { class: 'tool-sep' }),
    swatches, h('span', { class: 'tool-sep' }),
    sizeBtn, h('span', { class: 'tool-sep' }),
    undoBtn, redoBtn, clearBtn);

  const el = h('div', { class: 'drawpad' }, area, tools);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(area);
  requestAnimationFrame(resize);
  refreshTools();
  return { el, redraw: () => { w = 0; resize(); } };
}

/* =====================================================================
 * Overlays: alert / confirm / prompt / action sheet / toast
 * ===================================================================*/
const overlayRoot = () => document.getElementById('overlay-root');

function openOverlay(content, { sheet = false, onDismiss } = {}) {
  const backdrop = h('div', { class: 'backdrop' + (sheet ? ' sheet-backdrop' : '') }, content);
  const close = () => new Promise((res) => {
    backdrop.classList.add('closing');
    setTimeout(() => { backdrop.remove(); res(); }, 170);
  });
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop && onDismiss) onDismiss(); });
  overlayRoot().append(backdrop);
  return close;
}

function alertDialog({ title, message, input, actions }) {
  return new Promise((resolve) => {
    let field = null;
    if (input) {
      field = h('input', {
        type: 'text',
        value: input.value || '',
        placeholder: input.placeholder || '',
        autocapitalize: 'sentences',
        enterkeyhint: 'done',
        maxlength: '120',
      });
    }
    let close;
    const finish = (value) => { close().then(() => resolve(value)); };
    const buttons = actions.map((a) =>
      h('button', {
        class: [a.bold && 'bold', a.danger && 'danger'].filter(Boolean).join(' '),
        onclick: () => finish({ action: a.value, value: field ? field.value.trim() : undefined }),
      }, a.label)
    );
    const box = h('div', { class: 'alert', role: 'alertdialog' },
      h('div', { class: 'alert-body' },
        title && h('div', { class: 'alert-title' }, title),
        message && h('div', { class: 'alert-msg' }, message),
        field),
      h('div', { class: 'alert-actions' }, buttons));
    close = openOverlay(box);
    if (field) {
      field.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); buttons[buttons.length - 1].click(); }
      });
      setTimeout(() => { field.focus(); field.select(); }, 60);
    }
  });
}

async function confirmDialog(title, message, okLabel = 'OK', danger = false) {
  const r = await alertDialog({
    title, message,
    actions: [{ label: 'Cancel', value: false }, { label: okLabel, value: true, bold: !danger, danger }],
  });
  return r.action;
}

async function promptDialog(title, message, value = '', okLabel = 'Save', placeholder = 'Name') {
  const r = await alertDialog({
    title, message, input: { value, placeholder },
    actions: [{ label: 'Cancel', value: false }, { label: okLabel, value: true, bold: true }],
  });
  return r.action && r.value ? r.value : null;
}

function actionSheet(title, options) {
  return new Promise((resolve) => {
    let close;
    const finish = (v) => close().then(() => resolve(v));
    const sheet = h('div', { class: 'sheet' },
      h('div', { class: 'sheet-group' },
        title && h('div', { class: 'sheet-title' }, title),
        options.map((o) => h('button', { class: o.danger ? 'danger' : '', onclick: () => finish(o.value) }, o.label))),
      h('div', { class: 'sheet-group' }, h('button', { class: 'cancel', onclick: () => finish(null) }, 'Cancel')));
    close = openOverlay(sheet, { sheet: true, onDismiss: () => finish(null) });
  });
}

let toastTimer;
function toast(msg) {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  const t = h('div', { class: 'toast', role: 'status' }, msg);
  document.body.append(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), 1800);
}

/* =====================================================================
 * Navigation
 * ===================================================================*/
const stack = [{ view: 'home' }];
const cur = () => stack[stack.length - 1];
let keyHandler = null;

function navigate(route) {
  cur().scroll = window.scrollY;
  stack.push(route);
  render('push');
}
function back() {
  if (stack.length > 1) stack.pop();
  render('pop');
}
function render(anim = 'none') {
  keyHandler = null;
  const r = cur();
  const el = Views[r.view](r);
  if (!el) return; // view redirected
  el.classList.add(anim === 'push' ? 'push' : anim === 'pop' ? 'back-anim' : 'no-anim');
  const app = document.getElementById('app');
  app.replaceChildren(el);
  window.scrollTo(0, anim === 'pop' ? r.scroll || 0 : anim === 'none' ? window.scrollY : 0);
  updateNavbar();
}
function updateNavbar() {
  const nb = document.querySelector('#app .navbar');
  if (nb) nb.classList.toggle('scrolled', window.scrollY > 34);
}
window.addEventListener('scroll', updateNavbar, { passive: true });
document.addEventListener('keydown', (e) => {
  if (keyHandler && !e.target.closest('input, textarea, select') && !overlayRoot().children.length) keyHandler(e);
});
window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => render('none'));

/* =====================================================================
 * Shared UI pieces
 * ===================================================================*/
function navbar({ title, backLabel, left = [], right = [], alwaysTitle = false }) {
  const leftItems = [];
  if (backLabel != null) {
    leftItems.push(h('button', { class: 'nav-btn', onclick: back, 'aria-label': 'Back' },
      icon('back'), h('span', { class: 'back-label' }, backLabel)));
  }
  return h('header', { class: 'navbar' + (alwaysTitle ? ' always-title' : '') },
    h('div', { class: 'navbar-row' },
      h('div', { class: 'nav-left' }, leftItems, left),
      h('div', { class: 'navbar-title' }, title || ''),
      h('div', { class: 'nav-right' }, right)));
}
const navBtn = (label, onClick, opts = {}) =>
  h('button', { class: 'nav-btn' + (opts.bold ? ' bold' : ''), onclick: onClick, 'aria-label': opts.aria || label, disabled: opts.disabled }, opts.icon ? icon(opts.icon) : null, opts.icon ? null : label);

const chevron = () => h('span', { class: 'chev', svg: ICONS.chev });

function toolbar(left, center, right) {
  return h('footer', { class: 'toolbar' }, h('div', null, left), h('div', { class: 'row-sub' }, center), h('div', null, right));
}

function statTile(num, label, cls) {
  return h('div', { class: 'stat' + (cls ? ' ' + cls : '') }, h('div', { class: 'stat-num' }, num), h('div', { class: 'stat-label' }, label));
}

const WEEKDAY = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
const DATE_FMT = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
const DATETIME_FMT = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

/** "Review schedule" block: card maturity and a 7-day forecast of due cards. */
function scheduleSection(cards, st) {
  const fc = forecast(cards, 7);
  const studied = st.total - st.new;
  const out = [
    h('div', { class: 'section-header' }, 'Progress'),
    h('div', { class: 'study-card' },
      h('div', { class: 'stats compact' },
        statTile(st.new, 'Unseen', 'new'),
        statTile(st.learning, 'Learning', 'learn'),
        statTile(st.young, 'Young', 'young'),
        statTile(st.mature, 'Mature', 'mature')),
      h('div', { class: 'meter', role: 'img', 'aria-label': `${studied} of ${st.total} cards started` },
        ['mature', 'young', 'learn'].map((k) => {
          const n = k === 'mature' ? st.mature : k === 'young' ? st.young : st.learning;
          return n ? h('span', { class: 'meter-' + k, style: { width: `${(n / st.total) * 100}%` } }) : null;
        })),
      h('div', { class: 'row-sub', style: { whiteSpace: 'normal' } },
        `${studied} of ${st.total} started. Young cards are due again within ${MATURE_DAYS} days; mature cards less often.`)),
  ];
  if (!studied) return out;
  const rows = [];
  fc.days.forEach((n, i) => {
    if (!n) return;
    const d = new Date();
    d.setDate(d.getDate() + i);
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : WEEKDAY.format(d);
    rows.push([label, n, i === 0 ? 'due' : '']);
  });
  if (fc.later) rows.push(['Later', fc.later, '']);
  out.push(
    h('div', { class: 'section-header' }, 'Upcoming Reviews'),
    h('div', { class: 'list plain' }, rows.map(([label, n, cls]) =>
      h('div', { class: 'row plain static' },
        h('span', { class: 'row-main' }, label),
        h('span', { class: 'row-meta' + (cls ? ' ' + cls : '') }, plural(n, 'card'))))),
    h('div', { class: 'section-footer' }, Store.data.settings.newPerDay >= 9999 ? 'You can study as often as you like. Extra reviews never mess up the schedule.'
      : `New cards per day: ${Store.data.settings.newPerDay}. You can change this in Settings.`));
  return out;
}

function emptyState(iconName, title, text) {
  return h('div', { class: 'empty' }, h('div', { class: 'empty-icon', svg: ICONS[iconName] }), h('h3', null, title), h('div', null, text));
}

async function newFolderFlow(parentId) {
  const name = await promptDialog('New Folder', parentId ? `Inside “${Model.folder(parentId).name}”` : 'Enter a name for this folder.', '', 'Create');
  if (!name) return;
  Model.addFolder(name, parentId);
  render('none');
}
async function renameFolderFlow(f) {
  const name = await promptDialog('Rename Folder', null, f.name, 'Save');
  if (!name) return;
  Model.renameFolder(f.id, name);
  render('none');
}
async function deleteFolderFlow(f) {
  const cards = Model.cardsDeep(f.id).length;
  const subs = Model.descendantIds(f.id).length - 1;
  const parts = [plural(cards, 'card')];
  if (subs) parts.push(plural(subs, 'subfolder'));
  const ok = await confirmDialog(`Delete “${f.name}”?`, `This will permanently delete ${parts.join(' and ')}.`, 'Delete', true);
  if (!ok) return false;
  Model.deleteFolder(f.id);
  toast('Folder deleted');
  return true;
}

function folderRow(f, editing) {
  const all = Model.cardsDeep(f.id);
  const st = stats(all);
  const subCount = Model.childFolders(f.id).length;
  const sub = [plural(all.length, 'card')];
  if (subCount) sub.push(plural(subCount, 'folder'));
  return h('button', {
    class: 'row',
    onclick: () => (editing ? renameFolderFlow(f) : navigate({ view: 'folder', id: f.id })),
  },
  editing && h('span', {
    class: 'del-btn',
    role: 'button',
    'aria-label': `Delete ${f.name}`,
    onclick: async (e) => { e.stopPropagation(); if (await deleteFolderFlow(f)) render('none'); },
  }),
  h('span', { class: 'row-icon', svg: ICONS.folder }),
  h('span', { class: 'row-main' },
    h('div', { class: 'row-title' }, f.name),
    h('div', { class: 'row-sub' }, editing ? 'Tap to rename' : sub.join(' · '))),
  !editing && h('span', { class: 'row-meta' },
    st.due ? h('span', { class: 'badge', title: 'Due' }, st.due) : null,
    st.newToday ? h('span', { class: 'badge new', title: 'New today' }, st.newToday) : null,
    chevron()));
}

function cardRow(c, editing) {
  const frontTitle = cardTitle(c);
  const backSub = cardSubtitle(c);
  const status = cardStatus(c);
  return h('button', {
    class: 'row plain',
    onclick: () => navigate({ view: 'editor', cardId: c.id, folderId: c.folderId }),
  },
  editing && h('span', {
    class: 'del-btn',
    role: 'button',
    'aria-label': 'Delete card',
    onclick: async (e) => {
      e.stopPropagation();
      if (await confirmDialog('Delete this card?', `“${frontTitle}”`, 'Delete', true)) {
        Model.deleteCard(c.id);
        render('none');
      }
    },
  }),
  c.front.strokes.length ? drawingView(c.front.strokes, 'thumb') : null,
  h('span', { class: 'row-main' },
    h('div', { class: 'row-title' }, frontTitle),
    h('div', { class: 'row-sub' }, backSub)),
  !editing && h('span', { class: 'row-meta' },
    h('span', { style: { fontSize: '13px', color: status.cls === 'new' ? 'var(--good)' : status.cls === 'due' ? 'var(--accent)' : '' } }, status.label),
    chevron()));
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
function isStandalone() {
  return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
}
function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }

/* =====================================================================
 * Views
 * ===================================================================*/
const Views = {};

/* ----- Home: list of top-level folders ----- */
Views.home = (r) => {
  const folders = Model.childFolders(null);
  if (!folders.length) r.editing = false;
  const nav = navbar({
    title: 'Folders',
    right: folders.length ? [navBtn(r.editing ? 'Done' : 'Edit', () => { r.editing = !r.editing; render('none'); }, { bold: r.editing })] : [],
  });
  const content = h('main', { class: 'content' });

  if (folders.length) {
    const st = stats(Model.cards);
    const today = dayLog();
    const streak = studyStreak();
    content.append(
      h('div', { class: 'study-card today-card' },
        h('div', { class: 'today-title' }, 'Today'),
        h('div', { class: 'stats compact' },
          statTile(st.due, 'Due', 'due'),
          statTile(st.newToday, 'New', 'new'),
          statTile(today.reviews, 'Reviewed'),
          statTile(streak ? `🔥${streak}` : '0', 'Streak'))),
      h('div', { class: 'section-header' }, `${plural(folders.length, 'folder')} · ${plural(st.total, 'card')}`),
      h('div', { class: 'list' }, folders.map((f) => folderRow(f, r.editing)))
    );
  } else {
    content.append(emptyState('folder', 'No folders yet', 'Create a folder to start organizing your flash cards.'),
      h('button', { class: 'btn', onclick: () => newFolderFlow(null) }, 'Create Folder'));
  }

  if (isIOS() && !isStandalone() && !lsGet('flashcard-hide-install')) {
    const tip = h('div', { class: 'install-tip' },
      h('div', null, h('b', null, 'Install FlashCard: '), 'tap the Share button, then “Add to Home Screen”. It opens full-screen and keeps your cards safely stored.'),
      h('button', { onclick: () => { lsSet('flashcard-hide-install', '1'); tip.remove(); } }, 'Hide'));
    content.append(tip);
  }

  return h('div', { class: 'screen' }, nav, h('h1', { class: 'large-title' }, 'FlashCard'), content,
    toolbar(
      navBtn('Settings', () => navigate({ view: 'settings' }), { icon: 'settings', aria: 'Settings' }),
      folders.length ? plural(folders.length, 'folder') : '',
      navBtn('New Folder', () => newFolderFlow(null), { icon: 'folderPlus', aria: 'New folder' })));
};

/* ----- Folder: subfolders, cards, study ----- */
Views.folder = (r) => {
  const f = Model.folder(r.id);
  if (!f) { stack.pop(); render('pop'); return null; }
  const parent = Model.folder(f.parentId);
  const subs = Model.childFolders(f.id);
  const cards = Model.cardsIn(f.id);
  const deep = Model.cardsDeep(f.id);
  const st = stats(deep);
  if (!subs.length && !cards.length) r.editing = false;

  const more = navBtn('More', async () => {
    const choice = await actionSheet(f.name, [
      { label: 'New Card', value: 'card' },
      { label: 'New Subfolder', value: 'sub' },
      { label: 'Rename Folder', value: 'rename' },
      { label: 'Delete Folder', value: 'delete', danger: true },
    ]);
    if (choice === 'card') navigate({ view: 'editor', folderId: f.id });
    else if (choice === 'sub') newFolderFlow(f.id);
    else if (choice === 'rename') renameFolderFlow(f);
    else if (choice === 'delete' && (await deleteFolderFlow(f))) back();
  }, { icon: 'more', aria: 'Folder options' });

  const nav = navbar({
    title: f.name,
    backLabel: parent ? parent.name : 'Folders',
    right: [
      (subs.length || cards.length) ? navBtn(r.editing ? 'Done' : 'Edit', () => { r.editing = !r.editing; render('none'); }, { bold: r.editing }) : null,
      more,
    ],
  });

  const content = h('main', { class: 'content' });

  if (deep.length) {
    const toStudy = st.due + st.newToday;
    content.append(h('div', { class: 'study-card' },
      h('div', { class: 'stats' },
        statTile(st.due, 'Due', 'due'),
        statTile(st.newToday, 'New today', 'new'),
        statTile(st.total, 'Total')),
      h('div', { class: 'btn-row' },
        h('button', {
          class: 'btn',
          onclick: () => navigate({ view: 'study', folderId: f.id, mode: 'due' }),
        }, 'Study Now'),
        h('button', {
          class: 'btn secondary',
          onclick: () => navigate({ view: 'study', folderId: f.id, mode: 'practice' }),
        }, 'Flip All')),
      !toStudy ? h('div', { class: 'row-sub', style: { whiteSpace: 'normal', textAlign: 'center' } },
        st.new ? `All caught up for today. Study Now goes through all cards again; ${plural(st.new, 'card')} not started yet.`
          : 'All caught up ✓ Study Now goes through all cards again.') : null));
  }

  if (subs.length) {
    content.append(h('div', { class: 'section-header' }, 'Folders'), h('div', { class: 'list' }, subs.map((s) => folderRow(s, r.editing))));
  }
  if (cards.length) {
    content.append(h('div', { class: 'section-header' }, plural(cards.length, 'Card')), h('div', { class: 'list plain' }, cards.map((c) => cardRow(c, r.editing))));
  }
  if (deep.length) content.append(...scheduleSection(deep, st));
  if (!subs.length && !cards.length) {
    content.append(emptyState('cards', 'No cards yet', 'Tap the ✎ button to create your first card.'),
      h('button', { class: 'btn', onclick: () => navigate({ view: 'editor', folderId: f.id }) }, 'New Card'));
  }

  return h('div', { class: 'screen' }, nav, h('h1', { class: 'large-title' }, f.name), content,
    toolbar(
      navBtn('New Subfolder', () => newFolderFlow(f.id), { icon: 'folderPlus', aria: 'New subfolder' }),
      deep.length ? plural(deep.length, 'card') : '',
      navBtn('New Card', () => navigate({ view: 'editor', folderId: f.id }), { icon: 'compose', aria: 'New card' })));
};

/* ----- Card editor ----- */
Views.editor = (r) => {
  const existing = r.cardId ? Model.card(r.cardId) : null;
  if (r.cardId && !existing) { stack.pop(); render('pop'); return null; }
  if (!r.draft) {
    r.draft = existing
      ? { front: clone(existing.front), back: clone(existing.back), folderId: existing.folderId }
      : { front: emptySide(), back: emptySide(), folderId: r.folderId };
    r.original = JSON.stringify(r.draft);
    r.side = r.side || 'front';
    r.tool = r.tool || { mode: 'pen', color: 'ink', size: PEN_SIZES[1] };
  }
  const d = r.draft;
  const isDirty = () => JSON.stringify(d) !== r.original;

  async function cancel() {
    if (isDirty() && !(await confirmDialog('Discard changes?', 'Your edits to this card will be lost.', 'Discard', true))) return;
    back();
  }
  function validate() {
    if (sideIsEmpty(d.front)) {
      alertDialog({ title: 'Front is empty', message: 'Type or draw something on the front of the card.', actions: [{ label: 'OK', value: true, bold: true }] });
      showSide('front');
      return false;
    }
    if (!Model.folder(d.folderId)) {
      alertDialog({ title: 'Choose a folder', message: 'Pick a folder for this card.', actions: [{ label: 'OK', value: true, bold: true }] });
      return false;
    }
    return true;
  }
  function save(addAnother) {
    if (!validate()) return;
    if (existing) {
      Model.updateCard(existing.id, { front: clone(d.front), back: clone(d.back), folderId: d.folderId });
      toast('Card saved');
      back();
      return;
    }
    Model.addCard(d.folderId, clone(d.front), clone(d.back));
    if (addAnother) {
      r.draft = null;
      r.folderId = d.folderId;
      r.side = 'front';
      render('none');
      window.scrollTo(0, 0);
      toast('Card added');
      setTimeout(() => document.querySelector('#app .text-input')?.focus(), 50);
    } else {
      toast('Card added');
      back();
    }
  }

  const nav = navbar({
    title: existing ? 'Edit Card' : 'New Card',
    alwaysTitle: true,
    left: [navBtn('Cancel', cancel)],
    right: [navBtn(existing ? 'Save' : 'Add', () => save(false), { bold: true })],
  });

  const panels = {};
  const pads = {};
  const segButtons = {};
  function showSide(side) {
    r.side = side;
    for (const s of ['front', 'back']) {
      panels[s].style.display = s === side ? '' : 'none';
      segButtons[s].classList.toggle('active', s === side);
    }
    pads[side].redraw();
  }

  for (const side of ['front', 'back']) {
    const ta = h('textarea', {
      class: 'text-input',
      placeholder: side === 'front' ? 'Question, word or prompt…' : 'Answer…',
      rows: '4',
      autocapitalize: 'sentences',
      'aria-label': side === 'front' ? 'Front text' : 'Back text',
    });
    ta.value = d[side].text;
    const grow = () => { ta.style.height = 'auto'; ta.style.height = Math.max(120, ta.scrollHeight) + 'px'; };
    const styleTa = () => ta.classList.toggle('mono', isRich(ta.value));
    ta.addEventListener('input', () => { d[side].text = ta.value; styleTa(); grow(); });
    styleTa();
    requestAnimationFrame(grow);
    pads[side] = createDrawPad(d[side].strokes, r.tool);
    const preview = h('div', { class: 'text-preview', style: { display: 'none' } });
    const previewBtn = h('button', {
      class: 'link-btn',
      onclick: () => {
        const on = preview.style.display === 'none';
        if (on) preview.replaceChildren(d[side].text.trim() ? renderRich(d[side].text) : h('div', { class: 'face-empty' }, 'Nothing to preview'));
        preview.style.display = on ? '' : 'none';
        ta.style.display = on ? 'none' : '';
        previewBtn.textContent = on ? 'Edit' : 'Preview';
        if (!on) grow();
      },
    }, 'Preview');
    panels[side] = h('div', null,
      h('div', { class: 'side-label' }, h('span', null, side === 'front' ? 'Front — text' : 'Back — text'), previewBtn),
      ta,
      preview,
      h('div', { class: 'format-hint' }, 'Formatting: **bold**, `code`, ## heading, - bullet, and ``` for code blocks.'),
      h('div', { class: 'side-label', style: { marginTop: '18px' } }, h('span', null, 'Handwriting'), h('span', null, 'finger or Apple Pencil')),
      pads[side].el);
    segButtons[side] = h('button', { onclick: () => showSide(side) }, side === 'front' ? 'Front' : 'Back');
  }

  const folderSelect = h('select', {
    class: 'field',
    'aria-label': 'Folder',
    onchange: (e) => { d.folderId = e.target.value; },
  }, Model.tree().map(({ folder, depth }) =>
    h('option', { value: folder.id, selected: folder.id === d.folderId }, ' '.repeat(depth) + folder.name)));

  const content = h('main', { class: 'content', style: { paddingTop: '4px' } },
    h('div', { class: 'segmented', role: 'tablist' }, segButtons.front, segButtons.back),
    panels.front, panels.back,
    h('div', { class: 'section-header' }, 'Folder'),
    h('div', { class: 'list plain' },
      h('label', { class: 'row plain static' }, h('span', { class: 'row-main' }, 'Folder'), folderSelect)),
    !existing && h('div', { style: { marginTop: '22px' } },
      h('button', { class: 'btn secondary', onclick: () => save(true) }, 'Add & Create Another')),
    existing && reviewProgress(existing, () => render('none')),
    existing && h('div', { style: { marginTop: '22px' } },
      h('div', { class: 'list plain' },
        h('button', {
          class: 'row action danger center',
          onclick: async () => {
            if (await confirmDialog('Delete this card?', 'This cannot be undone.', 'Delete', true)) {
              Model.deleteCard(existing.id);
              toast('Card deleted');
              back();
            }
          },
        }, 'Delete Card'))));

  const screen = h('div', { class: 'screen' }, nav, content);
  showSide(r.side);
  return screen;
};

/** Per-card spaced-repetition details for the editor: next review, interval, history. */
function reviewProgress(card, onChange) {
  const s = card.srs;
  const t = now();
  const row = (label, value, cls) =>
    h('div', { class: 'row plain static' }, h('span', { class: 'row-main' }, label), h('span', { class: 'row-meta' + (cls ? ' ' + cls : '') }, value));
  let status, next;
  if (s.state === 'new') { status = 'New (not studied yet)'; next = 'When you study this folder'; }
  else {
    status = s.state === 'learn' ? 'Learning' : s.interval >= MATURE_DAYS ? 'Mature' : 'Young';
    next = s.due <= t ? 'Now (due)' : `${s.state === 'learn' ? DATETIME_FMT.format(s.due) : DATE_FMT.format(s.due)} · ${fmtDue(card)}`;
  }
  const rows = [
    row('Status', status),
    row('Next review', next, s.state !== 'new' && s.due <= t ? 'due' : ''),
  ];
  if (s.state !== 'new') {
    rows.push(
      row('Interval', s.state === 'learn' ? 'Relearning' : plural(s.interval, 'day')),
      row('Ease', `${Math.round(s.ease * 100)}%`),
      row('Reviews', String(s.reps)),
      row('Lapses (forgot)', String(s.lapses)),
      row('Last reviewed', s.last ? DATETIME_FMT.format(s.last) : '—'));
  }
  const hist = (s.history || []).slice().reverse();
  const out = h('div', null,
    h('div', { class: 'section-header' }, 'Review Progress'),
    h('div', { class: 'list plain' }, rows));
  if (hist.length) {
    out.append(
      h('div', { class: 'section-header' }, 'History'),
      h('div', { class: 'list plain' }, hist.slice(0, 10).map(([when, g]) =>
        h('div', { class: 'row plain static' },
          h('span', { class: 'row-main' }, DATETIME_FMT.format(when)),
          h('span', { class: 'grade-chip ' + (GRADES[g] || 'good') }, (GRADES[g] || '?').replace(/^./, (c) => c.toUpperCase()))))));
  }
  if (s.state !== 'new') {
    out.append(h('div', { class: 'list plain', style: { marginTop: '12px' } },
      h('button', {
        class: 'row action center',
        onclick: async () => {
          if (!(await confirmDialog('Reset progress?', 'This card will be treated as new again and its review history will be cleared.', 'Reset', true))) return;
          card.srs = newSrs();
          Store.save();
          toast('Progress reset');
          onChange();
        },
      }, 'Reset Progress')));
  }
  return out;
}

/* ----- Study session ----- */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function buildSession(folderId, mode) {
  const cards = Model.cardsDeep(folderId);
  let queue;
  if (mode === 'practice') {
    queue = shuffle(cards.map((c) => c.id));
  } else {
    const t = now();
    const learn = cards.filter((c) => c.srs.state === 'learn' && c.srs.due <= t).sort((a, b) => a.srs.due - b.srs.due);
    const review = cards.filter((c) => c.srs.state === 'review' && c.srs.due <= t).sort((a, b) => a.srs.due - b.srs.due);
    const fresh = cards.filter((c) => c.srs.state === 'new').sort((a, b) => a.createdAt - b.createdAt)
      .slice(0, newLeftToday(rootOf(folderId))); // daily limit on new cards per deck, like Anki
    queue = [...learn, ...review, ...fresh].map((c) => c.id);
    if (!queue.length) {
      // Nothing due: study every card in the folder again, soonest due first. Grading still counts.
      const started = cards.filter((c) => c.srs.state !== 'new').sort((a, b) => a.srs.due - b.srs.due);
      const unseen = cards.filter((c) => c.srs.state === 'new').sort((a, b) => a.createdAt - b.createdAt);
      queue = [...started, ...unseen].map((c) => c.id);
      return { queue, done: 0, flipped: false, mode, again: true };
    }
  }
  return { queue, done: 0, flipped: false, mode };
}

function faceView(side, which) {
  const text = side.text.trim();
  const rich = isRich(text);
  // Short content is centered vertically; formatted (long) content starts at the top and scrolls.
  const inner = h('div', { class: 'face-inner', style: { margin: rich ? '0' : 'auto 0', display: 'flex', flexDirection: 'column', gap: '16px' } });
  // Short formatted cards (just bold and paragraphs, like vocabulary) are shown large and centered.
  const simple = rich && text.length < 300 && !/```|^#{1,3}\s|^\s*[-•]\s/m.test(text);
  if (simple) inner.style.margin = 'auto 0';
  if (text) {
    let el;
    if (rich) {
      el = renderRich(side.text);
      if (simple) el.classList.add('center');
    } else {
      el = h('div', { class: 'face-text' + (text.length > 140 || text.split('\n').length > 4 ? ' long' : '') }, side.text);
    }
    inner.append(el);
  }
  if (side.strokes.length) inner.append(drawingView(side.strokes, 'face-drawing'));
  if (!text && !side.strokes.length) inner.append(h('div', { class: 'face-empty' }, 'Nothing on this side'));
  return h('div', { class: 'face ' + which },
    h('div', { class: 'face-tag' + (which === 'back' ? ' back-tag' : '') }, which === 'front' ? 'Front' : 'Back'),
    h('div', { class: 'face-body' + (rich ? ' rich-body' : '') }, inner),
    which === 'front' && !rich ? h('div', { class: 'tap-hint' }, 'Tap to flip') : null);
}

Views.study = (r) => {
  const f = Model.folder(r.folderId);
  if (!f) { stack.pop(); render('pop'); return null; }
  const s = r.session || (r.session = buildSession(f.id, r.mode));
  const practice = s.mode === 'practice';
  const editBtn = navBtn('Edit', () => { if (s.queue[0]) navigate({ view: 'editor', cardId: s.queue[0] }); });
  const nav = navbar({ title: practice ? 'Flip All' : s.again ? 'Study Again' : 'Study', backLabel: f.name, alwaysTitle: true, right: [editBtn] });
  const content = h('main', { class: 'content' });
  const screen = h('div', { class: 'screen study' }, nav, content);

  function currentCard() {
    while (s.queue.length) {
      const c = Model.card(s.queue[0]);
      if (c) return c;
      s.queue.shift();
    }
    return null;
  }

  function finished() {
    editBtn.style.visibility = 'hidden';
    const deep = Model.cardsDeep(f.id);
    const upcoming = deep.filter((c) => c.srs.state !== 'new' && c.srs.due > now()).sort((a, b) => a.srs.due - b.srs.due)[0];
    content.append(h('div', { class: 'done' },
      h('div', { class: 'big' }, '🎉'),
      h('h2', null, practice ? 'Round complete!' : 'All done!'),
      h('p', null, practice
        ? `You went through ${plural(s.done, 'card')}.`
        : `You reviewed ${plural(s.done, 'card')}.` + (upcoming ? ` Next card is due ${fmtDue(upcoming)}.` : '')),
      h('button', { class: 'btn', onclick: () => { r.session = buildSession(f.id, practice ? 'practice' : 'due'); render('none'); } }, practice ? 'Go Again' : 'Study Again'),
      !practice ? h('button', { class: 'btn secondary', onclick: () => { r.session = buildSession(f.id, 'practice'); render('none'); } }, 'Flip Through All Cards') : null,
      h('button', { class: 'btn secondary', onclick: back }, 'Back to Folder')));
  }

  function draw(enter) {
    content.replaceChildren();
    const card = currentCard();
    if (!card) { finished(); return; }
    editBtn.style.visibility = '';

    const total = s.done + s.queue.length;
    content.append(h('div', { class: 'progress' }, h('div', { style: { width: `${total ? (s.done / total) * 100 : 0}%` } })));

    if (!practice) {
      let n = 0, l = 0, d = 0;
      s.queue.forEach((id) => {
        const c = Model.card(id);
        if (!c) return;
        if (c.srs.state === 'new') n++; else if (c.srs.state === 'learn') l++; else d++;
      });
      const curState = card.srs.state;
      content.append(h('div', { class: 'counts', 'aria-label': 'New, learning, due' },
        h('span', { class: 'c-new' + (curState === 'new' ? ' current' : '') }, n),
        h('span', { class: 'c-learn' + (curState === 'learn' ? ' current' : '') }, l),
        h('span', { class: 'c-due' + (curState === 'review' ? ' current' : '') }, d)));
    } else {
      content.append(h('div', { class: 'counts' }, h('span', null, `${s.done + 1} / ${total}`)));
    }

    // At rest the card is "flat" (no 3D transform) so long faces scroll reliably on iOS.
    // The 3D transform is only switched on while the flip animation runs.
    const flipCard = h('div', {
      class: 'flip-card flat' + (s.flipped ? ' flipped' : ''),
      role: 'button',
      'aria-label': 'Flip card',
      onclick: () => flip(),
    }, faceView(card.front, 'front'), faceView(card.back, 'back'));
    const scene = h('div', { class: 'flip-scene' + (enter ? ' enter' : '') }, flipCard);
    const answerBar = h('div', { class: 'answer-bar' });
    content.append(scene, answerBar);
    let flipToken = 0;
    let graded = false;

    function renderAnswerBar() {
      answerBar.replaceChildren();
      if (!s.revealed) {
        answerBar.append(h('button', { class: 'btn', onclick: () => flip() }, 'Show Answer'));
      } else if (practice) {
        answerBar.append(h('div', { class: 'grade-row', style: { gridTemplateColumns: '1fr 1fr' } },
          h('button', { class: 'grade again', onclick: () => grade('again') }, 'Again', h('small', null, 'see it later')),
          h('button', { class: 'grade good', onclick: () => grade('good') }, 'Got It', h('small', null, 'next card'))));
      } else {
        answerBar.append(h('div', { class: 'grade-row' },
          ['again', 'hard', 'good', 'easy'].map((g) =>
            h('button', { class: 'grade ' + g, onclick: () => grade(g) }, g[0].toUpperCase() + g.slice(1), h('small', null, gradeLabel(card, g))))));
      }
    }

    function flip() {
      if (graded) return;
      // Leave flat mode without animating, so the flip starts from the current side.
      flipCard.style.transition = 'none';
      flipCard.classList.remove('flat');
      void flipCard.offsetWidth;
      flipCard.style.transition = '';
      s.flipped = !s.flipped;
      flipCard.classList.toggle('flipped', s.flipped);
      flipCard.querySelectorAll('.face-body').forEach((b) => { b.scrollTop = 0; });
      const token = ++flipToken;
      setTimeout(() => { if (token === flipToken) flipCard.classList.add('flat'); }, 560);
      if (s.flipped && !s.revealed) { s.revealed = true; renderAnswerBar(); }
    }

    function grade(g) {
      if (graded) return; // ignore double taps while the card animates out
      graded = true;
      if (!practice) {
        const wasNew = card.srs.state === 'new';
        applyGrade(card.srs, g);
        logStudy('reviews');
        if (wasNew) logStudy('newSeen', rootOf(card.folderId));
        Store.save();
      } else {
        logStudy('practice');
        Store.save();
      }
      s.queue.shift();
      const requeue = practice ? g === 'again' : card.srs.state === 'learn';
      if (requeue) s.queue.push(card.id); else s.done++;
      s.flipped = false;
      s.revealed = false;
      scene.classList.add('swipe-out');
      setTimeout(() => draw(true), 220);
    }

    renderAnswerBar();
    keyHandler = (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); return; }
      if (!s.revealed) return;
      const map = practice ? { 1: 'again', 2: 'good' } : { 1: 'again', 2: 'hard', 3: 'good', 4: 'easy' };
      if (map[e.key]) grade(map[e.key]);
    };
  }

  draw(false);
  return screen;
};

/* ----- Settings / backup ----- */
async function exportBackup() {
  const payload = { app: 'FlashCard', exportedAt: new Date().toISOString(), ...Store.data };
  const name = `flashcard-backup-${new Date().toISOString().slice(0, 10)}.json`;
  const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
  try {
    const file = new File([blob], name, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'FlashCard backup' });
      return;
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return;
  }
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: name, style: { display: 'none' } });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  toast('Backup exported');
}

function importBackup() {
  const input = h('input', { type: 'file', accept: '.json,application/json', style: { display: 'none' } });
  input.addEventListener('change', async () => {
    const file = input.files && input.files[0];
    input.remove();
    if (!file) return;
    let data;
    try {
      data = JSON.parse(await file.text());
      if (!Array.isArray(data.folders) || !Array.isArray(data.cards)) throw new Error('bad');
    } catch (e) {
      alertDialog({ title: 'Can’t import', message: 'That file is not a FlashCard backup.', actions: [{ label: 'OK', value: true, bold: true }] });
      return;
    }
    const incoming = normalizeData(data);
    const choice = await actionSheet(`Import ${plural(incoming.folders.length, 'folder')} and ${plural(incoming.cards.length, 'card')}`, [
      { label: 'Merge with My Cards', value: 'merge' },
      { label: 'Replace Everything', value: 'replace', danger: true },
    ]);
    if (!choice) return;
    // Remember which built-in decks were installed, so they are not added again.
    const packs = [...new Set([...Store.data.packs, ...incoming.packs])];
    if (choice === 'replace') {
      Store.data = incoming;
    } else {
      const fIds = new Set(Store.data.folders.map((f) => f.id));
      const cIds = new Set(Store.data.cards.map((c) => c.id));
      incoming.folders.forEach((f) => { if (!fIds.has(f.id)) Store.data.folders.push(f); });
      incoming.cards.forEach((c) => { if (!cIds.has(c.id)) Store.data.cards.push(c); });
      for (const [k, v] of Object.entries(incoming.days)) {
        const mine = Store.data.days[k] || { reviews: 0, newSeen: 0, practice: 0, newByRoot: {} };
        const newByRoot = Object.assign({}, v.newByRoot);
        for (const [rk, rv] of Object.entries(mine.newByRoot || {})) newByRoot[rk] = Math.max(rv, newByRoot[rk] || 0);
        Store.data.days[k] = {
          reviews: Math.max(mine.reviews, v.reviews), newSeen: Math.max(mine.newSeen, v.newSeen), practice: Math.max(mine.practice, v.practice), newByRoot,
        };
      }
    }
    Store.data.packs = packs;
    for (const [k, v] of Object.entries(incoming.packVersions || {})) {
      Store.data.packVersions[k] = Math.max(Store.data.packVersions[k] || 1, v);
    }
    await Store.flush();
    toast('Import complete');
    render('none');
  });
  document.body.append(input);
  input.click();
}

Views.settings = (r) => {
  const nav = navbar({ title: 'Settings', backLabel: 'Folders' });
  const st = stats(Model.cards);
  const storageStatus = h('span', { class: 'row-meta' }, '…');
  if (navigator.storage && navigator.storage.persisted) {
    navigator.storage.persisted().then((p) => { storageStatus.textContent = p ? 'Protected' : (isStandalone() ? 'On device' : 'Browser'); }).catch(() => { storageStatus.textContent = 'On device'; });
  } else storageStatus.textContent = 'On device';

  const row = (iconName, color, title, sub, onClick, meta) =>
    h(onClick ? 'button' : 'div', { class: 'row' + (onClick ? '' : ' static'), onclick: onClick },
      h('span', { class: 'row-icon', style: { background: color }, svg: ICONS[iconName] }),
      h('span', { class: 'row-main' }, h('div', { class: 'row-title' }, title), sub && h('div', { class: 'row-sub' }, sub)),
      meta || (onClick ? chevron() : null));

  const content = h('main', { class: 'content' },
    h('div', { class: 'section-header' }, 'Your Data'),
    h('div', { class: 'list' },
      row('shield', '#34c759', 'Saved automatically', `${plural(Model.folders.length, 'folder')} · ${plural(st.total, 'card')}`, null, storageStatus)),
    h('div', { class: 'section-footer' },
      'Everything is stored on this device and kept between visits. ' +
      (isIOS() && !isStandalone() ? 'For the safest storage on iPhone, add FlashCard to your Home Screen (Share › Add to Home Screen). ' : '') +
      'Export a backup now and then to keep a copy elsewhere.'),

    h('div', { class: 'section-header' }, 'Study'),
    h('div', { class: 'list' },
      h('label', { class: 'row static' },
        h('span', { class: 'row-icon', style: { background: '#34c759' }, svg: ICONS.cards }),
        h('span', { class: 'row-main' }, h('div', { class: 'row-title' }, 'New cards per day'),
          h('div', { class: 'row-sub' }, `${dayLog().newSeen} introduced today`)),
        h('select', {
          class: 'field',
          style: { maxWidth: '40%' },
          'aria-label': 'New cards per day',
          onchange: (e) => { Store.data.settings.newPerDay = Number(e.target.value); Store.save(); toast('Saved'); },
        }, [5, 10, 15, 20, 30, 50, 100, 9999].map((n) =>
          h('option', { value: String(n), selected: Number(Store.data.settings.newPerDay) === n }, n === 9999 ? 'No limit' : String(n))))),
      PACKS.map((def) => row('cards', PACK_COLORS[def.id] || '#8e8e93', `Add ${def.label} Deck`, def.about, async () => {
        let deck;
        try {
          deck = await loadPack(def);
        } catch (e) {
          alertDialog({ title: 'Could not load the deck', message: 'Check your internet connection and try again.', actions: [{ label: 'OK', value: true, bold: true }] });
          return;
        }
        const existing = Model.childFolders(null).some((f) => f.name === deck.name);
        if (!(await confirmDialog(`Add the ${def.label} deck?`, existing
          ? `You already have a ${deck.name} folder. This adds a second, fresh copy with all ${def.count} cards.`
          : `This adds a ${deck.name} folder with all ${def.count} cards, grouped by topic.`, 'Add'))) return;
        installDeck(deck);
        await Store.flush();
        toast(`${def.label} deck added`);
        render('none');
      }))),
    h('div', { class: 'section-footer' },
      'Study Now shows the cards that are due plus new cards. When nothing is due, it goes through all the cards again, as many times as you like. Set a limit here only if you want fewer new cards per deck each day.'),

    h('div', { class: 'section-header' }, 'Backup'),
    h('div', { class: 'list' },
      row('exportI', '#0a7aff', 'Export Backup', 'Save a .json file to Files, iCloud, etc.', exportBackup),
      row('importI', '#5856d6', 'Import Backup', 'Restore or merge a backup file', importBackup)),

    h('div', { class: 'section-header' }, 'About'),
    h('div', { class: 'list' },
      row('info', '#8e8e93', 'FlashCard', 'Flip cards, grade yourself: Again, Hard, Good, Easy. Cards you struggle with come back sooner.', null)),

    h('div', { style: { marginTop: '30px' } },
      h('div', { class: 'list plain' },
        h('button', {
          class: 'row action danger center',
          onclick: async () => {
            if (!(await confirmDialog('Delete all data?', 'Every folder and card will be permanently deleted. Export a backup first if you want to keep them.', 'Delete All', true))) return;
            // Keep settings and the record of installed decks, so the LC deck is not re-added.
            Store.data = normalizeData({ packs: Store.data.packs, packVersions: Store.data.packVersions, settings: Store.data.settings });
            await Store.flush();
            toast('All data deleted');
            stack.length = 1;
            render('pop');
          },
        }, 'Delete All Data'))));

  return h('div', { class: 'screen' }, nav, h('h1', { class: 'large-title' }, 'Settings'), content);
};

/* =====================================================================
 * Boot
 * ===================================================================*/
(async function boot() {
  await Store.load();
  render('none');
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch((e) => console.warn('SW registration failed', e));
  }
  ensurePacks();
})();
