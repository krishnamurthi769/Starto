import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const analyzeLocation = async (lat, lng, category, context, location_name) => {
    const response = await api.post('/analyze', { lat, lng, category, context, location_name });
    return response.data;
};

export const getFreelancers = async ({ lat, lng, radius_km, category } = {}) => {
    const params = {};
    if (lat) params.lat = lat;
    if (lng) params.lng = lng;
    if (radius_km) params.radius_km = radius_km;
    if (category) params.category = category;

    const response = await api.get('/freelancers', { params });
    return response.data;
};

export const getWorkspaces = async () => {
    const response = await api.get('/workspaces');
    return response.data;
};

export const getCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};
