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
  const [fieldErrors, setFieldErrors] = useState({});

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

  const validateFields = () => {
    const errors = {};

    // Validaciones para datos personales de paciente
    if (!formData.nombre.trim()) errors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) errors.apellido = 'El apellido es requerido';
    if (!formData.dni.match(/^\d{6,12}$/)) errors.dni = 'El DNI debe ser un número válido de 7 u 8 dígitos.';
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) errors.email = 'Ingrese un email válido.';
    
    // Validaciones para domicilio
    if (!formData.domicilio.calle.trim()) errors['domicilio.calle'] = 'La calle es obligatoria.';
    if (!formData.domicilio.numero.match(/^\d+$/)) errors['domicilio.numero'] = 'El número debe ser un valor numérico.';
    if (!formData.domicilio.localidad.trim()) errors['domicilio.localidad'] = 'La localidad es obligatoria.';
    if (!formData.domicilio.provincia.trim()) errors['domicilio.provincia'] = 'La provincia es obligatoria.';
    
    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errors = validateFields();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return; // No enviar si hay errores
    }

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
          {fieldErrors.nombre && <span className="field-error">{fieldErrors.nombre}</span>}
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
          {fieldErrors.apellido && <span className="field-error">{fieldErrors.apellido}</span>}
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
          {fieldErrors.dni && <span className="field-error">{fieldErrors.dni}</span>}
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
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
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
            {fieldErrors['domicilio.calle'] && <span className="field-error">{fieldErrors['domicilio.calle']}</span>}
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
            {fieldErrors['domicilio.numero'] && <span className="field-error">{fieldErrors['domicilio.numero']}</span>}
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
            {fieldErrors['domicilio.localidad'] && <span className="field-error">{fieldErrors['domicilio.localidad']}</span>}
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
            {fieldErrors['domicilio.provincia'] && <span className="field-error">{fieldErrors['domicilio.provincia']}</span>}
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