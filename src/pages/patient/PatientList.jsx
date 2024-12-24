import { useState, useEffect } from 'react';
import PatientCard from '../../components/patient/PatientCard';
import { request } from '../../components/axios_helper';
import '../../styles/PatientList.css';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await request('GET', '/paciente/buscartodos');
      setPatients(response.data);
    } catch (err) {
      setError('Error al cargar los pacientes.');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const searchPatients = async () => {
    try {
      setIsSearching(true);
      setLoading(true);
      setError(null); // Limpia cualquier error previo
      const endpoint = searchTerm.trim() ? `/paciente/buscarNombre/${searchTerm}` : '/paciente/buscartodos';
      const response = await request('GET', endpoint);
  
      if (response.data.length === 0) {
        setPatients([]); // Asegúrate de que la lista esté vacía
        setError('No se encontraron pacientes con ese nombre.');
      } else {
        setPatients(response.data);
      }
    } catch (err) {
      setError('Error al buscar pacientes.');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };
  

  const handleSearch = async (e) => {
    e.preventDefault();
    await searchPatients();
  };

  const handleReset = () => {
    setSearchTerm('');
    setIsSearching(false);
    fetchPatients();
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="patient-list-container">
      <div className="list-header">
        <h2>Listado de Pacientes</h2>
        <form onSubmit={handleSearch} className="search-container">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              disabled={isSearching}
            />
            <button 
              type="submit" 
              className="search-button" 
              disabled={isSearching}
            >
              {isSearching ? 'Buscar' : 'Buscar'}
            </button>
            {searchTerm && (
              <button 
                type="button" 
                className="reset-button"
                onClick={handleReset}
                disabled={isSearching}
              >
                Limpiar
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="list-content">
        {error ? (
          <div className="error-message">{error}</div>
        ) : loading ? (
          <div className="loading">Cargando...</div>
        ) : patients.length > 0 ? (
          <div className="cards-grid">
            {patients.map(patient => (
              <PatientCard 
                key={patient.id} 
                patient={patient}
                onDelete={() => fetchPatients()}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No se encontraron pacientes.</p>
            {searchTerm && (
              <button 
                onClick={handleReset} 
                className="link-button"
              >
                Ver todos los pacientes
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

export default PatientList; 