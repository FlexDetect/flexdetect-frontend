import axios from 'axios';
import { getToken } from './auth';

const DATA_SERVICE_URL = 'http://localhost:8081/api';

const dataServiceClient = axios.create({
  baseURL: DATA_SERVICE_URL,
});

// Add Authorization header with Bearer token before each request
dataServiceClient.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    // Ensure token includes "Bearer " prefix
    config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  return config;
});

// Facilities endpoints
export async function fetchFacilities() {
  const response = await dataServiceClient.get('/facilities');
  return response.data;
}

export async function createFacility(facility) {
  const response = await dataServiceClient.post('/facilities', facility);
  return response.data;
}

export async function updateFacility(id, facility) {
  const response = await dataServiceClient.put(`/facilities/${id}`, facility);
  return response.data;
}

export async function deleteFacility(id) {
  await dataServiceClient.delete(`/facilities/${id}`);
}

// Measurement Names endpoints
export async function fetchMeasurementNames() {
  const response = await dataServiceClient.get('/measurement-names');
  return response.data;
}

export async function createMeasurementName(measurementName) {
  const response = await dataServiceClient.post('/measurement-names', measurementName);
  return response.data;
}

export async function updateMeasurementName(id, measurementName) {
  const response = await dataServiceClient.put(`/measurement-names/${id}`, measurementName);
  return response.data;
}

export async function deleteMeasurementName(id) {
  await dataServiceClient.delete(`/measurement-names/${id}`);
}

// Datasets endpoints (facility scoped)
export async function fetchDatasets(facilityId) {
  const response = await dataServiceClient.get(`/facilities/${facilityId}/datasets`);
  return response.data;
}

export async function createDataset(facilityId, dataset) {
  const response = await dataServiceClient.post(`/facilities/${facilityId}/datasets`, dataset);
  return response.data;
}

export async function updateDataset(facilityId, id, dataset) {
  const response = await dataServiceClient.put(`/facilities/${facilityId}/datasets/${id}`, dataset);
  return response.data;
}

export async function deleteDataset(facilityId, id) {
  await dataServiceClient.delete(`/facilities/${facilityId}/datasets/${id}`);
}

// Measurements endpoints (dataset scoped)
export async function fetchMeasurements(datasetId) {
  const response = await dataServiceClient.get(`/datasets/${datasetId}/measurements`);
  return response.data;
}

export async function createMeasurement(datasetId, measurement) {
  const response = await dataServiceClient.post(`/datasets/${datasetId}/measurements`, measurement);
  return response.data;
}

export async function deleteMeasurement(datasetId, id) {
  await dataServiceClient.delete(`/datasets/${datasetId}/measurements/${id}`);
}

export default dataServiceClient;