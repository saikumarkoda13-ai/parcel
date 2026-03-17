<<<<<<< HEAD
// PRODUCTION — Pointing to deployed Render backend
const BASE_URL = 'https://damage-4.onrender.com';
=======
<<<<<<< HEAD
// Live Render backend — always uses the deployed backend
const BASE_URL = 'https://damage-4.onrender.com';
=======
// API service — update BASE_URL to your PC's local IP when testing on real device
// e.g. http://192.168.1.x:8000
const DEV_URL = 'http://192.168.236.53:8000'; 
const PROD_URL = 'https://damage-4.onrender.com'; // Deployed Render URL

const BASE_URL = process.env.NODE_ENV === 'production' ? PROD_URL : DEV_URL;
>>>>>>> 02d3e73b057bcff2b831d15e83f945c290fabb93
>>>>>>> cafefaa6ec9fbe18810376c7a2056891b12588c5

import axios from 'axios';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
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
  let filename = imageUri.split('/').pop();
  let match = /\\.(\\w+)$/.exec(filename);
  let type = match ? `image/${match[1] === 'jpg' ? 'jpeg' : match[1]}` : 'image/jpeg';
  // Ensure the filename has an extension so Django processes it properly
  if (!match) filename += '.jpg';
  
  formData.append('image', {
    uri: imageUri,
    name: filename,
    type: type,
  });
  const res = await api.post('/api/predict/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
  return res.data;
};

// Get all users (admin)
export const getUsers = () =>
  api.get('/api/users/').then(r => r.data);

// Activate user (admin)
export const activateUser = (uid) =>
  api.post('/api/activate-user/', { uid }).then(r => r.data);
