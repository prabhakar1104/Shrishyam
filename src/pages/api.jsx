import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

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