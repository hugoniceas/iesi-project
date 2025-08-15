"use client";

import { useRouter } from "next/navigation";


import React from "react";

type Medico = {
  id: number;
  name: string;
};

type Horario = {
  hour: string;
};
export default function MarcarConsulta() {
  const router = useRouter();
  // Estado para médicos, médico selecionado, data e horários
  const [medicos, setMedicos] = React.useState<Medico[]>([]);
  const [medicoSelecionado, setMedicoSelecionado] = React.useState<Medico | null>(null);
  const [buscaMedico, setBuscaMedico] = React.useState<string>("");
  const [mostrarSugestoes, setMostrarSugestoes] = React.useState<boolean>(false);
  const [dataSelecionada, setDataSelecionada] = React.useState<string>("");
  const [horarios, setHorarios] = React.useState<Horario[]>([]);
  const [carregandoHorarios, setCarregandoHorarios] = React.useState<boolean>(false);

  // Buscar médicos ao montar
  React.useEffect(() => {
    fetch("/api/medicos")
      .then(res => res.json())
      .then(data => setMedicos(data))
      .catch(() => setMedicos([]));
  }, []);

  // Buscar horários quando médico e data forem selecionados
  React.useEffect(() => {
    if (medicoSelecionado && dataSelecionada) {
      setCarregandoHorarios(true);
      fetch(`/api/horarios?date=${dataSelecionada}&idCalendar=${medicoSelecionado.id}`)
        .then(res => res.json())
        .then(data => {
          setHorarios(data.schedules || []);
          setCarregandoHorarios(false);
        })
        .catch(() => {
          setHorarios([]);
          setCarregandoHorarios(false);
        });
    } else {
      setHorarios([]);
    }
  }, [medicoSelecionado, dataSelecionada]);

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 gap-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-8 text-center text-blue-900">Marcar Consulta</h1>
      <div className="flex flex-col gap-6 w-full max-w-md bg-white p-6 rounded-xl shadow">
        {/* Barra de pesquisa de médico */}
  <label className="font-semibold mb-2 text-gray-800">Pesquise o médico:</label>
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
        {/* Sugestões de médicos */}
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
        {/* Médico selecionado */}
        {medicoSelecionado && (
          <div className="mb-2 text-green-800 font-semibold">Médico selecionado: {medicoSelecionado.name}</div>
        )}

        {/* Seleção de data */}
  <label className="font-semibold mb-2 text-gray-800">Selecione a data:</label>
        <input
          type="date"
          className="border rounded px-3 py-2 mb-4"
          value={dataSelecionada}
          onChange={e => setDataSelecionada(e.target.value)}
          disabled={!medicoSelecionado}
        />

        {/* Exibição dos horários */}
        {carregandoHorarios ? (
          <div className="text-center text-gray-500">Carregando horários...</div>
        ) : (
          medicoSelecionado && dataSelecionada && (
            <div>
              <h2 className="font-semibold mb-2 text-blue-900">Horários disponíveis:</h2>
              <div className="grid grid-cols-3 gap-2">
                {horarios.length === 0 ? (
                  <span className="col-span-3 text-gray-700">Nenhum horário disponível</span>
                ) : (
                  horarios.map(horario => (
                    <button
                      key={horario.hour}
                      className="px-2 py-1 rounded text-center text-sm font-medium bg-blue-200 text-blue-900 border border-blue-400 hover:bg-blue-300 transition-colors"
                      onClick={() => {
                        if (medicoSelecionado && dataSelecionada) {
                          router.push(`/registrar-paciente?medicoId=${medicoSelecionado.id}&medicoNome=${encodeURIComponent(medicoSelecionado.name)}&data=${dataSelecionada}&horario=${horario.hour}`);
                        }
                      }}
                    >
                      {horario.hour}
                    </button>
                  ))
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
