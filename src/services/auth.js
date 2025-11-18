import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export async function login(email, password) {
  const response = await axios.post(`${API_URL}/users/login`, { email, password });

  //console.log('Login response:', response)

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

