const API = 'http://localhost:5000/api';

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token) window.location.href = 'index.html';

document.getElementById('nav-username').textContent = user.name || '';

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// Check if viewing existing report
const urlParams = new URLSearchParams(window.location.search);
const reportId = urlParams.get('id');

if (reportId) {
  loadExistingReport(reportId);
}

async function loadExistingReport(id) {
  try {
    const res = await fetch(`${API}/reports/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const report = await res.json();
    if (!res.ok) return;

    document.getElementById('page-title').textContent = 'Report Details';
    document.getElementById('bug-report').value = report.rawReport;
    document.getElementById('analyze-btn').textContent = '🔍 Re-analyze';
    renderResult(report.analysis);
  } catch (err) {
    console.error(err);
  }
}

async function analyzeReport() {
  const rawReport = document.getElementById('bug-report').value.trim();
  const errorEl = document.getElementById('analyze-error');
  const btn = document.getElementById('analyze-btn');

  if (!rawReport) {
    errorEl.textContent = 'Please paste a bug report first';
    return;
  }

  errorEl.textContent = '';
  btn.disabled = true;
  btn.textContent = '⏳ Analyzing...';

  document.getElementById('result-container').innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>AI is analyzing your bug report...</p>
    </div>`;

  try {
    const res = await fetch(`${API}/reports/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ rawReport })
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.message;
      btn.disabled = false;
      btn.textContent = '🔍 Analyze with AI';
      document.getElementById('result-container').innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">❌</div>
          <p>Analysis failed. Try again.</p>
        </div>`;
      return;
    }

    renderResult(data.analysis);
    btn.disabled = false;
    btn.textContent = '🔍 Analyze with AI';

  } catch (err) {
    errorEl.textContent = 'Something went wrong. Try again.';
    btn.disabled = false;
    btn.textContent = '🔍 Analyze with AI';
  }
}

function renderResult(analysis) {
  document.getElementById('result-container').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="severity-badge severity-${analysis.severity}">${analysis.severity}</span>
      <span class="category-tag">${analysis.category}</span>
    </div>

    <div class="result-field">
      <div class="field-label">Title</div>
      <div class="field-value">${analysis.title}</div>
    </div>

    <div class="result-field">
      <div class="field-label">Steps to Reproduce</div>
      <ol class="steps-list">
        ${analysis.stepsToReproduce.map(s => `<li>${s}</li>`).join('')}
      </ol>
    </div>

    <div class="result-field">
      <div class="field-label">Expected Behavior</div>
      <div class="field-value">${analysis.expectedBehavior}</div>
    </div>

    <div class="result-field">
      <div class="field-label">Actual Behavior</div>
      <div class="field-value">${analysis.actualBehavior}</div>
    </div>

    <div class="result-field">
      <div class="field-label">Probable Root Cause</div>
      <div class="field-value">${analysis.probableRootCause}</div>
    </div>

    <div class="result-field">
      <div class="field-label">Suggested Fix</div>
      <div class="field-value">${analysis.suggestedFix}</div>
    </div>
  `;
}