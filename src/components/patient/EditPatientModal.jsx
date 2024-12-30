import { useState, useEffect } from 'react';
import { request } from '../axios_helper';
import '../../styles/EditPatientModal.css';


function EditPatientModal({ isOpen, onClose, patient, onSave }) {
  console.log('Patient recibido en modal:', patient);

  const [formData, setFormData] = useState({
    id: patient?.id || '',
    nombre: patient?.nombre || '',
    apellido: patient?.apellido || '',
    dni: patient?.dni || '',
    email: patient?.email || '',
    fechaIngreso: patient?.fechaIngreso || null,
    domicilio: {
      id: patient?.domicilio?.id || null,
      calle: patient?.domicilio?.calle || '',
      numero: patient?.domicilio?.numero || '',
      localidad: patient?.domicilio?.localidad || '',
      provincia: patient?.domicilio?.provincia || ''
    }
  });

  useEffect(() => {
    if (patient) {
      console.log('Actualizando formData con:', patient);
      setFormData({
        id: patient.id,
        nombre: patient.nombre,
        apellido: patient.apellido,
        dni: patient.dni,
        email: patient.email,
        fechaIngreso: patient.fechaIngreso,
        domicilio: {
          id: patient.domicilio?.id || null,
          calle: patient.domicilio?.calle || '',
          numero: patient.domicilio?.numero || '',
          localidad: patient.domicilio?.localidad || '',
          provincia: patient.domicilio?.provincia || ''
        }
      });
    }
  }, [patient]);

  const [errors, setErrors] = useState({
    nombre: '',
    apellido: ''
  });

  const [error, setError] = useState(null);

  const validateForm = () => {
    const newErrors = {
      nombre: '',
      apellido: '',
      localidad: '',
      provincia: ''
    };
    let isValid = true;

    // Expresión regular para validar solo letras y espacios
    const onlyLettersAndSpaces = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
      isValid = false;
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    }else if (!onlyLettersAndSpaces.test(formData.nombre)) {
      newErrors.nombre = 'El nombre debe contener solo letras.';
      isValid = false;
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
      isValid = false;
    } else if (formData.apellido.length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
      isValid = false;
    }else if (!onlyLettersAndSpaces.test(formData.apellido)) {
      newErrors.apellido = 'El apellido debe contener solo letras.';
      isValid = false;
    }

    if (!formData.domicilio.localidad.trim()) {
      newErrors.localidad = 'La localidad es requerida';
      isValid = false;
    } else if (!onlyLettersAndSpaces.test(formData.domicilio.localidad)) {
      newErrors.localidad = 'La localidad debe contener solo letras.';
      isValid = false;
    }
  
    if (!formData.domicilio.provincia.trim()) {
      newErrors.provincia = 'La provincia es requerida';
      isValid = false;
    } else if (!onlyLettersAndSpaces.test(formData.domicilio.provincia)) {
      newErrors.provincia = 'La provincia debe contener solo letras.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('domicilio.')) {
      const domicilioField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        domicilio: {
          ...prev.domicilio,
          [domicilioField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSave = async () => {
    try {
      setError(null);
      console.log('FormData a enviar:', formData); // Para depuración
      
      if (!validateForm()) {
        return;
      }

      if (!formData.id) {
        console.error('ID faltante en formData:', formData);
        throw new Error('ID de paciente no válido');
      }

      // Asegurarse de que todos los campos requeridos estén presentes
      const pacienteData = {
        id: formData.id,
        nombre: formData.nombre,
        apellido: formData.apellido,
        dni: formData.dni,
        email: formData.email,
        fechaIngreso: formData.fechaIngreso,
        domicilio: {
          id: formData.domicilio.id,
          calle: formData.domicilio.calle,
          numero: formData.domicilio.numero,
          localidad: formData.domicilio.localidad,
          provincia: formData.domicilio.provincia
        }
      };

      console.log('Datos a enviar al servidor:', pacienteData); // Para depuración
      
      await request('PUT', '/paciente/modificar', pacienteData);
      onSave(pacienteData);
      onClose();
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      const errorMessage = error.response?.data?.mensaje || 
                          error.response?.data?.error || 
                          error.message || 
                          'Error al guardar los cambios del paciente';
      setError(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Editar Paciente</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>
              Nombre:
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={errors.nombre ? 'input-error' : ''}
              />
            </label>
            {errors.nombre && <span className="error-text">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label>
              Apellido:
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className={errors.apellido ? 'input-error' : ''}
              />
            </label>
            {errors.apellido && <span className="error-text">{errors.apellido}</span>}
          </div>

          <div className="form-group">
            <label>
              DNI:
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                className={errors.dni ? 'input-error' : ''}
              />
            </label>
            {errors.dni && <span className="error-text">{errors.dni}</span>}
          </div>

          <div className="form-group">
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </label>
          </div>

          <div className="domicilio-section">
            <h4>Domicilio</h4>
            <div className="form-group">
              <label>
                Calle:
                <input
                  type="text"
                  name="domicilio.calle"
                  value={formData.domicilio.calle}
                  onChange={handleInputChange}
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                Número:
                <input
                  type="text"
                  name="domicilio.numero"
                  value={formData.domicilio.numero}
                  onChange={handleInputChange}
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                Localidad:
                <input
                  type="text"
                  name="domicilio.localidad"
                  value={formData.domicilio.localidad}
                  onChange={handleInputChange}
                  className={errors.localidad ? 'input-error' : ''}
                />
              </label>
              {errors.localidad && <span className="error-text">{errors.localidad}</span>}
            </div>

            <div className="form-group">
              <label>
                Provincia:
                <input
                  type="text"
                  name="domicilio.provincia"
                  value={formData.domicilio.provincia}
                  onChange={handleInputChange}
                  className={errors.provincia ? 'input-error' : ''}
                />
              </label>
              {errors.provincia && <span className="error-text">{errors.provincia}</span>}
            </div>
          </div>

          {error && <div className="error-message">
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>}

          <div className="modal-buttons">
            <button type="button" onClick={handleSave}>Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPatientModal;