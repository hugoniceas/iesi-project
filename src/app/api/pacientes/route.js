import { NextResponse } from "next/server";
import { tiSaudeAPI } from '../../../services/tisaudeAPI'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const searchTerm = searchParams.get('search') || '';
        const pacientes = await tiSaudeAPI.getPacientes(searchTerm);

        return NextResponse.json(pacientes);
    } catch (error) {
        console.error("Falha na API ao buscar pacientes");
        return NextResponse.json(
            { message: 'Erro ao buscar pacientes', error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try{
        const dadosPaciente = await request.json();
        if (!dadosPaciente || !dadosPaciente.name) {
            return NextResponse.json(
                { message: 'O nome do paciente é obrigatório'},
                { status: 400}
            );
        }

        const novoPaciente = await tiSaudeAPI.createPaciente(dadosPaciente);
        return NextResponse.json(novoPaciente, {status: 201})
    } catch (error) {
       console.error("Falha na API ao criar paciente");
        return NextResponse.json(
            { message: 'Erro ao criar paciente', error: error.message },
            { status: 500 }
        ); 
    }
}