import axios from 'axios';

const api = axios.create({ baseURL: 'http://127.0.0.1:8000/api/' });

// Attach JWT token to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh token on 401
api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        const { data } = await axios.post(
          'http://127.0.0.1:8000/api/auth/token/refresh/',
          { refresh }
        );
        localStorage.setItem('access_token', data.access);
        err.config.headers.Authorization = `Bearer ${data.access}`;
        return axios(err.config);
      }
    }
    return Promise.reject(err);
  }
);

export default api;