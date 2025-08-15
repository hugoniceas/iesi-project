
import { NextResponse } from "next/server";
import { tiSaudeAPI } from "../../../../services/tisaudeAPI";

export async function GET(request, { params }) {
    try {
        const { date } = await params;
        const { searchParams } = new URL(request.url);
        const filtros = {
            idCalendar: searchParams.get('idCalendar'),
            idLocal: searchParams.get('idLocal'),
            namePatient: searchParams.get('namePatient')
        };

        Object.keys(filtros).forEach(key => (filtros[key] == null) && delete filtros[key]);

        const agendamentos = await tiSaudeAPI.getAgendamentos(date, filtros);

        return NextResponse.json(agendamentos);
    } catch (error) {
        console.error("Falha na API ao buscar agendamentos");
        return NextResponse.json(
            { message: 'Erro ao buscar agendamentos', error: error.message },
            { status: 500 }
        );
    }
}