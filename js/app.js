/* ── Tatva  -  Vedic Master Reading ── */

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

// ── Prompt Builder ──
function buildPrompt(subject, modIds) {
  const partnerLine = subject.partner
    ? `Partner Name: ${subject.partner}${subject.pdob ? ', DOB: ' + subject.pdob : ''}${subject.ppob ? ', Place of Birth: ' + subject.ppob : ''}${subject.ptob ? ', Time: ' + subject.ptob : ''}`
    : 'No partner data provided.';

  const hasQuestion = subject.question && subject.question.trim().length > 0;
  const hasHandwriting = !!uploadedImages.handwriting;
  const hasPalm = !!(uploadedImages.palmLeft || uploadedImages.palmRight || uploadedImages.palm);
  const hasFace = !!uploadedImages.face;
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return `You are writing a complete personalised Vedic life reading for the person whose details are below. This is a single, continuous document -- not a list of separate modules. It reads like a story written specifically for this human being.

PERSON'S DATA:
Full Name: ${subject.name}
Phone: ${subject.phone || 'Not provided'}
Date of Birth: ${subject.dob}
Time of Birth: ${subject.tob}
Place of Birth: ${subject.pob}
Current City: ${subject.city}
Career / Industry: ${subject.career}
${hasQuestion ? 'Most Pressing Question: ' + subject.question : ''}
${partnerLine}
Report Date: ${today}

${hasHandwriting ? 'Handwriting sample image is attached. Analyse it in Chapter 2.' : ''}
${hasPalm ? 'Palm image(s) are attached. Analyse them in Chapter 2.' : ''}
${hasFace ? 'Face photo is attached. Analyse it in Chapter 2.' : ''}

DELIVER EXACTLY THESE 10 CHAPTERS IN ORDER. Each chapter: 3 to 5 tight paragraphs maximum. No padding. No repetition. Total output must not exceed 12 pages when printed.

## Chapter 1: Your Foundation
Calculate the Vedic birth chart. Present one clean table: Ascendant and all 9 planets with sign, house, nakshatra. State the current Mahadasha and Antardasha with dates. Name the top 3 yogas. Then write 2 paragraphs on what this chart means for this person's life trajectory. Reference specific placements, not generalities.
Bottom line: the defining pattern of this chart in one sentence.

## Chapter 2: Who You Are
${hasHandwriting ? `Handwriting is provided. Weave 2 to 3 specific observations (pressure, baseline, slant) directly into personality insights. No separate headers for "observation" and "interpretation". One flowing portrait.` : ''}
${hasPalm ? `Palm is provided. Weave 2 to 3 specific line observations directly into life insights. No separate headers.` : ''}
${hasFace ? `Face photo is provided. Weave 2 to 3 specific feature observations directly into character insights. No separate headers.` : ''}
${!hasHandwriting && !hasPalm && !hasFace ? 'No images provided. Read personality entirely from Ascendant, Moon nakshatra, and Mercury placement.' : ''}
Synthesise into one portrait of who they are beneath the surface. What they protect. What they give freely.
Bottom line: their core psychological pattern in one sentence.

${hasQuestion ? `## Chapter 3: Your Answer
The person asked: "${subject.question}"
Answer directly in the first sentence. Then give the planetary reasoning in 2 to 3 paragraphs: which house governs this, who rules it, where that ruler sits, which dasha and antardasha governs the timing, which specific transit activates it. Give a specific quarter and year. No hedging.
Bottom line: the answer with an exact quarter and year.` : ''}

## Chapter ${hasQuestion ? '4' : '3'}: Career and Money
10th house sign and lord. 2nd and 11th house income pattern. Which specific dasha periods bring peak income and which stall it. The one career move this chart demands they have not made yet. 3 to 4 paragraphs maximum.
Bottom line: specific career prediction with quarter and year.

## Chapter ${hasQuestion ? '5' : '4'}: Love and Relationships
7th house, its lord, Venus placement, Navamsha quality. Nature of future or current partner. What has shaped their relationship patterns so far. Marriage or commitment timing with dasha, antardasha, and year. ${subject.partner ? 'Partner data provided: run Guna compatibility and Dasha overlay.' : ''} 3 to 4 paragraphs.
Bottom line: relationship milestone with year.

## Chapter ${hasQuestion ? '6' : '5'}: Health and Body
Which organ systems are under stress from the chart. Physical constitution from Ascendant lord. Two specific health actions for the next 12 months tied to the current dasha. The one dasha period in the next 5 years requiring most attention. 3 paragraphs maximum.
Bottom line: one health action with a specific date.

## Chapter ${hasQuestion ? '7' : '6'}: Karma and Past Life
Ketu sign, house, nakshatra and what past life it describes. The most active karmic debt right now. What Rahu is asking them toward. The one repeating pattern that will not stop until they interrupt it. 3 paragraphs.
Bottom line: their karmic assignment this lifetime in one direct sentence.

## Chapter ${hasQuestion ? '8' : '7'}: Your Next 3 Years
Quarter by quarter from today through end of ${new Date().getFullYear() + 3}. For each quarter: dasha period running, dominant theme, one concrete action. Name specific transits and planets moving into specific houses. Keep this tight: one line per quarter.
Bottom line: the single most important quarter and why.

## Chapter ${hasQuestion ? '9' : '8'}: Remedies
Gemstones for this Ascendant's functional benefics: stone, weight, metal, finger, day, mantra for each. Three behavioral remedies tied to specific planets causing problems in this chart. One mantra for the most pressing issue. 3 paragraphs.
Bottom line: the first remedy to begin with a specific start date.

## Chapter ${hasQuestion ? '10' : '9'}: Power Moves
Exactly 10 numbered insights. Each must name a planet, house, or dasha. Each must be specific to this chart. Then one non-negotiable action to take before the end of this week. Tied to the chart.
Bottom line: the defining action sentence.

FINAL RULES:
- No em dashes. Not one. Use commas or full stops.
- No filler phrases.
- Second person throughout.
- One continuous story. Each chapter references the previous.
- The person reading this must think: "How did they know that about me."

Begin with Chapter 1.`;
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

const SYSTEM_PROMPT = `You are a senior Vedic astrologer, graphologist, and palmist with 30 years of practice. You write the way a brilliant mentor speaks to someone who came to you for real answers: direct, warm, occasionally confronting, always personal. You never sound like a textbook. You never sound like software.

ABSOLUTE RULES. All non-negotiable:
1. No em dashes. Not one. Use a comma, full stop, or colon instead.
2. No filler: no "it is worth noting", "delve into", "navigate", "tapestry", "fascinating", "in conclusion", "needless to say".
3. Every claim cites a specific planet, house, nakshatra, or dasha. No vague generalisations.
4. Second person throughout. Address the person as "you".
5. Short sentences. 15 words max.
6. Each chapter ends with exactly one "Bottom line:" sentence. Specific date or quarter.
7. Timing: always name year and quarter.
8. Planetary table in Chapter 1 ONLY. Never repeat it.
9. No answer repeated across chapters. Once, completely, in the right chapter.
10. PAGE LIMIT: Entire reading must be 10 to 12 pages maximum. Each chapter: 3 to 5 tight paragraphs. No padding.
11. Handwriting, palm, face: NO separate observation and interpretation headers. Weave the physical detail into the insight as one flowing paragraph. The person feels the insight, not reads a description.
12. One continuous story. Each chapter references the previous.
13. Tone: warm, direct, occasionally confronting. Sound like someone who has read 10,000 charts.`;

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
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + safeKey, 'HTTP-Referer': window.location.origin, 'X-Title': 'Tatva Vedic Reading' },
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

// ── PDF Engine — Dark Charcoal Design ──
let _pdfBlob = null;

function triggerPDFDownload() {
  if (!_pdfBlob) return;
  const subjectName = window._lastReadingSubject?.name || 'Reading';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(_pdfBlob);
  a.download = 'Tatva-' + subjectName.replace(/\s+/g,'-') + '-' + new Date().toISOString().slice(0,10) + '.pdf';
  a.click();
}

async function buildAndShowPDF(rawText, subject) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const W = 210, H = 297;
  const mL = 18, mR = 18, mT = 20, mB = 24;
  const cW = W - mL - mR;

  // Colour palette — dark charcoal like reference image
  const BG      = [38, 35, 32];     // dark charcoal
  const BG_CARD = [48, 44, 40];     // slightly lighter card
  const GOLD    = [196, 169, 100];  // warm gold
  const GOLD_LT = [228, 210, 160];  // light gold
  const WHITE   = [240, 236, 226];  // warm white
  const DIM     = [140, 128, 108];  // dimmed text
  const RULE    = [70, 62, 52];     // subtle rule

  function fillBG() {
    doc.setFillColor(...BG);
    doc.rect(0, 0, W, H, 'F');
  }

  function goldRule(y, w) {
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.3);
    doc.line(mL, y, mL + (w || cW), y);
  }

  function dimRule(y) {
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.2);
    doc.line(mL, y, W - mR, y);
  }

  function starDots() {
    const pts = [[25,20],[185,30],[60,270],[155,260],[195,55],[20,240],[108,12],[170,280]];
    doc.setFillColor(255,255,255);
    pts.forEach(([x,y]) => doc.circle(x, y, 0.3, 'F'));
  }

  function pageFooter(n, total) {
    dimRule(H - 16);
    doc.setFont('helvetica','normal');
    doc.setFontSize(7);
    doc.setTextColor(...DIM);
    doc.text('TATVA  ·  VEDIC LIFE READING', mL, H - 9);
    doc.text(String(n) + ' / ' + String(total), W - mR, H - 9, { align: 'right' });
  }

  // Strip markdown artifacts
  function cleanText(raw) {
    return raw
      .replace(/\r\n/g,'\n')
      .replace(/---+/g,'').replace(/===+/g,'')
      .replace(/\*\*(.*?)\*\*/g,'$1').replace(/\*(.*?)\*/g,'$1')
      .replace(/^#{1,6}\s*/gm,'')
      .replace(/`[^`]*`/g,'')
      .replace(/--/g,',')   // catch any em-dash variants
      .replace(/\u2014/g,',') // actual em dash
      .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  }

  // Parse chapters from text
  function parseChapters(text) {
    const cleaned = cleanText(text);
    const lines = cleaned.split('\n');
    const chapters = [];
    let current = null;
    lines.forEach(line => {
      const t = line.trim();
      if (/^chapter\s+\d+:/i.test(t) || /^##\s*chapter/i.test(t)) {
        if (current) chapters.push(current);
        current = { title: t.replace(/^#+\s*/,'').replace(/^chapter\s+\d+:\s*/i,'').trim(), lines: [] };
      } else if (current) {
        current.lines.push(t);
      }
    });
    if (current) chapters.push(current);

    // If no chapters parsed, treat as single chapter
    if (chapters.length === 0) {
      chapters.push({ title: 'Your Reading', lines: lines.map(l => l.trim()) });
    }
    return chapters;
  }

  // Render text content onto page, return new y
  function renderContent(lines, startY, pageNum, totalPages) {
    let y = startY;
    const LINE_H = 5.4;

    function newPage() {
      pageFooter(pageNum, totalPages);
      doc.addPage();
      pageNum++;
      fillBG(); starDots();
      y = mT + 8;
      // continuation bar
      doc.setFillColor(...BG_CARD);
      doc.rect(0, 0, W, 12, 'F');
      doc.setFont('helvetica','italic');
      doc.setFontSize(7);
      doc.setTextColor(...DIM);
      doc.text('continued', mL, 8.5);
      dimRule(12);
      y = 22;
    }

    lines.forEach(line => {
      if (!line) { y += 2.5; return; }

      if (y > H - mB - 10) newPage();

      // Bottom line styling
      if (/^bottom line:/i.test(line)) {
        y += 3;
        if (y > H - mB - 16) newPage();
        doc.setFillColor(...BG_CARD);
        const blText = line.replace(/^bottom line:\s*/i,'').trim();
        const wrapped = doc.setFont('helvetica','bolditalic').setFontSize(10) && doc.splitTextToSize(blText, cW - 14);
        const boxH = 8 + wrapped.length * 5.5;
        doc.rect(mL, y - 3, cW, boxH, 'F');
        doc.setDrawColor(...GOLD);
        doc.setLineWidth(1.5);
        doc.line(mL, y - 3, mL, y - 3 + boxH);
        doc.setLineWidth(0.2);
        doc.setFont('helvetica','bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...GOLD);
        doc.text('BOTTOM LINE', mL + 5, y + 1.5);
        doc.setFont('helvetica','bolditalic');
        doc.setFontSize(10);
        doc.setTextColor(...GOLD_LT);
        let by = y + 7;
        wrapped.forEach(wl => { doc.text(wl, mL + 5, by); by += 5.5; });
        y = by + 4;
        return;
      }

      // Table row detection
      if (line.startsWith('|') && line.includes('|', 1)) {
        if (line.replace(/[\s|:-]/g,'').length === 0) return; // separator row
        const cells = line.split('|').map(c => c.trim()).filter(Boolean);
        if (y > H - mB - 10) newPage();
        const isHeader = cells.some(c => /^(planet|sign|house|nakshatra)/i.test(c));
        doc.setFillColor(...(isHeader ? [55, 50, 45] : BG_CARD));
        doc.rect(mL, y - 3.5, cW, 8, 'F');
        doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...(isHeader ? GOLD : WHITE));
        const colW = cW / Math.max(cells.length, 1);
        cells.forEach((cell, i) => {
          doc.text(cell.slice(0,20), mL + 1 + i * colW, y + 1);
        });
        y += 8;
        return;
      }

      // Normal paragraph
      doc.setFont('helvetica','normal');
      doc.setFontSize(9.5);
      doc.setTextColor(...WHITE);
      const wrapped = doc.splitTextToSize(line, cW);
      wrapped.forEach(wl => {
        if (y > H - mB - 8) newPage();
        doc.text(wl, mL, y);
        y += LINE_H;
      });
      y += 1.5;
    });

    return { y, pageNum };
  }

  const today = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });
  const chapters = parseChapters(rawText);
  const totalPages = chapters.length + 1; // +1 for cover

  // ── COVER PAGE ──
  fillBG();

  // Top ornamental line
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.line(mL, 28, W - mR, 28);
  doc.line(mL, 30, W - mR, 30);

  // Moth/butterfly symbol (geometric approximation)
  doc.setFillColor(...GOLD);
  doc.ellipse(W/2 - 8, 42, 7, 4, 'F');
  doc.ellipse(W/2 + 8, 42, 7, 4, 'F');
  doc.setFillColor(...GOLD_LT);
  doc.ellipse(W/2 - 5, 44, 4, 2.5, 'F');
  doc.ellipse(W/2 + 5, 44, 4, 2.5, 'F');
  doc.setFillColor(...WHITE);
  doc.circle(W/2, 43, 2, 'F');

  // Brand
  doc.setFont('helvetica','normal');
  doc.setFontSize(9);
  doc.setTextColor(...DIM);
  doc.setCharSpace(3);
  doc.text('Tatva', W/2, 55, { align: 'center' });
  doc.setCharSpace(0);

  // Big title
  doc.setFont('helvetica','bold');
  doc.setFontSize(38);
  doc.setTextColor(...WHITE);
  doc.text('VEDIC', W/2, 90, { align: 'center' });
  doc.setFont('helvetica','normal');
  doc.setFontSize(38);
  doc.text('LIFE READING', W/2, 108, { align: 'center' });

  // Gold rule
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.3);
  doc.line(W/2 - 40, 116, W/2 + 40, 116);

  // Star cluster
  ['✦','·','✦','·','✦'].forEach((s, i) => {
    doc.setFont('helvetica','normal');
    doc.setFontSize(10);
    doc.setTextColor(...GOLD);
    doc.text(s, W/2 - 20 + i*10, 125, { align: 'center' });
  });

  // Subject name
  doc.setFont('helvetica','bold');
  doc.setFontSize(22);
  doc.setTextColor(...GOLD_LT);
  doc.text(subject.name, W/2, 148, { align: 'center' });

  // Born line
  doc.setFont('helvetica','normal');
  doc.setFontSize(10);
  doc.setTextColor(...DIM);
  doc.text(`Born ${subject.dob}  ·  ${subject.tob}  ·  ${subject.pob}`, W/2, 160, { align: 'center' });

  // Question box
  if (subject.question) {
    doc.setFillColor(...BG_CARD);
    doc.roundedRect(mL + 10, 170, cW - 20, 22, 2, 2, 'F');
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.3);
    doc.roundedRect(mL + 10, 170, cW - 20, 22, 2, 2, 'S');
    doc.setFont('helvetica','italic');
    doc.setFontSize(9);
    doc.setTextColor(...GOLD);
    doc.text('Your question:', W/2, 178, { align: 'center' });
    doc.setTextColor(...WHITE);
    doc.setFontSize(10);
    const qWrapped = doc.splitTextToSize(subject.question, cW - 30);
    doc.text(qWrapped[0], W/2, 186, { align: 'center' });
  }

  // Report date
  doc.setFont('helvetica','normal');
  doc.setFontSize(8);
  doc.setTextColor(...DIM);
  doc.setCharSpace(1.5);
  doc.text('REPORT DATE  ·  ' + today.toUpperCase(), W/2, 215, { align: 'center' });
  doc.setCharSpace(0);

  // Chapter count
  doc.setFontSize(8);
  doc.setTextColor(...GOLD);
  doc.text(chapters.length + ' CHAPTERS  ·  PERSONALISED ANALYSIS', W/2, 224, { align: 'center' });

  // Bottom ornamental lines
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.line(mL, H - 28, W - mR, H - 28);
  doc.line(mL, H - 26, W - mR, H - 26);

  // Footer moth
  doc.setFont('helvetica','normal');
  doc.setFontSize(7);
  doc.setTextColor(...DIM);
  doc.text('For self-awareness and insight only. Not medical, legal or financial advice.', W/2, H - 16, { align: 'center' });

  // ── CHAPTER PAGES ──
  let pageNum = 2;

  chapters.forEach((chapter, ci) => {
    doc.addPage();
    fillBG();
    starDots();

    // Chapter header bar
    doc.setFillColor(...BG_CARD);
    doc.rect(0, 0, W, 32, 'F');

    // Gold left accent
    doc.setFillColor(...GOLD);
    doc.rect(0, 0, 3, 32, 'F');

    // Chapter number
    doc.setFont('helvetica','bold');
    doc.setFontSize(8);
    doc.setTextColor(...GOLD);
    doc.setCharSpace(2);
    doc.text('CHAPTER ' + String(ci + 1).padStart(2,'0'), mL + 3, 13);
    doc.setCharSpace(0);

    // Chapter title
    doc.setFont('helvetica','bold');
    doc.setFontSize(16);
    doc.setTextColor(...WHITE);
    const titleLines = doc.splitTextToSize(chapter.title.toUpperCase(), cW - 10);
    titleLines.forEach((tl, ti) => doc.text(tl, mL + 3, 24 + ti * 7));

    dimRule(32);

    let y = 44;

    const result = renderContent(chapter.lines, y, pageNum, totalPages);
    pageNum = result.pageNum;

    pageFooter(pageNum, totalPages);
    pageNum++;
  });

  // Generate blob and show in iframe
  const blob = doc.output('blob');
  _pdfBlob = blob;
  const url = URL.createObjectURL(blob);

  const previewSection = document.getElementById('pdf-preview-section');
  const iframe = document.getElementById('pdf-iframe');
  if (previewSection && iframe) {
    iframe.src = url;
    previewSection.style.display = 'block';
    previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Show download button only
  document.getElementById('new-reading-row').style.display = 'none';
  document.getElementById('result-content').innerHTML = '';
  document.getElementById('result-tabs').innerHTML = '';
}




function exportReading() {
  const lines = [];
  lines.push('TATVA  -  VEDIC MASTER READING');
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
    name: 'Tatva',
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
  // Image uploads required (partner details are optional)
  if (!uploadedImages.handwriting) missing.push('Handwriting Sample (Step 04)');
  if (!uploadedImages.palmLeft && !uploadedImages.palmRight) missing.push('Palm Photo — at least one hand (Step 04)');
  if (!uploadedImages.face) missing.push('Face Photo (Step 04)');
  return missing;
}

// ── generateReading — single call, straight to PDF ──
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

  // Show loading state
  const btn = document.getElementById('run-btn');
  const btnText = document.getElementById('btn-text');
  btn.disabled = true;

  const progressMsgs = [
    'Casting your birth chart...',
    'Reading your Mahadasha...',
    'Analysing karmic patterns...',
    'Decoding your Nakshatra...',
    'Mapping planetary positions...',
    'Writing your story...',
    'Preparing your PDF...',
  ];
  let progIdx = 0;
  btnText.textContent = progressMsgs[0];
  const progInterval = setInterval(() => {
    progIdx = (progIdx + 1) % progressMsgs.length;
    btnText.textContent = progressMsgs[progIdx];
  }, 3500);

  // Show loading spinner only — no blue reading screen
  const resultsSection = document.getElementById('results-section');
  resultsSection.style.display = 'block';
  resultsSection.scrollIntoView({ behavior: 'smooth' });
  document.getElementById('result-tabs').innerHTML = '';
  document.getElementById('result-content').innerHTML = `
    <div style="text-align:center;padding:4rem 2rem">
      <div style="font-size:42px;color:#c4a55a;animation:pulse 2s ease-in-out infinite;margin-bottom:1.5rem">☽</div>
      <p style="font-family:'DM Mono',monospace;font-size:13px;color:rgba(196,165,90,0.6);letter-spacing:0.1em" id="loading-msg-text">Casting your birth chart...</p>
      <p style="font-size:12px;color:rgba(212,203,184,0.3);margin-top:1rem;font-family:'DM Mono',monospace">Your reading typically takes 3-5 minutes. Your PDF will appear below when ready.</p>
    </div>`;
  document.getElementById('new-reading-row').style.display = 'none';

  // Sync loading text with button
  const loadingMsgEl = document.getElementById('loading-msg-text');
  const syncInterval = setInterval(() => {
    if (loadingMsgEl) loadingMsgEl.textContent = progressMsgs[progIdx];
  }, 500);

  try {
    // Build single unified prompt
    const prompt = buildPrompt(subject, []);

    // Build messages with images
    const content = [];
    if (uploadedImages.handwriting) {
      content.push({ type: 'image', source: { type: 'base64', media_type: uploadedImages.handwriting.type, data: uploadedImages.handwriting.data }});
      content.push({ type: 'text', text: 'This is the handwriting sample. Analyse it in Chapter 2.' });
    }
    if (uploadedImages.palmLeft) {
      content.push({ type: 'image', source: { type: 'base64', media_type: uploadedImages.palmLeft.type, data: uploadedImages.palmLeft.data }});
      content.push({ type: 'text', text: 'This is the LEFT palm. Analyse in Chapter 2.' });
    }
    if (uploadedImages.palmRight) {
      content.push({ type: 'image', source: { type: 'base64', media_type: uploadedImages.palmRight.type, data: uploadedImages.palmRight.data }});
      content.push({ type: 'text', text: 'This is the RIGHT palm. Analyse in Chapter 2.' });
    }
    if (uploadedImages.face) {
      content.push({ type: 'image', source: { type: 'base64', media_type: uploadedImages.face.type, data: uploadedImages.face.data }});
      content.push({ type: 'text', text: 'This is the face photo. Analyse in Chapter 2.' });
    }
    content.push({ type: 'text', text: prompt });

    let fullText = '';

    if (!apiKey || activeProvider === 'claude') {
      const key = apiKey || '';
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-opus-4-5',
          max_tokens: 8000,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content }]
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      fullText = data.content?.[0]?.text || '';
    } else {
      fullText = await callAPI(apiKey, prompt, []);
    }

    if (!fullText) throw new Error('No content returned from API');

    // Store for PDF generation
    window._lastReadingText = fullText;
    window._lastReadingSubject = subject;

    // Hide loading, generate PDF immediately
    document.getElementById('result-content').innerHTML = '';
    clearInterval(progInterval);
    clearInterval(syncInterval);

    await buildAndShowPDF(fullText, subject);

  } catch (err) {
    clearInterval(progInterval);
    clearInterval(syncInterval);
    document.getElementById('result-content').innerHTML = `
      <div style="padding:2rem;color:#e88080;font-family:'DM Mono',monospace;font-size:13px">
        Error: ${err.message}. Please check your API key and try again.
      </div>`;
  }

  btnText.textContent = 'Get My Reading';
  btn.disabled = false;
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
    name: 'Tatva',
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
