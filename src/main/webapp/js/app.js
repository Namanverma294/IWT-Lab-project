
document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("searchQuery");
    const eventTypeSelect = document.getElementById("eventType");
    const categorySelect = document.getElementById("category");
    const eventsGrid = document.getElementById("eventsGrid");

    const statTotal = document.getElementById("statTotal");
    const statInter = document.getElementById("statInter");
    const statIntra = document.getElementById("statIntra");
    const statAttendees = document.getElementById("statAttendees");

    if (eventsGrid) {
        populateCategories();
        calculateStats();
        renderEvents(events);

        searchInput.addEventListener("input", handleFilter);
        eventTypeSelect.addEventListener("change", handleFilter);
        categorySelect.addEventListener("change", handleFilter);
    }

    function populateCategories() {
        if(!categorySelect) return;
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
    }

    function handleFilter() {
        const query = searchInput.value.toLowerCase();
        const type = eventTypeSelect.value;
        const cat = categorySelect.value;

        const filtered = events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(query) || 
                                  event.club.toLowerCase().includes(query);
            const matchesType = type === "all" || event.type === type;
            const matchesCategory = cat === "all" || event.category === cat;

            return matchesSearch && matchesType && matchesCategory;
        });

        renderEvents(filtered);
    }

    const calendarIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
    const clockIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
    const mapIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
    const userIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

    function renderEvents(eventsToRender) {
        if(!eventsGrid) return;
        eventsGrid.innerHTML = "";

        if (eventsToRender.length === 0) {
            eventsGrid.innerHTML = `<div class="no-results">
                <h3>No events found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>`;
            return;
        }

        eventsToRender.forEach(event => {
            const typeLabel = event.type === 'inter-college' ? 'Inter-College' : 'Intra-College';
            
            const card = document.createElement('div');
            card.className = "event-card";
            card.innerHTML = `
                <div class="event-card-header">
                    <span class="event-tag">${typeLabel}</span>
                    <span class="event-tag" style="background: rgba(59, 130, 246, 0.2); color: #58a6ff;">${event.category}</span>
                </div>
                <h3 class="event-card-title">${event.title}</h3>
                <p class="event-club">${event.club}</p>
                <div class="event-details">
                    <div class="detail-item">${calendarIcon} ${event.date}</div>
                    <div class="detail-item">${clockIcon} ${event.time}</div>
                    <div class="detail-item">${mapIcon} ${event.location}</div>
                </div>
                <div class="event-actions">
                    <div class="attendees">${userIcon} ${event.attendees} registered</div>
                    <button class="register-btn" onclick="alert('Register for ${event.title}')">Register</button>
                </div>
            `;
            eventsGrid.appendChild(card);
        });
    }

    function calculateStats() {
        if(!statTotal) return;
        let total = events.length;
        let inter = events.filter(e => e.type === "inter-college").length;
        let intra = events.filter(e => e.type === "intra-college").length;
        let attendees = events.reduce((sum, e) => sum + e.attendees, 0);

        statTotal.textContent = total;
        statInter.textContent = inter;
        statIntra.textContent = intra;
        statAttendees.textContent = attendees;
    }
});

const loginModalHTML = `
<div id="loginModal" class="modal-overlay" style="display: none;">
    <div class="modal-container">
        <button class="close-modal" onclick="document.getElementById('loginModal').style.display='none'">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div class="form-container" style="margin: 0; padding: 2.5rem 2.5rem; border: none; box-shadow: none; background: transparent; backdrop-filter: none; max-width: 100%;">
            <h2 style="font-size: 2rem; margin-bottom: 0.5rem; text-align: center;">Welcome Back</h2>
            <p style="color: var(--text-secondary); text-align: center; margin-bottom: 2rem;">Sign in to your Campus Connect account</p>
            
            <div id="loginError" style="color: #ff4444; text-align: center; margin-bottom: 1rem; display: none;"></div>
            <form id="loginForm">
                <div class="form-group">
                    <label for="modal-email">Email Address</label>
                    <input type="email" id="modal-email" required placeholder="student@college.edu">
                </div>
                
                <div class="form-group">
                    <label for="modal-password">Password</label>
                    <input type="password" id="modal-password" required placeholder="••••••••">
                </div>
                
                <button type="submit" class="btn-primary form-btn">Sign In</button>
            </form>
            <p style="text-align: center; margin-top: 1.5rem; color: var(--text-secondary); font-size: 0.875rem;">
                Don't have an account? <a href="#" style="color: var(--accent-primary);">Contact Admin</a>
            </p>
        </div>
    </div>
</div>
`;

if(!document.getElementById('loginModal')) {
    document.body.insertAdjacentHTML('beforeend', loginModalHTML);
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('loginModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
