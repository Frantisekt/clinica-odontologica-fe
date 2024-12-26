import React, { useState, useEffect } from 'react';
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
      const response = await fetch('http://localhost:8080/turnos/buscartodos');
      const data = await response.json();
      setTurnos(data);
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este turno?')) {
      try {
        await fetch(`http://localhost:8080/turnos/eliminar/${id}`);
        fetchTurnos(); // Recargar la lista
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
              <th>Paciente</th>
              <th>Odontólogo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno) => (
              <tr key={turno.id}>
                <td>{turno.fecha}</td>
                <td>{`${turno.pacienteResponseDto.nombre} ${turno.pacienteResponseDto.apellido}`}</td>
                <td>{`${turno.odontologoResponseDto.nombre} ${turno.odontologoResponseDto.apellido}`}</td>
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
            fetchTurnos();
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
            fetchTurnos();
          }}
        />
      )}
    </div>
  );
};

export default TurnoList; 