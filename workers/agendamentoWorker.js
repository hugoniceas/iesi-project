import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

import { mqService } from "../src/services/mqService.js";
import { tiSaudeAPI } from '../src/services/tiSaudeAPI.js';

async function processarAgendamento(agendamentoData) {
    try {
        console.log('WORKER - processando agendamento para o paciente:', agendamentoData.idPatient);
        const resultado = await tiSaudeAPI.createAgendamento(agendamentoData);
        console.log('WORKER - Agendamento processado:', resultado)
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        if (errorMessage.includes('Server Error')) {
            console.warn(`WORKER - AVISO: A API retornou um erro conhecido ('${errorMessage}'), mas o agendamento PODE ter sido criado. Marcando como processado.`);
        } else {
            console.error('WORKER - ERRO REAL ao processar agendamento:', errorMessage);
        }
}}

async function iniciarWorker() {
    console.log('WORKER - Iniciando');
    const nomeFila = 'criar_agendamento';

    mqService.consumeMessage(nomeFila,processarAgendamento);
}

iniciarWorker();