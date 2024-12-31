import axios from 'axios';

export const getAuthToken = () => {
    return window.localStorage.getItem('auth_token');
};

export const updatePatient = async (patient) => {
  await axios.put(`/paciente/modificar/${patient.id}`, patient);
};

export const setAuthHeader = (token) => {
    if (token) {
        window.localStorage.setItem("auth_token", token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        window.localStorage.removeItem("auth_token");
        delete axios.defaults.headers.common['Authorization'];
    }
};

// Configuración base de axios
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true; // Importante para CORS

export const request = async (method, url, data) => {
    try {
        const config = {
            method: method,
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true,
            data: data
        };

        // Solo añadimos el token si NO es una ruta de autenticación
        const token = getAuthToken();
        if (token && !url.includes('/api/auth/')) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios(config);
        return response;
    } catch (error) {
        if (error.response) {
            // El servidor respondió con un estado de error
            console.error('Error de respuesta:', error.response.data);
            throw error;
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            console.error('Error de red:', error.message);
            throw error;
        } else {
            // Algo sucedió al configurar la petición
            console.error('Error:', error.message);
            throw error;
        }
    }
};

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            setAuthHeader(null);
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const logout = async () => {
    try {
        const token = getAuthToken();
        if (token) {
            await request('POST', '/api/auth/logout');
        }
    } finally {
        // Limpiamos el token y el rol independientemente de la respuesta
        setAuthHeader(null);
        localStorage.removeItem('user_role');
    }
};