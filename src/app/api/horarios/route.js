import { NextResponse } from "next/server";
import { tiSaudeAPI } from '../../../services/tisaudeAPI'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const idCalendar = searchParams.get('idCalendar');
        const date = searchParams.get('date');
        const idLocal = searchParams.get('idLocal');
        if (!idCalendar || !date || !idLocal) {
            return NextResponse.json(
                {message: 'Faltam parâmetros obrigatórios'},
                {status: 400}
            );
        }
        const horarios = await tiSaudeAPI.getHorarios(idCalendar,date,idLocal);
        return NextResponse.json(horarios);
    } catch (error) {
        console.error("Falha na API ao buscar horários");
        return NextResponse.json(
            { message: 'Erro ao buscar horários', error: error.message },
            { status: 500 }
        );
    }
}