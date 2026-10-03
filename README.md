# FlashCard

A simple, elegant flash card web app for iPhone, inspired by AnkiMobile.

## Features

- **Folders**: organize cards into folders, with subfolders as deep as you like. Create, rename and delete them.
- **Cards**: add, edit, delete and move cards between folders.
- **Both sides**: every card has a front and a back. Each side can hold typed text, handwriting, or both.
- **Handwriting**: draw or write with your finger or Apple Pencil. It has a pen, an eraser, five colors, three sizes, undo, redo and clear. Palm rejection turns on once a Pencil is used.
- **Flip**: tap a card to flip it with a 3D animation.
- **Study Now**: Anki-style spaced repetition with **Again / Hard / Good / Easy**. Cards you struggle with come back sooner.
- **Flip All**: shuffle through every card in a folder without changing its schedule.
- **LC deck**: all 150 LeetCode Top Interview problems, added automatically in an **LC** folder with one subfolder per topic. The front has the problem and one example. The back has the approach, intuition, pseudocode, C++ solution and complexity.
- **Spanish deck**: 529 beginner words, roughly Duolingo units 1–16, in a **Spanish** folder with 19 topic subfolders. The front has the English word and an example sentence. The back has the Spanish word (nouns include *el* / *la*) and the sentence in Spanish.
- **Review tracking**: each card shows when it is next due. The editor shows its interval, ease, review count and history, and can reset its progress. Folders show progress (unseen, learning, young, mature) and upcoming reviews for the next week. The home screen shows today's due count, reviews done and your streak.
- **New cards per day**: limits how many new cards Study Now adds each day, separately for each top-level deck. The default is 20, and you can change it in Settings.
- **Formatting**: card text supports `**bold**`, `` `code` ``, `## headings`, `- bullets` and fenced code blocks, with C++ syntax coloring.
- **Saved automatically**: everything is stored on the device in IndexedDB and is still there when you reopen the app.
- **Backup**: export all your data to a `.json` file, through the share sheet to Files or iCloud. You can import it again later, merging with or replacing what's there.
- **Works offline**: it installs to the Home Screen as a full-screen app.
- Light and dark mode follow the iPhone setting.

## Run it

It is plain HTML, CSS and JavaScript, with no build step. Serve the folder with any static web server:

```sh
npx http-server -p 8080 .
```

Then open `http://localhost:8080`.

### Host it for your iPhone (GitHub Pages)

1. In the GitHub repo, go to **Settings → Pages**.
2. Choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
3. Open the published URL in **Safari** on your iPhone.
4. Tap **Share → Add to Home Screen**.

Installing to the Home Screen matters on iPhone. iOS can clear website data that hasn't been used for a while, but data for Home Screen apps is kept. You can also use **Settings → Export Backup** to keep an extra copy.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | App shell and iOS meta tags |
| `styles.css` | iOS-style design, light and dark |
| `app.js` | All app logic: storage, folders, cards, drawing pad, study mode |
| `sw.js` | Service worker for offline use (bump `VERSION` when files change) |
| `manifest.webmanifest`, `icons/` | Home Screen install metadata and icons |
| `decks/lc150/` | The LC 150 deck: problems, solutions and the card builder |
| `decks/spanish/` | The Spanish vocabulary deck (`node tests/spanish.js` validates it) |
| `tests/` | Compiles and runs every C++ solution against its example (`node tests/run.js`) |
