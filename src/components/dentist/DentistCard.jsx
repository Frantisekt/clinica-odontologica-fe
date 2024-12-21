import Card from '../common/Card';

function DentistCard({ dentist }) {
  return (
    <Card title={`Dr. ${dentist.nombre} ${dentist.apellido}`} className="dentist-card">
      <div className="dentist-info">
        <p><strong>Matrícula:</strong> {dentist.matricula}</p>
        <p><strong>Email:</strong> {dentist.email}</p>
        <div className="card-actions">
          <button className="btn-edit">Editar</button>
          <button className="btn-delete">Eliminar</button>
        </div>
      </div>
    </Card>
  );
}

export default DentistCard; 