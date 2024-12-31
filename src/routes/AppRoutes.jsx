import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import PatientList from '../pages/patient/PatientList';
import PatientAdd from '../pages/patient/PatientAdd';
import DentistList from '../pages/dentist/DentistList';
import TurnoList from '../components/turno/TurnoList';
//import DentistAdd from '../pages/dentist/DentistAdd';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/pacientes" element={<PatientList />} />
      <Route path="/odontologos" element={<DentistList />} />
      <Route path="/pacientes/agregar" element={<PatientAdd />} />
      <Route path="/turnos" element={<TurnoList />} />
      {/* <Route path="/odontologos/agregar" element={<DentistAdd />} /> */}
    </Routes>
  );
}

export default AppRoutes; 