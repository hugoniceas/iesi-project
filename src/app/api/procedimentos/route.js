import { NextResponse } from "next/server";
import { tiSaudeAPI } from '../../../services/tisaudeAPI'

export async function GET(request) {
    try {
        const procedimentos = await tiSaudeAPI.getProcedimentos();
        return NextResponse.json(procedimentos);
    } catch (error) {
        console.error("Falha na API ao buscar procedimentos");
        return NextResponse.json(
            { message: 'Erro ao buscar procedimentos', error: error.message },
            { status: 500 }
        );
    }
}