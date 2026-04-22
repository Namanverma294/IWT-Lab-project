

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

async function fetchEventBudget(eventId) {
    try {
        const response = await fetch(`api/events/${eventId}/budget`);
        const json = await response.json();
        return json.success ? json.data : null;
    } catch(err) { return null; }
}

async function createBudget(budgetData) {
    try {
        const response = await fetch('api/budgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(budgetData)
        });
        return await response.json();
    } catch(err) { return { error: 'Backend offline' }; }
}

async function updateBudget(budgetId, updates) {
    try {
        const response = await fetch(`api/budgets/${budgetId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        return await response.json();
    } catch(err) { return { error: 'Backend offline' }; }
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

async function fetchSpecialOffers(budgetId) {
    try {
        const response = await fetch(`api/budgets/${budgetId}/offers`);
        const json = await response.json();
        return json.success ? json.data : [];
    } catch(err) { return []; }
}

async function createSpecialOffer(offerData) {
    try {
        const response = await fetch('api/offers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(offerData)
        });
        return await response.json();
    } catch(err) { return { error: 'Backend offline' }; }
}
