import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ManageContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [number, setNumber] = useState('');
  const navigate = useNavigate();

  const fetchContacts = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/foods/contacts`);
    setContacts(res.data.contacts || []);
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      await axios.post(`${API_BASE_URL}/api/foods/contacts/add`, { number }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNumber('');
      fetchContacts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add contact.");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('adminToken');
    if (window.confirm("Delete this contact?")) {
      await axios.delete(`${API_BASE_URL}/api/foods/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchContacts();
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 24, borderRadius: 12, boxShadow: '0 2px 12px #eee', background: '#fff' }}>
      <h2>Manage Contact Numbers</h2>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          value={number}
          onChange={e => setNumber(e.target.value)}
          placeholder="Contact Number"
          required
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 6, background: '#222', color: '#fff', border: 'none' }}>Add</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {contacts.map(c => (
          <li key={c._id} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{c.number}</span>
            <button onClick={() => handleDelete(c._id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/admin-panel')} style={{ marginTop: 20, background: '#aaa', color: '#222', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}>Back</button>
    </div>
  );
};

export default ManageContacts;