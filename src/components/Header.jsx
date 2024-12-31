import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { logout, getAuthToken } from './axios_helper';

function Header() {
  const [showPatientMenu, setShowPatientMenu] = useState(false);
  const [showDentistMenu, setShowDentistMenu] = useState(false);
  const [showTurnoMenu, setShowTurnoMenu] = useState(false);
  const navigate = useNavigate();
  
  const isAuthenticated = !!getAuthToken();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header className="header">
      <nav>
        <div className="logo">
          <Link to="/">Clínica Dental</Link>
        </div>
        <div className="nav-links">
          <Link to="/">Inicio</Link>
          
          {isAuthenticated && (
            <>
              <div className="dropdown">
                <button 
                  className="dropdown-btn"
                  onMouseEnter={() => setShowPatientMenu(true)}
                  onMouseLeave={() => setShowPatientMenu(false)}
                >
                  Gestión de Pacientes
                  {showPatientMenu && (
                    <div className="dropdown-content">
                      <Link to="/pacientes">Listar pacientes</Link>
                      <Link to="/pacientes/agregar">Agregar pacientes</Link>
                    </div>
                  )}
                </button>
              </div>

              <div className="dropdown">
                <button 
                  className="dropdown-btn"
                  onMouseEnter={() => setShowDentistMenu(true)}
                  onMouseLeave={() => setShowDentistMenu(false)}
                >
                  Gestión Odontólogos
                  {showDentistMenu && (
                    <div className="dropdown-content">
                      <Link to="/odontologos">Listar odontólogos</Link>
                      <Link to="/odontologos/agregar">Agregar odontólogos</Link>
                    </div>
                  )}
                </button>
              </div>

              <div className="dropdown">
                <button 
                  className="dropdown-btn"
                  onMouseEnter={() => setShowTurnoMenu(true)}
                  onMouseLeave={() => setShowTurnoMenu(false)}
                >
                  Gestión Turnos
                  {showTurnoMenu && (
                    <div className="dropdown-content">
                      <Link to="/turnos">Listar turnos</Link>
                      <Link to="/turnos/agregar">Agregar turnos</Link>
                    </div>
                  )}
                </button>
              </div>
            </>
          )}

          {!isAuthenticated ? (
            <>
              <Link to="/login">Iniciar Sesión</Link>
              <Link to="/register">Registrarse</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
