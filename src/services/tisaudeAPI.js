import axios from 'axios';
import NodeCache from 'node-cache';

const tokenCache = new NodeCache({stdTTL: 1757792400})

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
        console.error("Falha ao autenticar:", error.response?.data || error.mesage);
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