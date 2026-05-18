const API = 'http://localhost:5000/api';

// Check auth
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token) {
  window.location.href = 'index.html';
}

// Set username in navbar
document.getElementById('nav-username').textContent = user.name || '';

// Logout
function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// Load reports
async function loadReports() {
  try {
    const res = await fetch(`${API}/reports`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const reports = await res.json();

    if (!res.ok) {
      window.location.href = 'index.html';
      return;
    }

    // Update stats
    document.getElementById('stat-total').textContent = reports.length;
    document.getElementById('stat-critical').textContent =
      reports.filter(r => r.analysis.severity === 'Critical').length;
    document.getElementById('stat-high').textContent =
      reports.filter(r => r.analysis.severity === 'High').length;
    document.getElementById('stat-other').textContent =
      reports.filter(r => ['Medium','Low'].includes(r.analysis.severity)).length;

    // Render reports
    const container = document.getElementById('reports-list');

    if (reports.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <p>No reports yet. Analyze your first bug!</p>
          <br/>
          <button class="btn-primary" onclick="window.location.href='analyzer.html'"
            style="width:auto;padding:10px 24px">
            Analyze a Bug
          </button>
        </div>`;
      return;
    }

    container.innerHTML = reports.map(report => `
      <div class="report-card" onclick="window.location.href='analyzer.html?id=${report._id}'">
        <div class="report-card-header">
          <div class="report-title">${report.analysis.title || 'Untitled Report'}</div>
          <span class="severity-badge severity-${report.analysis.severity}">
            ${report.analysis.severity}
          </span>
        </div>
        <p style="font-size:13px;color:#64748b;margin-top:6px">
          ${report.rawReport.substring(0, 100)}...
        </p>
        <div class="report-meta">
          <span class="category-tag">${report.analysis.category}</span>
          <span>${new Date(report.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error(err);
  }
}

loadReports();