import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Bienvenidos a Clínica Dental</h1>
        <p className="subtitle">Cuidamos tu sonrisa con profesionalismo y dedicación</p>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">👨‍⚕️</div>
          <h3>Profesionales Expertos</h3>
          <p>Contamos con odontólogos altamente calificados para cuidar tu salud dental.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🦷</div>
          <h3>Servicios Completos</h3>
          <p>Ofrecemos una amplia gama de tratamientos dentales para toda la familia.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Citas Flexibles</h3>
          <p>Programa tu cita en el horario que mejor se adapte a tus necesidades.</p>
        </div>
      </section>

      <section className="cta-section">
        <h2>¿Necesitas una consulta?</h2>
        <div className="cta-buttons">
          <Link to="/login" className="cta-button">Iniciar Sesión</Link>
          <Link to="/register" className="cta-button secondary">Registrarse</Link>
        </div>
      </section>
    </div>
  );
}

export default Home; 