// ============================================
// Events Module — CRUD via Supabase (PostgreSQL)
// ============================================

// Fetch all published events
async function fetchPublishedEvents() {
    const { data, error } = await supabaseClient
        .from('events')
        .select('*, profiles!events_organizer_id_fkey(full_name)')
        .eq('status', 'Published')
        .order('start_date', { ascending: true });
    return error ? [] : data;
}

// Fetch events for current month (Home Page)
async function fetchCurrentMonthEvents() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const { data, error } = await supabaseClient
        .from('events')
        .select('*')
        .in('status', ['Published', 'Approved'])
        .gte('start_date', startOfMonth)
        .lte('start_date', endOfMonth)
        .order('start_date', { ascending: true });
    return error ? [] : data;
}

// Fetch single event by ID
async function fetchEventById(eventId) {
    const { data, error } = await supabaseClient
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
    return error ? null : data;
}

// Create a new event
async function createEvent(eventData) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabaseClient
        .from('events')
        .insert([{
            name: eventData.name,
            type: eventData.type,
            start_date: eventData.startDate,
            end_date: eventData.endDate,
            num_guests: eventData.numGuests || 0,
            status: eventData.status || 'Draft',
            description: eventData.description || '',
            venue: eventData.venue || '',
            organizer_id: user.id
        }])
        .select()
        .single();
    return { data, error };
}

// Update event
async function updateEvent(eventId, updates) {
    const { data, error } = await supabaseClient
        .from('events')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', eventId)
        .select()
        .single();
    return { data, error };
}

// Delete event
async function deleteEvent(eventId) {
    const { error } = await supabaseClient
        .from('events')
        .delete()
        .eq('id', eventId);
    return { error };
}

// Fetch all events created by user (for organizer dashboard)
async function fetchMyEvents() {
    const user = await getCurrentUser();
    if (!user) return [];
    const { data, error } = await supabaseClient
        .from('events')
        .select('*')
        .eq('organizer_id', user.id)
        .order('created_at', { ascending: false });
    return error ? [] : data;
}

// Register participant for event
async function registerForEvent(eventId) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabaseClient
        .from('event_participants')
        .insert([{
            participant_id: user.id,
            event_id: eventId,
            status: 'Registered'
        }])
        .select()
        .single();
    return { data, error };
}

// Cancel registration
async function cancelRegistration(eventId) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabaseClient
        .from('event_participants')
        .delete()
        .eq('participant_id', user.id)
        .eq('event_id', eventId);
    return { error };
}

// Fetch events user is registered for
async function fetchMyRegistrations() {
    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabaseClient
        .from('event_participants')
        .select('*, events(*)')
        .eq('participant_id', user.id)
        .order('registered_at', { ascending: false });
    return error ? [] : data;
}

// Fetch participants for an event
async function fetchEventParticipants(eventId) {
    const { data, error } = await supabaseClient
        .from('event_participants')
        .select('*, profiles!event_participants_participant_id_fkey(full_name, email, phone)')
        .eq('event_id', eventId);
    return error ? [] : data;
}

// Get participant count for event
async function getParticipantCount(eventId) {
    const { count, error } = await supabaseClient
        .from('event_participants')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId);
    return error ? 0 : count;
}

// Check if current user is registered for event
async function isRegisteredForEvent(eventId) {
    const user = await getCurrentUser();
    if (!user) return false;

    const { data, error } = await supabaseClient
        .from('event_participants')
        .select('participant_id')
        .eq('participant_id', user.id)
        .eq('event_id', eventId)
        .maybeSingle();
    return !!data;
}
