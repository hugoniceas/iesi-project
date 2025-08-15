import { mqService } from "../src/services/mqService.js";
import { tiSaudeAPI } from '../src/services/tiSaudeAPI.js';

import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

async function processarAgendamento(agendamentoData) {
    try {
        console.log('WORKER - processando agendamento para o paciente:', agendamentoData.idPatient);
        const resultado = await tiSaudeAPI.createAgendamento(agendamentoData);
        console.log('WORKER - Agendamento processado:', resultado)
    } catch (error) {
        console.error('WORKER - Erro ao processar agendamento:', error.message);
    }
}

async function iniciarWorker() {
    console.log('WORKER - Iniciando');
    const nomeFila = 'criar_agendamento';

    mqService.consumeMessage(nomeFila,processarAgendamento);
}

iniciarWorker();