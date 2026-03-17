// PRODUCTION — Pointing to deployed Render backend
const BASE_URL = 'https://damage-4.onrender.com';

import axios from 'axios';
import { Platform } from 'react-native';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // Increased timeout for heavy image uploads
});

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
