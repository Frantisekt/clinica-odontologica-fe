import Card from '../common/Card';

function PatientCard({ patient }) {
  return (
    <Card title={`${patient.nombre} ${patient.apellido}`} className="patient-card">
      <div className="patient-info">
        <p><strong>DNI:</strong> {patient.dni}</p>
        <p><strong>Email:</strong> {patient.email}</p>
        <p><strong>Domicilio:</strong> {patient.domicilio}</p>
        <p><strong>Fecha de Alta:</strong> {new Date(patient.fechaAlta).toLocaleDateString()}</p>
        <div className="card-actions">
          <button className="btn-edit">Editar</button>
          <button className="btn-delete">Eliminar</button>
        </div>
      </div>
    </Card>
  );
}

export default PatientCard; 