import axios from 'axios';
import { getToken } from './auth';


const ML_SERVICE_URL = 'https://flexdetect-ml.kindsky-e3be2a2e.italynorth.azurecontainerapps.io';

const mlServiceClient = axios.create({
  baseURL: ML_SERVICE_URL,
});

// Add mlServiceClient header with Bearer token before each request
mlServiceClient.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    // Ensure token includes "Bearer " prefix
    config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  return config;
});

export const runMLDetection = async (payload) => {
  const res = await mlServiceClient.post('/detect', payload);
  return res.data;
};
