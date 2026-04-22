async function fetchAllServices() {
    try {
        const response = await fetch('api/services');
        const json = await response.json();
        return json.success ? json.data : [];
    } catch(err) { return []; }
}

async function fetchServicesByType(type) {
    try {
        const response = await fetch(`api/services?type=${type}`);
        const json = await response.json();
        return json.success ? json.data : [];
    } catch(err) { return []; }
}

async function createService(serviceData) {
    try {
        const response = await fetch('api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serviceData)
        });
        return await response.json();
    } catch(err) { return { error: 'Backend offline' }; }
}

async function linkServiceToEvent(eventId, serviceId) {
    try {
        const response = await fetch(`api/events/${eventId}/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ service_id: serviceId })
        });
        return await response.json();
    } catch(err) { return { error: 'Backend offline' }; }
}

async function unlinkServiceFromEvent(eventId, serviceId) {
    try {
        const response = await fetch(`api/events/${eventId}/services/${serviceId}`, { method: 'DELETE' });
        return await response.json();
    } catch(err) { return { error: 'Backend offline' }; }
}

async function fetchEventServices(eventId) {
    try {
        const response = await fetch(`api/events/${eventId}/services`);
        const json = await response.json();
        return json.success ? json.data : [];
    } catch(err) { return []; }
}

async function submitFeedback(eventId, rating, comments) {
    try {
        const response = await fetch(`api/events/${eventId}/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating, comments })
        });
        return await response.json();
    } catch(err) { return { error: 'Backend offline' }; }
}

async function fetchEventFeedback(eventId) {
    try {
        const response = await fetch(`api/events/${eventId}/feedback`);
        const json = await response.json();
        return json.success ? json.data : [];
    } catch(err) { return []; }
}

async function getAverageRating(eventId) {
    const feedbacks = await fetchEventFeedback(eventId);
    if (!feedbacks.length) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
}
