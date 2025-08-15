import { NextResponse } from "next/server";
import { tiSaudeAPI } from "../../../../../../services/tisaudeAPI"

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const novoStatusId = body.statusId;

        if (!novoStatusId) {
            return NextResponse.json({ message: 'O campo statusId é obrigatório' }, { status: 400 });
        }

        const agendamentoAtual = await tiSaudeAPI.getAgendamentoByID(id);

        if (!agendamentoAtual) {
            return NextResponse.json({ message: `Agendamento com ID ${id} não encontrado` }, { status: 404 });
        }

        const dadosAtualizar = {
            idPatient: agendamentoAtual.patient.id,
            name: agendamentoAtual.patient.name,
            schedule: [
                {
                    id: agendamentoAtual.id,
                    dateSchudule: formatDate(agendamentoAtual.date),
                    local: 1,
                    idCalendar: agendamentoAtual.calendar.id,
                    procedures: [],
                    hour:  agendamentoAtual.hour + ":00",
                    statusAppointment: novoStatusId
                }
            ]

        }

        const resultado = await tiSaudeAPI.updateAgendamento(id, dadosAtualizar);

        return NextResponse.json(resultado);
    } catch (error) {
        console.error("Falha na API ao atualizar status do agendamento");
        return NextResponse.json(
            { message: 'Erro ao atualizar status do agendamento', error: error.message },
            { status: 500 }
        );
    }
}