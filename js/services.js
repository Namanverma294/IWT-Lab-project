// ============================================
// Services Module — Supabase PostgreSQL
// ============================================

async function fetchAllServices() {
    const { data, error } = await supabaseClient
        .from('services')
        .select('*')
        .order('service_type');
    return error ? [] : data;
}

async function fetchServicesByType(type) {
    const { data, error } = await supabaseClient
        .from('services')
        .select('*')
        .eq('service_type', type);
    return error ? [] : data;
}

async function createService(serviceData) {
    const { data, error } = await supabaseClient
        .from('services')
        .insert([serviceData])
        .select()
        .single();
    return { data, error };
}

async function linkServiceToEvent(eventId, serviceId) {
    const { data, error } = await supabaseClient
        .from('event_services')
        .insert([{ event_id: eventId, service_id: serviceId }])
        .select()
        .single();
    return { data, error };
}

async function unlinkServiceFromEvent(eventId, serviceId) {
    const { error } = await supabaseClient
        .from('event_services')
        .delete()
        .eq('event_id', eventId)
        .eq('service_id', serviceId);
    return { error };
}

async function fetchEventServices(eventId) {
    const { data, error } = await supabaseClient
        .from('event_services')
        .select('*, services(*)')
        .eq('event_id', eventId);
    return error ? [] : data;
}

// ============================================
// Budget Module — Supabase PostgreSQL
// ============================================

async function fetchEventBudget(eventId) {
    const { data, error } = await supabaseClient
        .from('budgets')
        .select('*')
        .eq('event_id', eventId)
        .maybeSingle();
    return error ? null : data;
}

async function createBudget(budgetData) {
    const { data, error } = await supabaseClient
        .from('budgets')
        .insert([budgetData])
        .select()
        .single();
    return { data, error };
}

async function updateBudget(budgetId, updates) {
    const { data, error } = await supabaseClient
        .from('budgets')
        .update(updates)
        .eq('id', budgetId)
        .select()
        .single();
    return { data, error };
}

// ============================================
// Feedback Module — Supabase PostgreSQL
// ============================================

async function submitFeedback(eventId, rating, comments) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabaseClient
        .from('feedback')
        .insert([{
            customer_id: user.id,
            event_id: eventId,
            rating: rating,
            comments: comments
        }])
        .select()
        .single();
    return { data, error };
}

async function fetchEventFeedback(eventId) {
    const { data, error } = await supabaseClient
        .from('feedback')
        .select('*, profiles!feedback_customer_id_fkey(full_name)')
        .eq('event_id', eventId)
        .order('submitted_at', { ascending: false });
    return error ? [] : data;
}

async function getAverageRating(eventId) {
    const { data, error } = await supabaseClient
        .from('feedback')
        .select('rating')
        .eq('event_id', eventId);
    if (error || !data.length) return 0;
    const sum = data.reduce((acc, f) => acc + f.rating, 0);
    return (sum / data.length).toFixed(1);
}

// ============================================
// Special Offers — Supabase PostgreSQL
// ============================================

async function fetchSpecialOffers(budgetId) {
    const { data, error } = await supabaseClient
        .from('special_offers')
        .select('*')
        .eq('budget_id', budgetId);
    return error ? [] : data;
}

async function createSpecialOffer(offerData) {
    const { data, error } = await supabaseClient
        .from('special_offers')
        .insert([offerData])
        .select()
        .single();
    return { data, error };
}
