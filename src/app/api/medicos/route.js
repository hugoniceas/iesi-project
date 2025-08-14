import { NextResponse } from "next/server";
import { tiSaudeAPI } from '../../../services/tisaudeAPI'

export async function GET(request) {
    try {
        const medicos = await tiSaudeAPI.getMedicos();
        return NextResponse.json(medicos);
    } catch (error) {
        console.error("Falha na API ao buscar médicos");
        return NextResponse.json(
            { message: 'Erro ao buscar médicos', error: error.message },
            { status: 500 }
        );
    }
}