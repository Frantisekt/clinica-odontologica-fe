import React, { useState, useEffect } from 'react';
import { request } from '../axios_helper';
import AddTurnoModal from './AddTurnoModal';
import EditTurnoModal from './EditTurnoModal';
import '../../styles/TurnoList.css';

const TurnoList = () => {
  const [turnos, setTurnos] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);

  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    try {
      const response = await request('GET', '/turnos/buscartodos');
      if (response.data) {
        const turnosFormateados = response.data.map(turno => ({
          ...turno,
          fechaFormateada: new Date(turno.fecha + 'T' + turno.hora).toLocaleDateString('es-ES', {
            dateStyle: 'medium'
          }),
          horaFormateada: new Date(turno.fecha + 'T' + turno.hora).toLocaleTimeString('es-ES', {
            timeStyle: 'short'
          })
        }));
        setTurnos(turnosFormateados);
      }
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este turno?')) {
      try {
        await request('DELETE', `/turnos/eliminar/${id}`);
        fetchTurnos(); // Recargar la lista después de eliminar
      } catch (error) {
        console.error('Error al eliminar turno:', error);
      }
    }
  };

  const handleEdit = (turno) => {
    setSelectedTurno(turno);
    setShowEditModal(true);
  };

  return (
    <div className="turno-container">
      <div className="turno-header">
        <h2>Gestión de Turnos</h2>
        <button 
          className="add-button"
          onClick={() => setShowAddModal(true)}
        >
          Agregar Turno
        </button>
      </div>

      <div className="turno-list">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Paciente</th>
              <th>Odontólogo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno) => (
              <tr key={turno.id}>
                <td>{turno.fechaFormateada}</td>
                <td>{turno.horaFormateada}</td>
                <td>
                  {turno.pacienteResponseDto ? 
                    `${turno.pacienteResponseDto.nombre} ${turno.pacienteResponseDto.apellido}` : 
                    'No disponible'}
                </td>
                <td>
                  {turno.odontologoResponseDto ? 
                    `${turno.odontologoResponseDto.nombre} ${turno.odontologoResponseDto.apellido}` : 
                    'No disponible'}
                </td>
                <td>
                  <button 
                    className="edit-button"
                    onClick={() => handleEdit(turno)}
                  >
                    Editar
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(turno.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddTurnoModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            fetchTurnos(); // Recargar la lista después de agregar
          }}
        />
      )}

      {showEditModal && (
        <EditTurnoModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          turno={selectedTurno}
          onSave={() => {
            setShowEditModal(false);
            fetchTurnos(); // Recargar la lista después de editar
          }}
        />
      )}
    </div>
  );
};

export default TurnoList; 