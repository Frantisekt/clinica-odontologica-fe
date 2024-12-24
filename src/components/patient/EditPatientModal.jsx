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
    fechaIngreso: patient?.fechaIngreso || null,
    domicilio: patient?.domicilio || null
  });

  useEffect(() => {
    if (patient) {
      console.log('Actualizando formData con:', patient);
      setFormData({
        id: patient.id,
        nombre: patient.nombre,
        apellido: patient.apellido,
        dni: patient.dni,
        fechaIngreso: patient.fechaIngreso,
        domicilio: patient.domicilio
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
      apellido: ''
    };
    let isValid = true;

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
      isValid = false;
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
      isValid = false;
    } else if (formData.apellido.length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar el error del campo cuando el usuario empiece a escribir
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
        fechaIngreso: formData.fechaIngreso,
        domicilio: formData.domicilio
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