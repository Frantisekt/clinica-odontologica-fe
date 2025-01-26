import React, { useState, useEffect } from 'react';
import { request } from '../axios_helper';
import '../../styles/TurnoModal.css';

const EditTurnoModal = ({ isOpen, onClose, turno, onSave }) => {
  const [formData, setFormData] = useState({
    id: turno?.id || '',
    paciente_id: turno?.pacienteResponseDto?.id || '',
    odontologo_id: turno?.odontologoResponseDto?.id || '',
    fecha: turno?.fecha?.split('T')[0] || '',
    hora: turno?.hora || '',
    nota: turno?.nota || '',
    necesitaAcompanante: turno?.necesitaAcompanante || false
  });
  const [pacientes, setPacientes] = useState([]);
  const [odontologos, setOdontologos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPacientes();
    fetchOdontologos();
  }, []);

  const fetchPacientes = async () => {
    try {
      const response = await request('GET', '/paciente/buscartodos');
      setPacientes(response.data);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
    }
  };

  const fetchOdontologos = async () => {
    try {
      const response = await request('GET', '/odontologo/buscartodos');
      setOdontologos(response.data);
    } catch (error) {
      console.error('Error al cargar odontólogos:', error);
    }
  };

  const horasDisponibles = [];
  for (let i = 8; i <= 18; i++) {
    const hora = i.toString().padStart(2, '0') + ':00';
    horasDisponibles.push(hora);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const turnoData = {
        id: formData.id,
        paciente_id: formData.paciente_id,
        odontologo_id: formData.odontologo_id,
        fecha: formData.fecha,
        hora: formData.hora,
        nota: formData.nota,
        necesitaAcompanante: formData.necesitaAcompanante || false
      };
      
      const response = await request('PUT', '/turnos/modificar', turnoData);
      if (response.status === 200 || response.status === 201) {
        onSave();
      }
    } catch (error) {
      console.log('Error completo:', error);
      console.log('Response data:', error.response?.data);
      
      let errorMessage = '';
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('Ya existe un turno')) {
          errorMessage = 'Ya existe un turno para este odontólogo en la fecha y hora especificadas.';
        } else if (error.response.data.message.includes('Query did not return a unique result')) {
          errorMessage = 'Error: Se encontraron múltiples registros cuando se esperaba uno solo.';
        } else {
          errorMessage = error.response.data.message;
        }
      } else if (error.response?.status === 409) {
        errorMessage = 'Conflicto: El turno no puede ser guardado debido a un conflicto de horarios.';
      } else {
        errorMessage = 'Ocurrió un error al modificar el turno. Por favor, intente nuevamente.';
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Editar Turno</h3>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Paciente:</label>
            <select
              value={formData.paciente_id}
              onChange={(e) => setFormData({...formData, paciente_id: e.target.value})}
              required
            >
              <option value="">Seleccione un paciente</option>
              {pacientes.map(paciente => (
                <option key={paciente.id} value={paciente.id}>
                  {`${paciente.nombre} ${paciente.apellido}`}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Odontólogo:</label>
            <select
              value={formData.odontologo_id}
              onChange={(e) => setFormData({...formData, odontologo_id: e.target.value})}
              required
            >
              <option value="">Seleccione un odontologo</option>
              {odontologos.map(odontologo => (
                <option key={odontologo.id} value={odontologo.id}>
                  {`${odontologo.nombre} ${odontologo.apellido}`}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Fecha:</label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({...formData, fecha: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Hora:</label>
            <select
              value={formData.hora}
              onChange={(e) => setFormData({...formData, hora: e.target.value})}
              required
            >
              {horasDisponibles.map(hora => (
                <option key={hora} value={hora}>
                  {hora}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Nota:</label>
            <textarea
              value={formData.nota}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setFormData({ ...formData, nota: e.target.value });
                }
              }}
              rows="3"
              maxLength="500"
              placeholder="Agregar notas adicionales (máximo 500 caracteres)..."
            />
            <small>{formData.nota.length}/500 caracteres usados</small>
          </div>


          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.necesitaAcompanante}
                onChange={(e) => setFormData({...formData, necesitaAcompanante: e.target.checked})}
              />
              Necesita Acompañante
            </label>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="save-button">Guardar</button>
            <button type="button" onClick={onClose} className="cancel-button">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTurnoModal; 