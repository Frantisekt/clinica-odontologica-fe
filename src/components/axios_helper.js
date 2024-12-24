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

export const request = async (method, url, data) => {
    try {
        const config = {
            method: method,
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: data
        };

        // Si no es una ruta de autenticación y tenemos token, lo añadimos
        const token = getAuthToken();
        if (token && !url.includes('/api/auth/')) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios(config);
        console.log('Respuesta exitosa:', response);
        return response;
    } catch (error) {
        console.error('Error en la petición:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;
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