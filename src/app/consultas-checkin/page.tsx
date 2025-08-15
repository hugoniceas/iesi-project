"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Consulta {
  id: number;
  hour: string;
  patient?: { name?: string };
  calendar?: { name?: string };
  status?: { name?: string; color?: string };
  local?: { name?: string };
}

export default function ConsultasCheckinPage() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // Formatar data para DD/MM/YYYY se vier como YYYY-MM-DD
  let dataFormatada = data;
  if (data && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
    const [ano, mes, dia] = data.split("-");
    dataFormatada = `${dia}/${mes}/${ano}`;
  }

  const medicoId = searchParams.get("medicoId");
  useEffect(() => {
    if (!data || !medicoId) return;
    setLoading(true);
    setErro("");
    fetch(`/api/agendamentos/${data}?idCalendar=${medicoId}`)
      .then(res => res.json())
      .then(json => {
        setConsultas(Array.isArray(json.data) ? json.data : []);
        setLoading(false);
      })
      .catch(() => {
        setErro("Erro ao buscar consultas.");
        setLoading(false);
      });
  }, [data, medicoId]);

  return (
  <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 gap-8 bg-gray-100 relative">
      <button
        className="absolute top-6 left-6 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded shadow transition-colors border border-gray-400"
        onClick={() => window.location.href = '/checkin'}
      >
        ← Voltar
      </button>
      <h1 className="text-2xl font-bold mb-8 text-center text-blue-900">
        Visualizando consultas do dia {dataFormatada || "(data não informada)"}
      </h1>
      {loading ? (
        <div className="text-gray-700">Carregando consultas...</div>
      ) : erro ? (
        <div className="text-red-600 font-semibold">{erro}</div>
      ) : consultas.length === 0 ? (
        <div className="text-gray-700">Nenhuma consulta encontrada para esta data.</div>
      ) : (
        <div className="w-full max-w-2xl flex flex-col gap-4">
          {consultas.map((consulta) => (
            <div key={consulta.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-gray-200">
              <div className="font-bold text-blue-900 text-lg">{consulta.patient?.name || "Paciente não informado"}</div>
              <div className="text-gray-800">Horário: <b>{consulta.hour}</b></div>
              <div className="text-gray-800">Médico: <b>{consulta.calendar?.name || "-"}</b></div>
              <div className="text-gray-800">Status: <span style={{ color: consulta.status?.color }}>{consulta.status?.name}</span></div>
              <div className="text-gray-800">Local: <b>{consulta.local?.name || "-"}</b></div>
              {consulta.status?.name === "Marcado" && (
                <button
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-1 px-4 rounded shadow text-sm mt-2"
                  onClick={async () => {
                    await fetch(`/api/agendamentos/update/${consulta.id}/status`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ statusId: 1 })
                    });
                    window.location.reload();
                  }}
                >
                  Fazer Check-in
                </button>
              )}
              {consulta.status?.name === "Em espera" && (
                <button
                  className="bg-green-700 hover:bg-green-800 text-white font-bold py-1 px-4 rounded shadow text-sm mt-2"
                  onClick={async () => {
                    await fetch(`/api/agendamentos/update/${consulta.id}/status`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ statusId: 2 })
                    });
                    window.location.reload();
                  }}
                >
                  Encerrar Consulta
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
