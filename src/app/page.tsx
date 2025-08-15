export default function Home() {
  return (
  <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 gap-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Clínica-Escola de Fonoaudiologia</h1>
      <div className="flex flex-col gap-8 w-full max-w-xs">
        <a
          href="/marcar-consulta"
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-5 rounded-xl shadow-lg text-center text-xl transition-colors border border-blue-900"
        >
          Marcar Consulta
        </a>
        <a
          href="/checkin"
          className="bg-green-700 hover:bg-green-800 text-white font-bold py-5 rounded-xl shadow-lg text-center text-xl transition-colors border border-green-900"
        >
          Receber Paciente (Check-in)
        </a>
      </div>
    </div>
  );
}
