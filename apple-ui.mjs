import {galleryMemories, galleryFacets} from './smart-features.mjs';

const $ = id => document.getElementById(id);
const el = (tag, cls, text) => { const node = document.createElement(tag); if (cls) node.className = cls; if (text != null) node.textContent = text; return node; };
// Icons: Ionicons v7 (MIT) — https://github.com/ionic-team/ionicons (see vendor/ionicons/LICENSE)
const ICON = {
  library: '<path d="M432 112V96a48.14 48.14 0 00-48-48H64a48.14 48.14 0 00-48 48v256a48.14 48.14 0 0048 48h16" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"/><rect x="96" y="128" width="400" height="336" rx="45.99" ry="45.99" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"/><ellipse cx="372.92" cy="219.64" rx="30.77" ry="30.55" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path d="M342.15 372.17L255 285.78a30.93 30.93 0 00-42.18-1.21L96 387.64M265.23 464l118.59-117.73a31 31 0 0141.46-1.87L496 402.91" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/>',
  foryou: '<path d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/>',
  albums: '<rect x="64" y="176" width="384" height="256" rx="28.87" ry="28.87" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"/><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M144 80h224M112 128h288"/>',
  search: '<path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M338.29 338.29L448 448"/>',
  back: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M328 112L184 256l144 144"/>',
  heart: '<path d="M256 448a32 32 0 01-18-5.57c-78.59-53.35-112.62-89.93-131.39-112.8-40-48.75-59.15-98.8-58.61-153C48.63 114.52 98.46 64 159.08 64c44.08 0 74.61 24.83 92.39 45.51a6 6 0 009.06 0C278.31 88.81 308.84 64 352.92 64c60.62 0 110.45 50.52 111.08 112.64.54 54.21-18.63 104.26-58.61 153-18.77 22.87-52.8 59.45-131.39 112.8a32 32 0 01-18 5.56z"/>',
  gear: '<path d="M262.29 192.31a64 64 0 1057.4 57.4 64.13 64.13 0 00-57.4-57.4zM416.39 256a154.34 154.34 0 01-1.53 20.79l45.21 35.46a10.81 10.81 0 012.45 13.75l-42.77 74a10.81 10.81 0 01-13.14 4.59l-44.9-18.08a16.11 16.11 0 00-15.17 1.75A164.48 164.48 0 01325 400.8a15.94 15.94 0 00-8.82 12.14l-6.73 47.89a11.08 11.08 0 01-10.68 9.17h-85.54a11.11 11.11 0 01-10.69-8.87l-6.72-47.82a16.07 16.07 0 00-9-12.22 155.3 155.3 0 01-21.46-12.57 16 16 0 00-15.11-1.71l-44.89 18.07a10.81 10.81 0 01-13.14-4.58l-42.77-74a10.8 10.8 0 012.45-13.75l38.21-30a16.05 16.05 0 006-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 00-6.07-13.94l-38.19-30A10.81 10.81 0 0149.48 186l42.77-74a10.81 10.81 0 0113.14-4.59l44.9 18.08a16.11 16.11 0 0015.17-1.75A164.48 164.48 0 01187 111.2a15.94 15.94 0 008.82-12.14l6.73-47.89A11.08 11.08 0 01213.23 42h85.54a11.11 11.11 0 0110.69 8.87l6.72 47.82a16.07 16.07 0 009 12.22 155.3 155.3 0 0121.46 12.57 16 16 0 0015.11 1.71l44.89-18.07a10.81 10.81 0 0113.14 4.58l42.77 74a10.8 10.8 0 01-2.45 13.75l-38.21 30a16.05 16.05 0 00-6.05 14.08c.33 4.14.55 8.3.55 12.47z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/>',
  play: '<path d="M133 440a35.37 35.37 0 01-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0135.77.45l247.85 148.36a36 36 0 010 61l-247.89 148.4A35.5 35.5 0 01133 440z"/>',
  dots: '<circle cx="256" cy="256" r="48"/><circle cx="416" cy="256" r="48"/><circle cx="96" cy="256" r="48"/>',
  saved: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M176 262.62L256 342l80-79.38M256 330.97V170"/><path d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/>',
  viewed: '<path d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 128v144h96"/>',
  screenshots: '<path d="M350.54 148.68l-26.62-42.06C318.31 100.08 310.62 96 302 96h-92c-8.62 0-16.31 4.08-21.92 10.62l-26.62 42.06C155.85 155.23 148.62 160 140 160H80a32 32 0 00-32 32v192a32 32 0 0032 32h352a32 32 0 0032-32V192a32 32 0 00-32-32h-59c-8.65 0-16.85-4.77-22.46-11.32z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="256" cy="272" r="80" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M124 158v-22h-24v22"/>',
  videos: '<path d="M374.79 308.78L457.5 367a16 16 0 0022.5-14.62V159.62A16 16 0 00457.5 145l-82.71 58.22A16 16 0 00368 216.3v79.4a16 16 0 006.79 13.08z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M268 384H84a52.15 52.15 0 01-52-52V180a52.15 52.15 0 0152-52h184.48A51.68 51.68 0 01320 179.52V332a52.15 52.15 0 01-52 52z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/>',
  hidden: '<path d="M432 448a15.92 15.92 0 01-11.31-4.69l-352-352a16 16 0 0122.62-22.62l352 352A16 16 0 01432 448zM255.66 384c-41.49 0-81.5-12.28-118.92-36.5-34.07-22-64.74-53.51-88.7-91v-.08c19.94-28.57 41.78-52.73 65.24-72.21a2 2 0 00.14-2.94L93.5 161.38a2 2 0 00-2.71-.12c-24.92 21-48.05 46.76-69.08 76.92a31.92 31.92 0 00-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416a239.13 239.13 0 0075.8-12.58 2 2 0 00.77-3.31l-21.58-21.58a4 4 0 00-3.83-1 204.8 204.8 0 01-51.16 6.47zM490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96a227.34 227.34 0 00-74.89 12.83 2 2 0 00-.75 3.31l21.55 21.55a4 4 0 003.88 1 192.82 192.82 0 0150.21-6.69c40.69 0 80.58 12.43 118.55 37 34.71 22.4 65.74 53.88 89.76 91a.13.13 0 010 .16 310.72 310.72 0 01-64.12 72.73 2 2 0 00-.15 2.95l19.9 19.89a2 2 0 002.7.13 343.49 343.49 0 0068.64-78.48 32.2 32.2 0 00-.1-34.78z"/><path d="M256 160a95.88 95.88 0 00-21.37 2.4 2 2 0 00-1 3.38l112.59 112.56a2 2 0 003.38-1A96 96 0 00256 160zM165.78 233.66a2 2 0 00-3.38 1 96 96 0 00115 115 2 2 0 001-3.38z"/>',
  duplicates: '<rect x="128" y="128" width="336" height="336" rx="57" ry="57" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"/><path d="M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/>'
};
const icon = (name, size = 24) => '<svg viewBox="0 0 512 512" width="' + size + '" height="' + size + '" fill="currentColor" aria-hidden="true">' + (ICON[name] || '') + '</svg>';

let handle = null;
let root, header, content, tabbar;
let tab = 'library';
let zoom = 'days';
let sub = null;
let list = [];
let scrollHandler = null;
let poll = null;
let lastCount = -1;
let viewed = [];
try { viewed = JSON.parse(localStorage.getItem('sai-recently-viewed') || '[]'); } catch { viewed = []; }

const lib = () => handle && handle.library;
const allPhotos = () => { const library = lib(); if (!library) return []; return [...library.photos()].sort((a, b) => (Number(a.addedAt) || 0) - (Number(b.addedAt) || 0)); };
const activePhotos = () => { const library = lib(); if (!library) return []; return [...library.photos()].sort((a, b) => (Number(a.addedAt) || 0) - (Number(b.addedAt) || 0)); };
const dayStamp = t => { const d = new Date(t); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const monthStamp = t => { const d = new Date(t); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
const dayLabel = t => { const d = new Date(t); const now = new Date(); const today = dayStamp(now.getTime()); const stamp = dayStamp(t); if (stamp === today) return 'Today'; const y = new Date(now.getTime() - 86400000); if (stamp === dayStamp(y.getTime())) return 'Yesterday'; const sameYear = d.getFullYear() === now.getFullYear(); return d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', ...(sameYear ? {} : { year: 'numeric' }) }); };
const monthLabel = t => new Date(t).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

function tile(photo, seq) {
  const t = el('button', 'a-tile'); t.type = 'button';
  const img = el('img'); img.alt = photo.fileName || ''; img.loading = 'lazy'; img.decoding = 'async';
  lib().loadTile(photo, img);
  t.append(img);
  if (photo.mediaType === 'video') { const b = el('span', 'a-badge'); b.innerHTML = icon('play', 12); t.append(b); }
  const fav = lib().meta.favorites?.[photo.id]; if (fav) { const h = el('span', 'a-fav'); h.innerHTML = icon('heart', 14); t.append(h); }
  t.onclick = () => openPhoto(photo, seq || list);
  return t;
}

function rememberView(photo) { viewed = [photo.id, ...viewed.filter(id => id !== photo.id)].slice(0, 200); try { localStorage.setItem('sai-recently-viewed', JSON.stringify(viewed)); } catch {} }
function openPhoto(photo, seq) { rememberView(photo); try { lib().open(photo, seq && seq.length ? seq : [photo]); } catch {} }

function setHeaderTitle(text, { back = false } = {}) {
  header.replaceChildren();
  const bar = el('div', 'a-headerbar');
  if (back) { const b = el('button', 'a-iconbtn'); b.innerHTML = icon('back', 22); b.setAttribute('aria-label', 'Back'); b.onclick = () => { sub = null; render(); }; bar.append(b); }
  else { const b = el('button', 'a-iconbtn'); b.innerHTML = icon('gear', 22); b.setAttribute('aria-label', 'Settings'); b.onclick = () => { $('openSettings')?.click(); }; bar.append(b); }
  const spacer = el('span', 'a-grow'); bar.append(spacer);
  const dots = el('button', 'a-iconbtn'); dots.innerHTML = icon('dots', 22); dots.setAttribute('aria-label', 'More'); dots.onclick = () => { if (tab === 'search') renderSearch(true); else location.hash = ''; }; bar.append(dots);
  header.append(bar);
  header.append(el('h1', 'a-title', text));
}

function segmented() {
  const wrap = el('div', 'a-segmented');
  for (const [key, label] of [['years', 'Years'], ['months', 'Months'], ['days', 'Days'], ['all', 'All']]) {
    const b = el('button', '', label); b.type = 'button'; if (zoom === key) b.setAttribute('aria-current', 'true');
    b.onclick = () => { zoom = key; try { localStorage.setItem('sai-apple-zoom', key); } catch {} render(); };
    wrap.append(b);
  }
  return wrap;
}

function renderLibrary() {
  setHeaderTitle('Library');
  content.append(segmented());
  const photos = activePhotos(); list = photos;
  if (!photos.length) { content.append(emptyState('No photos yet. Connect pCloud and your library will appear here.')); return; }
  if (zoom === 'years') { renderYears(photos); return; }
  const items = [];
  let last = '';
  for (const p of photos) {
    const t = Number(p.addedAt) || 0;
    const key = zoom === 'days' ? dayStamp(t) : monthStamp(t);
    if (key !== last) { items.push({ header: zoom === 'days' ? dayLabel(t) : monthLabel(t) }); last = key; }
    items.push({ photo: p });
  }
  const grid = el('div', 'a-grid');
  grid.style.gridTemplateColumns = zoom === 'months' ? 'repeat(2,1fr)' : 'repeat(3,1fr)';
  content.append(grid);
  const CHUNK = 240;
  let start = items.length;
  const renderChunk = (from, to, prepend) => {
    const frag = document.createDocumentFragment();
    for (let i = from; i < to; i++) { const it = items[i]; if (it.header) frag.append(el('div', 'a-grid-header', it.header)); else frag.append(tile(it.photo, photos)); }
    if (prepend) grid.prepend(frag); else grid.append(frag);
  };
  const first = Math.max(0, start - CHUNK);
  renderChunk(first, start, false); start = first;
  if (scrollHandler) root.removeEventListener('scroll', scrollHandler);
  let busy = false;
  scrollHandler = () => {
    if (busy || start <= 0) return;
    if (root.scrollTop < 800) {
      busy = true; const prevH = root.scrollHeight, prevTop = root.scrollTop;
      const from = Math.max(0, start - CHUNK); renderChunk(from, start, true); start = from;
      root.scrollTop = prevTop + (root.scrollHeight - prevH); busy = false;
    }
  };
  root.addEventListener('scroll', scrollHandler, { passive: true });
  requestAnimationFrame(() => { root.scrollTop = root.scrollHeight; });
}

function renderYears(photos) {
  const byYear = new Map();
  for (const p of photos) { const y = new Date(Number(p.addedAt) || 0).getFullYear(); if (!byYear.has(y)) byYear.set(y, []); byYear.get(y).push(p); }
  const years = [...byYear.keys()].sort((a, b) => b - a);
  const grid = el('div', 'a-grid a-grid-years'); grid.style.gridTemplateColumns = 'repeat(2,1fr)';
  for (const y of years) {
    const group = byYear.get(y);
    const card = el('button', 'a-year'); card.type = 'button';
    const cover = group[group.length - 1];
    const img = el('img'); img.alt = String(y); img.loading = 'lazy'; img.decoding = 'async'; lib().loadTile(cover, img);
    card.append(img, el('span', 'a-year-label', String(y)), el('span', 'a-year-count', group.length + ' items'));
    card.onclick = () => { sub = { title: String(y), photos: group }; render(); };
    grid.append(card);
  }
  content.append(grid);
}

function emptyState(text) { return el('p', 'a-empty', text); }

function galleryView(title, photos) {
  setHeaderTitle(title, { back: true });
  list = photos;
  content.append(el('p', 'a-count', photos.length + (photos.length === 1 ? ' item' : ' items')));
  if (!photos.length) { content.append(emptyState('Nothing here yet.')); return; }
  const grid = el('div', 'a-grid'); grid.style.gridTemplateColumns = 'repeat(3,1fr)';
  const CHUNK = 300; let start = 0;
  const renderChunk = () => { const frag = document.createDocumentFragment(); const to = Math.min(photos.length, start + CHUNK); for (let i = start; i < to; i++) frag.append(tile(photos[i], photos)); grid.append(frag); start = to; };
  renderChunk();
  content.append(grid);
  if (scrollHandler) root.removeEventListener('scroll', scrollHandler);
  scrollHandler = () => { if (start < photos.length && root.scrollTop + root.clientHeight > root.scrollHeight - 900) renderChunk(); };
  root.addEventListener('scroll', scrollHandler, { passive: true });
}

function carousel(title, photos, onMore) {
  const section = el('section', 'a-section');
  const head = el('div', 'a-section-head');
  head.append(el('h2', '', title));
  if (onMore) { const more = el('button', '', 'See All'); more.onclick = onMore; head.append(more); }
  section.append(head);
  const row = el('div', 'a-row');
  for (const p of photos.slice(0, 20)) { const t = tile(p, photos); t.classList.add('a-row-tile'); row.append(t); }
  if (!photos.length) row.append(emptyState('Nothing here yet.'));
  section.append(row);
  return section;
}

function renderForYou() {
  setHeaderTitle('For You');
  const photos = allPhotos(); const library = lib();
  const groups = (() => { try { return galleryMemories(photos, new Date(), library.people || []); } catch { return []; } })();
  const featured = [...photos].sort((a, b) => (library.meta.favorites?.[b.id] ? 1 : 0) - (library.meta.favorites?.[a.id] ? 1 : 0) || (Number(b.addedAt) || 0) - (Number(a.addedAt) || 0)).slice(0, 15);
  if (featured.length) content.append(featureHero(featured));
  if (groups.length) {
    const section = el('section', 'a-section');
    section.append(el('h2', 'a-section-title', 'Memories'));
    for (const g of groups.slice(0, 12)) {
      const card = memoryCard(g);
      section.append(card);
    }
    content.append(section);
  } else {
    content.append(el('p', 'a-section-title', 'Memories'));
    content.append(emptyState('Memories appear here as your library loads.'));
  }
  const recentDays = recentDaysRow(photos);
  if (recentDays) content.append(recentDays);
  content.append(carousel('Favorites', photos.filter(p => library.meta.favorites?.[p.id]).reverse(), () => { sub = { title: 'Favorites', photos: photos.filter(p => library.meta.favorites?.[p.id]).reverse() }; render(); }));
  content.append(carousel('Recently Saved', [...photos].sort((a, b) => (Number(b.addedAt) || 0) - (Number(a.addedAt) || 0)).slice(0, 40)));
}

function featureHero(photos) {
  const hero = el('button', 'a-hero'); hero.type = 'button';
  const cover = photos[0]; const img = el('img'); img.alt = 'Featured'; img.loading = 'lazy'; lib().loadTile(cover, img);
  hero.append(img);
  const overlay = el('div', 'a-hero-overlay');
  overlay.append(el('strong', '', 'Featured Photos'));
  overlay.append(el('span', '', photos.length + ' highlights'));
  hero.append(overlay);
  hero.onclick = () => { sub = { title: 'Featured Photos', photos }; render(); };
  return hero;
}

function memoryCard(group) {
  const card = el('button', 'a-memory'); card.type = 'button';
  const imgs = el('div', 'a-memory-mosaic');
  for (const p of group.photos.slice(0, 4)) { const img = el('img'); img.alt = group.title; img.loading = 'lazy'; lib().loadTile(p, img); imgs.append(img); }
  card.append(imgs);
  const meta = el('div', 'a-memory-meta');
  meta.append(el('strong', '', group.title));
  meta.append(el('span', '', group.photos.length + ' photos'));
  card.append(meta);
  card.onclick = () => { sub = { title: group.title, photos: group.photos }; render(); };
  return card;
}

function recentDaysRow(photos) {
  const recent = [...photos].slice(-120).reverse();
  if (!recent.length) return null;
  const seen = new Set(); const picks = [];
  for (const p of recent) { const s = dayStamp(Number(p.addedAt) || 0); if (seen.has(s)) continue; seen.add(s); picks.push(p); if (picks.length >= 12) break; }
  return carousel('Recent Days', picks);
}

function renderAlbums() {
  setHeaderTitle('Albums');
  const library = lib(); const meta = library.meta || {}; const photos = allPhotos(); const byId = new Map(photos.map(p => [p.id, p]));
  const albums = Object.entries(meta.albums || {}).filter(([, a]) => !a.hidden);
  content.append(el('h2', 'a-section-title', 'My Albums'));
  const grid = el('div', 'a-album-grid');
  for (const [id, album] of albums) {
    const members = Object.keys(album.members || {}).map(pid => byId.get(pid)).filter(Boolean);
    if (!members.length && !album.smart) { /* keep album visible even if empty */ }
    const card = el('button', 'a-album'); card.type = 'button';
    const img = el('img'); img.alt = album.name; img.loading = 'lazy';
    if (members.length) lib().loadTile(members[members.length - 1], img); else img.style.background = 'var(--a-fill)';
    card.append(img);
    const info = el('div', 'a-album-info'); info.append(el('strong', '', album.name || 'Album'), el('span', '', (members.length || (album.members ? Object.keys(album.members).length : 0)) + ' items'));
    card.append(info);
    card.onclick = () => { sub = { title: album.name || 'Album', photos: members }; render(); };
    grid.append(card);
  }
  if (!albums.length) grid.append(emptyState('No albums yet.'));
  content.append(grid);

  content.append(el('h2', 'a-section-title', 'Utilities'));
  const utils = el('div', 'a-util-grid');
  const favs = photos.filter(p => meta.favorites?.[p.id]).reverse();
  const shots = photos.filter(p => /(screen[-_ ]?shot|screenshot)/i.test(p.fileName || '')).reverse();
  const vids = photos.filter(p => p.mediaType === 'video').reverse();
  const saved = [...photos].sort((a, b) => (Number(b.addedAt) || 0) - (Number(a.addedAt) || 0)).slice(0, 200);
  const recentlyViewed = viewed.map(id => byId.get(id)).filter(Boolean);
  const hidden = Object.entries(meta.hidden || {}).filter(([, v]) => v).map(([id]) => byId.get(id)).filter(Boolean);
  const addUtil = (label, glyph, photos2, onOpen, tint) => {
    const b = el('button', 'a-util'); b.type = 'button';
    const ico = el('span', 'a-util-icon'); ico.innerHTML = icon(glyph, 22); if (tint) ico.style.color = tint;
    b.append(ico, el('strong', '', label), el('span', 'a-util-count', photos2 ? String(photos2.length) : ''));
    b.onclick = onOpen; utils.append(b);
  };
  addUtil('Favorites', 'heart', favs, () => { sub = { title: 'Favorites', photos: favs }; render(); }, '#ff2d55');
  addUtil('Recently Saved', 'saved', saved, () => { sub = { title: 'Recently Saved', photos: saved }; render(); }, '#0a84ff');
  addUtil('Recently Viewed', 'viewed', recentlyViewed, () => { sub = { title: 'Recently Viewed', photos: recentlyViewed }; render(); }, '#30d158');
  addUtil('Screenshots', 'screenshots', shots, () => { sub = { title: 'Screenshots', photos: shots }; render(); }, '#5e5ce6');
  addUtil('Videos', 'videos', vids, () => { sub = { title: 'Videos', photos: vids }; render(); }, '#64d2ff');
  addUtil('Hidden', 'hidden', hidden, () => { sub = { title: 'Hidden', photos: hidden }; render(); }, '#8e8e93');
  addUtil('Duplicates', 'duplicates', null, () => openNativeCleanup(), '#ff9f0a');
  content.append(utils);

  const people = (library.people || []).slice(0, 24);
  if (people.length) {
    content.append(el('h2', 'a-section-title', 'People & Pets'));
    const ppl = el('div', 'a-people-grid');
    for (const person of people) {
      const members = [...(person.photos || [])].map(id => byId.get(id)).filter(Boolean);
      if (!members.length) continue;
      const card = el('button', 'a-person'); card.type = 'button';
      const img = el('img'); img.alt = person.name || 'Person'; img.loading = 'lazy'; lib().loadTile(members[members.length - 1], img);
      card.append(img, el('span', '', person.name || 'Unnamed'));
      card.onclick = () => { sub = { title: person.name || 'Person', photos: members }; render(); };
      ppl.append(card);
    }
    content.append(ppl);
  }
}

function renderSearch() {
  setHeaderTitle('Search');
  const field = el('input', 'a-search'); field.type = 'search'; field.placeholder = 'Photos, People, Places'; field.setAttribute('aria-label', 'Search');
  content.append(field);
  const results = el('div', 'a-search-results');
  content.append(results);
  const library = lib(); const photos = allPhotos();
  const run = () => {
    const q = field.value.trim().toLowerCase();
    results.replaceChildren();
    if (!q) { renderSearchCategories(results, photos); return; }
    const byName = new Set();
    for (const person of library.people || []) if ((person.name || '').toLowerCase().includes(q)) for (const id of person.photos || []) byName.add(id);
    const hits = photos.filter(p => byName.has(p.id) || (p.fileName || '').toLowerCase().includes(q) || Object.values(library.meta.albums || {}).some(a => a.members?.[p.id] && (a.name || '').toLowerCase().includes(q))).reverse();
    if (library.aiSearch) { try { library.aiSearch(q); } catch {} }
    list = hits;
    results.append(el('p', 'a-count', hits.length + ' results'));
    if (!hits.length) { results.append(emptyState('No matches. Try a person, place, or object.')); return; }
    const grid = el('div', 'a-grid'); grid.style.gridTemplateColumns = 'repeat(3,1fr)';
    const CHUNK = 300; let start = 0;
    const more = () => { const frag = document.createDocumentFragment(); const to = Math.min(hits.length, start + CHUNK); for (let i = start; i < to; i++) frag.append(tile(hits[i], hits)); grid.append(frag); start = to; };
    more(); results.append(grid);
    if (scrollHandler) root.removeEventListener('scroll', scrollHandler);
    scrollHandler = () => { if (start < hits.length && root.scrollTop + root.clientHeight > root.scrollHeight - 900) more(); };
    root.addEventListener('scroll', scrollHandler, { passive: true });
  };
  field.oninput = () => { clearTimeout(field._t); field._t = setTimeout(run, 220); };
  renderSearchCategories(results, photos);
  setTimeout(() => field.focus(), 50);
}

function renderSearchCategories(results) {
  const library = lib(); const photos = allPhotos(); const meta = library.meta || {};
  const grid = el('div', 'a-util-grid');
  const add = (label, glyph, list2) => { const b = el('button', 'a-util'); b.type = 'button'; const ico = el('span', 'a-util-icon'); ico.innerHTML = icon(glyph, 22); b.append(ico, el('strong', '', label), el('span', 'a-util-count', String(list2 ? list2.length : ''))); b.onclick = () => { sub = { title: label, photos: list2 }; render(); }; grid.append(b); };
  const favs = photos.filter(p => meta.favorites?.[p.id]).reverse();
  const shots = photos.filter(p => /(screen[-_ ]?shot|screenshot)/i.test(p.fileName || '')).reverse();
  const vids = photos.filter(p => p.mediaType === 'video').reverse();
  add('Favorites', ICON.heart, favs);
  add('Screenshots', ICON.library, shots);
  add('Videos', ICON.play, vids);
  results.append(el('h2', 'a-section-title', 'Browse'));
  results.append(grid);
  const people = (library.people || []).slice(0, 24);
  if (people.length) {
    results.append(el('h2', 'a-section-title', 'People & Pets'));
    const ppl = el('div', 'a-people-grid');
    for (const person of people) {
      const members = [...(person.photos || [])].filter(id => photos.some(p => p.id === id));
      if (!members.length) continue;
      const b = el('button', 'a-person'); b.type = 'button'; const img = el('img'); img.alt = person.name || 'Person'; img.loading = 'lazy'; const cover = photos.find(p => p.id === members[members.length - 1]); if (cover) lib().loadTile(cover, img);
      b.append(img, el('span', '', person.name || 'Unnamed')); b.onclick = () => { sub = { title: person.name || 'Person', photos: members.map(id => photos.find(p => p.id === id)).filter(Boolean) }; render(); }; ppl.append(b);
    }
    results.append(ppl);
  }
}

function openNativeCleanup() {
  const back = el('button', 'a-floating-back', '‹ Back to Photos');
  back.id = 'appleFloatingBack';
  back.onclick = () => { document.body.classList.add('apple-mode'); if (root) root.hidden = false; back.remove(); render(); };
  document.body.append(back);
  document.body.classList.remove('apple-mode');
  if (root) root.hidden = true;
  setTimeout(() => { const target = $('menuCleanup'); if (target) target.click(); }, 30);
}

function render() {
  if (!handle || !root) return;
  if (scrollHandler) { root.removeEventListener('scroll', scrollHandler); scrollHandler = null; }
  content.replaceChildren();
  root.scrollTop = 0;
  document.body.classList.toggle('apple-subpage', Boolean(sub));
  if (sub) { galleryView(sub.title, sub.photos); return; }
  if (tab === 'library') renderLibrary();
  else if (tab === 'foryou') renderForYou();
  else if (tab === 'albums') renderAlbums();
  else renderSearch();
  for (const [id, value] of [['tabLibrary', 'library'], ['tabForYou', 'foryou'], ['tabAlbums', 'albums'], ['tabSearch', 'search']]) { const b = $(id); if (b) b.setAttribute('aria-current', String(tab === value && !sub)); }
}

function build() {
  root = el('div', 'apple-root'); root.id = 'appleRoot';
  header = el('header', 'apple-header'); header.id = 'appleHeader';
  content = el('main', 'apple-content'); content.id = 'appleContent';
  tabbar = el('nav', 'apple-tabbar'); tabbar.id = 'appleTabbar';
  const tabs = [['tabLibrary', 'library', 'Library', ICON.library], ['tabForYou', 'foryou', 'For You', ICON.foryou], ['tabAlbums', 'albums', 'Albums', ICON.albums], ['tabSearch', 'search', 'Search', ICON.search]];
  for (const [id, key, label, glyph] of tabs) {
    const b = el('button', 'a-tab'); b.id = id; b.innerHTML = svg(glyph, 'width="26" height="26"'); b.append(el('span', 'a-tab-label', label)); b.setAttribute('aria-label', label);
    b.onclick = () => { sub = null; tab = key; render(); };
    tabbar.append(b);
  }
  root.append(header, content, tabbar);
  document.body.append(root);
  if (window.SAI_PHOTOS_ONLY) { const nav = $('photoNavigation'); if (nav) nav.hidden = true; }
}

export function activate() {
  if (!window.saiApple) return false;
  handle = window.saiApple;
  if (!root) build();
  document.body.classList.add('apple-mode');
  root.hidden = false;
  try { const z = localStorage.getItem('sai-apple-zoom'); if (z) zoom = z; } catch {}
  render();
  clearInterval(poll);
  lastCount = allPhotos().length;
  poll = setInterval(() => {
    if (!handle || document.hidden || sub) return;
    const count = allPhotos().length;
    if (count !== lastCount) { lastCount = count; if (root.scrollTop < 400 || tab !== 'library') render(); }
  }, 1500);
  const viewer = $('viewer'); if (viewer) viewer.addEventListener('close', () => { if (tab === 'albums' || tab === 'foryou' || tab === 'search' || sub) render(); });
  return true;
}

export function deactivate() {
  document.body.classList.remove('apple-mode');
  if (root) root.hidden = true;
  clearInterval(poll); poll = null;
}

export function refresh() { if (root && !root.hidden) render(); }

window.saiAppleUI = { activate, deactivate, refresh };

if (window.saiApple && (window.saiUiMode ? window.saiUiMode() === 'apple' : true)) {
  const start = () => { if (!activate()) setTimeout(start, 400); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
}
