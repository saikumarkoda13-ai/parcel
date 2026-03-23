// PRODUCTION — Pointing to deployed Render backend
const BASE_URL = 'https://damage-1-c2vz.onrender.com';

import axios from 'axios';
import { Platform } from 'react-native';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Reduced from 60s for faster error feedback
});

// REQUEST INTERCEPTOR — Log request start
api.interceptors.request.use((config) => {
  config.metadata = { startTime: new Date() };
  console.log(`[API REQUEST] ${config.method.toUpperCase()} ${config.url}`);
  return config;
});

// RESPONSE INTERCEPTOR — Log timing and handle errors
api.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata.startTime;
    console.log(`[API RESPONSE] ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`);
    return response;
  },
  (error) => {
    const duration = error.config ? new Date() - error.config.metadata.startTime : 'N/A';
    console.error(`[API ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.message} (${duration}ms)`);
    return Promise.reject(error);
  }
);

export const checkHealth = () => 
  api.get('/').then(r => r.data).catch(() => ({ success: false, message: 'Offline' }));

export const registerUser = (data) =>
  api.post('/api/register/', data).then(r => r.data);

// User Login
export const loginUser = (loginid, password) =>
  api.post('/api/login/', { loginid, password }).then(r => r.data);

// Admin Login
export const loginAdmin = (loginid, password) =>
  api.post('/api/admin-login/', { loginid, password }).then(r => r.data);

// Predict — multipart form upload
export const predictImage = async (imageUri) => {
  const formData = new FormData();
  let filename = imageUri.split('/').pop() || 'image.jpg';
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1] === 'jpg' ? 'jpeg' : match[1]}` : 'image/jpeg';

  if (Platform.OS === 'web') {
    // For Web, we must fetch the URI to get a Blob/File
    const response = await fetch(imageUri);
    const blob = await response.blob();
    formData.append('image', blob, filename);
  } else {
    // For Native (iOS/Android)
    if (!match) filename += '.jpg';
    formData.append('image', {
      uri: imageUri,
      name: filename,
      type: type,
    });
  }

  const res = await api.post('/api/predict/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 90000, // Higher timeout for predictions
  });
  return res.data;
};

// Get all users (admin)
export const getUsers = () =>
  api.get('/api/users/').then(r => r.data);

// Activate user (admin)
export const activateUser = (uid) =>
  api.post('/api/activate-user/', { uid }).then(r => r.data);

// Get Dashboard Stats (admin)
export const getStats = () =>
  api.get('/api/stats/').then(r => r.data);
