import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request, setAuthHeader } from '../../components/axios_helper';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
        const loginData = {
            email: formData.email,
            password: formData.password
        };
        
        console.log('Enviando datos de login:', loginData);
        
        const response = await request(
            'POST',
            '/api/auth/login',  // Cambiado de 'authenticate' a 'login'
            loginData
        );

        console.log('Respuesta del servidor:', response);

        if (response.data && response.data.token) {
            setAuthHeader(response.data.token);
            
            if (response.data.role) {
                localStorage.setItem('user_role', response.data.role);
            }
            
            navigate('/');
        } else {
            setError('Respuesta inválida del servidor');
        }
    } catch (error) {
        console.error('Error de autenticación:', error);
        
        if (error.response?.status === 404) {
            setError('Ruta de autenticación no encontrada');
        } else if (error.response?.status === 403) {
            setError('Credenciales inválidas');
        } else if (error.response?.status === 401) {
            setError('No autorizado');
        } else {
            setError('Error al intentar iniciar sesión. Por favor, intente nuevamente.');
        }
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default LoginPage;
