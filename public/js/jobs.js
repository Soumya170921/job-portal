async function fetchJobs(q='', location='') {
  const params = new URLSearchParams();
  if(q) params.append('q', q);
  if(location) params.append('location', location);
  const res = await fetch('/api/jobs?' + params.toString());
  const data = await res.json();
  return data;
}

function renderJobs(jobs) {
  const el = document.getElementById('jobsList');
  el.innerHTML = jobs.map(j => `
    <div class="job-card">
      <h4>${escapeHtml(j.title)}</h4>
      <div><strong>Company:</strong> ${escapeHtml(j.company || j.employer_name || '')} | <strong>Location:</strong> ${escapeHtml(j.location || '')}</div>
      <p>${escapeHtml((j.description||'').slice(0,300))}...</p>
      <a class="btn" href="/job.html?id=${j.id}">View</a>
    </div>
  `).join('');
}

function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

document.getElementById('searchBtn').addEventListener('click', async ()=>{
  const q = document.getElementById('q').value;
  const l = document.getElementById('location').value;
  const jobs = await fetchJobs(q, l);
  renderJobs(jobs);
});

fetchJobs().then(renderJobs);