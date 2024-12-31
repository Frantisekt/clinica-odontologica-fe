import React, { useState } from 'react';
import { request } from '../axios_helper';
import '../../styles/AddPatientModal.css';

const AddPatientModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fechaIngreso: '',
    email: '',
    domicilio: {
      calle: '',
      numero: '',
      localidad: '',
      provincia: ''
    }
  });

  const [errors, setErrors] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fechaIngreso: '',
    email: '',
    localidad: '',
    provincia: ''
  });

  const validateForm = () => {
    const newErrors = {};
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

    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es requerido';
      isValid = false;
    } else if (!/^\d{7,8}$/.test(formData.dni)) {
      newErrors.dni = 'El DNI debe tener entre 7 y 8 números';
      isValid = false;
    }

    if (!formData.fechaIngreso) {
      newErrors.fechaIngreso = 'La fecha de ingreso es requerida';
      isValid = false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
      isValid = false;
    }

    if (!formData.domicilio.localidad.trim()) {
      newErrors.localidad = 'La localidad es requerida';
      isValid = false;
    } else if (!onlyLettersAndSpaces.test(formData.domicilio.localidad)) {
      newErrors.localidad = 'La localidad debe contener solo letras';
      isValid = false;
    }

    if (!formData.domicilio.provincia.trim()) {
      newErrors.provincia = 'La provincia es requerida';
      isValid = false;
    } else if (!onlyLettersAndSpaces.test(formData.domicilio.provincia)) {
      newErrors.provincia = 'La provincia debe contener solo letras';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await request('POST', '/paciente/guardar', formData);
      if (response.status === 200 || response.status === 201) {
        onSave();
        onClose();
        setFormData({
          nombre: '',
          apellido: '',
          dni: '',
          fechaIngreso: '',
          email: '',
          domicilio: {
            calle: '',
            numero: '',
            localidad: '',
            provincia: ''
          }
        });
      }
    } catch (error) {
      console.error('Error al guardar el paciente:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Agregar Nuevo Paciente</h3>
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
                Fecha de Ingreso:
                <input 
                  type="date" 
                  name="fechaIngreso" 
                  value={formData.fechaIngreso} 
                  onChange={handleInputChange} 
                  className={errors.fechaIngreso ? 'input-error' : ''} 
                />
              </label>
              {errors.fechaIngreso && <span className="error-text">{errors.fechaIngreso}</span>}
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

            <div className="modal-buttons">
              <button type="submit" className="save-button">Guardar</button>
              <button 
                type="button"
                onClick={() => {
                  const confirmExit = window.confirm("¿Está seguro de que desea salir sin guardar los cambios?");
                  if (confirmExit) {
                    onClose();
                  }
                }} 
                className="cancel-button"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal; 