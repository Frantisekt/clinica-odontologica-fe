import { useState, useEffect } from 'react';
import PatientCard from '../../components/patient/PatientCard';
import { request } from '../../components/axios_helper';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    try {
      const response = await request('GET', '/paciente/buscartodos');
      setPatients(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los pacientes.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="patient-list-container">
      <h2>Listado de Pacientes</h2>
      <div className="cards-grid">
        {patients.map(patient => (
          <PatientCard 
            key={patient.id} 
            patient={patient}
          />
        ))}
      </div>
    </div>
  );
}

export default PatientList; 