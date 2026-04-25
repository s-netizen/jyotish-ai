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
  document.getElementById('prov-claude').classList.toggle('active', p === 'claude');
  document.getElementById('prov-gemini').classList.toggle('active', p === 'gemini');

  const input = document.getElementById('f-apikey');
  const label = document.getElementById('apikey-label');
  const hint  = document.getElementById('apikey-hint');

  if (p === 'claude') {
    input.placeholder = 'sk-ant-...';
    label.innerHTML = 'Anthropic API Key <span class="req">*</span>';
    hint.innerHTML = 'Get yours at <a href="https://console.anthropic.com" target="_blank">console.anthropic.com</a> · Used only for this session';
  } else {
    input.placeholder = 'AIza...';
    label.innerHTML = 'Gemini API Key <span class="req">*</span>';
    hint.innerHTML = 'Free key at <a href="https://aistudio.google.com/app/apikey" target="_blank">aistudio.google.com</a> · No billing required · Used only for this session';
  }
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
    const box = document.getElementById(`ub-${key}`);
    if (box) box.classList.add('has-file');

    const prev = document.getElementById(`prev-${key}`);
    if (prev) prev.innerHTML = `
      <img src="${e.target.result}" alt="uploaded" />
      <div class="upload-status">✓ ${file.name}</div>
    `;

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

  return `You are an elite Vedic Astrologer, Numerologist, Behavioral Psychologist, Palmist, and Life Strategist. Deliver a brutally honest, mathematically precise, structured reading.

SUBJECT DATA:
Full Name: ${subject.name}
Date of Birth: ${subject.dob}
Exact Time of Birth: ${subject.tob}
Place of Birth: ${subject.pob}
Current City: ${subject.city}
Career: ${subject.career}
Current State: ${subject.state}
${partnerLine}
${subject.reloc ? 'Relocation Target: ' + subject.reloc : ''}
${subject.question ? 'BURNING QUESTION (highest priority): ' + subject.question : ''}
Today's Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

MODULES TO DELIVER:
${modList}

EXECUTION RULES:
1. Calculate the Vedic birth chart mathematically from the data. State all 9 planetary positions with house and sign.
2. Use ## bold headings and numbered points throughout.
3. Every claim must reference a specific planet, house, nakshatra, or pattern  -  no vague statements.
4. No generic platitudes. No toxic positivity. Deliver precise strategic intelligence.
5. Each module ends with "Bottom line:"  -  one definitive, non-negotiable sentence in bold.
6. Treat the subject like a CEO seeking high-stakes strategic clarity.
7. For Module 23: synthesise all findings into 10 numbered points + one specific, time-bound action to execute TODAY.
${modIds.includes(19) ? '8. Module 19 (Handwriting): analyse the provided handwriting image in detail.' : ''}
${modIds.includes(20) ? '9. Module 20 (Palm): analyse the provided palm image in detail.' : ''}
${modIds.includes(21) ? '10. Module 21 (Face): analyse the provided face image in detail.' : ''}

Begin the complete reading now, module by module.`;
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
  if (modIds.includes(20) && uploadedImages.palm) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: uploadedImages.palm.type, data: uploadedImages.palm.data }
    });
    content.push({ type: 'text', text: 'This is the palm image for Module 20 analysis.' });
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

  // Disable button
  const btn = document.getElementById('run-btn');
  const btnText = document.getElementById('btn-text');
  btn.disabled = true;
  btnText.textContent = 'Reading in progress...';

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

const SYSTEM_PROMPT = 'You are a master Vedic astrologer and life strategist. Write like a sharp, experienced human mentor. Be precise and direct. Never use em dashes. Avoid AI filler phrases. Sound real.';

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
  if (modIds.includes(20) && uploadedImages.palm) {
    parts.push({ inline_data: { mime_type: uploadedImages.palm.type, data: uploadedImages.palm.data } });
    parts.push({ text: 'Palm image for Module 20.' });
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
  // Sanitise first
  let text = raw
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

// ── PDF Export ──
async function exportPDF() {
  if (!Object.keys(readingResults).length) return;

  const btn = document.getElementById('pdf-btn');
  btn.disabled = true;
  btn.innerHTML = '<span>...</span> Generating PDF';

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const W = 210, H = 297;
  const marginL = 18, marginR = 18, marginT = 20, marginB = 20;
  const contentW = W - marginL - marginR;

  // Colours
  const BG        = [7,   5,  15];   // #07050f
  const GOLD      = [196,169,125];   // #c4a97d
  const GOLD_LIGHT= [232,213,163];   // #e8d5a3
  const CREAM     = [212,201,176];   // #d4c9b0
  const DARK_CARD = [18,  12, 35];   // module header bg
  const RULE      = [50,  40, 80];   // subtle line colour
  const TEAL      = [138,180,160];   // #8ab4a0 accent

  const subjectName = document.getElementById('f-name').value.trim() || 'Subject';
  const subjectDOB  = document.getElementById('f-dob').value.trim()  || '';
  const today       = new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'long', year:'numeric'});
  const modules     = Object.values(readingResults);

  // ──────────── HELPERS ────────────
  function fillPage() {
    doc.setFillColor(...BG);
    doc.rect(0, 0, W, H, 'F');
  }

  function goldLine(y, alpha=0.3) {
    doc.setDrawColor(196,169,125);
    doc.setLineWidth(0.2);
    doc.line(marginL, y, W-marginR, y);
  }

  function starDecor(page) {
    // tiny scattered dots for star feel
    const positions = [[25,18],[180,30],[60,280],[155,270],[190,55],[30,240],[100,12],[170,285]];
    doc.setFillColor(255,255,255);
    positions.forEach(([x,y]) => {
      doc.circle(x, y, 0.4, 'F');
    });
  }

  function addPageNumber(n, total) {
    doc.setFont('helvetica','normal');
    doc.setFontSize(7);
    doc.setTextColor(...GOLD);
    doc.text('JYOTISH  •  VEDIC MASTER READING', marginL, H-10);
    doc.text(n + ' / ' + total, W-marginR, H-10, {align:'right'});
  }

  function wrapText(text, x, y, maxW, lineH, col, size, style) {
    doc.setFont('helvetica', style || 'normal');
    doc.setFontSize(size || 10);
    doc.setTextColor(...col);
    const lines = doc.splitTextToSize(text, maxW);
    lines.forEach(line => {
      if (y > H - marginB - 8) {
        doc.addPage();
        fillPage();
        starDecor();
        y = marginT + 8;
      }
      doc.text(line, x, y);
      y += lineH;
    });
    return y;
  }

  // ──────────── COVER PAGE ────────────
  fillPage();
  starDecor(1);

  // top glow
  doc.setFillColor(90,40,180);
  doc.ellipse(50, 80, 80, 50, 'F'); // fake radial via ellipse opacity trick
  // reset to bg so it blends (jsPDF has no opacity but we layer)
  doc.setFillColor(...BG);
  doc.setGState(new doc.GState({opacity: 0.85}));
  doc.rect(0, 0, W, H, 'F');
  doc.setGState(new doc.GState({opacity: 1}));

  // moon glyph
  doc.setFont('helvetica','bold');
  doc.setFontSize(48);
  doc.setTextColor(...GOLD);
  doc.text('☽', W/2, 72, {align:'center'});

  // brand
  doc.setFont('helvetica','normal');
  doc.setFontSize(9);
  doc.setTextColor(...GOLD);
  doc.setCharSpace(3);
  doc.text('JYOTISH', W/2, 88, {align:'center'});
  doc.setCharSpace(0);

  // title
  doc.setFont('helvetica','normal');
  doc.setFontSize(22);
  doc.setTextColor(...GOLD_LIGHT);
  doc.text('Vedic Master Reading', W/2, 106, {align:'center'});

  // italic subtitle
  doc.setFont('helvetica','italic');
  doc.setFontSize(13);
  doc.setTextColor(...GOLD);
  doc.text('Your Complete Cosmic Blueprint', W/2, 116, {align:'center'});

  // gold rule
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.3);
  doc.line(W/2 - 35, 122, W/2 + 35, 122);

  // subject block
  doc.setFont('helvetica','bold');
  doc.setFontSize(16);
  doc.setTextColor(...GOLD_LIGHT);
  doc.text(subjectName, W/2, 140, {align:'center'});

  if (subjectDOB) {
    doc.setFont('helvetica','normal');
    doc.setFontSize(9);
    doc.setTextColor(...GOLD);
    doc.text('Born ' + subjectDOB, W/2, 149, {align:'center'});
  }

  // modules count badge
  doc.setFillColor(...DARK_CARD);
  doc.roundedRect(W/2-28, 158, 56, 14, 2, 2, 'F');
  doc.setFont('helvetica','normal');
  doc.setFontSize(8);
  doc.setTextColor(...GOLD);
  doc.text(modules.length + ' MODULES  •  ' + today, W/2, 166.5, {align:'center'});

  // bottom rule + disclaimer
  goldLine(H - 28);
  doc.setFont('helvetica','normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 88, 70);
  doc.text('This reading is for self-awareness and strategic insight. Not a substitute for medical, legal, or financial advice.', W/2, H-20, {align:'center', maxWidth: contentW});

  // ──────────── TABLE OF CONTENTS ────────────
  doc.addPage();
  fillPage();
  starDecor();

  doc.setFont('helvetica','normal');
  doc.setFontSize(8);
  doc.setTextColor(...GOLD);
  doc.setCharSpace(3);
  doc.text('CONTENTS', marginL, marginT + 6);
  doc.setCharSpace(0);

  goldLine(marginT + 10);

  let tocY = marginT + 20;
  modules.forEach((m, i) => {
    const num = String(i+1).padStart(2,'0');
    doc.setFont('helvetica','normal');
    doc.setFontSize(9);
    doc.setTextColor(...GOLD);
    doc.text(num, marginL, tocY);
    doc.setTextColor(...CREAM);
    doc.text(m.name, marginL + 10, tocY);
    // dot leader
    doc.setTextColor(60,50,80);
    const dots = '.'.repeat(55);
    doc.text(dots, marginL + 10, tocY, {maxWidth: contentW - 15});
    tocY += 9;
    if (tocY > H - marginB - 10) {
      doc.addPage(); fillPage(); starDecor(); tocY = marginT + 10;
    }
  });

  addPageNumber(2, modules.length + 2);

  // ──────────── MODULE PAGES ────────────
  modules.forEach((mod, idx) => {
    doc.addPage();
    fillPage();
    starDecor();

    const pageNum = idx + 3;

    // Module header bar
    doc.setFillColor(...DARK_CARD);
    doc.rect(0, 0, W, 32, 'F');

    // Module number
    doc.setFont('helvetica','bold');
    doc.setFontSize(8);
    doc.setTextColor(...GOLD);
    doc.setCharSpace(2);
    doc.text('MODULE ' + String(idx+1).padStart(2,'0'), marginL, 13);
    doc.setCharSpace(0);

    // Module name
    doc.setFont('helvetica','normal');
    doc.setFontSize(14);
    doc.setTextColor(...GOLD_LIGHT);
    doc.text(mod.name, marginL, 24);

    // gold underline on header
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.line(0, 32, W, 32);

    // Parse and render content
    let y = 44;
    const rawText = mod.text
      .replace(/<br\s*\/?>|\\n/gi, '\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, (_, t) => '**' + t + '**')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');

    const lines = rawText.split(/\\n|\n/);

    lines.forEach(line => {
      if (!line.trim()) { y += 2; return; }

      // Check for page overflow
      if (y > H - marginB - 6) {
        addPageNumber(pageNum, modules.length + 2);
        doc.addPage();
        fillPage();
        starDecor();
        // continuation header
        doc.setFillColor(...DARK_CARD);
        doc.rect(0, 0, W, 18, 'F');
        doc.setFont('helvetica','italic');
        doc.setFontSize(8);
        doc.setTextColor(...GOLD);
        doc.text(mod.name + '  (continued)', marginL, 12);
        doc.setDrawColor(...GOLD);
        doc.setLineWidth(0.3);
        doc.line(0, 18, W, 18);
        y = 28;
      }

      const isH2      = /^##\s/.test(line);
      const isH3      = /^###\s/.test(line);
      const isBottomLine = /^bottom line:/i.test(line.trim());
      const isBullet  = /^[\-\*•]\s/.test(line.trim());
      const isNumered = /^\d+\.\s/.test(line.trim());
      const isBold    = /^\*\*(.*)\*\*$/.test(line.trim());

      if (isH2) {
        y += 3;
        const txt = line.replace(/^##\s*/, '');
        doc.setFont('helvetica','bold');
        doc.setFontSize(11);
        doc.setTextColor(...GOLD_LIGHT);
        const wrapped = doc.splitTextToSize(txt, contentW);
        wrapped.forEach(wl => { doc.text(wl, marginL, y); y += 6; });
        // underline
        doc.setDrawColor(...RULE);
        doc.setLineWidth(0.15);
        doc.line(marginL, y, W - marginR, y);
        y += 4;

      } else if (isH3) {
        y += 2;
        const txt = line.replace(/^###\s*/, '');
        doc.setFont('helvetica','bold');
        doc.setFontSize(10);
        doc.setTextColor(...GOLD);
        const wrapped = doc.splitTextToSize(txt, contentW);
        wrapped.forEach(wl => { doc.text(wl, marginL, y); y += 5.5; });
        y += 1;

      } else if (isBottomLine) {
        y += 3;
        const txt = line.replace(/^bottom line:\s*/i, '');
        // gold left bar + box
        doc.setFillColor(15, 10, 25);
        doc.roundedRect(marginL, y-4, contentW, 14 + doc.splitTextToSize(txt, contentW-10).length * 5, 1, 1, 'F');
        doc.setDrawColor(...GOLD);
        doc.setLineWidth(1);
        doc.line(marginL, y-4, marginL, y + 10 + doc.splitTextToSize(txt, contentW-10).length * 5);
        doc.setLineWidth(0.15);

        doc.setFont('helvetica','bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...GOLD);
        doc.text('BOTTOM LINE', marginL + 4, y + 1);

        doc.setFont('helvetica','bold');
        doc.setFontSize(9.5);
        doc.setTextColor(...GOLD_LIGHT);
        const btLines = doc.splitTextToSize(txt, contentW - 10);
        btLines.forEach(bl => { y += 5.5; doc.text(bl, marginL + 4, y); });
        y += 10;

      } else if (isBullet || isNumered) {
        const txt = line.replace(/^[\-\*•]\s/, '').replace(/^\d+\.\s/, '');
        const prefix = isBullet ? '•' : line.match(/^\d+/)[0] + '.';
        doc.setFont('helvetica','normal');
        doc.setFontSize(9);
        doc.setTextColor(...CREAM);
        doc.text(prefix, marginL + 1, y);
        const wrapped = doc.splitTextToSize(txt.replace(/\*\*(.*?)\*\*/g, ''), contentW - 8);
        wrapped.forEach(wl => { doc.text(wl, marginL + 8, y); y += 5; });
        y += 1;

      } else if (isBold) {
        const txt = line.replace(/\*\*(.*?)\*\*/g, '');
        doc.setFont('helvetica','bold');
        doc.setFontSize(9.5);
        doc.setTextColor(...GOLD_LIGHT);
        const wrapped = doc.splitTextToSize(txt, contentW);
        wrapped.forEach(wl => { doc.text(wl, marginL, y); y += 5.5; });

      } else {
        const txt = line.replace(/\*\*(.*?)\*\*/g, '');
        doc.setFont('helvetica','normal');
        doc.setFontSize(9);
        doc.setTextColor(...CREAM);
        const wrapped = doc.splitTextToSize(txt, contentW);
        wrapped.forEach(wl => { doc.text(wl, marginL, y); y += 5; });
      }
    });

    addPageNumber(pageNum, modules.length + 2);
  });

  // Save
  const filename = 'Jyotish-Reading-' + subjectName.replace(/\s+/g,'-') + '-' + new Date().toISOString().slice(0,10) + '.pdf';
  doc.save(filename);

  btn.disabled = false;
  btn.innerHTML = '<span class=pdf-icon>↓</span> Download PDF';
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

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  generateStars();
  renderModuleOverview();
  renderChips();
});
