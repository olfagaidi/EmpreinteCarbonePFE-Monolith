
import axios from 'axios';

// Création de l'instance axios avec la configuration de base
const api = axios.create({
  baseURL: 'https://localhost:7281/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;