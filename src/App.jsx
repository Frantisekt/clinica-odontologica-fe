import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './routes/Home';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
//import PatientList from './pages/patient/PatientList';
//import PatientAdd from './pages/patient/PatientAdd';
//import DentistList from './pages/dentist/DentistList';
//import DentistAdd from './pages/dentist/DentistAdd';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* <Route path="/pacientes" element={<PatientList />} />
            <Route path="/pacientes/agregar" element={<PatientAdd />} />
            <Route path="/odontologos" element={<DentistList />} />
            <Route path="/odontologos/agregar" element={<DentistAdd />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
