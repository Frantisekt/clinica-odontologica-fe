import { useState, useEffect } from 'react';
import axios from 'axios';
import PatientCard from '../../components/patient/PatientCard';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('/api/pacientes');
        setPatients(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los pacientes');
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <h2>Listado de Pacientes</h2>
      <div className="cards-grid">
        {patients.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}

export default PatientList; 