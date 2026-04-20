// ============================================
// Supabase Client Configuration
// ============================================
const SUPABASE_URL = 'https://ewlqprnuimrwmjumhztz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3bHFwcm51aW1yd21qdW1oenR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTkxMjgsImV4cCI6MjA5MTg5NTEyOH0.fSlpNIrz6BW1f-FwdSXOK_PcOpIymc1IOEOwPL9E9eo';

let supabaseClient = null;

function initSupabase() {
    if (window.supabase && !supabaseClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase Client Initialized');
    }
    return supabaseClient;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
});

// Helper: Get current session
async function getSession() {
    const client = initSupabase();
    if (!client) return null;
    const { data: { session } } = await client.auth.getSession();
    return session;
}

// Helper: Get current user
async function getCurrentUser() {
    const session = await getSession();
    return session?.user || null;
}

// Helper: Get user profile from profiles table
async function getUserProfile() {
    const user = await getCurrentUser();
    if (!user) return null;
    const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
    return error ? null : data;
}

// Helper: Check if user is authenticated, redirect if not
async function requireAuth(redirectTo = 'login.html') {
    const session = await getSession();
    if (!session) {
        window.location.href = redirectTo;
        return false;
    }
    return true;
}

// Helper: Redirect based on role
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
