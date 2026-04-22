

async function fetchPublishedEvents() {
    try {
        const response = await fetch('api/events');
        const json = await response.json();
        return json.success ? json.data : [];
    } catch(err) {
        console.error("Backend offline", err);
        return [];
    }
}

async function fetchCurrentMonthEvents() {
    return fetchPublishedEvents();
}

async function fetchEventById(eventId) {
    try {
        const response = await fetch(`api/events/${eventId}`);
        const json = await response.json();
        return json.success ? json.data : null;
    } catch(err) { return null; }
}

async function createEvent(eventData) {
    try {
        const response = await fetch('api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        });
        return await response.json();
    } catch (err) { return { success: false, error: "Backend offline" }; }
}

async function updateEvent(eventId, updates) {
    try {
        const response = await fetch(`api/events/${eventId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        return await response.json();
    } catch (err) { return { success: false, error: "Backend offline" }; }
}

async function deleteEvent(eventId) {
    try {
        const response = await fetch(`api/events/${eventId}`, { method: 'DELETE' });
        return await response.json();
    } catch (err) { return { success: false, error: "Backend offline" }; }
}

async function fetchMyEvents() {
    try {
        const response = await fetch('api/events?mine=true');
        const json = await response.json();
        return json.success ? json.data : [];
    } catch(err) { return []; }
}

async function registerForEvent(eventId) {
    try {
        const response = await fetch(`api/participate/${eventId}`, { method: 'POST' });
        return await response.json();
    } catch(err) { return { success: false, error: "Backend offline" }; }
}

async function cancelRegistration(eventId) {
    try {
        const response = await fetch(`api/participate/${eventId}`, { method: 'DELETE' });
        return await response.json();
    } catch(err) { return { success: false, error: "Backend offline" }; }
}

async function fetchMyRegistrations() {
    try {
        const response = await fetch('api/participants/my-events');
        const json = await response.json();
        return json.success ? json.data : [];
    } catch(err) { return []; }
}

async function isRegisteredForEvent(eventId) {
    const registrations = await fetchMyRegistrations();
    return registrations.some(r => r.id === eventId);
}

async function getParticipantCount(eventId) {
    try {
        const response = await fetch(`api/events/${eventId}`);
        const json = await response.json();
        return json.success ? (json.data.participantCount || 0) : 0;
    } catch(err) { return 0; }
}

async function fetchEventParticipants(eventId) { return []; }
