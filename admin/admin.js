/**
 * BGSS Admin Panel — admin.js
 * Full client-side admin SPA with localStorage persistence
 */

'use strict';

/* ═══════════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════════ */
const ADMIN_PASS = 'bgss@admin2024';
const STORAGE_KEY = 'bgss_admin_data';

let STATE = {
  settings: {
    emailjs_public_key: 'BGSS_PUBLIC_KEY',
    emailjs_service_id: 'BGSS_SERVICE_ID',
    emailjs_template_id: 'BGSS_TEMPLATE_ID',
    contact_email: 'devshah4689@gmail.com',
    whatsapp_number: '916352392705',
    site_phone: '+91 79 4890 4100',
    site_phone2: '+91 90999 27783',
    site_address: '604, Shiti Ratna Building, Panchwati Circle, C.G. Road, Ahmedabad – 380 009, Gujarat, India.',
    site_name: 'BGSS & Associates',
    linkedin_url: '',
    twitter_url: ''
  },
  partner_thoughts: [
    {
      id: uid(), partner: 'Bhaumik Goda', designation: 'Partner – Tax Advisory',
      thought: 'Tax planning is not about avoidance — it is about structuring transactions intelligently within the framework of the law to achieve the best possible outcome for the client.',
      category: 'Tax Advisory', date: '2024-11-01', image: '/assets/images/partner-bhaumik.jpg', published: true
    },
    {
      id: uid(), partner: 'Saumya Sheth', designation: 'Partner – Tax Litigation',
      thought: 'Every litigation is a story — the taxpayer\'s story of compliance and intent. Our job is to tell that story compellingly before the highest judicial forums.',
      category: 'Tax Litigation', date: '2024-11-01', image: '/assets/images/partner-saumya.jpg', published: true
    },
    {
      id: uid(), partner: 'Shalibhadra Shah', designation: 'Partner – Transfer Pricing',
      thought: 'Transfer pricing is where economics meets law. Getting it right requires both a deep understanding of business models and a mastery of regulatory frameworks across jurisdictions.',
      category: 'Transfer Pricing', date: '2024-11-01', image: '/assets/images/partner-shalibhadra.jpg', published: true
    },
    {
      id: uid(), partner: 'Malay Kalavadia', designation: 'Partner – M&A',
      thought: 'Great M&A deals are built on three pillars: legal certainty, tax efficiency, and commercial pragmatism. Miss any one and the deal crumbles at integration.',
      category: 'M&A', date: '2024-11-01', image: '/assets/images/partner-malay.jpg', published: true
    }
  ],
  resources: { ebooks: [], presentations: [], videos: [] },
  activity: []
};

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ═══════════════════════════════════════════════════════
   PERSIST
═══════════════════════════════════════════════════════ */
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE)); } catch(e) {}
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      STATE = Object.assign({}, STATE, parsed);
      // ensure nested defaults
      STATE.settings  = Object.assign({}, {
        emailjs_public_key:'BGSS_PUBLIC_KEY', emailjs_service_id:'BGSS_SERVICE_ID',
        emailjs_template_id:'BGSS_TEMPLATE_ID', contact_email:'devshah4689@gmail.com',
        whatsapp_number:'916352392705', site_phone:'+91 79 4890 4100',
        site_phone2:'+91 90999 27783', site_name:'BGSS & Associates',
        site_address:'604, Shiti Ratna Building, Panchwati Circle, C.G. Road, Ahmedabad – 380 009, Gujarat, India.',
        linkedin_url:'', twitter_url:''
      }, parsed.settings || {});
      STATE.resources = Object.assign({ ebooks:[], presentations:[], videos:[] }, parsed.resources || {});
      STATE.partner_thoughts = parsed.partner_thoughts || STATE.partner_thoughts;
      STATE.activity = parsed.activity || [];
    }
  } catch(e) {}
}

function logActivity(text, color = 'gold') {
  STATE.activity.unshift({ id: uid(), text, color, time: new Date().toLocaleString('en-IN') });
  if (STATE.activity.length > 50) STATE.activity.pop();
  saveState();
}

/* ═══════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════ */
function toast(msg, type = 'success') {
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warn: 'fa-triangle-exclamation' };
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fa-solid ${icons[type] || icons.success}"></i><span class="toast-msg">${msg}</span><button class="toast-close" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

/* ═══════════════════════════════════════════════════════
   CONFIRM MODAL
═══════════════════════════════════════════════════════ */
let _confirmResolve = null;
function confirm(msg) {
  return new Promise(res => {
    _confirmResolve = res;
    document.getElementById('confirm-msg').textContent = msg;
    openModal('confirm-modal');
  });
}
document.addEventListener('click', e => {
  if (e.target.closest('#confirm-ok')) {
    closeModal('confirm-modal');
    if (_confirmResolve) { _confirmResolve(true); _confirmResolve = null; }
  }
  if (e.target.closest('#confirm-cancel') || e.target.closest('#confirm-close')) {
    closeModal('confirm-modal');
    if (_confirmResolve) { _confirmResolve(false); _confirmResolve = null; }
  }
});

/* ═══════════════════════════════════════════════════════
   MODAL HELPERS
═══════════════════════════════════════════════════════ */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════ */
let currentPanel = 'dashboard';
function navigate(panel) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const panelEl = document.getElementById('panel-' + panel);
  if (panelEl) panelEl.classList.add('active');
  document.querySelectorAll(`[data-panel="${panel}"]`).forEach(n => n.classList.add('active'));
  currentPanel = panel;
  // Update topbar title
  const titles = {
    dashboard: 'Dashboard', thoughts: 'Partner Thoughts',
    ebooks: 'eBook Library', presentations: 'Presentations',
    videos: 'YouTube Videos', settings: 'Site Settings', enquiries: 'Enquiries'
  };
  document.getElementById('topbar-title').textContent = titles[panel] || 'Admin';
  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('sidebar-overlay').classList.remove('show');
  // Render panel
  renderPanel(panel);
}

function renderPanel(panel) {
  if (panel === 'dashboard')     renderDashboard();
  if (panel === 'thoughts')      renderThoughts();
  if (panel === 'ebooks')        renderEbooks();
  if (panel === 'presentations') renderPresentations();
  if (panel === 'videos')        renderVideos();
  if (panel === 'settings')      renderSettings();
  if (panel === 'enquiries')     renderEnquiries();
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════ */
function renderDashboard() {
  document.getElementById('stat-thoughts').textContent = STATE.partner_thoughts.filter(t => t.published).length;
  document.getElementById('stat-ebooks').textContent = STATE.resources.ebooks.length;
  document.getElementById('stat-presentations').textContent = STATE.resources.presentations.length;
  document.getElementById('stat-videos').textContent = STATE.resources.videos.length;

  // Activity
  const log = document.getElementById('activity-log');
  if (!STATE.activity.length) {
    log.innerHTML = '<div class="empty-state"><i class="fa-regular fa-clock"></i><p>No activity yet.</p></div>';
  } else {
    log.innerHTML = STATE.activity.slice(0, 10).map(a => `
      <div class="activity-item">
        <div class="activity-dot ${a.color}"></div>
        <div>
          <div class="activity-text">${a.text}</div>
          <div class="activity-time">${a.time}</div>
        </div>
      </div>`).join('');
  }

  // Quick stats cards
  document.getElementById('dash-email').textContent = STATE.settings.contact_email;
  document.getElementById('dash-wa').textContent = '+' + STATE.settings.whatsapp_number;
}

/* ═══════════════════════════════════════════════════════
   PARTNER THOUGHTS
═══════════════════════════════════════════════════════ */
let editingThoughtId = null;

function renderThoughts(filterList = null) {
  const grid = document.getElementById('thoughts-grid');
  const list = filterList !== null ? filterList : STATE.partner_thoughts;
  if (!list.length) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-quote-right"></i><p>No partner thoughts found. Click "Add Thought" to publish one.</p></div>';
    return;
  }
  grid.innerHTML = list.map(t => `
    <div class="thought-card" id="tc-${t.id}">
      <div class="thought-card-top">
        <div class="thought-badge-cluster">
          <span class="badge badge-category">${escHtml(t.category || 'General')}</span>
          <span class="badge ${t.published ? 'badge-success' : 'badge-draft'}">${t.published ? '● Live on Site' : '○ Draft'}</span>
        </div>
        <div class="thought-card-actions">
          <button class="action-btn" onclick="editThought('${t.id}')" title="Edit Thought"><i class="fa-solid fa-pen"></i></button>
          <button class="action-btn danger" onclick="deleteThought('${t.id}')" title="Delete Thought"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>

      <div class="thought-card-body">
        <p class="thought-quote">${escHtml(t.thought)}</p>
      </div>

      <div class="thought-card-footer">
        <div class="thought-avatar">
          ${t.image ? `<img src="${t.image}" alt="${escHtml(t.partner)}" onerror="this.onerror=null;this.parentNode.innerHTML='${initials(t.partner)}'">` : initials(t.partner)}
        </div>
        <div class="thought-partner-details">
          <div class="thought-partner-name">${escHtml(t.partner)}</div>
          <div class="thought-designation">${escHtml(t.designation || 'Partner')}</div>
        </div>
        ${t.date ? `<div class="thought-card-date"><i class="fa-regular fa-calendar"></i> ${t.date}</div>` : ''}
      </div>
    </div>`).join('');
}

function filterThoughts() {
  const q = (document.getElementById('thoughts-search')?.value || '').toLowerCase().trim();
  const cat = document.getElementById('thoughts-filter-category')?.value || '';
  const status = document.getElementById('thoughts-filter-status')?.value || '';

  const filtered = STATE.partner_thoughts.filter(t => {
    const matchQ = !q || (t.partner && t.partner.toLowerCase().includes(q)) ||
                          (t.thought && t.thought.toLowerCase().includes(q)) ||
                          (t.designation && t.designation.toLowerCase().includes(q));
    const matchCat = !cat || t.category === cat;
    const matchStatus = !status || (status === 'live' && t.published) || (status === 'draft' && !t.published);
    return matchQ && matchCat && matchStatus;
  });

  renderThoughts(filtered);
}

/* ── Partner Photo Upload & Optimization System ── */
function setupThoughtImageUpload() {
  const fileInput = document.getElementById('thought-image-file');
  const urlInput = document.getElementById('thought-image');
  const dropzone = document.getElementById('thought-dropzone');
  const preview = document.getElementById('thought-avatar-preview');
  const clearBtn = document.getElementById('thought-clear-image');

  if (!fileInput || !dropzone) return;

  function processImageFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      toast('Please upload an image file (JPG, PNG, WebP).', 'warn');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // High quality square avatar resize (max 450x450)
        const canvas = document.createElement('canvas');
        const MAX = 450;
        let w = img.width, h = img.height;
        if (w > h) {
          if (w > MAX) { h = Math.round((h * MAX) / w); w = MAX; }
        } else {
          if (h > MAX) { w = Math.round((w * MAX) / h); h = MAX; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);

        if (preview) preview.innerHTML = `<img src="${optimizedDataUrl}" alt="Partner Preview">`;
        if (urlInput) urlInput.value = optimizedDataUrl;
        if (clearBtn) clearBtn.style.display = 'inline-flex';
        toast('Photo uploaded and formatted successfully!', 'success');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  });

  // Drag & drop handlers
  ['dragenter', 'dragover'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-active');
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-active');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  });

  // Clicking dropzone opens file dialog
  dropzone.addEventListener('click', (e) => {
    if (e.target.closest('#thought-image-file') || e.target.closest('.btn-browse-file')) return;
    fileInput.click();
  });

  // Manual URL input sync
  if (urlInput) {
    urlInput.addEventListener('input', () => {
      const val = urlInput.value.trim();
      if (val) {
        if (preview) preview.innerHTML = `<img src="${val}" alt="Partner Preview" onerror="this.onerror=null;this.parentNode.innerHTML='<i class=\\'fa-solid fa-user-tie\\'></i>'">`;
        if (clearBtn) clearBtn.style.display = 'inline-flex';
      } else {
        clearThoughtImage();
      }
    });
  }
}

function clearThoughtImage() {
  const urlInput = document.getElementById('thought-image');
  const fileInput = document.getElementById('thought-image-file');
  const preview = document.getElementById('thought-avatar-preview');
  const clearBtn = document.getElementById('thought-clear-image');

  if (urlInput) urlInput.value = '';
  if (fileInput) fileInput.value = '';
  if (preview) preview.innerHTML = '<i class="fa-solid fa-user-tie"></i>';
  if (clearBtn) clearBtn.style.display = 'none';
}

function openAddThought() {
  editingThoughtId = null;
  document.getElementById('thought-modal-title').textContent = 'Add Partner Thought';
  document.getElementById('thought-form').reset();
  document.getElementById('thought-id').value = '';
  document.getElementById('thought-published').checked = true;
  clearThoughtImage();
  openModal('thought-modal');
}

function editThought(id) {
  const t = STATE.partner_thoughts.find(x => x.id === id);
  if (!t) return;
  editingThoughtId = id;
  document.getElementById('thought-modal-title').textContent = 'Edit Partner Thought';
  document.getElementById('thought-id').value = t.id;
  document.getElementById('thought-partner').value = t.partner;
  document.getElementById('thought-designation').value = t.designation || '';
  document.getElementById('thought-category').value = t.category || 'General';
  document.getElementById('thought-thought').value = t.thought;
  document.getElementById('thought-date').value = t.date || '';
  document.getElementById('thought-published').checked = !!t.published;

  const urlInput = document.getElementById('thought-image');
  const preview = document.getElementById('thought-avatar-preview');
  const clearBtn = document.getElementById('thought-clear-image');

  if (t.image) {
    if (urlInput) urlInput.value = t.image;
    if (preview) preview.innerHTML = `<img src="${t.image}" alt="${escHtml(t.partner)}" onerror="this.onerror=null;this.parentNode.innerHTML='<i class=\\'fa-solid fa-user-tie\\'></i>'">`;
    if (clearBtn) clearBtn.style.display = 'inline-flex';
  } else {
    clearThoughtImage();
  }

  openModal('thought-modal');
}

function saveThought() {
  const form = document.getElementById('thought-form');
  const partner = form.querySelector('#thought-partner').value.trim();
  const designation = form.querySelector('#thought-designation').value.trim();
  const thought = form.querySelector('#thought-thought').value.trim();
  const category = form.querySelector('#thought-category').value.trim();
  const image = form.querySelector('#thought-image').value.trim();
  const date = form.querySelector('#thought-date').value;
  const published = form.querySelector('#thought-published').checked;
  if (!partner || !thought) { toast('Partner name and thought are required.', 'error'); return; }
  const id = editingThoughtId || uid();
  const obj = { id, partner, designation, thought, category, image, date, published };
  if (editingThoughtId) {
    const idx = STATE.partner_thoughts.findIndex(x => x.id === editingThoughtId);
    if (idx !== -1) STATE.partner_thoughts[idx] = obj;
    logActivity(`Updated thought by ${partner}`, 'gold');
    toast('Thought updated successfully!');
  } else {
    STATE.partner_thoughts.unshift(obj);
    logActivity(`Added new thought by ${partner}`, 'sage');
    toast('Thought added successfully!');
  }
  saveState();
  closeModal('thought-modal');
  renderThoughts();
}

async function deleteThought(id) {
  const t = STATE.partner_thoughts.find(x => x.id === id);
  if (!t) return;
  const ok = await confirm(`Delete thought by ${t.partner}? This cannot be undone.`);
  if (!ok) return;
  STATE.partner_thoughts = STATE.partner_thoughts.filter(x => x.id !== id);
  logActivity(`Deleted thought by ${t.partner}`, 'crimson');
  saveState();
  renderThoughts();
  toast('Thought deleted.', 'warn');
}

window.filterThoughts = filterThoughts;
window.clearThoughtImage = clearThoughtImage;

/* ═══════════════════════════════════════════════════════
   EBOOKS
═══════════════════════════════════════════════════════ */
let editingEbookId = null;
function renderEbooks(filterList = null) {
  const grid = document.getElementById('ebooks-grid');
  const list = filterList !== null ? filterList : STATE.resources.ebooks;
  if (!list.length) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-book-open"></i><p>No eBooks found. Click "Add eBook" to upload one.</p></div>';
    return;
  }
  grid.innerHTML = list.map(e => `
    <div class="resource-card">
      <div class="resource-thumb">
        <i class="fa-solid fa-book-open"></i>
        <span class="badge thumb-badge ${e.published ? 'badge-success' : 'badge-draft'}">${e.published ? 'Live' : 'Draft'}</span>
      </div>
      <div class="resource-card-body">
        <div class="resource-title">${escHtml(e.title)}</div>
        <div class="resource-meta">
          <span><i class="fa-solid fa-tag"></i> ${escHtml(e.category || 'General')}</span>
          <span><i class="fa-regular fa-calendar"></i> ${e.date || '—'}</span>
        </div>
        ${e.description ? `<div style="font-size:.8rem;color:var(--muted);margin-top:.5rem;">${escHtml(e.description.slice(0,80))}…</div>` : ''}
        <div class="resource-actions">
          ${e.url ? `<a href="${e.url}" target="_blank" class="topbar-btn btn-outline btn-sm"><i class="fa-solid fa-eye"></i> View</a>` : ''}
          <button class="topbar-btn btn-outline btn-sm" onclick="editEbook('${e.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="topbar-btn btn-danger btn-sm" onclick="deleteEbook('${e.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    </div>`).join('');
}

function filterEbooks() {
  const q = (document.getElementById('ebooks-search')?.value || '').toLowerCase().trim();
  const filtered = STATE.resources.ebooks.filter(e => {
    return !q || (e.title && e.title.toLowerCase().includes(q)) || (e.category && e.category.toLowerCase().includes(q));
  });
  renderEbooks(filtered);
}
window.filterEbooks = filterEbooks;

function openAddEbook() {
  editingEbookId = null;
  document.getElementById('ebook-modal-title').textContent = 'Add eBook';
  document.getElementById('ebook-form').reset();
  document.getElementById('ebook-id').value = '';
  document.getElementById('ebook-published').checked = true;
  openModal('ebook-modal');
}
function editEbook(id) {
  const e = STATE.resources.ebooks.find(x => x.id === id);
  if (!e) return;
  editingEbookId = id;
  document.getElementById('ebook-modal-title').textContent = 'Edit eBook';
  document.getElementById('ebook-id').value = e.id;
  document.getElementById('ebook-title').value = e.title || '';
  document.getElementById('ebook-category').value = e.category || '';
  document.getElementById('ebook-description').value = e.description || '';
  document.getElementById('ebook-url').value = e.url || '';
  document.getElementById('ebook-cover').value = e.cover || '';
  document.getElementById('ebook-date').value = e.date || '';
  document.getElementById('ebook-published').checked = !!e.published;
  openModal('ebook-modal');
}
function saveEbook() {
  const form = document.getElementById('ebook-form');
  const title = form.querySelector('#ebook-title').value.trim();
  if (!title) { toast('Title is required.', 'error'); return; }
  const obj = {
    id: editingEbookId || uid(),
    title,
    category: form.querySelector('#ebook-category').value.trim(),
    description: form.querySelector('#ebook-description').value.trim(),
    url: form.querySelector('#ebook-url').value.trim(),
    cover: form.querySelector('#ebook-cover').value.trim(),
    date: form.querySelector('#ebook-date').value,
    published: form.querySelector('#ebook-published').checked
  };
  if (editingEbookId) {
    const idx = STATE.resources.ebooks.findIndex(x => x.id === editingEbookId);
    if (idx !== -1) STATE.resources.ebooks[idx] = obj;
    logActivity(`Updated eBook: ${title}`, 'gold');
    toast('eBook updated!');
  } else {
    STATE.resources.ebooks.unshift(obj);
    logActivity(`Added eBook: ${title}`, 'sage');
    toast('eBook added!');
  }
  saveState(); closeModal('ebook-modal'); renderEbooks();
}
async function deleteEbook(id) {
  const e = STATE.resources.ebooks.find(x => x.id === id);
  if (!e) return;
  if (!await confirm(`Delete eBook "${e.title}"?`)) return;
  STATE.resources.ebooks = STATE.resources.ebooks.filter(x => x.id !== id);
  logActivity(`Deleted eBook: ${e.title}`, 'crimson');
  saveState(); renderEbooks(); toast('eBook deleted.', 'warn');
}

/* ═══════════════════════════════════════════════════════
   PRESENTATIONS
═══════════════════════════════════════════════════════ */
let editingPresId = null;
function renderPresentations(filterList = null) {
  const grid = document.getElementById('presentations-grid');
  const list = filterList !== null ? filterList : STATE.resources.presentations;
  if (!list.length) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-file-powerpoint"></i><p>No presentations found. Click "Add Presentation" to upload one.</p></div>';
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="resource-card">
      <div class="resource-thumb" style="background:linear-gradient(135deg,#A7253A,#8f1e31);">
        <i class="fa-solid fa-file-powerpoint"></i>
        <span class="badge thumb-badge ${p.published ? 'badge-success' : 'badge-draft'}">${p.published ? 'Live' : 'Draft'}</span>
      </div>
      <div class="resource-card-body">
        <div class="resource-title">${escHtml(p.title)}</div>
        <div class="resource-meta">
          <span><i class="fa-solid fa-tag"></i> ${escHtml(p.category || 'General')}</span>
          <span><i class="fa-regular fa-calendar"></i> ${p.date || '—'}</span>
        </div>
        <div class="resource-actions">
          ${p.url ? `<a href="${p.url}" target="_blank" class="topbar-btn btn-outline btn-sm"><i class="fa-solid fa-eye"></i> View</a>` : ''}
          <button class="topbar-btn btn-outline btn-sm" onclick="editPres('${p.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="topbar-btn btn-danger btn-sm" onclick="deletePres('${p.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    </div>`).join('');
}

function filterPresentations() {
  const q = (document.getElementById('presentations-search')?.value || '').toLowerCase().trim();
  const filtered = STATE.resources.presentations.filter(p => {
    return !q || (p.title && p.title.toLowerCase().includes(q)) || (p.category && p.category.toLowerCase().includes(q));
  });
  renderPresentations(filtered);
}
window.filterPresentations = filterPresentations;
function openAddPres() {
  editingPresId = null;
  document.getElementById('pres-modal-title').textContent = 'Add Presentation';
  document.getElementById('pres-form').reset();
  document.getElementById('pres-id').value = '';
  document.getElementById('pres-published').checked = true;
  openModal('pres-modal');
}
function editPres(id) {
  const p = STATE.resources.presentations.find(x => x.id === id);
  if (!p) return;
  editingPresId = id;
  document.getElementById('pres-modal-title').textContent = 'Edit Presentation';
  document.getElementById('pres-id').value = p.id;
  document.getElementById('pres-title').value = p.title || '';
  document.getElementById('pres-category').value = p.category || '';
  document.getElementById('pres-description').value = p.description || '';
  document.getElementById('pres-url').value = p.url || '';
  document.getElementById('pres-embed').value = p.embed || '';
  document.getElementById('pres-date').value = p.date || '';
  document.getElementById('pres-published').checked = !!p.published;
  openModal('pres-modal');
}
function savePres() {
  const form = document.getElementById('pres-form');
  const title = form.querySelector('#pres-title').value.trim();
  if (!title) { toast('Title is required.', 'error'); return; }
  const obj = {
    id: editingPresId || uid(),
    title,
    category: form.querySelector('#pres-category').value.trim(),
    description: form.querySelector('#pres-description').value.trim(),
    url: form.querySelector('#pres-url').value.trim(),
    embed: form.querySelector('#pres-embed').value.trim(),
    date: form.querySelector('#pres-date').value,
    published: form.querySelector('#pres-published').checked
  };
  if (editingPresId) {
    const idx = STATE.resources.presentations.findIndex(x => x.id === editingPresId);
    if (idx !== -1) STATE.resources.presentations[idx] = obj;
    logActivity(`Updated presentation: ${title}`, 'gold');
    toast('Presentation updated!');
  } else {
    STATE.resources.presentations.unshift(obj);
    logActivity(`Added presentation: ${title}`, 'sage');
    toast('Presentation added!');
  }
  saveState(); closeModal('pres-modal'); renderPresentations();
}
async function deletePres(id) {
  const p = STATE.resources.presentations.find(x => x.id === id);
  if (!p) return;
  if (!await confirm(`Delete presentation "${p.title}"?`)) return;
  STATE.resources.presentations = STATE.resources.presentations.filter(x => x.id !== id);
  logActivity(`Deleted presentation: ${p.title}`, 'crimson');
  saveState(); renderPresentations(); toast('Presentation deleted.', 'warn');
}

/* ═══════════════════════════════════════════════════════
   YOUTUBE VIDEOS
═══════════════════════════════════════════════════════ */
let editingVideoId = null;
function renderVideos(filterList = null) {
  const grid = document.getElementById('videos-grid');
  const list = filterList !== null ? filterList : STATE.resources.videos;
  if (!list.length) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="fa-brands fa-youtube"></i><p>No videos found. Click "Add Video" to embed one.</p></div>';
    return;
  }
  grid.innerHTML = list.map(v => {
    const ytId = extractYtId(v.url);
    return `
    <div class="resource-card">
      <div class="resource-thumb" style="background:#18191C;padding:0;height:160px;">
        ${ytId
          ? `<iframe src="https://www.youtube.com/embed/${ytId}?rel=0" allowfullscreen style="width:100%;height:100%;border:none;"></iframe>`
          : `<div class="video-thumb-placeholder"><i class="fa-brands fa-youtube" style="color:#FF0000"></i><span>No valid YouTube URL</span></div>`}
        <span class="badge thumb-badge ${v.published ? 'badge-success' : 'badge-draft'}" style="position:absolute;top:.5rem;right:.5rem">${v.published ? 'Live' : 'Draft'}</span>
      </div>
      <div class="resource-card-body">
        <div class="resource-title">${escHtml(v.title)}</div>
        <div class="resource-meta">
          <span><i class="fa-solid fa-tag"></i> ${escHtml(v.category || 'General')}</span>
          <span><i class="fa-regular fa-calendar"></i> ${v.date || '—'}</span>
        </div>
        <div class="resource-actions">
          ${v.url ? `<a href="${v.url}" target="_blank" class="topbar-btn btn-outline btn-sm"><i class="fa-brands fa-youtube"></i> Watch</a>` : ''}
          <button class="topbar-btn btn-outline btn-sm" onclick="editVideo('${v.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="topbar-btn btn-danger btn-sm" onclick="deleteVideo('${v.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function filterVideos() {
  const q = (document.getElementById('videos-search')?.value || '').toLowerCase().trim();
  const filtered = STATE.resources.videos.filter(v => {
    return !q || (v.title && v.title.toLowerCase().includes(q)) || (v.category && v.category.toLowerCase().includes(q));
  });
  renderVideos(filtered);
}
window.filterVideos = filterVideos;

function extractYtId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function openAddVideo() {
  editingVideoId = null;
  document.getElementById('video-modal-title').textContent = 'Add YouTube Video';
  document.getElementById('video-form').reset();
  document.getElementById('video-id').value = '';
  document.getElementById('video-published').checked = true;
  openModal('video-modal');
}
function editVideo(id) {
  const v = STATE.resources.videos.find(x => x.id === id);
  if (!v) return;
  editingVideoId = id;
  document.getElementById('video-modal-title').textContent = 'Edit Video';
  document.getElementById('video-id').value = v.id;
  document.getElementById('video-title').value = v.title || '';
  document.getElementById('video-url').value = v.url || '';
  document.getElementById('video-category').value = v.category || '';
  document.getElementById('video-description').value = v.description || '';
  document.getElementById('video-date').value = v.date || '';
  document.getElementById('video-published').checked = !!v.published;
  openModal('video-modal');
}
function saveVideo() {
  const form = document.getElementById('video-form');
  const title = form.querySelector('#video-title').value.trim();
  const url   = form.querySelector('#video-url').value.trim();
  if (!title || !url) { toast('Title and YouTube URL are required.', 'error'); return; }
  if (!extractYtId(url)) { toast('Please enter a valid YouTube URL.', 'error'); return; }
  const obj = {
    id: editingVideoId || uid(),
    title, url,
    category: form.querySelector('#video-category').value.trim(),
    description: form.querySelector('#video-description').value.trim(),
    date: form.querySelector('#video-date').value,
    published: form.querySelector('#video-published').checked
  };
  if (editingVideoId) {
    const idx = STATE.resources.videos.findIndex(x => x.id === editingVideoId);
    if (idx !== -1) STATE.resources.videos[idx] = obj;
    logActivity(`Updated video: ${title}`, 'gold');
    toast('Video updated!');
  } else {
    STATE.resources.videos.unshift(obj);
    logActivity(`Added video: ${title}`, 'sage');
    toast('Video added!');
  }
  saveState(); closeModal('video-modal'); renderVideos();
}
async function deleteVideo(id) {
  const v = STATE.resources.videos.find(x => x.id === id);
  if (!v) return;
  if (!await confirm(`Delete video "${v.title}"?`)) return;
  STATE.resources.videos = STATE.resources.videos.filter(x => x.id !== id);
  logActivity(`Deleted video: ${v.title}`, 'crimson');
  saveState(); renderVideos(); toast('Video deleted.', 'warn');
}

/* ═══════════════════════════════════════════════════════
   SETTINGS
═══════════════════════════════════════════════════════ */
function renderSettings() {
  const s = STATE.settings;
  document.getElementById('set-email').value       = s.contact_email || '';
  document.getElementById('set-wa').value          = s.whatsapp_number || '';
  document.getElementById('set-phone').value       = s.site_phone || '';
  document.getElementById('set-phone2').value      = s.site_phone2 || '';
  document.getElementById('set-address').value     = s.site_address || '';
  document.getElementById('set-ejs-key').value     = s.emailjs_public_key || '';
  document.getElementById('set-ejs-service').value = s.emailjs_service_id || '';
  document.getElementById('set-ejs-tpl').value     = s.emailjs_template_id || '';
  document.getElementById('set-linkedin').value    = s.linkedin_url || '';
  document.getElementById('set-twitter').value     = s.twitter_url || '';
}

function saveSettings() {
  STATE.settings.contact_email       = document.getElementById('set-email').value.trim();
  STATE.settings.whatsapp_number     = document.getElementById('set-wa').value.trim();
  STATE.settings.site_phone          = document.getElementById('set-phone').value.trim();
  STATE.settings.site_phone2         = document.getElementById('set-phone2').value.trim();
  STATE.settings.site_address        = document.getElementById('set-address').value.trim();
  STATE.settings.emailjs_public_key  = document.getElementById('set-ejs-key').value.trim();
  STATE.settings.emailjs_service_id  = document.getElementById('set-ejs-service').value.trim();
  STATE.settings.emailjs_template_id = document.getElementById('set-ejs-tpl').value.trim();
  STATE.settings.linkedin_url        = document.getElementById('set-linkedin').value.trim();
  STATE.settings.twitter_url         = document.getElementById('set-twitter').value.trim();
  saveState();
  logActivity('Updated site settings', 'sage');
  toast('Settings saved successfully!');

  // Inject EmailJS keys into main.js via localStorage (picked up by main.js on load)
  localStorage.setItem('bgss_emailjs_key', STATE.settings.emailjs_public_key);
  localStorage.setItem('bgss_emailjs_service', STATE.settings.emailjs_service_id);
  localStorage.setItem('bgss_emailjs_template', STATE.settings.emailjs_template_id);
  localStorage.setItem('bgss_contact_email', STATE.settings.contact_email);
  localStorage.setItem('bgss_wa_number', STATE.settings.whatsapp_number);
}

/* ═══════════════════════════════════════════════════════
   ENQUIRIES (placeholder)
═══════════════════════════════════════════════════════ */
function renderEnquiries() {
  const tbody = document.getElementById('enquiries-tbody');
  if (!STATE.enquiries || !STATE.enquiries.length) {
    tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-inbox"></i><p>No enquiries received yet.</p></div></td></tr>';
    return;
  }
  tbody.innerHTML = STATE.enquiries.map(q => `
    <tr>
      <td>${escHtml(q.name || '—')}</td>
      <td>${escHtml(q.email || '—')}</td>
      <td>${escHtml(q.phone || '—')}</td>
      <td>${escHtml(q.service || '—')}</td>
      <td>${escHtml(q.date || '—')}</td>
      <td><span class="badge badge-gold">${escHtml(q.status || 'New')}</span></td>
    </tr>`).join('');
}

/* ═══════════════════════════════════════════════════════
   EXPORT DATA JSON
═══════════════════════════════════════════════════════ */
function exportData() {
  const blob = new Blob([JSON.stringify(STATE, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'bgss-site-data.json';
  a.click(); URL.revokeObjectURL(url);
  toast('Data exported as bgss-site-data.json');
  logActivity('Exported site data JSON', 'navy');
}

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
function escHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function initials(name) {
  return (name || '').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
}

/* ═══════════════════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════════════════ */
function attemptLogin() {
  const pass = document.getElementById('admin-pass').value;
  const err  = document.getElementById('login-error');
  if (pass === ADMIN_PASS) {
    document.getElementById('login-screen').style.display = 'none';
    const app = document.getElementById('app');
    app.style.display = 'flex';
    app.classList.add('active');
    sessionStorage.setItem('bgss_admin_auth', '1');
    navigate('dashboard');
  } else {
    err.style.display = 'block';
    err.textContent = 'Incorrect password. Please try again.';
    document.getElementById('admin-pass').value = '';
    document.getElementById('admin-pass').focus();
  }
}

function logout() {
  sessionStorage.removeItem('bgss_admin_auth');
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app').classList.remove('active');
  document.getElementById('app').style.display = 'none';
  document.getElementById('admin-pass').value = '';
}

/* ═══════════════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  setupThoughtImageUpload();

  // Auto-login if same session
  if (sessionStorage.getItem('bgss_admin_auth') === '1') {
    document.getElementById('login-screen').style.display = 'none';
    const app = document.getElementById('app');
    app.style.display = 'flex';
    app.classList.add('active');
    navigate('dashboard');
  }

  // Login form
  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault(); attemptLogin();
  });

  // Nav items
  document.querySelectorAll('[data-panel]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.panel));
  });

  // Mobile sidebar
  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('mobile-open');
    document.getElementById('sidebar-overlay').classList.toggle('show');
  });
  document.getElementById('sidebar-overlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('mobile-open');
    document.getElementById('sidebar-overlay').classList.remove('show');
  });

  // Modal close on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(bd => {
    bd.addEventListener('click', e => {
      if (e.target === bd && bd.id !== 'confirm-modal') closeModal(bd.id);
    });
  });
});
