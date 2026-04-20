// ============================================
// Authentication Module — auth.js
// Handles Sign Up, Sign In, Sign Out, Role Routing
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const client = initSupabase();
        if (!client) return;

        // ── LOGIN FORM (Global Modal) ──
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

                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email, password
                });

                if (error) {
                    if (errorDiv) {
                        errorDiv.textContent = error.message;
                        errorDiv.style.display = 'block';
                    }
                    btn.textContent = originalText;
                    btn.disabled = false;
                } else {
                    btn.textContent = '✓ Success! Redirecting...';
                    // Get user role and redirect
                    const { data: profile } = await supabaseClient
                        .from('profiles')
                        .select('role')
                        .eq('id', data.user.id)
                        .single();
                    
                    const role = profile?.role || 'participant';
                    setTimeout(() => redirectToDashboard(role), 500);
                }
            });
        }

        // ── SIGNUP FORM ──
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const phone = document.getElementById('phone')?.value.trim() || '';
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword')?.value;
                const role = document.getElementById('role')?.value || 'participant';
                const inviteCode = document.getElementById('inviteCode')?.value.trim() || '';

                const errorDiv = document.getElementById('signupError');
                const successDiv = document.getElementById('signupSuccess');
                const btn = signupForm.querySelector('button[type="submit"]');
                const originalText = btn.textContent;

                // Validation
                if (confirmPassword && password !== confirmPassword) {
                    if (errorDiv) {
                        errorDiv.textContent = 'Passwords do not match.';
                        errorDiv.style.display = 'block';
                    }
                    return;
                }

                // Internal roles require invite code
                if (role !== 'participant' && !inviteCode) {
                    if (errorDiv) {
                        errorDiv.textContent = 'An invite code is required for internal roles.';
                        errorDiv.style.display = 'block';
                    }
                    return;
                }

                btn.textContent = 'Creating account...';
                btn.disabled = true;
                if (errorDiv) errorDiv.style.display = 'none';

                const { data, error } = await supabaseClient.auth.signUp({
                    email, password,
                    options: {
                        data: { full_name: name, phone: phone, role: role }
                    }
                });

                if (error) {
                    if (errorDiv) {
                        errorDiv.textContent = error.message;
                        errorDiv.style.display = 'block';
                    }
                    btn.textContent = originalText;
                    btn.disabled = false;
                } else {
                    // PRD Bug Fix #8.1: Redirect to login, NOT home
                    if (successDiv) {
                        successDiv.textContent = 'Account created successfully! Redirecting to login...';
                        successDiv.style.display = 'block';
                    }
                    btn.textContent = '✓ Account Created!';
                    setTimeout(() => {
                        window.location.href = 'login.html?signup=success';
                    }, 1500);
                }
            });
        }

        // ── SIGN OUT ──
        const logoutBtns = document.querySelectorAll('.logout-btn, #logoutBtn');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                await supabaseClient.auth.signOut();
                window.location.href = 'index.html';
            });
        });

        // ── DETECT SIGNUP SUCCESS on login page ──
        if (window.location.pathname.includes('login.html')) {
            const params = new URLSearchParams(window.location.search);
            if (params.get('signup') === 'success') {
                const banner = document.getElementById('signupSuccessBanner');
                if (banner) banner.style.display = 'block';
            }
        }

        // ── UPDATE NAV based on auth state ──
        updateNavForAuth();

    }, 300);
});

// Update navigation buttons based on login state
async function updateNavForAuth() {
    const client = initSupabase();
    if (!client) return;

    const session = await getSession();
    const authButtons = document.querySelector('.auth-buttons');
    
    if (!authButtons) return;

    if (session) {
        const profile = await getUserProfile();
        const name = profile?.full_name || 'User';
        const role = profile?.role || 'participant';
        
        authButtons.innerHTML = `
            <span style="color: var(--text-secondary); font-size: 0.9rem;">Hi, ${name}</span>
            <a href="#" onclick="event.preventDefault(); redirectToDashboard('${role}')" class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Dashboard</a>
            <a href="#" class="btn-login logout-btn" style="padding: 0.5rem; margin: 0;">Sign out</a>
        `;

        // Re-bind logout
        authButtons.querySelector('.logout-btn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            await supabaseClient.auth.signOut();
            window.location.href = 'index.html';
        });
    }
}
