import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Save, X, ArrowLeft, Trash2, 
  Pencil, Check, Upload 
} from 'lucide-react';

const SearchEditItem = () => {
  const [search, setSearch] = useState('');
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Food Item States
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({
    name: '', halfPrice: '', fullPrice: '', description: '', category: ''
  });
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // For local preview

  // Category States
  const [editingCat, setEditingCat] = useState(null);
  const [catEditName, setCatEditName] = useState('');

  const navigate = useNavigate();
const API_BASE_URL = "https://restaurent-backend-h5p7.onrender.com";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const foodRes = await axios.get(`${API_BASE_URL}/api/foods`);
    const catRes = await axios.get(`${API_BASE_URL}/api/foods/categories`);
    setFoods(foodRes.data);
    setCategories(catRes.data);
  };

  const filteredFoods = foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  // --- IMAGE PREVIEW LOGIC ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // --- CATEGORY ACTIONS ---
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category? Items in this category might become uncategorized.")) return;
    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`${API_BASE_URL}/api/foods/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      alert("Failed to delete category.");
    }
  };

  const handleEditCategory = async (id) => {
    if (!catEditName.trim()) return;
    const token = localStorage.getItem('adminToken');
    try {
      await axios.put(`${API_BASE_URL}/api/foods/categories/${id}`, { name: catEditName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(categories.map(c => c._id === id ? { ...c, name: catEditName } : c));
      setEditingCat(null);
      setCatEditName('');
    } catch (err) {
      alert("Failed to update category.");
    }
  };

  // --- FOOD ITEM ACTIONS ---
  const handleDeleteFood = async (id) => {
    if (!window.confirm("Delete this food item?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE_URL}/api/foods/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFoods(foods.filter(f => f._id !== id));
    } catch (err) {
      alert("Failed to delete item.");
    }
  };

  const handleEditFood = async (id) => {
    const token = localStorage.getItem('adminToken');
    try {
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('halfPrice', editData.halfPrice);
      formData.append('fullPrice', editData.fullPrice);
      formData.append('description', editData.description);
      formData.append('category', editData.category);
      if (newImage) formData.append('image', newImage);

      await axios.put(`${API_BASE_URL}/api/foods/${id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Item updated successfully!");
      setEditing(null);
      setNewImage(null);
      setImagePreview(null);
      fetchData();
    } catch (err) {
      alert("Failed to update item.");
    }
  };

  return (
    <div style={container}>
      {/* Header Area */}
      <div style={header}>
        <button onClick={() => navigate('/admin-panel')} style={backCircleBtn}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ margin: 0, fontSize: '22px' }}>Menu & Categories</h2>
      </div>

      {/* --- CATEGORIES SECTION --- */}
      <div style={sectionCard}>
        <h3 style={{ margin: '0 0 15px 0', color: '#e67e22', fontSize: '18px' }}>Manage Categories</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {categories.map(cat => (
            <li key={cat._id} style={catItem}>
              {editingCat === cat._id ? (
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <input
                    value={catEditName}
                    onChange={e => setCatEditName(e.target.value)}
                    style={catInput}
                    autoFocus
                  />
                  <button onClick={() => handleEditCategory(cat._id)} style={catActionBtn('#27ae60')}><Check size={16}/></button>
                  <button onClick={() => { setEditingCat(null); setCatEditName(''); }} style={catActionBtn('#aaa')}><X size={16}/></button>
                </div>
              ) : (
                <>
                  <span style={{ flex: 1, fontWeight: '500' }}>{cat.name}</span>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => { setEditingCat(cat._id); setCatEditName(cat.name); }} style={catActionBtn('#f0f0f0', '#222')}><Pencil size={16}/></button>
                    <button onClick={() => handleDeleteCategory(cat._id)} style={catActionBtn('#fff1f0', '#e74c3c')}><Trash2 size={16}/></button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div style={divider}></div>

      {/* --- FOOD ITEMS SECTION --- */}
      <h3 style={{ marginBottom: '15px', color: '#e67e22', fontSize: '18px' }}>Manage Food Items</h3>
      <div style={searchWrapper}>
        <Search size={18} style={searchIcon} />
        <input
          placeholder="Search dishes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={searchInput}
        />
      </div>

      <div style={listWrapper}>
        {filteredFoods.map(food => (
          <div key={food._id} style={itemCard}>
            {editing === food._id ? (
              <div style={editForm}>
                <h4 style={{ marginBottom: 15, color: '#e67e22' }}>Editing: {food.name}</h4>
                
                {/* Image Edit Logic */}
                <div style={imageEditBox}>
                    <img 
                        src={imagePreview || (food.image?.startsWith('http') ? food.image : `${API_BASE_URL}/${food.image}`)} 
                        alt="Preview" 
                        style={editPreviewImg} 
                    />
                    <label style={uploadLabel}>
                        <Upload size={14} style={{ marginRight: 5 }} />
                        Change Photo
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    </label>
                </div>

                <label style={label}>Item Name</label>
                <input style={input} value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
                
                <div style={row}>
                  <div style={{ flex: 1 }}><label style={label}>Half Price</label><input style={input} type="number" value={editData.halfPrice} onChange={e => setEditData({ ...editData, halfPrice: e.target.value })} /></div>
                  <div style={{ flex: 1 }}><label style={label}>Full Price</label><input style={input} type="number" value={editData.fullPrice} onChange={e => setEditData({ ...editData, fullPrice: e.target.value })} /></div>
                </div>

                <label style={label}>Category</label>
                <select style={input} value={editData.category} onChange={e => setEditData({ ...editData, category: e.target.value })}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>

                <label style={label}>Description</label>
                <textarea style={{ ...input, height: '60px' }} value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} />

                <button onClick={() => handleEditFood(food._id)} style={saveBtn}><Save size={16} /> Save Changes</button>
                <button onClick={() => { setEditing(null); setImagePreview(null); }} style={cancelBtn}>Cancel</button>
              </div>
            ) : (
              <div style={displayRow}>
                <img 
                  src={food.image?.startsWith('http') ? food.image : `${API_BASE_URL}/${food.image}`} 
                  alt={food.name} style={thumb}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                />
                <div style={info}>
                  <h4 style={{ margin: 0 }}>{food.name}</h4>
                  <p style={priceText}>₹{food.fullPrice} {food.halfPrice && `| ₹${food.halfPrice}`}</p>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => { setEditing(food._id); setEditData({ name: food.name, halfPrice: food.halfPrice || '', fullPrice: food.fullPrice || '', description: food.description || '', category: food.category?._id || '' }); }} style={editIconBtn}><Pencil size={18} /></button>
                  <button onClick={() => handleDeleteFood(food._id)} style={{ ...editIconBtn, color: '#e74c3c' }}><Trash2 size={18} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- STYLES ---
const container = { maxWidth: '650px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' };
const header = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' };
const backCircleBtn = { width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const sectionCard = { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '20px' };
const catItem = { display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' };
const catInput = { flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' };
const catActionBtn = (bg, color = '#fff') => ({ background: bg, color: color, border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' });
const divider = { height: '1px', background: '#ddd', margin: '30px 0' };
const searchWrapper = { position: 'relative', marginBottom: '20px' };
const searchIcon = { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' };
const searchInput = { width: '100%', padding: '12px 12px 12px 45px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' };
const listWrapper = { display: 'flex', flexDirection: 'column', gap: '12px' };
const itemCard = { background: '#fff', borderRadius: '12px', padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const displayRow = { display: 'flex', alignItems: 'center', gap: '12px' };
const thumb = { width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' };
const info = { flex: 1 };
const priceText = { margin: '2px 0', color: '#e67e22', fontWeight: 'bold', fontSize: '14px' };
const editIconBtn = { background: '#f5f5f5', border: 'none', width: '34px', height: '34px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' };
const editForm = { display: 'flex', flexDirection: 'column' };
const label = { fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '4px' };
const input = { padding: '8px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '10px', fontSize: '14px' };
const row = { display: 'flex', gap: '10px' };
const saveBtn = { padding: '12px', background: '#222', color: '#ffd700', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };
const cancelBtn = { padding: '10px', background: '#eee', color: '#444', border: 'none', borderRadius: '8px', cursor: 'pointer' };

// --- NEW IMAGE EDIT STYLES ---
const imageEditBox = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', background: '#fcfcfc', padding: '10px', borderRadius: '8px', border: '1px dashed #ddd' };
const editPreviewImg = { width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const uploadLabel = { background: '#222', color: '#ffd700', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center' };

export default SearchEditItem;