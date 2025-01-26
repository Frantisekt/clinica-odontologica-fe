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
        const token = getAuthToken();
        const config = {
            method: method,
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            },
            withCredentials: true,
            data: data
        };

        console.log('Request config:', config); // Debug

        const response = await axios(config);
        return response;
    } catch (error) {
        console.log('Request error details:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers
        });
        throw error;
    }
};

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
    response => response,
    error => {
        // Solo cerrar sesión si es un error de token inválido o expirado
        if (error.response?.status === 401 && 
            error.response?.data?.message?.includes('token')) {
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