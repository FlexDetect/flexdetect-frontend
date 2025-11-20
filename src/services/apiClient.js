import axios from 'axios';
import { getToken } from './auth'; // getter za token v auth.js

const API_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default apiClient;


/*
UPORABA V ZASČITENIH ZAHTEVKIH:
import apiClient from '../services/apiClient';

export async function fetchProtectedData() {
  const response = await apiClient.get('/protected-endpoint');
  return response.data;
}
*/