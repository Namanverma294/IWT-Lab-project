

document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('modal-email').value.trim();
            const password = document.getElementById('modal-password').value;
            const errorDiv = document.getElementById('loginError');
            const btn = loginForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = 'Signing in...';
            btn.disabled = true;
            if (errorDiv) errorDiv.style.display = 'none';

            try {
                const response = await fetch('api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const json = await response.json();

                if (!json.success) {
                    if (errorDiv) {
                        errorDiv.textContent = json.message || json.error;
                        errorDiv.style.display = 'block';
                    }
                    btn.textContent = originalText;
                    btn.disabled = false;
                } else {
                    btn.textContent = '✓ Success! Redirecting...';
                    const role = json.data?.role || 'participant';
                    localStorage.setItem('userName', json.data?.name || 'User');
                    localStorage.setItem('userEmail', json.data?.email || '');
                    localStorage.setItem('userPhone', json.data?.phone || '');
                    localStorage.setItem('userRole', role);
                    setTimeout(() => redirectToDashboard(role), 500);
                }
            } catch (err) {
                console.error("Backend offline:", err);
                
                if (errorDiv) {
                    errorDiv.textContent = 'Java Backend is currently offline. Please boot Tomcat.';
                    errorDiv.style.display = 'block';
                }
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone')?.value.trim() || '';
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword')?.value;
            const role = 'participant';

            const errorDiv = document.getElementById('signupError');
            const successDiv = document.getElementById('signupSuccess');
            const btn = signupForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            if (confirmPassword && password !== confirmPassword) {
                if (errorDiv) {
                    errorDiv.textContent = 'Passwords do not match.';
                    errorDiv.style.display = 'block';
                }
                return;
            }

            btn.textContent = 'Creating account...';
            btn.disabled = true;
            if (errorDiv) errorDiv.style.display = 'none';

            const data = new URLSearchParams();
            data.append("C_name", name);
            data.append("C_email", email);
            data.append("C_phone", phone);
            data.append("password", password);
            data.append("role", role);

            try {

                const response = await fetch('api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: data.toString()
                });

                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    
                    if (successDiv) {
                        successDiv.textContent = 'Account created successfully! Redirecting to login...';
                        successDiv.style.display = 'block';
                    }
                    setTimeout(() => {
                        window.location.href = 'login.html?signup=success';
                    }, 1000);
                }
            } catch (err) {
                if (errorDiv) {
                    errorDiv.textContent = 'Java Database Server is Offline. Start Tomcat server.';
                    errorDiv.style.display = 'block';
                }
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    const authButtons = document.querySelector('.auth-buttons');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole') || 'participant';

    if (userName) {
        const welcomeTitle = document.getElementById('welcomeTitle');
        if (welcomeTitle) {
            welcomeTitle.textContent = `Welcome back, ${userName}!`;
        }

        const profileBtn = document.querySelector('a[href="profile.html"]');
        if (profileBtn) {
            profileBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px; vertical-align: text-bottom;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${userName}`;
        }

        if (authButtons && authButtons.innerHTML.includes('Log in')) {
            authButtons.innerHTML = `
                <a href="#" onclick="redirectToDashboard('${userRole}')" class="btn-login" style="padding: 0.5rem; margin: 0;">Dashboard</a>
                <a href="api/auth/logout" class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Sign Out</a>
            `;
        }
    }

    document.body.addEventListener('click', (e) => {
        const logoutLink = e.target.closest('a[href="api/auth/logout"]');
        if (logoutLink) {
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userPhone');
            localStorage.removeItem('userRole');
        }
    });

});

function redirectToDashboard(role) {
    const routes = {
        'participant': 'dashboard-participant.html',
        'organizer': 'dashboard-organizer.html',
        'faculty_advisor': 'dashboard-faculty.html',
        '4ys': 'dashboard-4ys.html',
        'oc': 'dashboard-oc.html',
        'poc': 'dashboard-poc.html'
    };
    window.location.href = routes[role] || 'dashboard-participant.html';
}
