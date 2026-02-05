import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../CartContext';

const API_BASE_URL = "http://localhost:5000";

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  
  // 🟢 SETTING DEFAULT TO 'Half' as per your requirement
  const [size, setSize] = useState('Half'); 
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/foods`)
      .then(res => {
        const found = res.data.find(f => f._id === id);
        setItem(found);
        
        // Logic: If for some reason there is NO halfPrice, only then default to Full
        if (found && !found.halfPrice && found.fullPrice) {
          setSize('Full');
        }
      });
  }, [id]);

  if (!item) return <div style={{ textAlign: 'center', marginTop: 50 }}>Loading...</div>;

  const getPrice = () => {
    if (size === 'Half') {
      return item.halfPrice; 
    }
    return item.fullPrice || item.price; 
  };

  const currentPrice = getPrice();

  const handleAddToCart = () => {
    if (!currentPrice) {
      alert("Price not available for this portion.");
      return;
    }

    addToCart({
      ...item,
      _id: item._id + size, 
      originalId: item._id, 
      // Updated name to include the ML volume in cart too
      name: `${item.name} (${size === 'Half' ? '350ml' : '500ml'})`, 
      price: currentPrice, 
      selectedSize: size
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #eee', padding: 24 }}>
      <img
        src={item.image && item.image.startsWith('http') ? item.image : `${API_BASE_URL}/${item.image}`}
        alt={item.name}
        onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Shyam+Bhojnalaya'; }}
        style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 10, marginBottom: 24 }}
      />
      
      <h2>{item.name}</h2>
      
      {/* 🔴 Updated Price Display based on selection */}
      <p style={{ color: '#e67e22', fontWeight: 'bold', fontSize: 24 }}>
        {currentPrice ? `₹${currentPrice}` : 'Price Unavailable'}
      </p>

      <p>{item.description}</p>
      <p style={{ color: '#888', fontSize: 14 }}>Category: {item.category?.name || 'N/A'}</p>

      {/* 🟢 PORTION SELECTOR WITH ML LABELS */}
      <div style={{ margin: '20px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold' }}>Portion:</span>
        
        {item.halfPrice && (
          <button 
            onClick={() => setSize('Half')}
            style={size === 'Half' ? activeSizeBtn : inactiveSizeBtn}
          >
            Half (350ml)
          </button>
        )}

        {(item.fullPrice || item.price) && (
          <button 
            onClick={() => setSize('Full')}
            style={size === 'Full' ? activeSizeBtn : inactiveSizeBtn}
          >
            Full (500ml)
          </button>
        )}
      </div>

      <div style={{ borderTop: '1px solid #eee', paddingTop: 20, marginTop: 20 }}>
        <button
          onClick={handleAddToCart}
          disabled={!currentPrice || added}
          style={{
            padding: '12px 30px',
            background: added ? '#27ae60' : '#222',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 'bold',
            cursor: (!currentPrice || added) ? 'not-allowed' : 'pointer',
            transition: '0.3s',
            opacity: !currentPrice ? 0.5 : 1
          }}
        >
          {added ? "✔ Added" : `Add to Thali ${currentPrice ? `(₹${currentPrice})` : ''}`}
        </button>
        
        <button
          style={{
            marginLeft: 16,
            padding: '12px 30px',
            background: '#eee',
            color: '#222',
            border: 'none',
            borderRadius: 6,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

// --- Styles ---
const baseSizeBtn = {
  padding: '10px 15px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px',
  border: '1px solid #ddd',
  transition: 'all 0.2s ease'
};

const activeSizeBtn = {
  ...baseSizeBtn,
  background: '#e67e22',
  color: '#fff',
  border: '1px solid #e67e22',
  boxShadow: '0 2px 5px rgba(230, 126, 34, 0.3)'
};

const inactiveSizeBtn = {
  ...baseSizeBtn,
  background: '#fff',
  color: '#555'
};

export default ItemDetail;