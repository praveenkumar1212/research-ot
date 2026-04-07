const API_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' ? 'http://127.0.0.1:5000/api' : 'https://research-ot.onrender.com/api';

// Utility: Get Token
function getToken() {
    return localStorage.getItem('token');
}

// Utility: Status to class
function statusClass(status) {
    switch (status) {
        case "Pending": return "badge status-pending";
        case "Ongoing": return "badge status-ongoing";
        case "Completed": return "badge status-completed";
        case "Published": return "badge status-published";
        default: return "badge";
    }
}

// --- Data Loading Functions ---

async function loadResearch() {
    const activeTableBody = document.querySelector("#research-table tbody");
    const publishedTableBody = document.querySelector("#published-table tbody");
    if (!activeTableBody && !publishedTableBody) return;

    try {
        const res = await fetch(`${API_URL}/research?user=me`, {
            headers: { 'x-auth-token': getToken() }
        });
        const data = await res.json();

        // Update Stats
        if (document.getElementById('total-projects-val')) document.getElementById('total-projects-val').textContent = data.length;
        if (document.getElementById('ongoing-val')) document.getElementById('ongoing-val').textContent = data.filter(r => r.status === 'Ongoing').length;
        if (document.getElementById('published-val')) document.getElementById('published-val').textContent = data.filter(r => r.status === 'Published').length;

        // Render Active Table
        if (activeTableBody) {
            activeTableBody.innerHTML = "";
            let pendingLabels = [];
            let pendingData = [];
            
            data.filter(r => r.status !== "Published").forEach(r => {
                const tr = document.createElement("tr");
                let progressHtml = '';
                let updateBtnHtml = '';
                let publishBtnHtml = '';
                
                if (r.status === 'Pending' || r.status === 'Completed') {
                    const progressCount = r.progress ? r.progress.length : 0;
                    const progressPercent = r.status === 'Completed' ? 100 : Math.round((progressCount / 7) * 100);
                    
                    if (r.status === 'Pending') {
                        pendingLabels.push(r.title);
                        pendingData.push(progressPercent);
                    }

                    progressHtml = `
                        <div class="progress-container">
                            <div class="progress-bar-fill" style="width: ${progressPercent}%; ${r.status === 'Completed' ? 'background: var(--success);' : ''}"></div>
                        </div>
                        <div style="font-size: 0.7rem; color: var(--text-muted); text-align: right; margin-top: 2px;">${progressPercent}%</div>
                    `;
                    
                    if (r.status === 'Pending') {
                        updateBtnHtml = `<button class="btn update-progress-btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; width: auto; white-space: nowrap; background: linear-gradient(135deg, hsl(190, 100%, 60%), hsl(190, 80%, 50%));" 
                            data-id="${r._id}" 
                            data-name="${r.title.replace(/"/g, '&quot;')}"
                            data-progress='${JSON.stringify(r.progress || [])}'>Update</button>`;
                    } else if (r.status === 'Completed') {
                        publishBtnHtml = `<button class="btn btn-secondary publish-btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; width: auto; white-space: nowrap;" data-id="${r._id}" data-name="${r.title.replace(/"/g, '&quot;')}">Publish</button>`;
                    }
                }

                tr.innerHTML = `
                    <td style="font-weight: 500;">${r.title}</td>
                    <td style="color: var(--text-muted);">${r.description.substring(0, 100)}...</td>
                    <td>${new Date(r.startDate).toLocaleDateString()}</td>
                    <td>
                        <span class="${statusClass(r.status)}">${r.status}</span>
                        ${progressHtml}
                    </td>
                    <td>
                        <div style="display: flex; gap: 0.5rem; justify-content: flex-start; align-items: center;">
                            ${updateBtnHtml}
                            ${publishBtnHtml}
                            <button class="btn btn-danger delete-btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; background: #ff4d4d; border-color: #ff4d4d; width: auto; white-space: nowrap;" data-id="${r._id}" data-name="${r.title.replace(/"/g, '&quot;')}">Delete</button>
                        </div>
                    </td>
                `;
                activeTableBody.appendChild(tr);
            });
            
            // Render Progress Chart
            const chartContainer = document.getElementById('progress-chart-container');
            if (chartContainer) {
                if (pendingLabels.length > 0) {
                    chartContainer.style.display = 'block';
                    const ctx = document.getElementById('progressChart').getContext('2d');
                    if (window.progressChartInstance) {
                        window.progressChartInstance.destroy();
                    }
                    window.progressChartInstance = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: pendingLabels,
                            datasets: [{
                                label: 'Progress %',
                                data: pendingData,
                                backgroundColor: 'hsl(190, 100%, 60%)',
                                borderRadius: 6,
                                maxBarThickness: 50
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    max: 100,
                                    ticks: { color: '#888' },
                                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                                },
                                x: {
                                    ticks: { color: '#888' },
                                    grid: { display: false }
                                }
                            },
                            plugins: {
                                legend: { display: false }
                            }
                        }
                    });
                } else {
                    chartContainer.style.display = 'none';
                }
            }
        }

        // Render Published Table
        if (publishedTableBody) {
            try {
                const pubRes = await fetch(`${API_URL}/research?status=Published`, {
                    headers: { 'x-auth-token': getToken() }
                });
                const pubData = await pubRes.json();
                publishedTableBody.innerHTML = "";
                pubData.forEach(r => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td style="font-weight: 500;">${r.title}</td>
                        <td style="color: var(--text-muted);">${r.description.substring(0, 100)}...</td>
                        <td>${new Date(r.startDate).toLocaleDateString()}</td>
                        <td><span class="badge status-published">Public</span></td>
                        <td>
                            <button class="btn btn-secondary view-details-btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; width: auto; white-space: nowrap;" 
                                data-id="${r._id}" 
                                data-title="${r.title.replace(/"/g, '&quot;')}"
                                data-desc="${r.description.replace(/"/g, '&quot;')}"
                                data-date="${r.startDate}">
                                View Details
                            </button>
                        </td>
                    `;
                    publishedTableBody.appendChild(tr);
                });
            } catch (err) {
                console.error('Error loading published research:', err);
            }
        }
    } catch (err) {
        console.error('Error loading research:', err);
    }
}

async function loadReports() {
    const tableBody = document.querySelector("#reports-table tbody");
    if (!tableBody) return;

    try {
        const res = await fetch(`${API_URL}/research?user=me`, {
            headers: { 'x-auth-token': getToken() }
        });
        const items = await res.json();

        tableBody.innerHTML = "";
        items.forEach(r => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="font-weight: 500;">${r.title}</td>
                <td style="color: var(--text-muted);">${r.description}</td>
                <td>${new Date(r.startDate).toLocaleDateString()}</td>
                <td><span class="${statusClass(r.status)}">${r.status}</span></td>
            `;
            tableBody.appendChild(tr);
        });

        // Summary stats
        if (document.getElementById("total-research")) document.getElementById("total-research").textContent = items.length;
        if (document.getElementById("ongoing-count")) document.getElementById("ongoing-count").textContent = items.filter(r => r.status === "Ongoing").length;
        if (document.getElementById("completed-count")) document.getElementById("completed-count").textContent = items.filter(r => r.status === "Completed").length;
        if (document.getElementById("published-count")) document.getElementById("published-count").textContent = items.filter(r => r.status === "Published").length;
    } catch (err) {
        console.error('Error loading reports:', err);
    }
}



// --- Main Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth Guard
    const isAuthPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('register.html') || window.location.pathname === '/' || window.location.pathname.includes('/index.html') || window.location.pathname.includes('/register.html');
    if (!getToken() && !isAuthPage) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Dashboard User Welcome
    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) welcomeName.textContent = user.name;
    }

    // 3. Login Form
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value.toLowerCase().trim();
            const password = document.getElementById("login-password").value;

            try {
                const res = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = "dashboard.html";
                } else {
                    alert(data.msg || "Login failed");
                }
            } catch (err) {
                console.error("Login error:", err);
                alert(`Network error: ${err.message}. Check if backend is running.`);
            }
        });
    }

    // 4. Register Form
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("register-name").value;
            const email = document.getElementById("register-email").value.toLowerCase().trim();
            const password = document.getElementById("register-password").value;
            const confirmPassword = document.getElementById("register-confirm-password").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            try {
                const res = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    alert("Registration successful! Please login.");
                    window.location.href = "index.html";
                } else {
                    alert(data.msg || "Registration failed");
                }
            } catch (err) {
                console.error("Register error:", err);
                alert(`Network error: ${err.message}. Check if backend is running.`);
            }
        });
    }

    // 5. Add Research Form
    const addForm = document.getElementById("add-research-form");
    if (addForm) {
        addForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const title = document.getElementById("title").value;
            const description = document.getElementById("description").value;
            const startDate = document.getElementById("start-date").value;
            const status = document.getElementById("status").value;

            try {
                const res = await fetch(`${API_URL}/research`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': getToken()
                    },
                    body: JSON.stringify({ title, description, startDate, status })
                });
                if (res.ok) {
                    alert("Research added successfully!");
                    window.location.href = "dashboard.html";
                } else {
                    alert("Failed to add research");
                }
            } catch (err) {
                console.error("Add error:", err);
            }
        });

        // Status color change
        const statusSelect = document.getElementById("status");
        if (statusSelect) {
            const update = () => {
                const val = statusSelect.value;
                statusSelect.classList.remove('status-select-pending', 'status-select-ongoing', 'status-select-completed', 'status-select-published');
                if (val === 'Pending') statusSelect.classList.add('status-select-pending');
                if (val === 'Ongoing') statusSelect.classList.add('status-select-ongoing');
                if (val === 'Completed') statusSelect.classList.add('status-select-completed');
                if (val === 'Published') statusSelect.classList.add('status-select-published');
            };
            statusSelect.addEventListener('change', update);
            update();
        }
    }

    // 6. Modal Handling (Delegation)
    const modal = document.getElementById("publish-modal");
    if (modal) {
        let currentId = null;
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('publish-btn')) {
                currentId = e.target.dataset.id;
                document.getElementById('modal-project-name').textContent = e.target.dataset.name;
                modal.style.display = 'flex';
            }
        });

        document.getElementById('confirm-cancel').onclick = () => modal.style.display = 'none';

        document.getElementById('confirm-publish').onclick = async () => {
            try {
                const res = await fetch(`${API_URL}/research/${currentId}/publish`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': getToken()
                    }
                });
                if (res.ok) {
                    modal.style.display = 'none';
                    loadResearch();
                }
            } catch (err) {
                console.error("Publish error:", err);
            }
        };
    }

    // 6.5 Delete Modal Handling
    const deleteModal = document.getElementById("delete-modal");
    if (deleteModal) {
        let currentDeleteId = null;
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                currentDeleteId = e.target.dataset.id;
                document.getElementById('delete-modal-project-name').textContent = e.target.dataset.name;
                deleteModal.style.display = 'flex';
            }
        });

        document.getElementById('delete-cancel').onclick = () => deleteModal.style.display = 'none';

        document.getElementById('confirm-delete').onclick = async () => {
            const url = `${API_URL}/research/${currentDeleteId}`;
            console.log('Attempting to delete:', url);
            try {
                const res = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'x-auth-token': getToken()
                    }
                });
                if (res.ok) {
                    deleteModal.style.display = 'none';
                    loadResearch();
                } else {
                    const data = await res.json();
                    alert(data.msg || "Failed to delete research");
                }
            } catch (err) {
                console.error("Delete error:", err);
                alert(`Network error while deleting: ${err.message}\nURL: ${url}`);
            }
        };
    }

    // 6.6 Update Progress Modal Handling
    const progressModal = document.getElementById("progress-modal");
    if (progressModal) {
        let currentProgressId = null;
        
        const updateModalVisuals = () => {
            const checkedCount = document.querySelectorAll('#progress-form input[type="checkbox"]:checked').length;
            const percent = Math.round((checkedCount / 7) * 100);
            document.getElementById('modal-progress-fill').style.width = `${percent}%`;
            document.getElementById('modal-progress-text').textContent = percent;
        };

        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('update-progress-btn')) {
                currentProgressId = e.target.dataset.id;
                document.getElementById('progress-project-name').textContent = e.target.dataset.name;
                
                // Parse existing progress and check boxes
                const existingProgress = JSON.parse(e.target.dataset.progress || '[]');
                const checkboxes = document.querySelectorAll('#progress-form input[type="checkbox"]');
                checkboxes.forEach(cb => {
                    cb.checked = existingProgress.includes(cb.value);
                });
                
                updateModalVisuals();
                progressModal.style.display = 'flex';
            }
        });

        // Add event listener to checkboxes manually so bar updates instantly
        document.querySelectorAll('#progress-form input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', updateModalVisuals);
        });

        document.getElementById('progress-cancel').onclick = () => {
            progressModal.style.display = 'none';
        }

        const progressForm = document.getElementById("progress-form");
        if (progressForm) {
            progressForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const checkedBoxes = Array.from(document.querySelectorAll('#progress-form input[type="checkbox"]:checked')).map(cb => cb.value);
                
                try {
                    const res = await fetch(`${API_URL}/research/${currentProgressId}/progress`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': getToken()
                        },
                        body: JSON.stringify({ progress: checkedBoxes })
                    });
                    
                    if (res.ok) {
                        progressModal.style.display = 'none';
                        loadResearch();
                    } else {
                        const data = await res.json();
                        alert(data.msg || "Failed to update progress");
                    }
                } catch (err) {
                    console.error("Progress update error:", err);
                }
            });
        }
    }

    // 6.7 Details Modal Handling
    const detailsModal = document.getElementById("details-modal");
    if (detailsModal) {
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-details-btn')) {
                const title = e.target.getAttribute('data-title');
                const desc = e.target.getAttribute('data-desc');
                const date = e.target.getAttribute('data-date');
                
                document.getElementById('details-title').textContent = title;
                document.getElementById('details-description').textContent = desc;
                document.getElementById('details-date').textContent = new Date(date).toLocaleDateString();
                
                detailsModal.style.display = 'flex';
            }
        });

        document.getElementById('details-close').onclick = () => detailsModal.style.display = 'none';
        
        // Optional: Close modal on outside click
        detailsModal.addEventListener('click', (e) => {
            if (e.target === detailsModal) {
                detailsModal.style.display = 'none';
            }
        });
    }

    // 7. Logout
    document.querySelectorAll('.sidebar-link').forEach(link => {
        if (link.textContent.trim().toLowerCase().includes('logout')) {
            link.addEventListener('click', () => {
                localStorage.clear();
                window.location.href = 'index.html';
            });
        }
    });

    // 8. Page-specific data loads
    if (document.getElementById("research-table")) loadResearch();
    if (document.getElementById("reports-table")) loadReports();

    // 9. Export CSV
    const exportCsvBtn = document.getElementById('export-csv-btn');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
            const table = document.getElementById('reports-table');
            if (!table) return;
            let csv = [];
            const rows = table.querySelectorAll('tr');
            for (let i = 0; i < rows.length; i++) {
                let row = [], cols = rows[i].querySelectorAll('td, th');
                for (let j = 0; j < cols.length; j++) {
                    let text = cols[j].innerText.replace(/"/g, '""');
                    row.push('"' + text + '"');
                }
                csv.push(row.join(','));
            }
            const csvData = new Blob([csv.join('\n')], { type: 'text/csv' });
            const csvUrl = window.URL.createObjectURL(csvData);
            const hiddenElement = document.createElement('a');
            hiddenElement.href = csvUrl;
            hiddenElement.target = '_blank';
            hiddenElement.download = 'reports.csv';
            hiddenElement.click();
        });
    }

    // 10. Download PDF
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            const element = document.querySelector('.data-card');
            if (!element) return;

            // Clone the element to avoid modifying the original DOM while PDF is generating
            const elementClone = element.cloneNode(true);

            // Adjust styling for PDF (e.g. remove real-time badge if it looks weird, tweak coloring)
            elementClone.style.padding = '20px';
            elementClone.style.background = '#fff';
            elementClone.style.color = '#000';

            // Optional: convert colored text to black so it's readable on white paper
            const textMuted = elementClone.querySelectorAll('[style*="color: var(--text-muted)"]');
            textMuted.forEach(el => el.style.color = '#666');

            const opt = {
                margin: 0.5,
                filename: 'research-reports.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(elementClone).save();
        });
    }

});
