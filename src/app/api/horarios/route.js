import { NextResponse } from "next/server";
import { tiSaudeAPI } from '../../../services/tisaudeAPI'

function gerarHorariosDeTrabalho(intervaloEmMinutos = 30) {
  const horarios = [];
  const horaInicio = 8 * 60;
  const horaFim = 18 * 60;

  for (let minutos = horaInicio; minutos < horaFim; minutos += intervaloEmMinutos) {
    const horas = Math.floor(minutos / 60).toString().padStart(2, '0');
    const mins = (minutos % 60).toString().padStart(2, '0');
    horarios.push(`${horas}:${mins}:00`);
  }
  return horarios;
}

export async function GET(request) {
    try {
        const { searchParams } = request.nextUrl;
    const date = searchParams.get('date');
    const idCalendar = searchParams.get('idCalendar');

    
    if (!idCalendar || !date) {
      return NextResponse.json({ message: 'Parâmetros idCalendar e date são obrigatórios.' }, { status: 400 });
    }

    const todosOsHorarios = gerarHorariosDeTrabalho();

    const agendamentosDoDia = await tiSaudeAPI.getAgendamentos(date, { idCalendar });

    const listaDeAgendamentos = agendamentosDoDia.data || [];

    const horariosOcupados = listaDeAgendamentos.map(ag => `${ag.hour}:00`);

    const horariosDisponiveis = todosOsHorarios.filter(horario => !horariosOcupados.includes(horario));

    const respostaFormatada = {
      schedules: horariosDisponiveis.map(h => ({ hour: h }))
    };

    return NextResponse.json(respostaFormatada);
    } catch (error) {
        console.error("Falha na API ao buscar horários");
        return NextResponse.json(
            { message: 'Erro ao buscar horários', error: error.message },
            { status: 500 }
        );
    }
}