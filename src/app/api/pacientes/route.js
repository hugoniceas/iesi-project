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