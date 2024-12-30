import { useState, useEffect } from 'react';
import { request } from '../axios_helper';
import '../../styles/EditDentistModal.css';

function EditDentistModal({ isOpen, onClose, dentist, onSave }) {
  console.log('Odontologo recibido en modal:', dentist);

  const [formData, setFormData] = useState({
    id: dentist?.id || '',
    nombre: dentist?.nombre || '',
    apellido: dentist?.apellido || '',
    matricula: dentist?.matricula || '',
    email: dentist?.email || '',
    //especialidad: dentist?.especialidad || '',
  });

  useEffect(() => {
    if (dentist) {
    console.log('Actualizando formData con:', dentist);
    setFormData({
    id: dentist.id,
    nombre: dentist.nombre,
    apellido: dentist.apellido,
    matricula: dentist.matricula,
    email: dentist.email,
    //especialidad: dentist.especialidad,
    });
    }
  }, [dentist]);

  const [errors, setErrors] = useState({
    nombre: '',
    apellido: '',
    matricula: '',
    email: ''
  });

  const [error, setError] = useState(null);

  const validateForm = () => {
    const newErrors = {
      nombre: '',
      apellido: '',
      matricula: '',
      email: ''
    };
    let isValid = true;

    // Validación nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
      isValid = false;
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    }

    // Validación apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
      isValid = false;
    } else if (formData.apellido.length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
      isValid = false;
    }

    // Validación matrícula
    if (!formData.matricula.trim()) {
      newErrors.matricula = 'La matrícula es requerida';
      isValid = false;
    } else if (!/^\d{7,}$/.test(formData.matricula)) {
      newErrors.matricula = 'La matrícula debe tener al menos 7 números';
      isValid = false;
    }

    // Validación email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        throw new Error('ID de odontologo no válido');
      }

      const odontologoData = {
        id: formData.id,    
        nombre: formData.nombre,
        apellido: formData.apellido,
        matricula: formData.matricula,
        email: formData.email,
        //especialidad: formData.especialidad,
      };

      console.log('Datos a enviar al servidor:', odontologoData); // Para depuración

      await request('PUT', '/odontologo/modificar', odontologoData);
      onSave(formData);
      onClose();

    } catch (error) {
      setError(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Editar Odontólogo</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-container">
            <div className="form-group">
              <label>
                Nombre:
                <input 
                  type="text" name="nombre" 
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
                  type="text" name="apellido" 
                  value={formData.apellido} 
                  onChange={handleInputChange} 
                  className={errors.apellido ? 'input-error' : ''} 
                />
              </label>
              {errors.apellido && <span className="error-text">{errors.apellido}</span>}
            </div>

            <div className="form-group">
              <label>
                Matricula:
                <input 
                  type="text" name="matricula" 
                  value={formData.matricula} 
                  onChange={handleInputChange} 
                  className={errors.matricula ? 'input-error' : ''} 
                />
              </label>
              {errors.matricula && <span className="error-text">{errors.matricula}</span>}
            </div>
            
            <div className="form-group">
              <label>
                Email:
                <input 
                  type="text" name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className={errors.email ? 'input-error' : ''} 
                />
              </label>
              {errors.email && <span className="error-text">{errors.email}</span>}
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

export default EditDentistModal;