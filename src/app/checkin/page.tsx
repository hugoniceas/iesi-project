"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function CheckinPage() {
  const router = useRouter();
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [medicos, setMedicos] = useState<{ id: number; name: string }[]>([]);
  const [medicoSelecionado, setMedicoSelecionado] = useState<{ id: number; name: string } | null>(null);
  const [buscaMedico, setBuscaMedico] = useState("");
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  useEffect(() => {
    fetch("/api/medicos")
      .then(res => res.json())
      .then(data => setMedicos(data))
      .catch(() => setMedicos([]));
  }, []);

  const handleIrParaConsultas = () => {
    if (dataSelecionada && medicoSelecionado) {
      router.push(`/consultas-checkin?data=${dataSelecionada}&medicoId=${medicoSelecionado.id}&medicoNome=${encodeURIComponent(medicoSelecionado.name)}`);
    }
  };

  return (
  <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 gap-8 bg-gray-100 relative">
      <button
        className="absolute top-6 left-6 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded shadow transition-colors border border-gray-400"
        onClick={() => window.location.href = '/'}
      >
        ← Voltar
      </button>
      <h1 className="text-2xl font-bold mb-8 text-center text-blue-900">Check-in de Pacientes</h1>
      <div className="flex flex-col gap-6 w-full max-w-md bg-white p-6 rounded-xl shadow">
        <label className="font-semibold mb-2 text-gray-800">Selecione a data:</label>
        <input
          type="date"
          className="border rounded px-3 py-2 mb-4 text-gray-900"
          value={dataSelecionada}
          onChange={e => setDataSelecionada(e.target.value)}
        />
        <label className="font-semibold mb-2 text-gray-800">Selecione o médico:</label>
        <input
          type="text"
          className="border rounded px-3 py-2 mb-2 placeholder-gray-700 text-gray-900"
          placeholder="Digite o nome do médico"
          value={buscaMedico}
          onChange={e => {
            setBuscaMedico(e.target.value);
            setMostrarSugestoes(true);
            setMedicoSelecionado(null);
          }}
          onFocus={() => setMostrarSugestoes(true)}
        />
        {mostrarSugestoes && buscaMedico.length > 0 && (
          <ul className="border rounded bg-white shadow max-h-40 overflow-y-auto mb-4">
            {medicos.filter(m => m.name.toLowerCase().includes(buscaMedico.toLowerCase())).length === 0 ? (
              <li className="px-3 py-2 text-gray-500">Nenhum médico encontrado</li>
            ) : (
              medicos.filter(m => m.name.toLowerCase().includes(buscaMedico.toLowerCase())).map(medico => (
                <li
                  key={medico.id}
                  className="px-3 py-2 cursor-pointer hover:bg-blue-200 text-gray-900"
                  onClick={() => {
                    setMedicoSelecionado(medico);
                    setBuscaMedico(medico.name);
                    setMostrarSugestoes(false);
                  }}
                >
                  {medico.name}
                </li>
              ))
            )}
          </ul>
        )}
        {medicoSelecionado && (
          <div className="mb-2 text-green-800 font-semibold">Médico selecionado: {medicoSelecionado.name}</div>
        )}
        <button
          className={`bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl shadow-lg text-center text-lg transition-colors border border-green-900 cursor-pointer ${!dataSelecionada || !medicoSelecionado ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleIrParaConsultas}
          disabled={!dataSelecionada || !medicoSelecionado}
        >
          Ver consultas do dia
        </button>
      </div>
    </div>
  );
}
