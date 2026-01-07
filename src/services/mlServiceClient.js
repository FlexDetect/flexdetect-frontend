import axios from 'axios';
import { getToken } from './auth';

const ML_SERVICE_URL =
  'https://flexdetect-ml.kindsky-e3be2a2e.italynorth.azurecontainerapps.io';

const mlServiceClient = axios.create({
  baseURL: ML_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

mlServiceClient.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = token.startsWith('Bearer ')
      ? token
      : `Bearer ${token}`;
  }
  return config;
});

export const runMLDetection = async ({
  datasetId,
  powerMeasurementId,
  featureMeasurementIds,
}) => {
  const res = await mlServiceClient.post('/detect', {
    dataset_id: datasetId,
    power_measurement_id: powerMeasurementId,
    feature_measurement_ids: featureMeasurementIds,
  });

  return res.data;
};
