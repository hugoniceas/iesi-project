import { NextResponse } from "next/server";
import { mqService } from "../../../services/mqService";

export async function POST(request) {
    try {
        const dadosAgendamento = await request.json();
        if (!dadosAgendamento || !dadosAgendamento.idPatient || !dadosAgendamento.schedule) {
            return NextResponse.json({ message: 'Dados para agendamento incompletos' }, { status: 400 });
        }
        const nomeFila = 'criar_agendamento';
        await mqService.publishMessage(nomeFila, dadosAgendamento);

        return NextResponse.json({message: "Solicitação de agendamento recebida, aguarde processamento"}, {status: 202});
    } catch (error) {
        console.error("Falha na API ao criar agendamento");
        return NextResponse.json(
            { message: 'Erro ao criar agendamento', error: error.message },
            { status: 500 }
        );
    }
}