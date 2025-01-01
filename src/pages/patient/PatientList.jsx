import { useState, useEffect } from 'react';
import PatientCard from '../../components/patient/PatientCard';
import { request } from '../../components/axios_helper';
import EditPatientModal from '../../components/patient/EditPatientModal';
import AddPatientModal from '../../components/patient/AddPatientModal';
import '../../styles/PatientList.css';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchType, setSearchType] = useState('nombre');

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
      setError(null);
      
      let endpoint;
      if (searchTerm.trim()) {
        if (searchType === 'telefono') {
          if (!/^\d+$/.test(searchTerm)) {
            setError('El teléfono debe contener solo números');
            setPatients([]);
            setLoading(false);
            setIsSearching(false);
            return;
          }
        }

        endpoint = searchType === 'nombre' 
          ? `/paciente/buscarNombre/${searchTerm}`
          : `/paciente/buscarTelefono/${searchTerm}`;

        console.log('Realizando búsqueda en:', endpoint);
        
        try {
          const response = await request('GET', endpoint);
          console.log('Respuesta del servidor:', response);
          
          if (response.data && Array.isArray(response.data)) {
            if (response.data.length === 0) {
              setError(`No se encontraron pacientes con ese ${searchType}`);
            } else {
              setPatients(response.data);
              setError(null);
            }
          } else {
            setError('Formato de respuesta inválido');
          }
        } catch (error) {
          console.error('Error específico de búsqueda:', error);
          if (error.response?.status === 404) {
            setError(`No se encontraron pacientes con ese ${searchType}`);
            setPatients([]);
          } else {
            setError(`Error al buscar por ${searchType}: ${error.message}`);
          }
        }
      } else {
        try {
          const response = await request('GET', '/paciente/buscartodos');
          setPatients(response.data);
          setError(null);
        } catch (error) {
          setError('Error al cargar los pacientes');
          console.error('Error al cargar todos los pacientes:', error);
        }
      }
    } catch (err) {
      console.error('Error general:', err);
      setError('Error en la búsqueda');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (searchType === 'telefono' && value !== '' && !/^\d+$/.test(value)) {
      setError('El teléfono debe contener solo números');
    } else {
      setError(null);
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

  const handleEditClick = (patient) => {
    console.log('Paciente seleccionado para editar:', patient);
    if (patient && patient.id) {
      setSelectedPatient(patient);
      setIsModalOpen(true);
    } else {
      console.error('Paciente inválido:', patient);
    }
  };

  const handleModalClose = () => {
    setSelectedPatient(null);
    setIsModalOpen(false);
  };

  const handleSavePatient = async (updatedPatient) => {
    try {
      await request('PUT', '/paciente/modificar', updatedPatient);
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === updatedPatient.id ? updatedPatient : patient
        )
      );
      handleModalClose();
    } catch (err) {
      setError('Error al guardar los cambios del paciente.');
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="patient-list-container">
      <div className="list-header">
        <h2>Listado de Pacientes</h2>
        <button className="add-button" onClick={() => setIsAddModalOpen(true)}>
          Agregar Paciente
        </button>
        <form onSubmit={handleSearch} className="search-container">
          <div className="search-input-group">
            <select 
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value)}
              className="search-type-select"
            >
              <option value="nombre">Buscar por nombre</option>
              <option value="telefono">Buscar por teléfono</option>
            </select>
            <input
              type="text"
              placeholder={`Buscar por ${searchType}...`}
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
              disabled={isSearching}
            />
            <button 
              type="submit" 
              className="search-button" 
              disabled={isSearching || (searchType === 'telefono' && searchTerm && !/^\d+$/.test(searchTerm))}
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
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
          <div className="error-message">
            <p>{error}</p>
            {searchTerm && (
              <button 
                onClick={handleReset} 
                className="link-button"
              >
                Ver todos los pacientes
              </button>
            )}
          </div>
        ) : loading ? (
          <div className="loading">Cargando...</div>
        ) : patients.length > 0 ? (
          <div className="cards-grid">
            {patients.map(patient => (
              <PatientCard 
                key={patient.id} 
                patient={patient}
                onDelete={() => fetchPatients()}
                onEdit={() => handleEditClick(patient)}
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
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={() => {
          fetchPatients();
          setIsAddModalOpen(false);
        }}
      />
      <EditPatientModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        patient={selectedPatient}
        onSave={handleSavePatient}
      />
    </div>
  );
}

export default PatientList; 