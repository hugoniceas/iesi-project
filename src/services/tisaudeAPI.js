import axios from 'axios';
import NodeCache from 'node-cache';

const tokenCache = new NodeCache({stdTTL: 2419200})

let apiClient = null;

function getApiClient() {
    if (apiClient == null) {
        apiClient = axios.create({
            baseURL: process.env.TISAUDE_API_URL,
            headers: {
                    'Content-Type': 'application/json'
                    }
});
    apiClient.interceptors.request.use(async (config) => {
    if (config.url == '/login') {
        return config;
    }

    const token = await getToken();
    config.headers.Authorization = `Bearer ${token}`;

    return config;
}, (error) => {
    return Promise.reject(error);
});

    
    }
    return apiClient;
}

async function loginCacheToken() {
    const client = getApiClient();
    try {
        const response = await client.post('/login', {
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


async function getMedicos() {
    const client = getApiClient();
    try {
        const response = await client.get('/schedule/doctors?local=1');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar médicos:", error.response?.data || error.message);
        throw new Error("Não foi possível buscar médicos");
    }
}

async function getProcedimentos() {
    const client = getApiClient();
    try {
        const response = await client.get('/procedures?all=true&noPaginate=true');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar procedimentos:", error.response?.data || error.message);
        throw new Error("Não foi possível buscar procedimentos");
    }
}

async function getHorarios(idCalendar, date, idLocal) {
    const client = getApiClient();
    try {
        const response = await client.get(`/schedule/filter/calendar/hours?idCalendar=${idCalendar}&date=${date}&local=${idLocal}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar horários:", error.response?.data || error.message);
        throw new Error("Não foi possível buscar horários")
    }
}

async function getPacientes(searchTerm = '') {
    const client = getApiClient();
    try {
        const response = await client.get('/patients',{
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

async function getAgendamentos(date, filtros = {}) {
    const client = getApiClient();
    try {
        if (!date) {
            throw new Error("Data é obrigatória");
        }
        const response = await client.get(`/schedule/${date}`, {
            params: filtros
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error.response?.data || error.message);
        throw new Error("Não foi possível buscar agendamentos")
    }
}

async function createPaciente(dadosPaciente) {
    const client = getApiClient();
    try {
        const response = await client.post('/patients/create', dadosPaciente);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar paciente:", error.response?.data || error.message);
        throw new Error("Não foi possível criar novo paciente")  
    }
}

async function createAgendamento(dadosAgendamento) {
    const client = getApiClient();
    try {
        const response = await client.post('/schedule/new', dadosAgendamento);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar agendamento:", error.response?.data || error.message);
        throw new Error("Não foi possível criar novo agendamento")
    }
}

async function updateAgendamento(idAgendamento, dadosAtualizar) {
    const client = getApiClient();
    try {
        const response = await client.put(`/schedule/edit/${idAgendamento}`, dadosAtualizar);
        return response.data;
    } catch (error) {
            if (error.response?.data && error.response.data.message === 'Server Error') {
                console.warn("AVISO: 'Server Error' recebido, mas não será tratado como erro.");
                return { ...error.response.data, message: 'Agendamento atualizado com sucesso (falso positivo)' };
            } else {
                console.error("Erro ao atualizar agendamento:", error.response?.data || error.message);
                throw new Error("Não foi possível atualizar agendamento");
            }
    }
}

async function getAgendamentoByID(idAgendamento) {
    const client = getApiClient();
    try {
        const response = await client.get(`/schedule/appointment/${idAgendamento}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao procurar agendamento por id:", error.response?.data || error.message);
        throw new Error("Não foi possível procurar agendamento por id")    
    }
}

export const tiSaudeAPI = {
    getMedicos,
    getProcedimentos,
    getHorarios,
    getPacientes,
    getAgendamentos,
    createPaciente,
    createAgendamento,
    updateAgendamento,
    getAgendamentoByID
};