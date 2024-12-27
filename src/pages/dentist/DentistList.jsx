import { useState, useEffect } from 'react';
import { request } from '../../components/axios_helper';
import DentistCard from '../../components/dentist/DentistCard';
import EditDentistModal from '../../components/dentist/EditDentistModal';
import '../../styles/DentistList.css';

function DentistList() {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDentists = async () => {
    try {
      const response = await request('GET', '/odontologo/buscartodos');
      setDentists(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los odontologos.');
    }finally{
        setIsSearching(false);
        setLoading(false);
      }
    };
  

  const searchDentists = async () => {
    try{
        setIsSearching(true);
        setLoading(true);
        setError(null);
        const endpoint = searchTerm.trim() ? `/odontologo/buscarNombre/${searchTerm}` : '/odontologo/buscartodos';
        const response = await request('GET', endpoint);

        if(response.data.length === 0){
            setDentists([]);
            setError('No se encontraron odontologos con ese nombre.');
        }else{
            setDentists(response.data);
        }
    }catch(err){
        setError('Error al buscar odontologos.');
    }finally{
        setIsSearching(false);
        setLoading(false);
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

  useEffect(() => {
    fetchDentists();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="odontologo-list-container">
      <div className="list-header">
        <h2>Listado de Odontólogos</h2>
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
    </div>
  );
}

export default DentistList;