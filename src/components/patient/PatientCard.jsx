import Card from '../common/Card';
import { request } from '../axios_helper';

function PatientCard({ patient, onDelete, onEdit }) {
  const handleDelete = async () => {
    if (window.confirm('¿Está seguro de que desea eliminar este paciente?')) {
      try {
        await request('DELETE', `/paciente/eliminar/${patient.id}`);
        onDelete && onDelete();
      } catch (error) {
        console.error('Error al eliminar paciente:', error);
        alert('Error al eliminar el paciente');
      }
    }
  };

  // Formatear la dirección completa
  const direccionCompleta = patient.domicilio ? 
    `${patient.domicilio.calle} ${patient.domicilio.numero}, ${patient.domicilio.localidad}, ${patient.domicilio.provincia}` : 
    'No especificado';

  return (
    <Card title={`${patient.nombre} ${patient.apellido}`} className="patient-card">
      <div className="patient-info">
        <p><strong>DNI:</strong> {patient.dni}</p>
        <p><strong>Email:</strong> {patient.email}</p>
        <p><strong>Teléfono:</strong> {patient.telefono}</p>
        <p><strong>Domicilio:</strong> {direccionCompleta}</p>
        <p><strong>Fecha de Alta:</strong> {
          patient.fechaAlta ? 
            new Date(patient.fechaAlta).toLocaleDateString() : 
            'No especificada'
        }</p>
        <div className="card-actions">
          <button 
            className="btn-edit"
            onClick={() => onEdit && onEdit()}
          >
            Editar
          </button>
          <button 
            className="btn-delete"
            onClick={handleDelete}
          >
            Eliminar
          </button>
        </div>
      </div>
    </Card>
  );
}

export default PatientCard; 