import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const AddItem = () => {
  const [categories, setCategories] = useState([]);
  // 1. Updated state to hold halfPrice and fullPrice
  const [foodData, setFoodData] = useState({ 
    name: '', 
    halfPrice: '', 
    fullPrice: '', 
    description: '', 
    category: '' 
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Make sure your backend URL is correct here
    axios.get(`${API_BASE_URL}/api/foods/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAddFood = async (e) => {
    e.preventDefault();

    // 2. Validation: Ensure at least ONE price is entered
    if (!foodData.halfPrice && !foodData.fullPrice) {
      alert("Please enter a price for either Half or Full portion.");
      return;
    }

    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('name', foodData.name);
    formData.append('description', foodData.description);
    formData.append('category', foodData.category);
    
    // 3. Append prices only if they exist
    if (foodData.halfPrice) formData.append('halfPrice', foodData.halfPrice);
    if (foodData.fullPrice) formData.append('fullPrice', foodData.fullPrice);

    // 4. Append image ONLY if user selected one (Optional Image Logic)
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post(`${API_BASE_URL}/api/foods/categories/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Food Added Successfully!");
      navigate('/admin-panel');
    } catch (err) {
      console.error(err);
      alert("Failed to add food item.");
    }
  };

  return (
    <div style={{ maxWidth: 450, margin: '60px auto', padding: 24, borderRadius: 12, boxShadow: '0 2px 12px #eee', background: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Add Food Item</h2>
      <form onSubmit={handleAddFood} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Name */}
        <input
          placeholder="Food Name"
          value={foodData.name}
          onChange={e => setFoodData({ ...foodData, name: e.target.value })}
          required
          style={inputStyle}
        />

        {/* Dual Price Section */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Half Price (₹)</label>
            <input
              placeholder="e.g. 150"
              type="number"
              value={foodData.halfPrice}
              onChange={e => setFoodData({ ...foodData, halfPrice: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Full Price (₹)</label>
            <input
              placeholder="e.g. 280"
              type="number"
              value={foodData.fullPrice}
              onChange={e => setFoodData({ ...foodData, fullPrice: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Description */}
        <textarea
          placeholder="Description"
          value={foodData.description}
          onChange={e => setFoodData({ ...foodData, description: e.target.value })}
          style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
        />

        {/* Category */}
        <select
          value={foodData.category}
          onChange={e => setFoodData({ ...foodData, category: e.target.value })}
          required
          style={inputStyle}
        >
          <option value="">Select Category</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        {/* Image (Optional) */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', display: 'block', marginBottom: 5 }}>Food Image (Optional)</label>
          <input
            type="file"
            onChange={e => setImage(e.target.files[0])}
            // Removed 'required' attribute
            style={inputStyle}
          />
        </div>

        {/* Buttons */}
        <div style={{ marginTop: 10 }}>
          <button type="submit" style={{ ...btnStyle, background: '#222' }}>Upload Item</button>
          <button type="button" style={{ ...btnStyle, background: '#eee', color: '#222' }} onClick={() => navigate('/admin-panel')}>Back</button>
        </div>

      </form>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  boxSizing: 'border-box',
  fontSize: '14px'
};

const btnStyle = {
  width: '100%',
  padding: '14px',
  margin: '5px 0',
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: '0.2s'
};

export default AddItem;