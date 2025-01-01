import { useState, useEffect } from 'react';
import { request } from '../../components/axios_helper';
import DentistCard from '../../components/dentist/DentistCard';
import EditDentistModal from '../../components/dentist/EditDentistModal';
import AddDentistModal from '../../components/dentist/AddDentistModal';
import '../../styles/DentistList.css';

function DentistList() {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchType, setSearchType] = useState('nombre');

  const fetchDentists = async () => {
    try {
      setLoading(true);
      const response = await request('GET', '/odontologo/buscartodos');
      setDentists(response.data);
    } catch (err) {
      setError('Error al cargar los odontologos.');
    }finally{
        setLoading(false);
        setIsSearching(false);
      }
    };
  

  const searchDentists = async () => {
    try {
      setIsSearching(true);
      setLoading(true);
      setError(null);
      
      let endpoint;
      if (searchTerm.trim()) {
        // Validación para búsqueda por teléfono
        if (searchType === 'telefono') {
          if (!/^\d+$/.test(searchTerm)) {
            setError('El teléfono debe contener solo números');
            setDentists([]);
            setLoading(false);
            setIsSearching(false);
            return;
          }
        }

        endpoint = searchType === 'nombre' 
          ? `/odontologo/buscarNombre/${searchTerm}`
          : `/odontologo/buscarTelefono/${searchTerm}`;

        console.log('Realizando búsqueda en:', endpoint); // Debug
      } else {
        endpoint = '/odontologo/buscartodos';
      }

      try {
        const response = await request('GET', endpoint);
        if (response.data && Array.isArray(response.data)) {
          setDentists(response.data);
          setError(null);
        } else {
          setDentists([]);
          setError('No se encontraron resultados');
        }
      } catch (error) {
        // Manejo específico para error 404
        if (error.response?.status === 404) {
          setDentists([]);
          setError(`No se encontraron odontólogos con ese ${searchType === 'nombre' ? 'nombre' : 'teléfono'}`);
        } else {
          throw error; // Re-lanzar otros errores
        }
      }
    } catch (err) {
      console.error('Error en la búsqueda:', err);
      setError(`Error al buscar odontólogos por ${searchType}`);
      setDentists([]);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await searchDentists();
  };

  const handleReset = () => {
    setSearchTerm('');
    setIsSearching(false);
    fetchDentists();
  };

  const handleEditClick = (dentist) => {
    console.log('Odontologo seleccionado para editar:', dentist);
    if (dentist && dentist.id) {
      setSelectedDentist(dentist);
      setIsModalOpen(true);
    } else {
      setSelectedDentist(null);
    }
  };

  const handleModalClose = () => {
    setSelectedDentist(null);
    setIsModalOpen(false);
  };


  const handleSaveDentist = async (updatedDentist) => {
    try{
        await request('PUT', '/odontologo/modificar', updatedDentist);
        setDentists((prevDentists) =>
        prevDentists.map((dentist) =>
          dentist.id === updatedDentist.id ? updatedDentist : dentist
        )
      );
      handleModalClose();
    }catch(err){
        setError('Error al guardar los cambios del odontologo.');
    }
  };

  const handleAddDentist = () => {
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    fetchDentists();
  }, []);

  return (
    <div className="odontologo-list-container">
      <div className="list-header">
        <h2>Listado de Odontólogos</h2>
        <button 
          className="add-button" 
          onClick={handleAddDentist}
        >
          Agregar Odontólogo
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
        ) : dentists.length > 0 ? (
          <div className="cards-grid">
            {dentists.map(dentist => (
              <DentistCard 
                key={dentist.id} 
                dentist={dentist}
                onDelete={() => fetchDentists()}
                onEdit={() => handleEditClick(dentist)}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No se encontraron odontólogos.</p>
            {searchTerm && (
              <button 
                onClick={handleReset} 
              className="link-button"
            >
              Ver todos los odontólogos
            </button>
          )}  
        </div>
      )}
      </div>
      <EditDentistModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveDentist}
        dentist={selectedDentist}
      />
      <AddDentistModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={() => {
          fetchDentists();
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}

export default DentistList;