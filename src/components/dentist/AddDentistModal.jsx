import React, { useState } from 'react';
import { request } from '../axios_helper';
import '../../styles/AddDentistModal.css';

const AddDentistModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    matricula: '',
    email: '',
    especialidad: 'ODONTOLOGIA_GENERAL',
  });

  const [errors, setErrors] = useState({
    nombre: '',
    apellido: '',
    matricula: '',
    email: ''
  });

  const especialidades = [
    { value: 'ODONTOLOGIA_GENERAL', label: 'Odontología General' },
    { value: 'CIRUGIA_ORAL', label: 'Cirugía Oral' },
    { value: 'ORTODONCIA', label: 'Ortodoncia' },
    { value: 'PERIODONCIA', label: 'Periodoncia' }
  ];

  const validateForm = () => {
    const newErrors = {
      nombre: '',
      apellido: '',
      matricula: '',
      email: ''
    };
    let isValid = true;

    const onlyLettersAndSpaces = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
      isValid = false;
    } else if (!onlyLettersAndSpaces.test(formData.nombre)) {
      newErrors.nombre = 'El nombre debe contener solo letras';
      isValid = false;
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
      isValid = false;
    } else if (!onlyLettersAndSpaces.test(formData.apellido)) {
      newErrors.apellido = 'El apellido debe contener solo letras';
      isValid = false;
    }

    if (!formData.matricula.trim()) {
      newErrors.matricula = 'La matrícula es requerida';
      isValid = false;
    } else if (!/^\d{7,}$/.test(formData.matricula)) {
      newErrors.matricula = 'La matrícula debe tener al menos 7 números';
      isValid = false;
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await request('POST', '/odontologo/guardar', formData);
      if (response.status === 200 || response.status === 201) {
        onSave();
        onClose();
        setFormData({
          nombre: '',
          apellido: '',
          matricula: '',
          email: '',
          especialidad: 'ODONTOLOGIA_GENERAL',
        });
      }
    } catch (error) {
      console.error('Error al guardar el odontólogo:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Agregar Nuevo Odontólogo</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-container">
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
                Matrícula:
                <input 
                  type="text" 
                  name="matricula" 
                  value={formData.matricula} 
                  onChange={handleInputChange} 
                  className={errors.matricula ? 'input-error' : ''} 
                />
              </label   >
              {errors.matricula && <span className="error-text">{errors.matricula}</span>}
            </div>
            <div className="form-group">
              <label>
                Email:
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className={errors.email ? 'input-error' : ''} 
                />
              </label>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>
                Especialidad:
                <select name="especialidad" value={formData.especialidad} onChange={handleInputChange}>
                  {especialidades.map(especialidad => (
                    <option key={especialidad.value} value={especialidad.value}>{especialidad.label}</option>
                  ))}
                </select>
              </label>  
              {errors.especialidad && <span className="error-text">{errors.especialidad}</span>}    
            </div>
            <button type="submit" className="save-button">Guardar</button>
            <button 
                onClick={(e) => {
                    e.preventDefault(); // Evita que se envíe el formulario si está dentro de uno
                    const confirmExit = window.confirm("¿Está seguro de que desea salir sin guardar los cambios?");
                    if (confirmExit) {
                    onClose(); // Cierra el modal
                    }
                }} 
                className="cancel-button"
                >
                Cancelar
                </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDentistModal;