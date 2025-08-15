"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function RegistrarPaciente() {
	const router = useRouter();
	const [agendamentoCriado, setAgendamentoCriado] = useState(false);
	const [mensagemAgendamento, setMensagemAgendamento] = useState("");
	const searchParams = useSearchParams();
	const medicoNome = searchParams.get("medicoNome");
	const data = searchParams.get("data");
	const horario = searchParams.get("horario");

	const [nomePaciente, setNomePaciente] = useState("");
	const [erro, setErro] = useState("");
	const [showConfirm, setShowConfirm] = useState(false);
	type PacienteExistente = { name: string } | null;
	const [pacienteExistente, setPacienteExistente] = useState<PacienteExistente>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErro("");
		setShowConfirm(false);
		setPacienteExistente(null);
		try {
			const res = await fetch("/api/pacientes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: nomePaciente })
			});
					if (res.ok) {
						// Cadastro realizado com sucesso
						setShowConfirm(true);
					} else {
						// Sempre mostra o pop-up de confirmação em caso de erro
						setPacienteExistente({ name: nomePaciente });
						setShowConfirm(true);
					}
		} catch {
			setErro("Erro ao cadastrar paciente.");
		}
	};

		return (
			<div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 gap-8 bg-gray-100">
				<h1 className="text-2xl font-bold mb-8 text-center text-blue-900">Registrar Paciente</h1>
				{medicoNome && data && horario && (
					<div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded text-blue-900 font-semibold text-center">
						<span>Agendamento para <b>{medicoNome}</b> em <b>{data}</b> às <b>{horario}</b></span>
					</div>
				)}
				{!agendamentoCriado ? (
					<>
						<form className="flex flex-col gap-6 w-full max-w-md bg-white p-6 rounded-xl shadow" onSubmit={handleSubmit}>
							<label className="font-semibold mb-2 text-gray-800">Nome do paciente:</label>
							<input
								type="text"
								className="border rounded px-3 py-2 mb-2 placeholder-gray-700 text-gray-900"
								placeholder="Digite o nome do paciente"
								value={nomePaciente}
								onChange={e => setNomePaciente(e.target.value)}
								required
							/>
							<button
								type="submit"
								className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg text-center text-lg transition-colors border border-blue-900 cursor-pointer"
							>
								Registrar/Checar paciente
							</button>
							{erro && <div className="text-red-600 font-semibold">{erro}</div>}
						</form>
						{/* Pop-up de confirmação */}
						{showConfirm && (
							<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
								<div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-4 min-w-[320px]">
									<h2 className="text-xl font-bold text-blue-900 mb-2">Confirmação de Consulta</h2>
									<div className="text-gray-800 mb-2">Paciente: <b>{pacienteExistente ? pacienteExistente.name : nomePaciente}</b></div>
									<div className="text-gray-800 mb-2">Médico: <b>{medicoNome}</b></div>
									<div className="text-gray-800 mb-2">Data: <b>{data}</b></div>
									<div className="text-gray-800 mb-2">Horário: <b>{horario}</b></div>
									<button
										className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded shadow-lg text-center text-lg transition-colors border border-green-900 cursor-pointer"
										onClick={async () => {
											setMensagemAgendamento("");
											try {
												// Buscar paciente pelo nome
												const pacienteRes = await fetch(`/api/pacientes?search=${encodeURIComponent(nomePaciente)}`);
												let idPatient = 0;
												if (pacienteRes.ok) {
													const pacientes = await pacienteRes.json();
                                                    console.log(pacientes)
													idPatient = pacientes.data[0].id;
												}
												// Criar agendamento com idPatient
												// Formatar data para DD/MM/YYYY
												let dataFormatada = data;
												if (data && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
													const [ano, mes, dia] = data.split("-");
													dataFormatada = `${dia}/${mes}/${ano}`;
												}
												const agendamentoObj = {
													idPatient,
													name: nomePaciente,
													schedule: [{
														id: "",
														idScheduleReturn: null,
														dateSchudule: dataFormatada,
														local: 1,
														idCalendar: searchParams.get("medicoId") || "",
														procedures: [1],
														hour: horario
													}]
												};
												console.log("Agendamento enviado:", agendamentoObj);
												const res = await fetch("/api/agendamentos", {
													method: "POST",
													headers: { "Content-Type": "application/json" },
													body: JSON.stringify(agendamentoObj)
												});
												if (res.ok) {
													setAgendamentoCriado(true);
													setMensagemAgendamento("Agendamento realizado com sucesso!");
													setShowConfirm(false);
												} else {
													setMensagemAgendamento("Erro ao criar agendamento.");
												}
											} catch {
												setMensagemAgendamento("Erro ao criar agendamento.");
											}
										}}
									>
										Confirmar
									</button>
								</div>
							</div>
						)}
					</>
				) : (
					<div className="flex flex-col items-center gap-6 w-full max-w-md bg-white p-6 rounded-xl shadow">
						<div className="text-green-800 font-bold text-lg text-center">{mensagemAgendamento}</div>
						<button
							className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg text-center text-lg transition-colors border border-blue-900 cursor-pointer"
							onClick={() => router.push("/")}
						>
							Voltar à página inicial
						</button>
					</div>
				)}
			</div>
		);
}
