import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


const CreateCategory = () => {
  const [catName, setCatName] = useState('');
  const navigate = useNavigate();

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      await axios.post(`${API_BASE_URL}/api/foods/categories/add`, { name: catName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Category Created!");
      navigate('/admin-panel');
    } catch (err) {
      alert("Failed to add category. Check permissions.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 24, borderRadius: 12, boxShadow: '0 2px 12px #eee', background: '#fff' }}>
      <h2>Create Category</h2>
      <form onSubmit={handleAddCategory}>
        <input
          value={catName}
          onChange={e => setCatName(e.target.value)}
          placeholder="Category Name"
          required
          style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ ...btnStyle, background: '#222' }}>Create</button>
        <button type="button" style={{ ...btnStyle, background: '#aaa', color: '#222' }} onClick={() => navigate('/admin-panel')}>Back</button>
      </form>
    </div>
  );
};

const btnStyle = {
  width: '100%',
  padding: '12px',
  margin: '8px 0',
  border: 'none',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default CreateCategory;