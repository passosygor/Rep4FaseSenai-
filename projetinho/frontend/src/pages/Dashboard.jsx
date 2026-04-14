import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ date: '', patientName: '', doctorId: '' });

  const fetchAppointments = async () => {
    const res = await fetch('http://localhost:3000/api/appointments');
    const data = await res.json();
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error); // Aqui vai disparar o erro se o médico já tiver consulta no horário
    } else {
      alert('Consulta agendada!');
      fetchAppointments();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Gestão de Consultas</h1>
      
      <form onSubmit={handleSchedule} className="mb-8 flex gap-4">
        <input 
          type="datetime-local" 
          required 
          className="border p-2"
          onChange={e => setForm({...form, date: e.target.value})} 
        />
        <input 
          type="text" 
          placeholder="Nome do Paciente" 
          required 
          className="border p-2"
          onChange={e => setForm({...form, patientName: e.target.value})} 
        />
        <input 
          type="number" 
          placeholder="ID do Médico" 
          required 
          className="border p-2"
          onChange={e => setForm({...form, doctorId: e.target.value})} 
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Agendar
        </button>
      </form>

      <ul className="bg-white p-4 shadow rounded">
        {appointments.map(app => (
          <li key={app.id} className="border-b py-2">
            {new Date(app.date).toLocaleString()} - Paciente: {app.patientName} - Médico: {app.doctor?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}