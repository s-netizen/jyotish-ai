/* ── Jyotish Rich Renderer ── */

// ── Planet metadata ──
const PLANET_META = {
  'sun':     { symbol: '☉', color: '#e8943a', bg: 'rgba(232,148,58,0.12)',  label: 'Sun'     },
  'moon':    { symbol: '☽', color: '#c4b8e0', bg: 'rgba(196,184,224,0.12)', label: 'Moon'    },
  'mars':    { symbol: '♂', color: '#e05555', bg: 'rgba(224,85,85,0.12)',   label: 'Mars'    },
  'mercury': { symbol: '☿', color: '#5bba8a', bg: 'rgba(91,186,138,0.12)', label: 'Mercury' },
  'jupiter': { symbol: '♃', color: '#e8d060', bg: 'rgba(232,208,96,0.12)', label: 'Jupiter' },
  'venus':   { symbol: '♀', color: '#e88ab0', bg: 'rgba(232,138,176,0.12)','label': 'Venus'  },
  'saturn':  { symbol: '♄', color: '#8ab4c4', bg: 'rgba(138,180,196,0.12)', label: 'Saturn'  },
  'rahu':    { symbol: '☊', color: '#a08060', bg: 'rgba(160,128,96,0.12)',  label: 'Rahu'    },
  'ketu':    { symbol: '☋', color: '#90a060', bg: 'rgba(144,160,96,0.12)',  label: 'Ketu'    },
  'lagna':   { symbol: 'Lg', color: '#c4a97d', bg: 'rgba(196,169,125,0.12)', label: 'Lagna'  },
  'ascendant':{ symbol: 'Lg', color: '#c4a97d', bg: 'rgba(196,169,125,0.12)', label: 'Lagna' },
};

const SIGN_SYMBOLS = {
  'aries':'♈','taurus':'♉','gemini':'♊','cancer':'♋','leo':'♌','virgo':'♍',
  'libra':'♎','scorpio':'♏','sagittarius':'♐','capricorn':'♑','aquarius':'♒','pisces':'♓',
  'mesha':'♈','vrishabha':'♉','mithuna':'♊','karka':'♋','simha':'♌','kanya':'♍',
  'tula':'♎','vrishchika':'♏','dhanu':'♐','makara':'♑','kumbha':'♒','meena':'♓',
};

function getPlanetMeta(name) {
  const key = name.toLowerCase().replace(/\s*\(.*\)/, '').trim();
  return PLANET_META[key] || { symbol: '●', color: '#c4a97d', bg: 'rgba(196,169,125,0.1)', label: name };
}

function getSignSymbol(sign) {
  if (!sign) return '';
  const key = sign.toLowerCase().replace(/\s*\(.*\)/, '').trim().split(' ')[0];
  return SIGN_SYMBOLS[key] || '';
}

// ── Detect if a block of lines is a markdown table ──
function isTableBlock(lines) {
  if (lines.length < 2) return false;
  const hasPipes = lines[0].includes('|') && lines[1].includes('|');
  const hasSep = lines.some(l => /^\|?[\s\-|:]+\|/.test(l));
  return hasPipes && hasSep;
}

// ── Render markdown table to rich HTML ──
function renderTable(lines) {
  const rows = lines
    .filter(l => l.trim() && !/^\|?[\s\-|:]+\|/.test(l.trim()))
    .map(l => l.replace(/^\||\|$/g, '').split('|').map(c => c.trim()));

  if (rows.length < 2) return null;

  const headers = rows[0];
  const dataRows = rows.slice(1);

  // Detect if this is a planetary positions table
  const isPlanetTable = headers.some(h => /planet|graha/i.test(h));
  // Detect life areas dashboard
  const isLifeTable = headers.some(h => /domain|area|rating/i.test(h));
  // Detect dosha table
  const isDoshaTable = headers.some(h => /dosha|severity/i.test(h));

  if (isPlanetTable) return renderPlanetTable(headers, dataRows);
  if (isLifeTable) return renderLifeDashboard(headers, dataRows);

  // Generic styled table
  let html = `<div class="rt-table-wrap"><table class="rt-table">`;
  html += `<thead><tr>${headers.map(h => `<th>${inlineFormat(h)}</th>`).join('')}</tr></thead>`;
  html += `<tbody>`;
  dataRows.forEach((row, i) => {
    html += `<tr class="${i % 2 === 0 ? 'rt-row-even' : ''}">`;
    row.forEach((cell, ci) => {
      const formatted = inlineFormat(cell);
      // Rating cells
      if (/^strong$/i.test(cell.trim())) {
        html += `<td><span class="rt-badge rt-badge-strong">Strong</span></td>`;
      } else if (/^medium$/i.test(cell.trim())) {
        html += `<td><span class="rt-badge rt-badge-medium">Medium</span></td>`;
      } else if (/^weak$/i.test(cell.trim())) {
        html += `<td><span class="rt-badge rt-badge-weak">Weak</span></td>`;
      } else {
        html += `<td>${formatted}</td>`;
      }
    });
    html += `</tr>`;
  });
  html += `</tbody></table></div>`;
  return html;
}

// ── Planetary positions table ──
function renderPlanetTable(headers, rows) {
  let html = `<div class="rt-planet-table">`;
  html += `<div class="rt-planet-grid">`;

  rows.forEach(row => {
    const planetName = row[0] || '';
    const meta = getPlanetMeta(planetName);
    const sign = row[1] || '';
    const house = row[2] || '';
    const degree = row[3] || '';
    const nakshatra = row[4] || '';
    const signSym = getSignSymbol(sign);

    html += `<div class="rt-planet-card" style="border-color:${meta.color}22;background:${meta.bg}">
      <div class="rt-planet-header">
        <span class="rt-planet-symbol" style="color:${meta.color}">${meta.symbol}</span>
        <span class="rt-planet-name" style="color:${meta.color}">${planetName}</span>
        <span class="rt-planet-house">House ${house}</span>
      </div>
      <div class="rt-planet-sign">${signSym} ${sign}</div>
      <div class="rt-planet-footer">
        <span class="rt-planet-deg">${degree}</span>
        ${nakshatra ? `<span class="rt-planet-nak">${nakshatra}</span>` : ''}
      </div>
    </div>`;
  });

  html += `</div></div>`;
  return html;
}

// ── Life areas dashboard ──
function renderLifeDashboard(headers, rows) {
  const ratingOrder = { 'strong': 3, 'medium': 2, 'weak': 1 };
  let html = `<div class="rt-life-grid">`;

  rows.forEach(row => {
    const domain = row[0] || '';
    const rating = (row[1] || '').trim();
    const verdict = row[2] || '';
    const ratingKey = rating.toLowerCase();
    const score = ratingOrder[ratingKey] || 2;
    const pct = score === 3 ? 88 : score === 2 ? 55 : 28;
    const colorClass = ratingKey === 'strong' ? 'strong' : ratingKey === 'weak' ? 'weak' : 'medium';

    html += `<div class="rt-life-card">
      <div class="rt-life-domain">${domain}</div>
      <div class="rt-life-bar-wrap">
        <div class="rt-life-bar rt-life-bar-${colorClass}" style="width:${pct}%"></div>
      </div>
      <div class="rt-life-meta">
        <span class="rt-badge rt-badge-${colorClass}">${rating}</span>
        <span class="rt-life-verdict">${verdict}</span>
      </div>
    </div>`;
  });

  html += `</div>`;
  return html;
}

// ── Vedic Kundli Wheel (North Indian square style) ──
function renderKundliWheel(planetData) {
  // planetData: array of {name, house, symbol, color}
  const size = 320;
  const s = size;
  const u = s / 4; // unit

  // House positions in North Indian chart (fixed layout)
  // Houses go: 12 1 2 / 11 - 3 / 10 9 8 / 7 6 5 → center=4+8
  const houseCoords = {
    1:  { x: u,     y: 0,     w: u,   h: u   }, // top-mid-left
    2:  { x: u*2,   y: 0,     w: u,   h: u   }, // top-mid-right
    3:  { x: u*3,   y: u,     w: u,   h: u   }, // right-top
    4:  { x: u*3,   y: u*2,   w: u,   h: u   }, // right-bottom (center-right area)
    5:  { x: u*2,   y: u*3,   w: u,   h: u   }, // bottom-mid-right
    6:  { x: u,     y: u*3,   w: u,   h: u   }, // bottom-mid-left
    7:  { x: 0,     y: u*3,   w: u,   h: u   }, // bottom-left
    8:  { x: 0,     y: u*2,   w: u,   h: u   }, // left-bottom
    9:  { x: 0,     y: u,     w: u,   h: u   }, // left-top
    10: { x: 0,     y: 0,     w: u,   h: u   }, // top-left
    11: { x: u*3,   y: 0,     w: u,   h: u   }, // top-right
    12: { x: u*2,   y: u*3,   w: u,   h: u   }, // bottom-right (swap 5/12)
  };

  // North Indian standard layout
  const NI = {
    1:  [u,    0],
    2:  [u*2,  0],
    3:  [u*3,  u],
    4:  [u*2,  u*2], // center-right
    5:  [u*2,  u*3],
    6:  [u,    u*3],
    7:  [0,    u*3],
    8:  [0,    u*2],
    9:  [0,    u],
    10: [0,    0],
    11: [u*3,  0],
    12: [u*3,  u*3],
  };

  // Group planets by house
  const byHouse = {};
  for (let i = 1; i <= 12; i++) byHouse[i] = [];
  planetData.forEach(p => {
    const h = parseInt(p.house);
    if (h >= 1 && h <= 12) byHouse[h].push(p);
  });

  let svg = `<div class="rt-kundli-wrap">
  <div class="rt-kundli-title">Vedic Birth Chart  -  North Indian Style</div>
  <svg viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg" class="rt-kundli-svg">
    <rect width="${s}" height="${s}" fill="#0a0718" rx="4"/>`;

  // Draw outer border
  svg += `<rect x="1" y="1" width="${s-2}" height="${s-2}" fill="none" stroke="#c4a97d" stroke-width="0.8" rx="3"/>`;

  // Draw the cross lines (inner diamond)
  svg += `<line x1="${u}" y1="0" x2="0" y2="${u}" stroke="#c4a97d44" stroke-width="0.5"/>`;
  svg += `<line x1="${u*2}" y1="0" x2="${u*3}" y2="${u}" stroke="#c4a97d44" stroke-width="0.5"/>`;
  svg += `<line x1="${u*3}" y1="${u}" x2="${s}" y2="${u*2}" stroke="#c4a97d44" stroke-width="0.5"/>`;
  svg += `<line x1="${s}" y1="${u*2}" x2="${u*3}" y2="${u*3}" stroke="#c4a97d44" stroke-width="0.5"/>`;
  svg += `<line x1="${u*3}" y1="${u*3}" x2="${u*2}" y2="${s}" stroke="#c4a97d44" stroke-width="0.5"/>`;
  svg += `<line x1="${u*2}" y1="${s}" x2="${u}" y2="${u*3}" stroke="#c4a97d44" stroke-width="0.5"/>`;
  svg += `<line x1="${u}" y1="${u*3}" x2="0" y2="${u*2}" stroke="#c4a97d44" stroke-width="0.5"/>`;
  svg += `<line x1="0" y1="${u*2}" x2="${u}" y2="${u}" stroke="#c4a97d44" stroke-width="0.5"/>`;

  // Grid lines
  svg += `<line x1="${u}" y1="${u}" x2="${u*3}" y2="${u}" stroke="#c4a97d33" stroke-width="0.4"/>`;
  svg += `<line x1="${u}" y1="${u*3}" x2="${u*3}" y2="${u*3}" stroke="#c4a97d33" stroke-width="0.4"/>`;
  svg += `<line x1="${u}" y1="${u}" x2="${u}" y2="${u*3}" stroke="#c4a97d33" stroke-width="0.4"/>`;
  svg += `<line x1="${u*3}" y1="${u}" x2="${u*3}" y2="${u*3}" stroke="#c4a97d33" stroke-width="0.4"/>`;
  // Center cross
  svg += `<line x1="${u*2}" y1="${u}" x2="${u*2}" y2="${u*3}" stroke="#c4a97d22" stroke-width="0.3"/>`;
  svg += `<line x1="${u}" y1="${u*2}" x2="${u*3}" y2="${u*2}" stroke="#c4a97d22" stroke-width="0.3"/>`;

  // House number and planets
  const houseBoxes = {
    1:  { x: u,    y: 0,    cx: u*1.5, cy: u*0.5  },
    2:  { x: u*2,  y: 0,    cx: u*2.5, cy: u*0.5  },
    3:  { x: u*3,  y: u,    cx: u*3.5, cy: u*1.5  },
    4:  { x: u*2,  y: u,    cx: u*2.5, cy: u*1.5  }, // center right
    5:  { x: u*2,  y: u*3,  cx: u*2.5, cy: u*3.5  },
    6:  { x: u,    y: u*3,  cx: u*1.5, cy: u*3.5  },
    7:  { x: 0,    y: u*2,  cx: u*0.5, cy: u*2.5  }, // was bottom-left, now left-bottom
    8:  { x: 0,    y: u,    cx: u*0.5, cy: u*1.5  },
    9:  { x: u,    y: u,    cx: u*1.5, cy: u*1.5  }, // center left
    10: { x: 0,    y: 0,    cx: u*0.5, cy: u*0.5  },
    11: { x: u*3,  y: 0,    cx: u*3.5, cy: u*0.5  },
    12: { x: 0,    y: u*3,  cx: u*0.5, cy: u*3.5  },
  };

  Object.entries(houseBoxes).forEach(([hNum, pos]) => {
    const h = parseInt(hNum);
    const planets = byHouse[h] || [];

    // House number (small, gold)
    svg += `<text x="${pos.cx}" y="${pos.cy - 10}" text-anchor="middle" font-size="7" fill="#c4a97d88" font-family="monospace">${h}</text>`;

    // Planets in this house
    planets.forEach((p, i) => {
      const yOffset = (i - (planets.length - 1) / 2) * 11;
      svg += `<text x="${pos.cx}" y="${pos.cy + yOffset + 4}" text-anchor="middle" font-size="9.5" fill="${p.color}" font-family="monospace" font-weight="bold">${p.symbol}</text>`;
      svg += `<text x="${pos.cx}" y="${pos.cy + yOffset + 13}" text-anchor="middle" font-size="6" fill="${p.color}cc">${p.shortName}</text>`;
    });
  });

  svg += `</svg>`;

  // Legend
  svg += `<div class="rt-kundli-legend">`;
  planetData.forEach(p => {
    svg += `<div class="rt-kundli-legend-item">
      <span style="color:${p.color};font-size:13px;">${p.symbol}</span>
      <span style="color:#cfc8b8;font-size:11px;">${p.shortName}</span>
      <span style="color:#c4a97d77;font-size:10px;">H${p.house}</span>
    </div>`;
  });
  svg += `</div></div>`;
  return svg;
}

// ── Dasha Timeline ──
function renderDashaTimeline(dashaData) {
  // dashaData: [{planet, start, end, isCurrent}]
  if (!dashaData || dashaData.length === 0) return null;

  const colors = {
    'Sun':'#e8943a','Moon':'#c4b8e0','Mars':'#e05555','Mercury':'#5bba8a',
    'Jupiter':'#e8d060','Venus':'#e88ab0','Saturn':'#8ab4c4','Rahu':'#a08060','Ketu':'#90a060'
  };

  let html = `<div class="rt-dasha-wrap">
    <div class="rt-dasha-title">Dasha Timeline</div>
    <div class="rt-dasha-bars">`;

  const total = dashaData.reduce((sum, d) => sum + d.years, 0) || 1;
  dashaData.forEach(d => {
    const pct = ((d.years / total) * 100).toFixed(1);
    const col = colors[d.planet] || '#c4a97d';
    html += `<div class="rt-dasha-row ${d.isCurrent ? 'rt-dasha-current' : ''}">
      <div class="rt-dasha-label" style="color:${col}">${d.planet}</div>
      <div class="rt-dasha-bar-wrap">
        <div class="rt-dasha-bar" style="width:${pct}%;background:${col}44;border-left:3px solid ${col}">
          <span class="rt-dasha-years">${d.years}yr</span>
        </div>
      </div>
      <div class="rt-dasha-dates">${d.start} – ${d.end}</div>
    </div>`;
  });

  html += `</div></div>`;
  return html;
}

// ── Strength meter for doshas ──
function renderDoshaMeter(name, severity, desc) {
  const levels = { 'none':0, 'mild':25, 'moderate':55, 'high':80, 'severe':95, 'cancelled':0 };
  const colors = { 'none':'#5bba8a', 'mild':'#e8d060', 'moderate':'#e8943a', 'high':'#e05555', 'severe':'#c03030', 'cancelled':'#5bba8a' };
  const sKey = severity.toLowerCase();
  const pct = levels[sKey] || 40;
  const col = colors[sKey] || '#c4a97d';

  return `<div class="rt-dosha-card">
    <div class="rt-dosha-header">
      <span class="rt-dosha-name">${name}</span>
      <span class="rt-dosha-sev" style="color:${col}">${severity}</span>
    </div>
    <div class="rt-dosha-bar-bg">
      <div class="rt-dosha-bar-fill" style="width:${pct}%;background:${col}"></div>
    </div>
    ${desc ? `<div class="rt-dosha-desc">${desc}</div>` : ''}
  </div>`;
}

// ── Numerology cards ──
function renderNumCards(nums) {
  // nums: [{label, number, meaning}]
  let html = `<div class="rt-num-grid">`;
  nums.forEach(n => {
    html += `<div class="rt-num-card">
      <div class="rt-num-big">${n.number}</div>
      <div class="rt-num-label">${n.label}</div>
      ${n.meaning ? `<div class="rt-num-meaning">${n.meaning}</div>` : ''}
    </div>`;
  });
  html += `</div>`;
  return html;
}

// ── Inline bold/italic formatter ──
function inlineFormat(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

// ── Parse planetary data from text ──
function parsePlanetData(text) {
  const planets = [];
  const lines = text.split('\n');

  lines.forEach(line => {
    // Match table rows: | Planet | Sign | House | ...
    const match = line.match(/\|\s*\*?\*?(Lagna|Ascendant|Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\*?\*?\s*\|([^|]*)\|([^|]*)\|/i);
    if (match) {
      const name = match[1];
      const sign = match[2].trim();
      const house = match[3].trim().replace(/[^0-9]/g, '') || '1';
      const meta = getPlanetMeta(name);
      planets.push({
        name, house,
        symbol: meta.symbol,
        color: meta.color,
        shortName: name.substring(0, 3)
      });
    }
  });
  return planets;
}

// ── Parse dasha data from text ──
function parseDashaData(text) {
  const dashas = [];
  const lines = text.split('\n');
  const dashaPattern = /(Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)[^0-9]*(\d{4})[^0-9]+(\d{4})/gi;

  lines.forEach(line => {
    let m;
    while ((m = dashaPattern.exec(line)) !== null) {
      const startY = parseInt(m[2]);
      const endY = parseInt(m[3]);
      const now = new Date().getFullYear();
      dashas.push({
        planet: m[1],
        start: m[2],
        end: m[3],
        years: endY - startY,
        isCurrent: now >= startY && now <= endY
      });
    }
  });

  return dashas.slice(0, 9);
}

// ── Parse numerology numbers from text ──
function parseNumerologyData(text) {
  const nums = [];
  const patterns = [
    { label: 'Life Path',   re: /life\s*path\s*(?:number)?[:\s]+(\d+)/i },
    { label: 'Destiny',     re: /destiny\s*(?:number)?[:\s]+(\d+)/i },
    { label: 'Soul Urge',   re: /soul\s*urge\s*(?:number)?[:\s]+(\d+)/i },
    { label: 'Personality', re: /personality\s*(?:number)?[:\s]+(\d+)/i },
    { label: 'Personal Year',re: /personal\s*year\s*(?:number)?[:\s]+(\d+)/i },
  ];
  patterns.forEach(p => {
    const m = text.match(p.re);
    if (m) nums.push({ label: p.label, number: m[1], meaning: '' });
  });
  return nums;
}

// ── Parse dosha data from text ──
function parseDoshaData(text) {
  const doshas = [];
  const patterns = [
    { name: 'Mangal Dosha', re: /mangal\s*dosha[^.]*?(not\s*present|absent|cancelled|nil|none|mild|moderate|high|severe|present)/i },
    { name: 'Kaal Sarpa',   re: /kaal\s*sarpa[^.]*?(not\s*present|absent|cancelled|nil|none|mild|moderate|high|severe|present)/i },
    { name: 'Sade Sati',    re: /sade\s*sati[^.]*?(not\s*active|inactive|none|rising|peak|setting|active)/i },
    { name: 'Pitra Dosha',  re: /pitra\s*dosha[^.]*?(not\s*present|absent|none|mild|moderate|present)/i },
  ];
  patterns.forEach(p => {
    const m = text.match(p.re);
    if (m) {
      let sev = m[1].toLowerCase();
      if (sev.includes('not') || sev.includes('absent') || sev.includes('nil') || sev.includes('none')) sev = 'None';
      else if (sev.includes('cancel')) sev = 'Cancelled';
      else sev = sev.charAt(0).toUpperCase() + sev.slice(1);
      doshas.push({ name: p.name, severity: sev });
    }
  });
  return doshas;
}

// ── Master rich format function ──
// Called by app.js showTab  -  replaces plain formatText for rich rendering
function richFormat(raw, moduleId) {
  // Strip raw markdown artifacts before rendering to screen
  const cleaned = raw
    .replace(/^---+\s*$/gm, '')      // horizontal rules
    .replace(/^===+\s*$/gm, '');     // equals rules
  const lines = cleaned.split('\n');
  const out = [];
  let i = 0;
  let planetChartInserted = false;
  let dashaChartInserted = false;

  // Pre-parse for chart data
  const planetData = (moduleId === 1) ? parsePlanetData(raw) : [];
  const dashaData  = (moduleId === 1 || moduleId === 3) ? parseDashaData(raw) : [];
  const numsData   = (moduleId === 17) ? parseNumerologyData(raw) : [];
  const doshaData  = (moduleId === 8)  ? parseDoshaData(raw) : [];

  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();

    // ── Table detection ──
    if (t.startsWith('|') && i + 1 < lines.length && lines[i+1].trim().startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const tableHTML = renderTable(tableLines);
      if (tableHTML) {
        out.push(tableHTML);

        // After planet table  -  inject kundli wheel
        if (!planetChartInserted && planetData.length > 0 && tableLines.some(l => /planet|graha/i.test(l))) {
          out.push(renderKundliWheel(planetData));
          planetChartInserted = true;
        }
        continue;
      }
    }

    // ── Dasha timeline injection (after seeing dasha section heading) ──
    if (!dashaChartInserted && dashaData.length > 0 && /dasha|mahadasha/i.test(t) && /^##/.test(t)) {
      // Will inject after processing this heading
    }

    // ── Numerology cards injection ──
    if (moduleId === 17 && numsData.length >= 2 && /15\.1|core numbers/i.test(t)) {
      out.push(renderNumCards(numsData));
    }

    // ── Dosha meter injection ──
    if (moduleId === 8 && doshaData.length > 0 && /8\.1|mangal dosha/i.test(t)) {
      let doshaHTML = `<div class="rt-dosha-grid">`;
      doshaData.forEach(d => { doshaHTML += renderDoshaMeter(d.name, d.severity, ''); });
      doshaHTML += `</div>`;
      out.push(doshaHTML);
    }

    // Empty line
    if (!t) { out.push('<br/>'); i++; continue; }

    // ## Heading
    if (/^## /.test(t)) {
      const heading = t.replace(/^## /, '');
      out.push(`<span class="mod-h2">${inlineFormat(heading)}</span>`);

      // Inject dasha chart after dasha heading
      if (!dashaChartInserted && dashaData.length > 0 && /dasha/i.test(heading)) {
        out.push(renderDashaTimeline(dashaData));
        dashaChartInserted = true;
      }
    }
    // ### subheading
    else if (/^### /.test(t)) {
      out.push(`<span class="mod-h3">${inlineFormat(t.replace(/^### /, ''))}</span>`);
    }
    // #### or **bold heading** standalone line
    else if (/^####? /.test(t)) {
      out.push(`<span class="mod-h3">${inlineFormat(t.replace(/^####? /, ''))}</span>`);
    }
    // Bottom line
    else if (/^bottom line:/i.test(t)) {
      const content = inlineFormat(t.replace(/^bottom line:\s*/i, ''));
      out.push(`<span class="mod-bottomline"><span class="mod-bottomline-label">Bottom line</span>${content}</span>`);
    }
    // Bullet
    else if (/^[-•*] /.test(t)) {
      out.push(`<span class="mod-bullet">${inlineFormat(t.replace(/^[-•*] /, ''))}</span>`);
    }
    // Numbered
    else if (/^\d+\.\s/.test(t)) {
      const num = t.match(/^(\d+\.)/)[1];
      const content = inlineFormat(t.replace(/^\d+\.\s/, ''));
      out.push(`<span class="mod-bullet"><strong class="mod-num">${num}</strong>${content}</span>`);
    }
    // Bold standalone
    else if (/^\*\*[^*]+\*\*$/.test(t)) {
      out.push(`<strong class="mod-bold-line">${t.replace(/\*\*(.*?)\*\*/g, '$1')}</strong>`);
    }
    // Normal text
    else {
      out.push(`<span class="mod-para">${inlineFormat(t)}</span>`);
    }

    i++;
  }

  return `<div class="result-text">${out.join('\n')}</div>`;
}
