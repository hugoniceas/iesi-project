import axios from 'axios';
import NodeCache from 'node-cache';

const tokenCache = new NodeCache({stdTTL: 2419200})

const apiClient = axios.create({
    baseURL: process.env.TISAUDE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

async function loginCacheToken() {
    try {
        const response = await apiClient.post('/login', {
            login: process.env.TISAUDE_API_USER,
            senha: process.env.TISAUDE_API_PASSWORD
        });

        const token = response.data.access_token;
        if (!token) {
            throw new Error('Token não encontrado');
        }

        tokenCache.set('apiToken', token);
        return token;

    } catch (error) {
        console.error("Falha ao autenticar:", error.response?.data || error.message);
        throw new Error("Não foi possível autenticar");
    }
}

async function getToken() {
    const token = tokenCache.get('apiToken');
    if (token) {
        return token;
    } else {
        return await loginCacheToken();
    }
}

apiClient.interceptors.request.use(async (config) => {
    if (config.url == '/login') {
        return config;
    }

    const token = await getToken();
    config.headers.Authorization = `Bearer ${token}`;

    return config;
}, (error) => {
    return Promise.reject(error);
})

async function getMedicos() {
    try {
        const response = await apiClient.get('/schedule/doctors?local=1');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar médicos:", error.response?.data || error.message);
        throw new Error("Não foi possível buscar médicos");
    }
}

async function getProcedimentos() {
    try {
        const response = await apiClient.get('/procedures?all=true&noPaginate=true');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar procedimentos:", error.response?.data || error.message);
        throw new Error("Não foi possível buscar procedimentos");
    }
}

async function getHorarios(idCalendar, date, idLocal) {
    try {
        const response = await apiClient.get(`/schedule/filter/calendar/hours?idCalendar=${idCalendar}&date=${date}&local=${idLocal}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar horários:", error.response?.data || error.message);
        throw new Error("Não foi possível buscar horários")
    }
}

async function getPacientes(searchTerm = '') {
    try {
        const response = await apiClient.get('/patients',{
            params: {
                search: searchTerm
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar pacientes:", error.response?.data || error.message);
        throw new Error("Não foi possível buscar pacientes");
    }
}

export const tiSaudeAPI = {
    getMedicos,
    getProcedimentos,
    getHorarios,
    getPacientes
};