

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
    if (authButtons) {

    }

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
