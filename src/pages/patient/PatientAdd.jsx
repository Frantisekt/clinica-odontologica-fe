import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../../components/axios_helper';
import '../../styles/PatientAdd.css';


function PatientAdd() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    fechaIngreso: new Date().toISOString().split('T')[0], 
    domicilio: {
      calle: '',
      numero: '',
      localidad: '',
      provincia: ''
    }
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Manejo de campos anidados (domicilio)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await request('POST', '/paciente/guardar', formData);
      alert('Paciente registrado exitosamente');
      navigate('/pacientes');
    } catch (error) {
      console.error('Error al registrar paciente:', error);
      setError('Error al registrar el paciente. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="patient-add-container">
      <h2>Registrar Nuevo Paciente</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido:</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dni">DNI:</label>
          <input
            type="text"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <fieldset className="address-fieldset">
          <legend>Domicilio</legend>
          
          <div className="form-group">
            <label htmlFor="calle">Calle:</label>
            <input
              type="text"
              id="calle"
              name="domicilio.calle"
              value={formData.domicilio.calle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="numero">Número:</label>
            <input
              type="text"
              id="numero"
              name="domicilio.numero"
              value={formData.domicilio.numero}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="localidad">Localidad:</label>
            <input
              type="text"
              id="localidad"
              name="domicilio.localidad"
              value={formData.domicilio.localidad}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="provincia">Provincia:</label>
            <input
              type="text"
              id="provincia"
              name="domicilio.provincia"
              value={formData.domicilio.provincia}
              onChange={handleChange}
              required
            />
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="btn-submit">Registrar Paciente</button>
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate('/pacientes')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default PatientAdd; 