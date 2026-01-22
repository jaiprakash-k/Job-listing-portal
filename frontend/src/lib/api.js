const API_BASE_URL = '/api';

const getHeaders = () => {
    const user = JSON.parse(localStorage.getItem('jobconnect_user'));
    return {
        'Content-Type': 'application/json',
        ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
    };
};

export const api = {
    get: async (endpoint) => {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    post: async (endpoint, data) => {
        const isFormData = data instanceof FormData;
        const headers = getHeaders();
        if (isFormData) {
            delete headers['Content-Type']; // Let browser set multipart boundary
        }

        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: headers,
            body: isFormData ? data : JSON.stringify(data)
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    put: async (endpoint, data) => {
        const isFormData = data instanceof FormData;
        const headers = getHeaders();
        if (isFormData) {
            delete headers['Content-Type'];
        }

        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: headers,
            body: isFormData ? data : JSON.stringify(data)
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    delete: async (endpoint) => {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }
};
