import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const menuItems = [
    { title: 'Create Category', path: '/admin/create-category', icon: '📁' },
    { title: 'Add New Item', path: '/admin/add-item', icon: '➕' },
    { title: 'Manage Food', path: '/admin/search-edit', icon: '🍴' },
    { title: 'Manage Contacts', path: '/admin/manage-contacts', icon: '📞' },
  ];

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#222' }}>Admin Control</h2>
          <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>Welcome back, Shri Shyam Admin</p>
        </div>

        <div style={gridStyle}>
          {menuItems.map((item, index) => (
            <button 
              key={index} 
              style={gridBtnStyle} 
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</span>
              {item.title}
            </button>
          ))}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            style={{ ...actionBtnStyle, background: '#f8f9fa', color: '#444', border: '1px solid #ddd' }} 
            onClick={() => navigate('/')}
          >
            View Shop
          </button>
          <button 
            style={{ ...actionBtnStyle, background: '#ff4757', color: '#fff' }} 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Styles ---

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f1f2f6', // Light gray background
  padding: '20px'
};

const cardStyle = {
  width: '100%',
  maxWidth: '500px',
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  padding: '30px',
  boxSizing: 'border-box'
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '30px',
  borderBottom: '2px solid #ffd700', // Gold accent line
  paddingBottom: '15px'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '15px',
  marginBottom: '10px'
};

const gridBtnStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px 10px',
  background: '#fff',
  border: '1px solid #eee',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#333',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxSizing: 'border-box'
};

const actionBtnStyle = {
  flex: 1,
  padding: '12px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'opacity 0.2s'
};

export default AdminPanel;