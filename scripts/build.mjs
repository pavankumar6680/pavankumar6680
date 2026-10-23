// Generates the themed SVG cards used by README.md.
// Run: node scripts/build.mjs   (the contribution trail is refreshed daily by .github/workflows/profile.yml)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets');
mkdirSync(OUT, { recursive: true });

const USER = 'pavankumar6680';
const W = 820;
const SANS = `'Segoe UI', Inter, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif`;
const MONO = `ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace`;
const C = { ink: '#e6fffa', teal: '#2dd4bf', mint: '#5eead4', soft: '#99f6e4', muted: '#8fb8b3', panel: '#0a1d20' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const iconPath = (n) => readFileSync(join(ROOT, 'scripts', 'icons', `${n}.svg`), 'utf8').match(/<path d="([^"]+)"/)[1];
const write = (name, content) => { writeFileSync(join(OUT, name), content); console.log(`wrote assets/${name}`); };

// Reveal animations use `backwards` fill so content stays visible if CSS animation is unsupported.
const STYLE = `<style>
@keyframes rise{from{opacity:0;transform:translateY(6px)}}
@keyframes blink{50%{opacity:0}}
@keyframes pulse{50%{opacity:.35}}
.r{animation:rise .7s ease-out backwards}
.blink{animation:blink 1.1s steps(1) infinite}
.pulse{animation:pulse 2.4s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>`;

const FRAME_DEFS = `
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f4f48"/><stop offset=".55" stop-color="#0b2e33"/><stop offset="1" stop-color="#173c55"/></linearGradient>
<radialGradient id="glowA" cx=".14" cy="0" r=".6"><stop offset="0" stop-color="#34d399" stop-opacity=".5"/><stop offset="1" stop-color="#34d399" stop-opacity="0"/></radialGradient>
<radialGradient id="glowB" cx=".92" cy="1" r=".55"><stop offset="0" stop-color="#60a5fa" stop-opacity=".25"/><stop offset="1" stop-color="#60a5fa" stop-opacity="0"/></radialGradient>
<linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5eead4" stop-opacity=".9"/><stop offset=".5" stop-color="#2dd4bf" stop-opacity=".3"/><stop offset="1" stop-color="#5eead4" stop-opacity=".7"/></linearGradient>`;

function svg(h, title, body, defs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${STYLE}<defs>${FRAME_DEFS}${defs}</defs>${body}</svg>\n`;
}

function frame(h, inner, { panel = true } = {}) {
  const box = `x="1" y="1" width="${W - 2}" height="${h - 2}" rx="18"`;
  return `<rect ${box} fill="url(#bg)"/>
<rect ${box} fill="url(#glowA)"><animate attributeName="opacity" values=".65;1;.65" dur="7s" repeatCount="indefinite"/></rect>
<rect ${box} fill="url(#glowB)"/>
<rect ${box} fill="none" stroke="url(#edge)" stroke-width="1.5"/>
${panel ? `<rect x="22" y="22" width="${W - 44}" height="${h - 44}" rx="14" fill="${C.panel}" fill-opacity=".72" stroke="${C.mint}" stroke-opacity=".32"/>` : ''}
${inner}
<text x="${W - 14}" y="${h - 8}" text-anchor="end" font-family="${SANS}" font-size="9" fill="${C.mint}" fill-opacity=".5">github.com/${USER}</text>`;
}

const text = (x, y, s, { size = 12, weight = 400, fill = C.ink, font = SANS, anchor = 'start', ls = 0, extra = '' } = {}) =>
  `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}"${anchor !== 'start' ? ` text-anchor="${anchor}"` : ''}${ls ? ` letter-spacing="${ls}"` : ''} ${extra}>${esc(s)}</text>`;

// ---------------------------------------------------------------- badges
function badges() {
  const items = [
    ['Java', 'openjdk', '#e76f00', '#ffffff', '#f89820'],
    ['Spring Boot', 'springboot', '#6db33f', '#ffffff', '#6db33f'],
    ['Python', 'python', '#3776ab', '#ffd43b', '#4b8bbe'],
    ['React', 'react', '#20232a', '#61dafb', '#61dafb'],
    ['TypeScript', 'typescript', '#3178c6', '#ffffff', '#3178c6'],
    ['Kafka', 'apachekafka', '#231f20', '#ffffff', '#9ca3af'],
    ['AWS', 'amazonwebservices', '#232f3e', '#ff9900', '#ff9900'],
    ['Docker', 'docker', '#2496ed', '#ffffff', '#2496ed'],
    ['Kubernetes', 'kubernetes', '#326ce5', '#ffffff', '#5b8def'],
  ];
  const tw = 82, gap = 10, h = 90;
  const body = items.map(([label, icon, bg, fg, border], i) => {
    const x = 1 + i * (tw + gap);
    return `<g class="r" style="animation-delay:${(i * 0.07).toFixed(2)}s">
<rect x="${x}" y="1" width="${tw}" height="${h - 2}" rx="11" fill="#1b2430" stroke="${border}" stroke-width="1.8"/>
<rect x="${x + 22}" y="12" width="38" height="38" rx="9" fill="${bg}"/>
<path transform="translate(${x + 30} 20) scale(${22 / 24})" d="${iconPath(icon)}" fill="${fg}"/>
${text(x + tw / 2, 72, label, { size: 11, weight: 700, fill: '#e5e7eb', anchor: 'middle' })}
</g>`;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" role="img" aria-label="Core stack: ${items.map((i) => i[0]).join(', ')}"><title>Core stack</title>${STYLE}${body}</svg>\n`;
}

// ---------------------------------------------------------------- hero
function hero() {
  const h = 236;
  const chips = ['Java', 'Spring Boot', 'Agentic AI', 'Kafka'].map((t, i) => {
    const x = 50 + i * 124;
    return `<g class="r" style="animation-delay:${0.5 + i * 0.1}s"><rect x="${x}" y="176" width="112" height="28" rx="14" fill="#0e3434" fill-opacity=".85" stroke="${C.mint}" stroke-opacity=".55"/>${text(x + 16, 194.5, t, { size: 12, weight: 700 })}</g>`;
  }).join('');
  const defs = `<radialGradient id="mono" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#1f7a70"/><stop offset="1" stop-color="#0b2a2c"/></radialGradient>
<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>`;
  const inner = `
<circle cx="104" cy="100" r="54" fill="${C.teal}" opacity=".35" filter="url(#soft)" class="pulse"/>
<circle cx="104" cy="100" r="48" fill="url(#mono)" stroke="${C.mint}" stroke-width="2.5"/>
<circle cx="104" cy="100" r="41" fill="none" stroke="${C.mint}" stroke-opacity=".25"/>
${text(104, 112, 'PK', { size: 34, weight: 800, fill: C.ink, anchor: 'middle', ls: 1 })}
<path d="M176 80 Q 300 54 440 76" fill="none" stroke="${C.mint}" stroke-opacity=".35" stroke-width="1.2"/>
<path d="M176 80 Q 300 54 440 76" fill="none" stroke="${C.ink}" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="36 400"><animate attributeName="stroke-dashoffset" values="436;0" dur="4.5s" repeatCount="indefinite"/></path>
<g class="r">${text(176, 70, '@' + USER, { size: 13, weight: 700, fill: C.mint, ls: 1.5 })}</g>
<g class="r" style="animation-delay:.12s">${text(174, 124, 'Pavan Kumar', { size: 46, weight: 800, fill: C.ink })}</g>
<g class="r" style="animation-delay:.24s">${text(176, 150, 'Building with Java, Spring Boot & Generative AI on GitHub.', { size: 14, fill: C.mint })}</g>
<line x1="604" y1="58" x2="604" y2="150" stroke="${C.mint}" stroke-opacity=".2"/>
<g class="r" style="animation-delay:.36s">
${text(696, 104, '3+', { size: 44, weight: 800, fill: C.teal, anchor: 'middle' })}
${text(696, 126, 'YEARS SHIPPING', { size: 10, weight: 700, fill: C.soft, anchor: 'middle', ls: 2.5 })}
${text(696, 146, 'Capgemini · CBRE · Deloitte', { size: 10, fill: C.muted, anchor: 'middle' })}
</g>
${chips}`;
  return svg(h, 'Pavan Kumar, Application Developer building with Java, Spring Boot and Generative AI', frame(h, inner), defs);
}

// ---------------------------------------------------------------- terminal wordmark
const GLYPHS = {
  P: ['#######.', '##....##', '##....##', '##....##', '#######.', '##......', '##......', '##......', '##......'],
  A: ['..####..', '.##..##.', '##....##', '##....##', '########', '##....##', '##....##', '##....##', '##....##'],
  V: ['##....##', '##....##', '##....##', '##....##', '##....##', '.##..##.', '.##..##.', '..####..', '...##...'],
  N: ['##....##', '###...##', '####..##', '##.##.##', '##..####', '##...###', '##....##', '##....##', '##....##'],
};

function wordmark() {
  const word = 'PAVAN';
  const rows = 9, gapPx = 2;
  // Build a pixel grid, each pixel rendered as two characters wide.
  const px = Array.from({ length: rows }, (_, r) => [...word].map((ch) => GLYPHS[ch][r]).join('.'.repeat(gapPx)));
  const grid = px.map((row) => [...row].flatMap((p) => [p === '#', p === '#']));
  const cols = grid[0].length + 1;
  const filled = (r, c) => r >= 0 && c >= 0 && r < grid.length && c < grid[0].length && grid[r][c];
  const lines = [], shades = [];
  for (let r = 0; r <= rows; r++) {
    let a = '', b = '';
    for (let c = 0; c < cols; c++) {
      if (filled(r, c)) { a += 'S'; b += ' '; }
      else if (filled(r - 1, c - 1)) { a += ' '; b += filled(r - 1, c) ? '+' : '-'; }
      else { a += ' '; b += ' '; }
    }
    lines.push(a); shades.push(b);
  }
  const size = 12.5, lh = 14.5, top = 82, x0 = (W - cols * size * 0.6) / 2;
  const h = top + lines.length * lh + 70;
  const row = (s, r, fill) => `<text x="${x0.toFixed(1)}" y="${top + r * lh}" xml:space="preserve" font-family="${MONO}" font-size="${size}" fill="${fill}">${esc(s)}</text>`;
  const art = lines.map((s, r) => `<g class="r" style="animation-delay:${(0.2 + r * 0.06).toFixed(2)}s">${row(shades[r], r, C.teal)}${row(s, r, '#d9fbf4')}</g>`).join('\n');
  const footY = top + lines.length * lh + 26;
  const tagline = '> Application Developer · Java · Spring Boot · React · GenAI';
  const body = `
<rect x="1" y="1" width="${W - 2}" height="${h - 2}" rx="12" fill="#0d1117" stroke="#30363d"/>
<path d="M1 13 a12 12 0 0 1 12 -12 h${W - 26} a12 12 0 0 1 12 12 v21 h-${W - 2} z" fill="#161b22"/>
<line x1="1" y1="34" x2="${W - 1}" y2="34" stroke="#30363d"/>
<circle cx="20" cy="17.5" r="6" fill="#ff5f57"/><circle cx="40" cy="17.5" r="6" fill="#febc2e"/><circle cx="60" cy="17.5" r="6" fill="#28c840"/>
${text(W / 2, 22, `${USER}@github: ~$ ./wordmark.sh --name`, { size: 11, fill: '#8b949e', font: MONO, anchor: 'middle' })}
${art}
<g class="r" style="animation-delay:1s">
<text x="${x0.toFixed(1)}" y="${footY}" font-family="${MONO}" font-size="12" fill="${C.mint}">${esc(tagline)} <tspan class="blink">▋</tspan></text>
</g>
${text(W - 14, h - 10, `github.com/${USER}`, { size: 9, fill: '#3b4a54' , anchor: 'end' })}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" role="img" aria-label="Terminal wordmark spelling PAVAN"><title>PAVAN</title>${STYLE}${body}</svg>\n`;
}

// ---------------------------------------------------------------- highlights
function highlights() {
  const h = 156;
  const items = [
    ['Agentic AI', 'LangGraph + Azure OpenAI · current focus'],
    ['Spring Boot microservices', 'Kafka · Redis · Resilience4j in production'],
    ['RAG pipelines', 'Embeddings + Azure AI Search vectors'],
  ];
  const bw = (W - 44 - 36 - 28) / 3;
  const boxes = items.map(([t, s], i) => {
    const x = 40 + i * (bw + 14);
    return `<g class="r" style="animation-delay:${0.15 + i * 0.12}s">
<rect x="${x}" y="66" width="${bw}" height="62" rx="9" fill="#0b2427" stroke="${C.mint}" stroke-opacity=".35"/>
<rect x="${x}" y="78" width="3" height="38" rx="1.5" fill="${C.teal}"/>
${text(x + 16, 93, t, { size: 13, weight: 700 })}
${text(x + 16, 112, s, { size: 10, fill: C.soft })}
</g>`;
  }).join('\n');
  const inner = `${text(42, 52, 'HIGHLIGHTS', { size: 9.5, weight: 700, fill: C.mint, ls: 3 })}\n${boxes}`;
  return svg(h, 'Highlights: agentic AI, Spring Boot microservices, RAG pipelines', frame(h, inner));
}

// ---------------------------------------------------------------- engineering stack
function stack() {
  const rows = [
    ['Languages', '#f89820', ['Java 8/11/17/21', 'Python', 'TypeScript', 'JavaScript', 'SQL']],
    ['Backend', '#6db33f', ['Spring Boot', 'Spring Cloud', 'Spring Security', 'Spring Batch', 'Hibernate / JPA', 'FastAPI']],
    ['AI / GenAI', '#a78bfa', ['LangGraph', 'Azure OpenAI', 'RAG', 'Azure AI Search', 'Spring AI', 'Ollama']],
    ['Frontend', '#61dafb', ['React', 'TypeScript', 'Tailwind CSS', 'Axios']],
    ['Data', '#f472b6', ['MySQL', 'PostgreSQL', 'Oracle DB', 'SQL Server', 'MongoDB', 'Redis']],
    ['Messaging', '#e5e7eb', ['Apache Kafka', 'Event-Driven', 'Saga Pattern', 'Resilience4j']],
    ['Cloud & DevOps', '#ff9900', ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions']],
    ['Quality', '#facc15', ['JUnit', 'Mockito', 'pytest', '82%+ coverage']],
    ['Observability', '#60a5fa', ['Dynatrace', 'Grafana', 'Splunk', 'ELK Stack', 'CloudWatch']],
  ];
  const top = 96, rh = 27, h = top + rows.length * rh + 30;
  const body = rows.map(([label, color, chips], i) => {
    const y = top + i * rh;
    let x = 196;
    const pills = chips.map((c) => {
      const w = c.length * 6.1 + 18;
      const s = `<rect x="${x}" y="${y - 13}" width="${w.toFixed(1)}" height="19" rx="9.5" fill="${color}" fill-opacity=".1" stroke="${color}" stroke-opacity=".45"/>${text(x + w / 2, y + 0.5, c, { size: 10, fill: '#dbeafe', anchor: 'middle' })}`;
      x += w + 7;
      return s;
    }).join('');
    return `<g class="r" style="animation-delay:${(0.1 + i * 0.07).toFixed(2)}s"><circle cx="50" cy="${y - 3.5}" r="4" fill="${color}"/>${text(62, y, label, { size: 11, weight: 700, fill: '#e5e7eb' })}${pills}</g>`;
  }).join('\n');
  const inner = `
${text(42, 56, 'Engineering Stack', { size: 18, weight: 800 })}
${text(42, 73, 'Grouped by layer · from 3+ years of production work', { size: 10.5, weight: 600, fill: C.teal })}
${text(W - 42, 56, '> stack.scan', { size: 11, fill: C.teal, font: MONO, anchor: 'end' })}
<rect x="36" y="${top - 18}" width="${W - 72}" height="2" fill="${C.mint}" opacity=".5"><animate attributeName="y" values="${top - 18};${h - 40};${top - 18}" dur="9s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.35;0" dur="4.5s" repeatCount="indefinite"/></rect>
${body}`;
  return svg(h, 'Engineering stack grouped by layer', frame(h, inner));
}

// ---------------------------------------------------------------- featured projects
function projects() {
  const items = [
    ['project/premium-threads', 'Premium Threads', ['AI-assisted fashion marketplace: 16 modules,', '95 REST endpoints, Llama 3.2 via Spring AI.'], 'Java 21 · React 19', 'JAVA', '#f89820'],
    ['space-theme-portfolio', 'Space Portfolio', ['Interactive 3D portfolio built with', 'HTML, CSS and Three.js. The latest theme.'], 'HTML · Three.js', 'HTML', '#e34c26'],
    ['train-theme-portfolio', 'Train Portfolio', ['A train-journey take on the portfolio,', 'rendered in 3D with Three.js.'], 'HTML · Three.js', 'HTML', '#e34c26'],
    ['pavankumar6680.github.io', 'Cloud Portfolio', ['The original cloud-themed portfolio,', 'live at pavankumar6680.github.io.'], 'HTML · Three.js', 'HTML', '#e34c26'],
  ];
  const cw = (W - 44 - 36 - 14) / 2, ch = 112, top = 66, h = top + 2 * ch + 14 + 40;
  const circ = 2 * Math.PI * 20;
  const cards = items.map(([slug, title, desc, tags, lang, color], i) => {
    const x = 40 + (i % 2) * (cw + 14), y = top + Math.floor(i / 2) * (ch + 14);
    const cx = x + cw - 42, cy = y + 64;
    return `<g class="r" style="animation-delay:${0.15 + i * 0.12}s">
<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="9" fill="#0b2427" stroke="${C.mint}" stroke-opacity=".35"/>
<line x1="${x}" y1="${y + 22}" x2="${x + cw}" y2="${y + 22}" stroke="${C.mint}" stroke-opacity=".18"/>
${text(x + 12, y + 15, `> ${slug}`, { size: 9.5, fill: C.mint, font: MONO })}
<circle cx="${x + cw - 14}" cy="${y + 11}" r="3.5" fill="#34d399" class="pulse"/>
${text(x + 12, y + 44, title, { size: 15, weight: 800 })}
${text(x + 12, y + 62, desc[0], { size: 10, fill: C.soft })}
${text(x + 12, y + 76, desc[1], { size: 10, fill: C.soft })}
<rect x="${x + 12}" y="${y + 86}" width="${tags.length * 6 + 18}" height="17" rx="8.5" fill="${color}" fill-opacity=".14" stroke="${color}" stroke-opacity=".55"/>
${text(x + 21, y + 98, tags, { size: 9.5, fill: '#e5e7eb' })}
<circle cx="${cx}" cy="${cy}" r="20" fill="none" stroke="#12302f" stroke-width="5"/>
<circle cx="${cx}" cy="${cy}" r="20" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})" stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="0"><animate attributeName="stroke-dashoffset" values="${circ.toFixed(1)};0" dur="1.6s" begin="${0.3 + i * 0.15}s" fill="freeze"/></circle>
${text(cx, cy + 3.5, lang, { size: 9, weight: 700, fill: C.ink, anchor: 'middle' })}
</g>`;
  }).join('\n');
  const inner = `
${text(42, 50, 'PROJECTS.LIST', { size: 9.5, weight: 700, fill: C.mint, font: MONO, ls: 3 })}
${text(W / 2, 50, '~/projects.sh --all', { size: 10, fill: C.muted, font: MONO, anchor: 'middle' })}
${text(W - 42, 50, `${items.length} projects`, { size: 10, fill: C.muted, font: MONO, anchor: 'end' })}
${cards}`;
  return svg(h, 'Featured projects', frame(h, inner));
}

// ---------------------------------------------------------------- connect
function connect() {
  const h = 116;
  const pills = [['in', 'LINKEDIN', 'pavan-kumar'], ['◎', 'PORTFOLIO', 'space-theme-portfolio'], ['@', 'EMAIL', 'pavankumaranjuri']];
  const pw = 206, gap = 18, x0 = (W - (pills.length * pw + (pills.length - 1) * gap)) / 2;
  const body = pills.map(([ico, label, value], i) => {
    const x = x0 + i * (pw + gap);
    return `<g class="r" style="animation-delay:${0.1 + i * 0.12}s">
<rect x="${x}" y="40" width="${pw}" height="36" rx="18" fill="#0d1f22" stroke="${C.mint}" stroke-opacity=".6"/>
<circle cx="${x + 19}" cy="58" r="11" fill="${C.teal}" fill-opacity=".18" stroke="${C.mint}" stroke-opacity=".6"/>
${text(x + 19, 62, ico, { size: 10.5, weight: 800, fill: C.ink, anchor: 'middle' })}
${text(x + 38, 54, label, { size: 8, weight: 700, fill: C.mint, ls: 1.5 })}
${text(x + 38, 68, value, { size: 11, weight: 700 })}
</g>`;
  }).join('\n');
  return svg(h, 'Connect: LinkedIn, portfolio, email', frame(h, body));
}

// ---------------------------------------------------------------- contribution trail
async function trail() {
  const res = await fetch(`https://github.com/users/${USER}/contributions`, { headers: { 'User-Agent': `${USER}-profile-build` } });
  if (!res.ok) throw new Error(`contributions fetch failed: ${res.status}`);
  const html = await res.text();
  const cells = [...html.matchAll(/data-date="(\d{4}-\d\d-\d\d)" id="contribution-day-component-(\d+)-(\d+)" data-level="(\d)"/g)]
    .map((m) => ({ date: m[1], row: +m[2], col: +m[3], level: +m[4] }));
  if (cells.length < 300) throw new Error(`unexpected calendar shape (${cells.length} cells)`);
  const counts = new Map([...html.matchAll(/for="contribution-day-component-(\d+-\d+)"[^>]*>(\d+) contributions? on/g)].map((m) => [m[1], +m[2]]));
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  const weeks = Math.max(...cells.map((c) => c.col)) + 1;

  const cell = 10, gap = 3, step = cell + gap, gridW = weeks * step - gap;
  const x0 = (W - gridW) / 2, y0 = 92, h = y0 + 7 * step + 34;
  const shades = ['#12302f', '#115e59', '#0f766e', '#14b8a6', '#5eead4'];
  const squares = cells.map(({ row, col, level }) =>
    `<rect x="${x0 + col * step}" y="${y0 + row * step}" width="${cell}" height="${cell}" rx="2.5" fill="${shades[level]}"${level === 4 ? ' class="pulse"' : ''}/>`).join('');

  // Serpentine route through every week, down one column and up the next.
  const pts = [];
  for (let c = 0; c < weeks; c++) for (let k = 0; k < 7; k++) {
    const r = c % 2 ? 6 - k : k;
    pts.push(`${(x0 + c * step + cell / 2).toFixed(1)} ${(y0 + r * step + cell / 2).toFixed(1)}`);
  }
  const route = `M${pts.join(' L')}`;
  const dur = 60, perCell = dur / pts.length;
  const snake = Array.from({ length: 6 }, (_, i) => {
    const r = i === 0 ? 5 : 4.2 - i * 0.4;
    const fill = i === 0 ? C.ink : C.mint;
    return `<circle r="${r.toFixed(1)}" fill="${fill}" fill-opacity="${(1 - i * 0.14).toFixed(2)}"><animateMotion dur="${dur}s" repeatCount="indefinite" begin="-${(i * perCell * 1.6 + 0.001).toFixed(3)}s" path="${route}"/></circle>`;
  }).reverse().join('');

  const inner = `
${text(42, 52, 'CONTRIBUTION TRAIL', { size: 9.5, weight: 700, fill: C.mint, ls: 3 })}
${text(42, 74, `${total.toLocaleString('en-US')} contribution${total === 1 ? '' : 's'} in the last year, one continuous run`, { size: 15, weight: 800 })}
<circle cx="${W - 78}" cy="49" r="4" fill="#34d399" class="pulse"/>
${text(W - 42, 52, 'LIVE', { size: 9.5, weight: 800, fill: C.mint, anchor: 'end', ls: 2 })}
${squares}
${snake}`;
  return svg(h, `${total} GitHub contributions in the last year`, frame(h, inner));
}

write('badges.svg', badges());
write('hero.svg', hero());
write('wordmark.svg', wordmark());
write('highlights.svg', highlights());
write('stack.svg', stack());
write('projects.svg', projects());
write('connect.svg', connect());
try {
  write('trail.svg', await trail());
} catch (err) {
  console.warn(`trail.svg not refreshed: ${err.message}`);
}
