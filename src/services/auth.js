import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
const API_URL = 'http://localhost:8080/api';

export async function login(email, password) {
  const response = await axios.post(`${API_URL}/users/login`, { email, password });

  //console.log('Login response:', response)

  if (response.data) {
    localStorage.setItem('token', response.data);
  }                                     
  return response.data;
}

export async function register(email, password) {
  const response = await axios.post(`${API_URL}/users/register`, { email, password });

  if (response.data) {
    localStorage.setItem('token', response.data);
  }
  return response.data;
}

export function logout() {
  localStorage.removeItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
}

export function isLoggedIn() {
  const raw = getToken();
  if (!raw) return false;

  // Token mora OBVEZNO biti oblike "Bearer <token>"
  if (!raw.startsWith("Bearer ")) return false;

  const token = raw.substring(7).trim();
  if (!token || token.split('.').length !== 3) return false; // preveri tri dele

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp && decoded.exp > now;
  } catch {
    return false;
  }
}                                     
