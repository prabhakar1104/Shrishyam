import axios from 'axios';

const API = axios.create({ baseURL: 'https://restaurent-backend-h5p7.onrender.com/api' });

// This helps send the Admin Token automatically if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const fetchFoods = () => API.get('/foods');
export const addFood = (foodData) => API.post('/foods/add', foodData);