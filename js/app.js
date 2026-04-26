/* ── Jyotish  -  Vedic Master Reading ── */

// ── Module Definitions ──
const MODULES = [
  { id: 1,  name: 'Birth Chart & Vedic Kundli',       tag: 'core',     img: false, desc: 'Your complete Vedic birth chart with all 9 planetary positions, house placements, key yogas, current Mahadasha, and the single defining feature of your chart.' },
  { id: 2,  name: 'Nakshatra Deep Dive',              tag: 'identity', img: false, desc: 'Your Moon Nakshatra decoded at the deepest level, covering mythology, ruling deity, shadow wounds, compatible Nakshatras for love and work, and famous personalities who share your star.' },
  { id: 3,  name: 'Master Timeline: 3 Years',        tag: 'timing',   img: false, desc: 'Exact date windows for career pivots, wealth spikes, and relationship shifts. Identifies the single highest-leverage 6-month window and the most dangerous 3 months to avoid bold moves.' },
  { id: 4,  name: 'Career & Wealth Architecture',     tag: 'career',   img: false, desc: 'Where your real money comes from: salary, entrepreneurship, or foreign markets. Career trajectory, 2–3 critical turning points, investment risk windows, and real estate timing.' },
  { id: 5,  name: 'Geographic Vector',                tag: 'location', img: false, desc: 'Does your chart demand leaving your birth city for maximum potential? 2–3 optimal geographies identified with reasoning. Relocation target assessed if provided.' },
  { id: 6,  name: 'Marriage Blueprint',               tag: 'marriage', img: false, desc: 'Predicted marriage window, spouse type, phonetic name frequency codes for compatibility, and 3 non-negotiable psychological traits your ideal partner must have.' },
  { id: 7,  name: 'Relationship Dynamics',            tag: 'partner',  img: false, desc: 'Your relationship archetype, Venus–Mars tension map, emotional availability score, past-life love karma, and the gap between who you chase and who you actually need.' },
  { id: 8,  name: 'Dosha Analysis',                   tag: 'doshas',   img: false, desc: 'Full diagnostic for Mangal Dosha, Kaal Sarpa, Sade Sati, and Pitra Dosha  -  severity ratings, exact effects, cancellation checks, and targeted remedies for each active affliction.' },
  { id: 9,  name: 'Karma & Past Life',                tag: 'karma',    img: false, desc: 'Three karma layers decoded: Sanchita, Prarabdha, Kriyamana. Your past-life role, the gift carried forward, the unresolved wound, and the one mindset shift that breaks the karmic loop.' },
  { id: 10, name: 'Divisional Charts (D9/D10/D7)',    tag: 'advanced', img: false, desc: 'Navamsha reveals your soul-level strengths and spouse reality. Dashamsha shows your true professional destiny. Saptamsha reads children, creative legacy, and what you will be remembered for.' },
  { id: 11, name: 'Children & Fertility',             tag: 'family',   img: false, desc: 'Timing windows for conception or adoption, fertility indicators, number of children suggested by the chart, and your creative legacy if children are not the focus.' },
  { id: 12, name: 'Life Areas Dashboard',             tag: 'overview', img: false, desc: 'All 8 life domains rated Strong, Medium, or Weak across Love, Career, Wealth, Health, Foreign Prospects, Spiritual Clarity, Children, and Karma Clearance Progress.' },
  { id: 13, name: 'Biological Reset Protocol',        tag: 'health',   img: false, desc: 'Maps current planetary stress to your physical symptoms. A strict 48-hour reset plan covering sleep, diet, movement, and digital hygiene, plus your single highest-cortisol trigger.' },
  { id: 14, name: 'Medical Astrology',                tag: 'health',   img: false, desc: 'Constitutional type (Vata/Pitta/Kapha), organ systems under stress, 6th and 8th house health vulnerabilities, mental health indicators, and 3 specific preventive actions to take now.' },
  { id: 15, name: 'Varshaphal: This Year',           tag: 'forecast', img: false, desc: 'Solar return chart for your current year, covering the dominant theme, career and wealth outlook, relationship developments, 2 best months to act, 2 most volatile months, and one likely event before your next birthday.' },
  { id: 16, name: 'Muhurta Timing',                   tag: 'timing',   img: false, desc: 'Auspicious windows in the next 6 months for launching a business, signing contracts, starting a relationship, investing, or relocating, plus dates to completely avoid.' },
  { id: 17, name: 'Numerology Integration',           tag: 'numbers',  img: false, desc: 'Life Path, Destiny, Soul Urge, and Personality numbers calculated. Current Personal Year cycle, name alignment check, and cross-match between your numerology and Vedic chart.' },
  { id: 18, name: 'Lal Kitab Overlay',                tag: 'remedies', img: false, desc: 'North Indian practical astrology covering the top 3 planetary placements creating the biggest effects, ancestral debt diagnosis, and 3 immediately actionable remedies requiring no ritual expertise.' },
  { id: 19, name: 'Handwriting Analysis',             tag: 'image',    img: true,  imgKey: 'handwriting', desc: 'Upload a handwriting sample. Baseline, pressure, letter formation, size, zones, and signature all decoded. 3 dominant personality traits and 2 suppressed tendencies revealed.' },
  { id: 20, name: 'Palm Reading',                     tag: 'image',    img: true,  imgKey: 'palm',        desc: 'Upload a palm photo. The Life, Head, Heart, and Fate lines read in full. Mounts analysis, travel and relationship line indicators, cross-validated against your birth chart.' },
  { id: 21, name: 'Face Reading (Physiognomy)',       tag: 'image',    img: true,  imgKey: 'face',        desc: 'Upload a face photo. Face shape, forehead, eyes, nose, mouth, jaw decoded. 2 suppressed traits visible in the face identified, cross-validated with your Lagna and Moon sign.' },
  { id: 22, name: 'Gemstone & Remedial Protocol',     tag: 'remedies', img: false, desc: '2–3 gemstone recommendations with weight, metal, finger, and wearing day. Planet mantras, fasting protocols, and Rudraksha bead recommendation, including contraindication warnings.' },
  { id: 23, name: 'Executive Summary & Power Move',   tag: 'synthesis',img: false, desc: 'All modules synthesised into 10 ranked findings. Life areas snapshot table. One non-negotiable action to take today, drawn from the intersection of your Dasha, karma, numerology, palm, and face reading.' },
];

const DEFAULT_ON = new Set([1, 2, 3, 4, 23]);
const selected = new Set(DEFAULT_ON);
const uploadedImages = {};
let readingResults = {};
let currentTab = null;
let activeProvider = 'claude'; // 'claude' | 'gemini'

// ── Provider Toggle ──
function setProvider(p) {
  activeProvider = p;
  // Re-render tabs
  const providers = ['claude','gemini','groq','openrouter','mistral','cohere'];
  const el = document.getElementById('provider-tabs');
  if (el) {
    el.innerHTML = providers.map(pr => `
      <button class="prov-tab ${pr === p ? 'active' : ''}" id="prov-${pr}" onclick="setProvider('${pr}')">${pr.charAt(0).toUpperCase()+pr.slice(1)}</button>
    `).join('');
  }

  const input = document.getElementById('f-apikey');
  if (!input) return;
  const placeholders = {
    claude: 'sk-ant-...', gemini: 'AIza...', groq: 'gsk_...',
    openrouter: 'sk-or-...', mistral: 'ms-...', cohere: 'co-...'
  };
  input.placeholder = placeholders[p] || 'Paste your API key here';
  input.value = '';
}

// ── Star Field ──
function generateStars() {
  const field = document.getElementById('stars');
  if (!field) return;
  const count = 120;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --d: ${2 + Math.random() * 4}s;
      --delay: ${Math.random() * 4}s;
      opacity: ${0.2 + Math.random() * 0.6};
      width: ${Math.random() > 0.85 ? 2 : 1.5}px;
      height: ${Math.random() > 0.85 ? 2 : 1.5}px;
    `;
    field.appendChild(s);
  }
}

// ── Module Overview Grid ──
function renderModuleOverview() {
  const grid = document.getElementById('module-overview-grid');
  if (!grid) return;
  grid.innerHTML = MODULES.map(m => `
    <div class="module-card ${m.img ? 'has-image' : ''}">
      <div class="module-card-num">${String(m.id).padStart(2, '0')}</div>
      <div class="module-card-name">${m.name}</div>
      <div class="module-card-tag">${m.img ? '⬡ image required' : m.tag}</div>
      ${m.desc ? `<div class="module-card-tooltip">${m.desc}</div>` : ''}
    </div>
  `).join('');
}

// ── Module Chips ──
function renderChips() {
  const container = document.getElementById('mod-chips');
  if (!container) return;
  container.innerHTML = MODULES.map(m => {
    const isOn = selected.has(m.id);
    const imgLocked = m.img && !uploadedImages[m.imgKey];
    return `
      <div class="mchip ${isOn ? 'on' : ''} ${m.img ? 'img-req' : ''} ${imgLocked ? 'img-locked' : ''}"
           data-id="${m.id}"
           onclick="toggleChip(${m.id}, ${m.img}, '${m.imgKey || ''}')">
        ${m.name}
      </div>
    `;
  }).join('');
  updateModCount();
}

function toggleChip(id, isImg, imgKey) {
  if (isImg && !uploadedImages[imgKey]) return; // locked until image is uploaded
  if (selected.has(id)) {
    if (id === 1 || id === 23) return; // can't deselect core
    selected.delete(id);
  } else {
    selected.add(id);
  }
  renderChips();
}

function toggleAllMods(on) {
  MODULES.forEach(m => {
    if (on) {
      if (!m.img || uploadedImages[m.imgKey]) selected.add(m.id);
    } else {
      if (m.id !== 1 && m.id !== 23) selected.delete(m.id);
    }
  });
  renderChips();
}

function updateModCount() {
  const el = document.getElementById('mod-count');
  if (el) el.textContent = `${selected.size} selected`;
}

// ── Image Uploads ──
function handleUpload(key, input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImages[key] = {
      data: e.target.result.split(',')[1],
      type: file.type,
      name: file.name
    };

    // Update UI
    const boxId = key === 'palmLeft' ? 'ub-palm-left' : key === 'palmRight' ? 'ub-palm-right' : `ub-${key}`;
    const box = document.getElementById(boxId);
    if (box) box.classList.add('has-file');

    const prevId = key === 'palmLeft' ? 'prev-palm-left' : key === 'palmRight' ? 'prev-palm-right' : `prev-${key}`;
    const prev = document.getElementById(prevId);
    if (prev) prev.innerHTML = `
      <img src="${e.target.result}" alt="uploaded" />
      <div class="upload-status">✓ ${file.name}</div>
    `;

    // For palm chips: unlock when either palm is uploaded
    if (key === 'palmLeft' || key === 'palmRight') {
      uploadedImages['palm'] = uploadedImages[key]; // keep backward compat
    }

    renderChips(); // unlock image-req chips
  };
  reader.readAsDataURL(file);
}

// ── Form Helpers ──
function gv(id) {
  const el = document.getElementById(id);
  if (!el) return '';
  // Strip invisible/non-printable unicode characters that break fetch headers
  return el.value.replace(/[^ -~]/g, '').trim();
}

function validate() {
  const required = [
    ['f-name', 'Full Name'],
    ['f-dob', 'Date of Birth'],
    ['f-tob', 'Time of Birth'],
    ['f-pob', 'Place of Birth'],
    ['f-city', 'Current City'],
    ['f-career', 'Career'],
    ['f-state', 'Current State'],
    ['f-apikey', 'API Key'],
  ];
  return required.filter(([id]) => !gv(id)).map(([, label]) => label);
}

// ── Prompt Builder ──
function buildPrompt(subject, modIds) {
  const modList = modIds
    .map(id => {
      const m = MODULES.find(x => x.id === id);
      return m ? `Module ${id}: ${m.name}` : null;
    })
    .filter(Boolean)
    .join('\n');

  const partnerLine = subject.partner
    ? `Partner Name + DOB: ${subject.partner}`
    : 'No partner data provided. Running Tier 1 only for Module 7.';

  return `You are delivering a complete Vedic master reading. This is not a generic horoscope. Every sentence must reference a specific planet, house, nakshatra, yoga, or dasha period. No vague reassurances. No padding. No em dashes.

SUBJECT DATA:
Full Name: ${subject.name}
Date of Birth: ${subject.dob}
Exact Time of Birth: ${subject.tob}
Place of Birth: ${subject.pob}
Current City: ${subject.city}
Career/Industry: ${subject.career}
Current Mental and Physical State: ${subject.state}
${partnerLine}
${subject.reloc ? 'Relocation Target: ' + subject.reloc : ''}
${subject.question ? 'PRIMARY QUESTION (answer this above everything else): ' + subject.question : ''}
Today: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

MODULES TO DELIVER:
${modList}

WRITING RULES (follow these exactly):
1. Calculate the Vedic birth chart from the data provided. State all 9 planetary positions with sign, house, and nakshatra. Do this first in Module 1.
2. Use ## for section headings and ### for sub-headings. Use numbered lists for sequential insights. Use bullet points for supporting evidence only.
3. Every prediction must cite its planetary basis. "Your career shifts in Q3 2026 because Saturn transits your 10th house lord in Revati nakshatra" not "career changes are coming."
4. Timing must be specific. Name the year and quarter. Name the Mahadasha and Antardasha running at that time.
5. Each module ends with exactly one "Bottom line:" paragraph. One definitive, time-bound sentence. No hedging.
6. No em dashes anywhere. Use commas or full stops.
7. Do not say: "it's important to note", "it's worth mentioning", "as an AI", "I should point out", "fascinating", "delve", "navigate", "tapestry", "in conclusion", or any similar filler.
8. Write in short sentences. 15 words max per sentence wherever possible.
9. For image modules: describe what you physically observe first, then interpret. Be specific about line characteristics, letter formations, or facial features.
10. Module 23 must synthesise findings into exactly 10 numbered insights and one specific action to take before the end of this week.
${modIds.includes(19) ? '11. Module 19 (Handwriting): name the baseline type, pressure level, zone dominance, and slant direction. Then interpret each.' : ''}
${modIds.includes(20) ? '12. Module 20 (Palm): analyse left and right hands separately if both provided. Name each major line and describe its length, depth, breaks, and branches before interpreting.' : ''}
${modIds.includes(21) ? '13. Module 21 (Face): describe the face shape, then analyse forehead lines, eye spacing, nose bridge, lip fullness, and jaw structure individually before interpreting.' : ''}

Deliver the reading now, module by module, in the order listed above.`;
}

// ── Build Messages Array (with optional images) ──
function buildMessages(prompt, modIds) {
  // Strip characters that break HTTP headers (keep unicode in body  -  body is fine, only headers fail)
  const content = [];

  // Add images if modules require them
  if (modIds.includes(19) && uploadedImages.handwriting) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: uploadedImages.handwriting.type, data: uploadedImages.handwriting.data }
    });
    content.push({ type: 'text', text: 'This is the handwriting sample for Module 19 analysis.' });
  }
  if (modIds.includes(20) && (uploadedImages.palmLeft || uploadedImages.palmRight || uploadedImages.palm)) {
    if (uploadedImages.palmLeft) {
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: uploadedImages.palmLeft.type, data: uploadedImages.palmLeft.data }
      });
      content.push({ type: 'text', text: 'This is the LEFT palm image for Module 20 analysis. Left hand = karmic blueprint.' });
    }
    if (uploadedImages.palmRight) {
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: uploadedImages.palmRight.type, data: uploadedImages.palmRight.data }
      });
      content.push({ type: 'text', text: 'This is the RIGHT palm image for Module 20 analysis. Right hand = active destiny.' });
    }
    if (!uploadedImages.palmLeft && !uploadedImages.palmRight && uploadedImages.palm) {
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: uploadedImages.palm.type, data: uploadedImages.palm.data }
      });
      content.push({ type: 'text', text: 'This is the palm image for Module 20 analysis.' });
    }
  }
  if (modIds.includes(21) && uploadedImages.face) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: uploadedImages.face.type, data: uploadedImages.face.data }
    });
    content.push({ type: 'text', text: 'This is the face photo for Module 21 analysis.' });
  }

  content.push({ type: 'text', text: prompt });
  return [{ role: 'user', content }];
}

// ── Main Reading Runner ──
async function runReading() {
  const missing = validate();
  const errEl = document.getElementById('err-area');

  if (missing.length) {
    errEl.innerHTML = `<div class="err-msg">Please fill in: ${missing.join(', ')}</div>`;
    return;
  }
  errEl.innerHTML = '';

  const subject = {
    name: gv('f-name'), dob: gv('f-dob'), tob: gv('f-tob'),
    pob: gv('f-pob'), city: gv('f-city'), career: gv('f-career'),
    state: gv('f-state'), partner: gv('f-partner'),
    reloc: gv('f-reloc'), question: gv('f-question'),
  };
  const apiKey = gv('f-apikey');
  const modIds = [...selected].sort((a, b) => a - b);

  // Show results section
  document.getElementById('results-section').style.display = 'block';
  document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });

  // Set meta
  document.getElementById('results-meta').textContent =
    `${subject.name} · ${subject.dob} · ${modIds.length} modules · ${new Date().toLocaleTimeString()}`;

  // Disable button with live progress cycling
  const btn = document.getElementById('run-btn');
  const btnText = document.getElementById('btn-text');
  btn.disabled = true;

  const progressMsgs = [
    'Casting your birth chart...',
    'Mapping planetary positions...',
    'Reading your Mahadasha...',
    'Analysing karmic patterns...',
    'Decoding your Nakshatra...',
    'Calculating Dasha timeline...',
    'Running all modules...',
    'Synthesising your blueprint...',
  ];
  let progIdx = 0;
  btnText.textContent = progressMsgs[0];
  const progInterval = setInterval(() => {
    progIdx = (progIdx + 1) % progressMsgs.length;
    btnText.textContent = progressMsgs[progIdx];
  }, 2800);

  // Show loading
  document.getElementById('result-content').innerHTML = `
    <div class="result-loading">
      <span class="loading-mandala">☽</span>
      <p>Calculating your cosmic blueprint...</p>
      <div class="loading-bar"><div class="loading-fill"></div></div>
    </div>`;
  document.getElementById('result-tabs').innerHTML = '';

  readingResults = {};
  let completedBatches = 0;

  // Pre-render all tabs immediately as "loading" state
  const batches = chunkArray(modIds, 4);
  renderTabsLoading(modIds);

  // Stagger batches  -  2 at a time with a small delay to avoid rate limits
  const CONCURRENCY = 2;
  const delay = ms => new Promise(res => setTimeout(res, ms));

  async function runBatch(batch, idx) {
    // Stagger start: each pair waits 800ms per slot
    await delay(Math.floor(idx / CONCURRENCY) * 800);
    const prompt = buildPrompt(subject, batch);
    try {
      let text = '';
      text = await callAPI(apiKey, prompt, batch);
      batch.forEach(id => {
        const m = MODULES.find(x => x.id === id);
        if (!m) return;
        readingResults[id] = { name: m.name, text: extractModuleText(text, id, m.name) };
        markTabReady(id);
      });
    } catch (e) {
      // Retry once after 3s if rate limited
      const isRateLimit = e.message && (e.message.includes('529') || e.message.includes('rate') || e.message.includes('overloaded'));
      if (isRateLimit) {
        updateProgressText('Rate limit hit  -  retrying batch in 5s...');
        await delay(5000);
        try {
          let text = '';
          text = await callAPI(apiKey, prompt, batch);
          batch.forEach(id => {
            const m = MODULES.find(x => x.id === id);
            if (!m) return;
            readingResults[id] = { name: m.name, text: extractModuleText(text, id, m.name) };
            markTabReady(id);
          });
        } catch (e2) {
          batch.forEach(id => {
            const m = MODULES.find(x => x.id === id);
            readingResults[id] = { name: m ? m.name : '', text: 'Error: ' + e2.message + '\n\nTip: Try selecting fewer modules at once, or switch to Gemini (free, higher limits).' };
            markTabReady(id);
          });
        }
      } else {
        batch.forEach(id => {
          const m = MODULES.find(x => x.id === id);
          readingResults[id] = { name: m ? m.name : '', text: 'Error: ' + e.message };
          markTabReady(id);
        });
      }
    }
    completedBatches++;
    updateProgress(completedBatches, batches.length, modIds.length);
  }

  const batchPromises = batches.map((batch, idx) => runBatch(batch, idx));

  // Show first result as soon as any batch completes
  await Promise.all(batchPromises);

  // Final: if no tab is active yet, show first
  if (!currentTab || !readingResults[currentTab]) {
    const firstDone = modIds.find(id => readingResults[id]);
    if (firstDone) showTab(firstDone);
  }

  btnText.textContent = 'Generate My Reading';
  btn.disabled = false;
  clearInterval(progInterval);
  document.getElementById('progress-bar-wrap') && (document.getElementById('progress-bar-wrap').style.display = 'none');
}

function renderTabsLoading(modIds) {
  const tabsEl = document.getElementById('result-tabs');
  tabsEl.innerHTML = modIds.map((id, i) => {
    const m = MODULES.find(x => x.id === id);
    return `<div class="rtab loading-tab ${i === 0 ? 'active' : ''}" onclick="showTab(${id})" data-tab="${id}" id="tab-${id}">
      <span class="tab-dot"></span>${m ? m.name : id}
    </div>`;
  }).join('');

  // Show global loading in content
  document.getElementById('result-content').innerHTML = `
    <div class="result-loading">
      <span class="loading-mandala">☽</span>
      <p id="progress-text">Running ${modIds.length} modules in parallel...</p>
      <div class="loading-bar"><div class="loading-fill" id="loading-fill"></div></div>
      <p class="progress-sub" id="progress-sub">Results appear as each batch completes</p>
    </div>`;
  currentTab = modIds[0];
}

function markTabReady(id) {
  const tab = document.getElementById('tab-' + id);
  if (tab) {
    tab.classList.remove('loading-tab');
    tab.classList.add('ready-tab');
    tab.querySelector('.tab-dot') && (tab.querySelector('.tab-dot').className = 'tab-dot done');
  }
  // If this is the currently viewed tab or no tab shown yet, render it
  if (!currentTab || currentTab === id || !readingResults[currentTab]) {
    currentTab = id;
    document.querySelectorAll('.rtab').forEach(t => t.classList.toggle('active', +t.dataset.tab === id));
    const rendered = (typeof richFormat === 'function')
      ? richFormat(readingResults[id].text, id)
      : `<div class="result-text">${formatText(readingResults[id].text)}</div>`;
    document.getElementById('result-content').innerHTML = rendered;
  }
}

function updateProgress(done, total, totalMods) {
  const pct = Math.round((done / total) * 100);
  const fill = document.getElementById('loading-fill');
  if (fill) fill.style.width = pct + '%';
  const pt = document.getElementById('progress-text');
  if (pt) pt.textContent = done === total
    ? 'All ' + totalMods + ' modules complete'
    : done + ' of ' + total + ' batches complete...';
}

function updateProgressText(msg) {
  const pt = document.getElementById('progress-text');
  if (pt) pt.textContent = msg;
}

// ── API Providers ──

const SYSTEM_PROMPT = `You are a senior Vedic astrologer, palmist, and behavioral analyst with 25 years of practice. You write the way an elite human mentor speaks: direct, precise, occasionally blunt. You cite specific planetary positions, house numbers, and nakshatra names in every claim. You never pad. You never use em dashes. You do not say "it's important to note", "it is worth mentioning", "in conclusion", "as we can see", "fascinating", or any phrase that signals AI-generated text. You write in short, punchy sentences. Each paragraph earns its place. When you analyse a palm or handwriting, you describe what you see physically first, then interpret it. When you give timing predictions, you give year and quarter, not vague windows. You end every module with a single "Bottom line:" sentence that is non-negotiable and time-specific. Sound like a human who has read 10,000 charts.`;

const PROVIDERS = {
  claude:     { models: ['claude-sonnet-4-6', 'claude-haiku-4-5-20251001'] },
  gemini:     { models: ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'] },
  groq:       { models: ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'] },
  openrouter: { models: ['meta-llama/llama-3.3-70b-instruct:free', 'mistralai/mistral-7b-instruct:free', 'google/gemma-2-9b-it:free'] },
  mistral:    { models: ['mistral-large-latest', 'mistral-small-latest', 'open-mistral-7b'] },
  cohere:     { models: ['command-r-plus', 'command-r', 'command-light'] },
};

function getSelectedModel() {
  const sel = document.getElementById('f-model');
  const cfg = PROVIDERS[activeProvider];
  if (sel && sel.value) return sel.value;
  return cfg && cfg.models ? cfg.models[0] : '';
}

async function callAPI(apiKey, prompt, modIds) {
  switch (activeProvider) {
    case 'claude':     return callClaude(apiKey, prompt, modIds);
    case 'gemini':     return callGemini(apiKey, prompt, modIds);
    case 'groq':       return callGroq(apiKey, prompt, modIds);
    case 'openrouter': return callOpenRouter(apiKey, prompt, modIds);
    case 'mistral':    return callMistral(apiKey, prompt, modIds);
    case 'cohere':     return callCohere(apiKey, prompt, modIds);
    default:           throw new Error('Unknown provider: ' + activeProvider);
  }
}

async function callClaude(apiKey, prompt, modIds) {
  const messages = buildMessages(prompt, modIds);
  const safeKey = apiKey.replace(/[^\x00-\xFF]/g, '').trim();
  const model = getSelectedModel() || 'claude-sonnet-4-6';
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': safeKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({ model, max_tokens: 4000, system: SYSTEM_PROMPT, messages }),
  });
  if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error?.message || 'HTTP '+res.status); }
  const data = await res.json();
  return (data.content || []).map(b => b.text || '').join('');
}

async function callGemini(apiKey, prompt, modIds) {
  const parts = [];
  if (modIds.includes(19) && uploadedImages.handwriting) {
    parts.push({ inline_data: { mime_type: uploadedImages.handwriting.type, data: uploadedImages.handwriting.data } });
    parts.push({ text: 'Handwriting sample for Module 19.' });
  }
  if (modIds.includes(20) && (uploadedImages.palmLeft || uploadedImages.palmRight || uploadedImages.palm)) {
    if (uploadedImages.palmLeft) {
      parts.push({ inline_data: { mime_type: uploadedImages.palmLeft.type, data: uploadedImages.palmLeft.data } });
      parts.push({ text: 'LEFT palm image for Module 20. Left = karmic blueprint.' });
    }
    if (uploadedImages.palmRight) {
      parts.push({ inline_data: { mime_type: uploadedImages.palmRight.type, data: uploadedImages.palmRight.data } });
      parts.push({ text: 'RIGHT palm image for Module 20. Right = active destiny.' });
    }
    if (!uploadedImages.palmLeft && !uploadedImages.palmRight && uploadedImages.palm) {
      parts.push({ inline_data: { mime_type: uploadedImages.palm.type, data: uploadedImages.palm.data } });
      parts.push({ text: 'Palm image for Module 20.' });
    }
  }
  if (modIds.includes(21) && uploadedImages.face) {
    parts.push({ inline_data: { mime_type: uploadedImages.face.type, data: uploadedImages.face.data } });
    parts.push({ text: 'Face photo for Module 21.' });
  }
  parts.push({ text: prompt });
  const safeKey = apiKey.replace(/[^\x00-\xFF]/g, '').trim();
  const model = getSelectedModel() || 'gemini-2.0-flash';
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + safeKey;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts }],
      generationConfig: { maxOutputTokens: 4000, temperature: 0.7 },
    }),
  });
  if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error?.message || 'HTTP '+res.status); }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || 'No response received.';
}

async function callGroq(apiKey, prompt, modIds) {
  const safeKey = apiKey.replace(/[^\x00-\xFF]/g, '').trim();
  const model = getSelectedModel() || 'llama-3.3-70b-versatile';
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + safeKey },
    body: JSON.stringify({ model, max_tokens: 4000, temperature: 0.7, messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: prompt }] }),
  });
  if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error?.message || 'HTTP '+res.status); }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'No response received.';
}

async function callOpenRouter(apiKey, prompt, modIds) {
  const safeKey = apiKey.replace(/[^\x00-\xFF]/g, '').trim();
  const model = getSelectedModel() || 'meta-llama/llama-3.3-70b-instruct:free';
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + safeKey, 'HTTP-Referer': window.location.origin, 'X-Title': 'Jyotish Vedic Reading' },
    body: JSON.stringify({ model, max_tokens: 4000, messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: prompt }] }),
  });
  if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error?.message || 'HTTP '+res.status); }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'No response received.';
}

async function callMistral(apiKey, prompt, modIds) {
  const safeKey = apiKey.replace(/[^\x00-\xFF]/g, '').trim();
  const model = getSelectedModel() || 'mistral-large-latest';
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + safeKey },
    body: JSON.stringify({ model, max_tokens: 4000, messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: prompt }] }),
  });
  if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error?.message || 'HTTP '+res.status); }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'No response received.';
}

async function callCohere(apiKey, prompt, modIds) {
  const safeKey = apiKey.replace(/[^\x00-\xFF]/g, '').trim();
  const model = getSelectedModel() || 'command-r-plus';
  const res = await fetch('https://api.cohere.com/v2/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + safeKey },
    body: JSON.stringify({ model, max_tokens: 4000, messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: prompt }] }),
  });
  if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error?.message || 'HTTP '+res.status); }
  const data = await res.json();
  return data.message?.content?.[0]?.text || data.choices?.[0]?.message?.content || 'No response received.';
}



function extractModuleText(fullText, id, name) {
  // Try to find the module section in the full response
  const patterns = [
    new RegExp(`MODULE\\s*${id}[^\\n]*\\n([\\s\\S]*?)(?=MODULE\\s*\\d|$)`, 'i'),
    new RegExp(`##\\s*Module\\s*${id}[^\\n]*\\n([\\s\\S]*?)(?=##\\s*Module\\s*\\d|$)`, 'i'),
    new RegExp(`\\*\\*Module\\s*${id}[^\\n]*\\*\\*\\n([\\s\\S]*?)(?=\\*\\*Module\\s*\\d|$)`, 'i'),
  ];
  for (const p of patterns) {
    const match = fullText.match(p);
    if (match) return match[0].trim();
  }
  return fullText; // fallback: return full text for single-module batches
}

function renderResults(modIds) {
  // Render tabs
  const tabsEl = document.getElementById('result-tabs');
  tabsEl.innerHTML = modIds.map((id, i) => {
    const m = MODULES.find(x => x.id === id);
    return `<div class="rtab ${i === 0 ? 'active' : ''}" onclick="showTab(${id})" data-tab="${id}">${m ? m.name : id}</div>`;
  }).join('');

  // Show first tab
  if (modIds.length > 0) showTab(modIds[0]);
}

function showTab(id) {
  currentTab = id;
  document.querySelectorAll('.rtab').forEach(t => {
    t.classList.toggle('active', +t.dataset.tab === id);
  });

  const result = readingResults[id];
  const contentEl = document.getElementById('result-content');

  if (!result) {
    contentEl.innerHTML = `<div class="result-loading"><span class="loading-mandala">☽</span><p>Loading...</p></div>`;
    return;
  }

  // Use richFormat if available, fallback to formatText
  const rendered = (typeof richFormat === 'function')
    ? richFormat(result.text, id)
    : `<div class="result-text">${formatText(result.text)}</div>`;

  contentEl.innerHTML = rendered;
  contentEl.scrollTop = 0;
  // Scroll results section into view smoothly
  contentEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function formatText(raw) {
  // Strip raw markdown artifacts
  let text = raw
    .replace(/^---+\s*$/gm, '')
    .replace(/^===+\s*$/gm, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Process line by line for clean output
  const lines = text.split(/\n/);
  const out = [];

  lines.forEach(line => {
    const t = line.trim();
    if (!t) { out.push('<br/>'); return; }

    // ## Heading
    if (/^## /.test(t)) {
      out.push(`<span class="mod-h2">${t.replace(/^## /, '')}</span>`);
    }
    // ### Subheading
    else if (/^### /.test(t)) {
      out.push(`<span class="mod-h3">${t.replace(/^### /, '')}</span>`);
    }
    // Bottom line
    else if (/^bottom line:/i.test(t)) {
      const content = t.replace(/^bottom line:\s*/i, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      out.push(`<span class="mod-bottomline"><span class="mod-bottomline-label">Bottom line</span>${content}</span>`);
    }
    // Bullet point
    else if (/^[-•*] /.test(t)) {
      const content = t.replace(/^[-•*] /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      out.push(`<span class="mod-bullet">${content}</span>`);
    }
    // Numbered list
    else if (/^\d+\.\s/.test(t)) {
      const num = t.match(/^(\d+\.)/)[1];
      const content = t.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      out.push(`<span class="mod-bullet"><strong style="color:#c4a97d;margin-right:4px;">${num}</strong>${content}</span>`);
    }
    // Bold only line
    else if (/^\*\*.*\*\*$/.test(t)) {
      out.push(`<strong>${t.replace(/\*\*(.*?)\*\*/g, '$1')}</strong><br/>`);
    }
    // Normal line
    else {
      const content = t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      out.push(content + '<br/>');
    }
  });

  return out.join('\n');
}

// ── Utils ──
function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

function scrollToForm() {
  document.getElementById('reading-form').scrollIntoView({ behavior: 'smooth' });
}

function newReading() {
  document.getElementById('results-section').style.display = 'none';
  document.getElementById('reading-form').scrollIntoView({ behavior: 'smooth' });
}

// ── PDF Export (Full Rewrite) ──
let _pdfBlob = null; // store for iframe preview

function triggerPDFDownload() {
  if (!_pdfBlob) return;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(_pdfBlob);
  const subjectName = document.getElementById('f-name').value.trim() || 'Subject';
  a.download = 'Jyotish-Reading-' + subjectName.replace(/\s+/g,'-') + '-' + new Date().toISOString().slice(0,10) + '.pdf';
  a.click();
}

async function exportPDF() {
  if (!Object.keys(readingResults).length) return;

  const btn = document.getElementById('pdf-btn');
  btn.disabled = true;
  btn.innerHTML = '<span>⏳</span> Building PDF...';

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const W = 210, H = 297;
    const mL = 16, mR = 16, mT = 18, mB = 22;
    const cW = W - mL - mR;

    // ── Colour palette ──
    const BG         = [8,   5,  18];
    const GOLD       = [196, 169, 125];
    const GOLD_LT    = [232, 213, 163];
    const CREAM      = [210, 200, 178];
    const CARD_BG    = [16,  10,  32];
    const RULE_COL   = [48,  38,  72];
    const ACCENT     = [138, 180, 160];
    const DIM        = [100,  88,  70];

    const subjectName = document.getElementById('f-name').value.trim() || 'Subject';
    const subjectDOB  = document.getElementById('f-dob').value.trim() || '';
    const today       = new Date().toLocaleDateString('en-IN', {day:'2-digit',month:'long',year:'numeric'});
    const modules     = Object.values(readingResults);

    // ── Helpers ──
    function fillBG() {
      doc.setFillColor(...BG);
      doc.rect(0, 0, W, H, 'F');
    }

    function goldRule(y, alpha) {
      doc.setDrawColor(...GOLD);
      doc.setLineWidth(0.25);
      doc.line(mL, y, W - mR, y);
    }

    function dimRule(y) {
      doc.setDrawColor(...RULE_COL);
      doc.setLineWidth(0.15);
      doc.line(mL, y, W - mR, y);
    }

    function starDots() {
      const pts = [[22,15],[185,25],[55,278],[162,265],[193,52],[28,245],[105,10],[172,282],[80,140],[140,155]];
      doc.setFillColor(255,255,255);
      pts.forEach(([x,y]) => doc.circle(x, y, 0.35, 'F'));
    }

    function pageFooter(n, total) {
      doc.setFont('helvetica','normal');
      doc.setFontSize(6.5);
      doc.setTextColor(...DIM);
      doc.text('JYOTISH  •  VEDIC MASTER READING', mL, H - 11);
      doc.text(String(n) + ' / ' + String(total), W - mR, H - 11, {align:'right'});
      goldRule(H - 14);
    }

    // ── Strip all markdown from raw AI text ──
    function cleanText(raw) {
      return raw
        .replace(/\r\n/g, '\n')
        .replace(/---+/g, '')          // remove horizontal rules
        .replace(/===+/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')  // strip bold markers, keep text
        .replace(/\*(.*?)\*/g, '$1')      // strip italic markers
        .replace(/^#{1,6}\s*/gm, '')      // strip all # headings
        .replace(/`{1,3}[^`]*`{1,3}/g, '') // strip code
        .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
    }

    // ── Parse cleaned lines into typed blocks ──
    function parseBlocks(cleanedText) {
      const lines = cleanedText.split('\n');
      const blocks = [];

      lines.forEach(raw => {
        const line = raw.trimEnd();
        const t = line.trim();
        if (!t) { blocks.push({type:'gap'}); return; }

        // Detect heading-like lines: originally ## or ### (already stripped)
        // We rely on post-clean structural cues: ALL CAPS short lines, or lines ending with ':'
        if (/^bottom line:?\s*/i.test(t)) {
          blocks.push({type:'bottomline', text: t.replace(/^bottom line:?\s*/i,'').trim()});
          return;
        }

        // Numbered list item
        if (/^\d{1,2}\.\s/.test(t)) {
          const num = t.match(/^(\d{1,2}\.)/)[1];
          blocks.push({type:'numbered', num, text: t.replace(/^\d{1,2}\.\s/,'').trim()});
          return;
        }

        // Bullet
        if (/^[-•*]\s/.test(t)) {
          blocks.push({type:'bullet', text: t.replace(/^[-•*]\s/,'').trim()});
          return;
        }

        // Short line in ALL CAPS or title case that reads like a heading
        if (t.length < 80 && /^[A-Z][A-Z\s&:()\/0-9-]+$/.test(t)) {
          blocks.push({type:'h2', text: t});
          return;
        }

        // Sub-heading: title case, short, not a sentence
        if (t.length < 70 && !t.endsWith('.') && /^[A-Z]/.test(t) && (t.split(' ').length <= 7)) {
          // Could be a heading or just a short sentence — treat short non-sentence lines as h3
          blocks.push({type:'h3', text: t});
          return;
        }

        // Normal paragraph text
        blocks.push({type:'para', text: t});
      });

      // Collapse consecutive gaps
      const merged = [];
      blocks.forEach(b => {
        if (b.type === 'gap' && merged.length && merged[merged.length-1].type === 'gap') return;
        merged.push(b);
      });
      return merged;
    }

    // ── Render one block onto the doc, return new y ──
    function renderBlock(block, y, pageNum, totalPages) {
      const LINE_H = 5.2;

      function checkOverflow(needed) {
        if (y + needed > H - mB - 6) {
          pageFooter(pageNum, totalPages);
          doc.addPage();
          fillBG();
          starDots();
          y = mT + 4;
          // continuation sub-bar
          doc.setFillColor(...CARD_BG);
          doc.rect(0, 0, W, 12, 'F');
          doc.setFont('helvetica','italic');
          doc.setFontSize(7);
          doc.setTextColor(...GOLD);
          doc.text('continued...', mL, 8.5);
          goldRule(12);
          y = 20;
        }
        return y;
      }

      switch(block.type) {
        case 'gap':
          y += 2.5;
          break;

        case 'h2': {
          y = checkOverflow(14);
          y += 4;
          doc.setFont('helvetica','bold');
          doc.setFontSize(11);
          doc.setTextColor(...GOLD_LT);
          const wrapped = doc.splitTextToSize(block.text, cW);
          wrapped.forEach(wl => { doc.text(wl, mL, y); y += 6.5; });
          dimRule(y);
          y += 4;
          break;
        }

        case 'h3': {
          y = checkOverflow(10);
          y += 3;
          doc.setFont('helvetica','bold');
          doc.setFontSize(9.5);
          doc.setTextColor(...GOLD);
          const wrapped = doc.splitTextToSize(block.text, cW);
          wrapped.forEach(wl => { doc.text(wl, mL, y); y += 5.5; });
          y += 1;
          break;
        }

        case 'bottomline': {
          const textLines = doc.setFont('helvetica','normal') || true;
          const wrapped = doc.splitTextToSize(block.text, cW - 12);
          const boxH = 10 + wrapped.length * 5.5;
          y = checkOverflow(boxH + 8);
          y += 4;
          // dark card bg
          doc.setFillColor(12, 8, 26);
          doc.roundedRect(mL, y - 3, cW, boxH, 1.5, 1.5, 'F');
          // gold left bar
          doc.setFillColor(...GOLD);
          doc.rect(mL, y - 3, 2.5, boxH, 'F');
          // label
          doc.setFont('helvetica','bold');
          doc.setFontSize(6.5);
          doc.setTextColor(...GOLD);
          doc.text('BOTTOM LINE', mL + 6, y + 2.5);
          // content
          doc.setFont('helvetica','bold');
          doc.setFontSize(9.5);
          doc.setTextColor(...GOLD_LT);
          wrapped.forEach(wl => { y += 5.5; doc.text(wl, mL + 6, y); });
          y += boxH - wrapped.length * 5.5 + 4;
          break;
        }

        case 'numbered': {
          y = checkOverflow(8);
          doc.setFont('helvetica','bold');
          doc.setFontSize(8.5);
          doc.setTextColor(...GOLD);
          doc.text(block.num, mL + 1, y);
          doc.setFont('helvetica','normal');
          doc.setFontSize(9);
          doc.setTextColor(...CREAM);
          const wrapped = doc.splitTextToSize(block.text, cW - 10);
          wrapped.forEach((wl, i) => {
            y = checkOverflow(6);
            doc.text(wl, mL + 9, y);
            if (i < wrapped.length - 1) y += LINE_H;
          });
          y += LINE_H + 1;
          break;
        }

        case 'bullet': {
          y = checkOverflow(8);
          doc.setFont('helvetica','bold');
          doc.setFontSize(10);
          doc.setTextColor(...GOLD);
          doc.text('•', mL + 1, y);
          doc.setFont('helvetica','normal');
          doc.setFontSize(9);
          doc.setTextColor(...CREAM);
          const wrapped = doc.splitTextToSize(block.text, cW - 9);
          wrapped.forEach((wl, i) => {
            y = checkOverflow(6);
            doc.text(wl, mL + 7, y);
            if (i < wrapped.length - 1) y += LINE_H;
          });
          y += LINE_H + 0.5;
          break;
        }

        case 'para':
        default: {
          doc.setFont('helvetica','normal');
          doc.setFontSize(9);
          doc.setTextColor(...CREAM);
          const wrapped = doc.splitTextToSize(block.text, cW);
          wrapped.forEach(wl => {
            y = checkOverflow(6);
            doc.text(wl, mL, y);
            y += LINE_H;
          });
          y += 1.5;
          break;
        }
      }

      return y;
    }

    const totalPages = modules.length + 2; // cover + TOC + module pages (approx)

    // ──────────── COVER PAGE ────────────
    fillBG();
    starDots();

    // purple glow blob (layered rects to fake blur)
    [[70,35,130,0.18],[70,35,130,0.12],[70,35,130,0.07]].forEach(([r,g,b,a]) => {
      doc.setFillColor(r,g,b);
      doc.ellipse(W*0.38, 75, 55, 38, 'F');
    });

    // Moon glyph
    doc.setFont('helvetica','bold');
    doc.setFontSize(52);
    doc.setTextColor(...GOLD);
    doc.text('☽', W/2, 72, {align:'center'});

    // Brand
    doc.setFont('helvetica','normal');
    doc.setFontSize(8);
    doc.setTextColor(...GOLD);
    doc.setCharSpace(3.5);
    doc.text('JYOTISH', W/2, 87, {align:'center'});
    doc.setCharSpace(0);

    // Title
    doc.setFont('helvetica','normal');
    doc.setFontSize(22);
    doc.setTextColor(...GOLD_LT);
    doc.text('Vedic Master Reading', W/2, 105, {align:'center'});

    // Subtitle
    doc.setFont('helvetica','italic');
    doc.setFontSize(12);
    doc.setTextColor(...GOLD);
    doc.text('Your Complete Cosmic Blueprint', W/2, 115, {align:'center'});

    goldRule(121);

    // Subject name
    doc.setFont('helvetica','bold');
    doc.setFontSize(17);
    doc.setTextColor(...GOLD_LT);
    doc.text(subjectName, W/2, 140, {align:'center'});

    if (subjectDOB) {
      doc.setFont('helvetica','normal');
      doc.setFontSize(9);
      doc.setTextColor(...GOLD);
      doc.text('Born ' + subjectDOB, W/2, 150, {align:'center'});
    }

    // Module count badge
    doc.setFillColor(...CARD_BG);
    doc.roundedRect(W/2 - 30, 160, 60, 14, 2, 2, 'F');
    goldRule(160); // top of badge
    doc.setFont('helvetica','normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...GOLD);
    doc.text(modules.length + ' MODULES  •  ' + today, W/2, 168, {align:'center'});

    // Footer disclaimer
    goldRule(H - 26);
    doc.setFont('helvetica','normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...DIM);
    doc.text('For self-awareness and strategic insight only. Not medical, legal, or financial advice.', W/2, H - 17, {align:'center', maxWidth: cW});
    doc.text('Page 1 / ' + totalPages, W/2, H - 10, {align:'center'});

    // ──────────── TABLE OF CONTENTS ────────────
    doc.addPage();
    fillBG();
    starDots();

    // TOC header bar
    doc.setFillColor(...CARD_BG);
    doc.rect(0, 0, W, 26, 'F');
    doc.setFont('helvetica','normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...GOLD);
    doc.setCharSpace(3);
    doc.text('CONTENTS', mL, 16);
    doc.setCharSpace(0);
    goldRule(26);

    let tocY = 38;
    modules.forEach((m, i) => {
      const num = String(i + 1).padStart(2, '0');

      // alternating row tint
      if (i % 2 === 0) {
        doc.setFillColor(14, 9, 28);
        doc.rect(mL - 2, tocY - 5, cW + 4, 9, 'F');
      }

      doc.setFont('helvetica','bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...GOLD);
      doc.text(num, mL, tocY);

      doc.setFont('helvetica','normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...CREAM);
      doc.text(m.name, mL + 9, tocY);

      // page number on right
      doc.setFont('helvetica','normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...DIM);
      doc.text(String(i + 3), W - mR, tocY, {align:'right'});

      tocY += 10;

      if (tocY > H - mB - 10) {
        pageFooter(2, totalPages);
        doc.addPage(); fillBG(); starDots(); tocY = 30;
      }
    });

    pageFooter(2, totalPages);

    // ──────────── MODULE PAGES ────────────
    modules.forEach((mod, idx) => {
      doc.addPage();
      fillBG();
      starDots();

      const pageNum = idx + 3;

      // Module header bar
      doc.setFillColor(...CARD_BG);
      doc.rect(0, 0, W, 30, 'F');

      // Gold left accent bar on header
      doc.setFillColor(...GOLD);
      doc.rect(0, 0, 3, 30, 'F');

      // Module number
      doc.setFont('helvetica','bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...GOLD);
      doc.setCharSpace(2);
      doc.text('MODULE ' + String(idx + 1).padStart(2,'0'), mL + 2, 12);
      doc.setCharSpace(0);

      // Module name
      doc.setFont('helvetica','normal');
      doc.setFontSize(13);
      doc.setTextColor(...GOLD_LT);
      const nameLine = doc.splitTextToSize(mod.name, cW - 20);
      nameLine.forEach((nl, ni) => doc.text(nl, mL + 2, 22 + ni * 6));

      goldRule(30);

      // Parse and render content
      const cleaned = cleanText(mod.text);
      const blocks  = parseBlocks(cleaned);

      let y = 42;

      blocks.forEach(block => {
        y = renderBlock(block, y, pageNum, totalPages);
      });

      pageFooter(pageNum, totalPages);
    });

    // ── Generate blob for iframe preview ──
    const pdfOutput = doc.output('blob');
    _pdfBlob = pdfOutput;

    const pdfUrl = URL.createObjectURL(pdfOutput);
    const previewSection = document.getElementById('pdf-preview-section');
    const iframe = document.getElementById('pdf-iframe');

    if (previewSection && iframe) {
      iframe.src = pdfUrl;
      previewSection.style.display = 'block';
      previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

  } catch (err) {
    console.error('PDF error:', err);
    alert('PDF generation failed: ' + err.message);
  }

  btn.disabled = false;
  btn.innerHTML = '<span class="pdf-icon">↓</span> Generate PDF';
}



function exportReading() {
  const lines = [];
  lines.push('JYOTISH  -  VEDIC MASTER READING');
  lines.push('Generated: ' + new Date().toLocaleString());
  lines.push('='.repeat(60));
  Object.values(readingResults).forEach(r => {
    lines.push('\n' + '='.repeat(60));
    lines.push(r.name.toUpperCase());
    lines.push('='.repeat(60));
    lines.push(r.text);
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'vedic-reading.txt';
  a.click();
}

// ── Provider Tabs Render ──
function renderProviderTabs() {
  const el = document.getElementById('provider-tabs');
  if (!el) return;
  const providers = ['claude','gemini','groq','openrouter','mistral','cohere'];
  el.innerHTML = providers.map(p => `
    <button class="prov-tab ${p === activeProvider ? 'active' : ''}" id="prov-${p}" onclick="setProvider('${p}')">${p.charAt(0).toUpperCase()+p.slice(1)}</button>
  `).join('');
}

// ── Razorpay Payment ──
const RAZORPAY_KEY = 'rzp_live_PASTE_YOUR_KEY_HERE';

function handleGenerateClick() {
  const apiKey = document.getElementById('f-apikey').value.trim();
  if (apiKey) {
    generateReading();
  } else {
    openPaymentModal();
  }
}

function openPaymentModal() {
  const name = document.getElementById('f-name').value.trim();
  const dob  = document.getElementById('f-dob').value.trim();
  const pob  = document.getElementById('f-pob').value.trim();
  if (!name || !dob || !pob) {
    alert('Please fill in your Name, Date of Birth, and Place of Birth before proceeding.');
    document.getElementById('f-name').focus();
    return;
  }
  document.getElementById('payment-overlay').classList.add('open');
}

function closePaymentModal(e) {
  if (e && e.target !== document.getElementById('payment-overlay')) return;
  document.getElementById('payment-overlay').classList.remove('open');
}

function initiateRazorpay() {
  const email = document.getElementById('payment-email').value.trim();
  const name  = document.getElementById('f-name').value.trim();
  const options = {
    key: RAZORPAY_KEY,
    amount: 99900,
    currency: 'INR',
    name: 'Jyotish',
    description: 'Vedic Master Reading — 23 Modules',
    prefill: { name, email: email || '' },
    theme: { color: '#c4a55a' },
    handler: function(response) {
      document.getElementById('payment-overlay').classList.remove('open');
      window._paymentId = response.razorpay_payment_id;
      generateReading(true);
    }
  };
  try {
    const rzp = new Razorpay(options);
    rzp.on('payment.failed', r => alert('Payment failed: ' + r.error.description));
    rzp.open();
  } catch(err) {
    alert('Razorpay not loaded. Please check your internet connection.');
  }
}

function onPaymentSuccess(response) {
  window._paymentId = response.razorpay_payment_id;
  generateReading(true);
}

// ── FAQ Toggle ──
function toggleFaq(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ── Mobile Nav ──
function toggleMobileNav() {
  document.getElementById('nav-mobile').classList.toggle('open');
}

// ── DOB Auto-slash formatting ──
function initDobField(id) {
  const input = document.getElementById(id);
  if (!input) return;
  input.addEventListener('input', function(e) {
    let val = this.value.replace(/\D/g, '');
    if (val.length >= 3 && val.length <= 4) val = val.slice(0,2) + '/' + val.slice(2);
    else if (val.length >= 5) val = val.slice(0,2) + '/' + val.slice(2,4) + '/' + val.slice(4,8);
    this.value = val;
  });
}

// ── Time Dropdowns ──
function initTimeDropdowns(hId, mId) {
  const hSel = document.getElementById(hId);
  const mSel = document.getElementById(mId);
  if (!hSel || !mSel) return;
  for (let h = 1; h <= 12; h++) {
    const opt = document.createElement('option');
    opt.value = String(h).padStart(2, '0');
    opt.textContent = String(h).padStart(2, '0');
    hSel.appendChild(opt);
  }
  for (let m = 0; m < 60; m++) {
    const opt = document.createElement('option');
    opt.value = String(m).padStart(2, '0');
    opt.textContent = String(m).padStart(2, '0');
    mSel.appendChild(opt);
  }
}

function getTimeValue(hId, mId, ampmId) {
  const h = document.getElementById(hId)?.value || '';
  const m = document.getElementById(mId)?.value || '';
  const ampm = document.getElementById(ampmId)?.value || 'AM';
  if (!h || !m) return '';
  return `${h}:${m} ${ampm}`;
}

// ── City Autocomplete (Nominatim) ──
let _acTimers = {};
async function cityAutocomplete(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;
  const q = input.value.trim();
  if (q.length < 3) { dropdown.innerHTML = ''; return; }

  clearTimeout(_acTimers[inputId]);
  _acTimers[inputId] = setTimeout(async () => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=6&addressdetails=1`, {
        headers: { 'Accept-Language': 'en' }
      });
      const data = await res.json();
      dropdown.innerHTML = data.map(p => {
        const display = p.display_name.split(',').slice(0,3).join(',');
        return `<div class="ac-item" onclick="selectCity('${inputId}','${dropdownId}','${display.replace(/'/g,"\\'")}')"> ${display}</div>`;
      }).join('');
    } catch(e) { dropdown.innerHTML = ''; }
  }, 350);
}

function selectCity(inputId, dropdownId, value) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (input) input.value = value;
  if (dropdown) dropdown.innerHTML = '';
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.autocomplete-wrap')) {
    document.querySelectorAll('.ac-dropdown').forEach(d => d.innerHTML = '');
  }
});

// ── Modules Pills Display ──
function renderModulesPills() {
  const container = document.getElementById('modules-pills-display');
  if (!container) return;
  container.innerHTML = MODULES.map(m =>
    `<span class="module-pill">${String(m.id).padStart(2,'0')} ${m.name}</span>`
  ).join('');
}

// ── Daily Rashi Horoscope ──
const RASHIS = [
  { name: 'Aries',       emoji: '🐏', sign: 'Mesha' },
  { name: 'Taurus',      emoji: '🐂', sign: 'Vrishabha' },
  { name: 'Gemini',      emoji: '👫', sign: 'Mithuna' },
  { name: 'Cancer',      emoji: '🦀', sign: 'Karka' },
  { name: 'Leo',         emoji: '🦁', sign: 'Simha' },
  { name: 'Virgo',       emoji: '👸', sign: 'Kanya' },
  { name: 'Libra',       emoji: '⚖️', sign: 'Tula' },
  { name: 'Scorpio',     emoji: '🦂', sign: 'Vrishchika' },
  { name: 'Sagittarius', emoji: '🏹', sign: 'Dhanu' },
  { name: 'Capricorn',   emoji: '🐐', sign: 'Makara' },
  { name: 'Aquarius',    emoji: '🏺', sign: 'Kumbha' },
  { name: 'Pisces',      emoji: '🐟', sign: 'Meena' },
];

function renderRashiGrid() {
  const grid = document.getElementById('rashi-grid');
  const dateEl = document.getElementById('rashi-today-date');
  if (!grid) return;
  const today = new Date();
  if (dateEl) {
    dateEl.textContent = today.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  }
  grid.innerHTML = RASHIS.map((r, i) => `
    <button class="rashi-pill" onclick="getRashiReading(${i})" id="rashi-pill-${i}">
      <span class="rashi-pill-emoji">${r.emoji}</span>
      <span class="rashi-pill-name">${r.name}</span>
    </button>
  `).join('');
}

// Date-seeded daily content so it changes every day automatically
function getDailyContent(idx) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth()+1) * 100 + today.getDate() + idx * 37;
  const rng = (n) => Math.abs((seed * 1103515245 + n * 12345) % n);

  const planets = ['Mercury','Venus','Mars','Jupiter','Saturn','Rahu','Sun','Moon','Ketu'];
  const energies = ['focused and precise','expansive and bold','charged with tension','deeply reflective','quietly grounded','creatively alive','restless but driven','emotionally heightened'];
  const focuses = ['your career and long-term direction','a relationship that needs honesty','your financial decisions','your health and daily routine','a creative project you have been delaying','communication with someone important','a decision you have been avoiding','your sense of purpose'];
  const doActions = [
    'reach out to someone you owe a conversation',
    'write down your three non-negotiable priorities this week',
    'spend 20 minutes away from screens before noon',
    'revisit a decision you made last month with fresh eyes',
    'say the thing you have been holding back',
    'begin something — even one small step counts',
    'ask for what you actually need today',
    'clear one thing from your environment that is slowing you down'
  ];
  const avoidActions = [
    'making financial commitments before reading the fine print',
    'starting new projects before finishing what is open',
    'reacting before you have all the information',
    'saying yes when you mean maybe',
    'comparing your timeline to someone else\'s',
    'forcing a conclusion before things have settled',
    'postponing a health concern',
    'burning energy on people who are not invested in you'
  ];

  const rashi = RASHIS[idx];
  const planet = planets[rng(planets.length)];
  const energy = energies[rng(energies.length)];
  const focus = focuses[rng(focuses.length)];
  const doAct = doActions[rng(doActions.length)];
  const avoidAct = avoidActions[rng(avoidActions.length)];
  const todayStr = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long' });

  return [
    `${planet} is active in the sky today, and ${rashi.name} natives will feel it as a pull toward ${energy} thinking. Use this energy deliberately — it will not last past the evening.`,
    `Your attention today is best directed toward ${focus}. Something in this area has been asking for your clarity, and today the chart supports honest engagement with it.`,
    `Do: ${doAct}. Avoid: ${avoidAct}.`
  ].join('\n\n');
}

async function getRashiReading(idx) {
  const rashi = RASHIS[idx];

  // Update pills
  document.querySelectorAll('.rashi-pill').forEach(p => p.classList.remove('active'));
  document.getElementById('rashi-pill-' + idx)?.classList.add('active');

  // Show panel
  const panel = document.getElementById('rashi-reading-box');
  const content = document.getElementById('rashi-reading-content');
  panel.style.display = 'block';

  // Update left panel info
  document.getElementById('rashi-panel-emoji').textContent = rashi.emoji;
  document.getElementById('rashi-panel-name').textContent = rashi.name;
  document.getElementById('rashi-panel-sub').textContent = rashi.sign + ' Rashi';
  document.getElementById('rashi-panel-date').textContent = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });

  content.innerHTML = '<div class="rashi-loading">☽ Reading the stars...</div>';
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Try live API reading first, fall back to daily seeded content
  const apiKey = document.getElementById('f-apikey')?.value?.trim();
  if (apiKey) {
    const today = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
    const prompt = `You are a senior Vedic astrologer. Write a brief, specific daily horoscope for ${rashi.name} (${rashi.sign} Rashi) for ${today}. Write exactly 3 short paragraphs: (1) which planet is most active today and how it affects this sign specifically, (2) one area of life to focus on today with a specific reason, (3) one action to take and one to avoid. Under 150 words total. No em dashes. No generic platitudes. Sound like a real astrologer.`;
    try {
      let text = '';
      if (activeProvider === 'claude') {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json', 'anthropic-dangerous-direct-browser-access': 'true' },
          body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 250, messages: [{ role: 'user', content: prompt }] })
        });
        const data = await res.json();
        text = data.content?.[0]?.text || '';
      } else if (activeProvider === 'gemini') {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await res.json();
        text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }
      if (text) {
        content.innerHTML = text.split('\n').filter(l => l.trim()).map(l =>
          `<p>${l.trim()}</p>`
        ).join('');
        return;
      }
    } catch(e) { /* fall through to daily seeded */ }
  }

  // Daily seeded fallback — changes every day automatically
  const dailyText = getDailyContent(idx);
  content.innerHTML = dailyText.split('\n\n').map(p => `<p>${p}</p>`).join('');
}

// ── Override buildSubject to use new field structure ──
function buildSubjectNew() {
  const tob = getTimeValue('f-tob-h', 'f-tob-m', 'f-tob-ampm');
  const ptob = getTimeValue('f-ptob-h', 'f-ptob-m', 'f-ptob-ampm');
  return {
    name: gv('f-name'),
    phone: gv('f-phone'),
    dob: gv('f-dob'),
    tob: tob || 'Unknown',
    pob: gv('f-pob'),
    city: gv('f-city'),
    career: gv('f-career'),
    question: gv('f-question'),
    partner: gv('f-partner'),
    pdob: gv('f-pdob'),
    ppob: gv('f-ppob'),
    ptob: ptob,
    state: gv('f-question'), // use question as state context too
    reloc: '',
  };
}

// ── Validation override ──
function validate() {
  const missing = [];
  if (!gv('f-name')) missing.push('Full Name');
  if (!gv('f-dob')) missing.push('Date of Birth');
  if (!gv('f-pob')) missing.push('Place of Birth');
  if (!gv('f-city')) missing.push('Current City');
  if (!gv('f-career')) missing.push('Career / Industry');
  if (!gv('f-question')) missing.push('Your Most Pressing Question');
  return missing;
}

// ── generateReading override to use new subject builder ──
async function generateReading(paidMode) {
  const missing = validate();
  const errEl = document.getElementById('err-area');
  if (missing.length) {
    errEl.innerHTML = `<div class="err-msg">Please fill in: ${missing.join(', ')}</div>`;
    errEl.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  errEl.innerHTML = '';

  const subject = buildSubjectNew();
  const apiKey = paidMode ? '' : gv('f-apikey');
  const modIds = [...Array(23)].map((_,i) => i+1); // all 23

  document.getElementById('results-section').style.display = 'block';
  document.getElementById('new-reading-row').style.display = 'flex';
  document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
  document.getElementById('results-meta').textContent =
    `${subject.name} · ${subject.dob} · 23 modules · ${new Date().toLocaleTimeString()}`;

  const btn = document.getElementById('run-btn');
  const btnText = document.getElementById('btn-text');
  btn.disabled = true;

  const progressMsgs = [
    'Casting your birth chart...',
    'Mapping planetary positions...',
    'Reading your Mahadasha...',
    'Analysing karmic patterns...',
    'Decoding your Nakshatra...',
    'Calculating Dasha timeline...',
    'Synthesising your blueprint...',
  ];
  let progIdx = 0;
  btnText.textContent = progressMsgs[0];
  const progInterval = setInterval(() => {
    progIdx = (progIdx + 1) % progressMsgs.length;
    btnText.textContent = progressMsgs[progIdx];
  }, 2800);

  readingResults = {};
  const batches = chunkArray(modIds, 4);
  renderTabsLoading(modIds);

  const CONCURRENCY = 2;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  let completedBatches = 0;

  async function runBatch(batch, idx) {
    await delay(Math.floor(idx / CONCURRENCY) * 800);
    const prompt = buildPrompt(subject, batch);
    try {
      const text = await callAPI(apiKey, prompt, batch);
      batch.forEach(id => {
        const m = MODULES.find(x => x.id === id);
        if (!m) return;
        readingResults[id] = { name: m.name, text: extractModuleText(text, id, m.name) };
        markTabReady(id);
      });
    } catch (e) {
      const isRateLimit = e.message && (e.message.includes('529') || e.message.includes('rate') || e.message.includes('overloaded'));
      if (isRateLimit) {
        await delay(5000);
        try {
          const text = await callAPI(apiKey, prompt, batch);
          batch.forEach(id => {
            const m = MODULES.find(x => x.id === id);
            if (!m) return;
            readingResults[id] = { name: m.name, text: extractModuleText(text, id, m.name) };
            markTabReady(id);
          });
        } catch(e2) {
          batch.forEach(id => {
            const m = MODULES.find(x => x.id === id);
            readingResults[id] = { name: m ? m.name : '', text: 'Error: ' + e2.message };
            markTabReady(id);
          });
        }
      } else {
        batch.forEach(id => {
          const m = MODULES.find(x => x.id === id);
          readingResults[id] = { name: m ? m.name : '', text: 'Error: ' + e.message };
          markTabReady(id);
        });
      }
    }
    completedBatches++;
    updateProgress(completedBatches, batches.length, modIds.length);
  }

  await Promise.all(batches.map((batch, idx) => runBatch(batch, idx)));

  if (!currentTab || !readingResults[currentTab]) {
    const firstDone = modIds.find(id => readingResults[id]);
    if (firstDone) showTab(firstDone);
  }

  btnText.textContent = 'Get My Reading';
  btn.disabled = false;
  clearInterval(progInterval);
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  renderRashiGrid();
  renderModulesPills();
  initDobField('f-dob');
  initDobField('f-pdob');
  initTimeDropdowns('f-tob-h', 'f-tob-m');
  initTimeDropdowns('f-ptob-h', 'f-ptob-m');
  renderProviderTabs();
  // No module overview grid or chips needed
});


function handleGenerateClick() {
  const apiKey = document.getElementById('f-apikey').value.trim();
  if (apiKey) {
    // User has own key — generate free
    generateReading();
  } else {
    // No key — show payment modal
    openPaymentModal();
  }
}

// Show/hide free key button based on API key input
document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('f-apikey');
  if (apiKeyInput) {
    apiKeyInput.addEventListener('input', () => {
      const freeBtn = document.getElementById('free-key-btn');
      const mainBtn = document.getElementById('run-btn');
      if (apiKeyInput.value.trim().length > 10) {
        freeBtn.style.display = 'block';
        mainBtn.querySelector('#btn-text').textContent = 'Use My Key (Free)';
        mainBtn.onclick = generateReading;
      } else {
        freeBtn.style.display = 'none';
        mainBtn.querySelector('#btn-text').textContent = 'Get My Reading';
        mainBtn.onclick = handleGenerateClick;
      }
    });
  }
});

function openPaymentModal() {
  // Validate required fields first
  const name = document.getElementById('f-name').value.trim();
  const dob  = document.getElementById('f-dob').value.trim();
  const tob  = document.getElementById('f-tob').value.trim();
  const pob  = document.getElementById('f-pob').value.trim();
  if (!name || !dob || !tob || !pob) {
    alert('Please fill in your Name, Date of Birth, Time of Birth, and Place of Birth before proceeding.');
    document.getElementById('f-name').focus();
    return;
  }
  if (selected.size === 0) {
    alert('Please select at least one module.');
    return;
  }
  document.getElementById('payment-overlay').classList.add('open');
}

function closePaymentModal(e) {
  if (e && e.target !== document.getElementById('payment-overlay')) return;
  document.getElementById('payment-overlay').classList.remove('open');
}

function initiateRazorpay() {
  const email = document.getElementById('payment-email').value.trim();
  const name  = document.getElementById('f-name').value.trim();

  const options = {
    key: RAZORPAY_KEY,
    amount: 99900, // ₹999 in paise
    currency: 'INR',
    name: 'Jyotish AI',
    description: 'Vedic Master Reading — 23 Modules',
    image: 'https://jyotish-ai.netlify.app/logo.png',
    prefill: {
      name: name,
      email: email || '',
    },
    theme: { color: '#c4a97d' },
    modal: {
      ondismiss: () => console.log('Payment modal closed')
    },
    handler: function(response) {
      // Payment successful
      closePaymentModal();
      document.getElementById('payment-overlay').classList.remove('open');
      onPaymentSuccess(response);
    }
  };

  try {
    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function(response) {
      alert('Payment failed: ' + response.error.description + '. Please try again.');
    });
    rzp.open();
  } catch(err) {
    alert('Razorpay not loaded. Please check your internet connection and try again.');
    console.error('Razorpay error:', err);
  }
}

function onPaymentSuccess(response) {
  // Payment confirmed — generate the reading
  console.log('Payment ID:', response.razorpay_payment_id);
  // Store payment ID for reference
  window._paymentId = response.razorpay_payment_id;
  // Now generate reading using our backend API key
  generateReading(true); // true = use backend key
}

// ── FAQ Toggle ──
function toggleFaq(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  generateStars();
  renderModuleOverview();
  renderChips();
});
