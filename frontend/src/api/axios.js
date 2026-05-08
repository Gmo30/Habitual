import axios from 'axios';

const api = axios.create({
  baseURL: `http://localhost:${import.meta.env.VITE_PORT}`,
  withCredentials: true,            
});

export default api;