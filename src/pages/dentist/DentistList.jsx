import { useState, useEffect } from 'react';
import axios from 'axios';
import DentistCard from '../../components/dentist/DentistCard';

function DentistList() {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const response = await axios.get('/api/odontologos');
        setDentists(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los odontólogos');
        setLoading(false);
      }
    };

    fetchDentists();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <h2>Listado de Odontólogos</h2>
      <div className="cards-grid">
        {dentists.map(dentist => (
          <DentistCard key={dentist.id} dentist={dentist} />
        ))}
      </div>
    </div>
  );
}

export default DentistList; 