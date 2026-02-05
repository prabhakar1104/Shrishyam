import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    
    try {
      const res = await axios.post('http://localhost:5000/api/foods/login', { email, password });
      
      // Store the token and redirect
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin-panel');
    } catch (err) {
      console.error(err);
      alert("Invalid credentials or server error. Please try again.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Modern Styling Objects
  const containerStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const formStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    padding: '40px',
    borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    color: '#fff'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: 'none',
    outline: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: loading ? '#555' : '#4ecca3',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: '0.3s ease'
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>Admin Gateway</h1>
          <p style={{ color: '#aaa', fontSize: '14px' }}>Please verify your credentials</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ textAlign: 'left', marginBottom: '5px', fontSize: '14px', color: '#4ecca3' }}>Email Address</div>
          <input 
            type="email" 
            placeholder="admin@restaurant.com" 
            style={inputStyle}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />

          <div style={{ textAlign: 'left', marginBottom: '5px', fontSize: '14px', color: '#4ecca3' }}>Password</div>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              style={inputStyle}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <span 
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '12px',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#aaa'
              }}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </span>
          </div>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Authenticating..." : "Unlock Access"}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
          Restricted Area: Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;