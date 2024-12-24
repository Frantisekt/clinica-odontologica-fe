import { useState, useEffect } from 'react';
import { request } from '../../components/axios_helper';
import DentistCard from '../../components/dentist/DentistCard';


function DentistList() {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDentists = async () => {
    try {
      const response = await request('GET', '/odontologo/buscartodos');
      setPatients(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los odontologos.');
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDentists();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="odontologo-list-container">
      <h2>Listado de Odontólogos</h2>
      <div className="cards-grid">
        {dentists.map(dentist => (
          <DentistCard 
            key={dentist.id} 
            dentist={dentist} 
          />
        ))}
      </div>
    </div>
  );
}

export default DentistList; 