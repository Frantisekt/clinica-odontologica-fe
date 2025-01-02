import Card from '../common/Card';
import { request } from '../axios_helper';

function DentistCard({ dentist, onDelete, onEdit }) {
  const handleDelete = async()=> {
    if (window.confirm('¿Está seguro de que desea eliminar este odontologo?')) {
      try {
        await request('DELETE', `/odontologo/eliminar/${dentist.id}`);
        onDelete && onDelete();
      } catch (error) {
        console.error('Error al eliminar odontologo:', error);
        alert('Error al eliminar el odontologo');
      }
    }
  };
  
  return (
    <Card title={`Dr. ${dentist.nombre} ${dentist.apellido}`} className="dentist-card">
      <div className="dentist-info">
        <p><strong>Matrícula:</strong> {dentist.matricula}</p>
        <p><strong>Email:</strong> {dentist.email}</p>
        <p><strong>Email:</strong> {dentist.telefono}</p>
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

export default DentistCard; 