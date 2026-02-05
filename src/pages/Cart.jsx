import React, { useState } from 'react';
import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ChevronLeft, Minus, Plus } from 'lucide-react';

const Cart = () => {
  const { cart, clearCart, addToCart, decreaseQuantity, removeFromCart } = useCart();
  const [ordered, setOrdered] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:5000";
  const adminWhatsApp = "917696952407"; // Admin phone number

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = () => {
    if (cart.length === 0) return;

    // 1. Format cart items for WhatsApp message
    let message = `*New Order from Shri Shyam Bhojnalaya*\n\n`;
    cart.forEach((item, idx) => {
      message += `${idx + 1}. ${item.name} x${item.quantity} - ₹${item.price * item.quantity}\n`;
    });
    message += `\n*Total: ₹${totalAmount}*`;
    message += `\n\nPlease share your location by tapping the 📎 (attach) icon and choosing "Location".`;

    // 2. Encode message for URL
    const encodedMsg = encodeURIComponent(message);

    // 3. WhatsApp redirect URL
    const waUrl = `https://wa.me/${adminWhatsApp}?text=${encodedMsg}`;

    // 4. Clear the cart and redirect
    clearCart();
    window.location.href = waUrl; 
    
    // Optional: setOrdered(true) if you want them to see the success screen 
    // when they click "back" from WhatsApp
    setOrdered(true);
  };

  if (ordered) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100, padding: 20 }}>
        <div style={{ fontSize: '60px' }}>✅</div>
        <h2 style={{ fontSize: '28px', color: '#222' }}>Redirecting to WhatsApp...</h2>
        <p style={{ color: '#666' }}>Your delicious meal from Shri Shyam is almost ready. Please confirm the order on WhatsApp.</p>
        <button onClick={() => navigate('/')} style={mainBtn}>Back to Menu</button>
      </div>
    );
  }

  return (
    <div style={container}>
      {/* --- HEADER --- */}
      <div style={header}>
        <button onClick={() => navigate('/')} style={backBtn}>
          <ChevronLeft size={24} />
        </button>
        <h2 style={{ margin: 0 }}>My Thali</h2>
        <div style={{ width: 24 }}></div>
      </div>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <ShoppingBag size={60} color="#ccc" />
          <p style={{ color: '#888', marginTop: 15 }}>Your thali is empty.</p>
          <button onClick={() => navigate('/')} style={mainBtn}>Add Items</button>
        </div>
      ) : (
        <div style={{ paddingBottom: 150 }}>
          {/* --- ITEM LIST --- */}
          <div style={{ padding: '0 15px' }}>
            {cart.map((item, idx) => (
              <div key={idx} style={cartItemCard}>
                <img 
                  src={item.image && item.image.startsWith('http') ? item.image : `${API_BASE_URL}/${item.image}`}
                  alt={item.name}
                  style={itemImg}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Food'; }}
                />
                
                <div style={{ flex: 1, marginLeft: 15 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{item.name}</h4>
                  <p style={{ margin: 0, color: '#e67e22', fontWeight: 'bold' }}>₹{item.price}</p>
                </div>

                <div style={qtyControls}>
                  <button onClick={() => decreaseQuantity(item._id)} style={smallCircleBtn}><Minus size={14}/></button>
                  <span style={{ fontWeight: 'bold', width: 20, textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => addToCart(item)} style={smallCircleBtn}><Plus size={14}/></button>
                  <button onClick={() => removeFromCart(item._id)} style={deleteBtn}>
                    <Trash2 size={18} color="#ff4757" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* --- BOTTOM SUMMARY BAR --- */}
          <div style={summaryBar}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
              <span style={{ color: '#666' }}>Total Amount</span>
              <span style={{ fontSize: '20px', fontWeight: '900', color: '#222' }}>₹{totalAmount}</span>
            </div>
            <button onClick={handleOrder} style={checkoutBtn}>
              Place Order on WhatsApp (₹{totalAmount})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- STYLES (Unchanged) ---

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  minHeight: '100vh',
  backgroundColor: '#f9f9f9',
  fontFamily: 'sans-serif'
};

const header = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '15px',
  background: '#fff',
  borderBottom: '1px solid #eee',
  position: 'sticky',
  top: 0,
  zIndex: 10
};

const backBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0
};

const cartItemCard = {
  display: 'flex',
  alignItems: 'center',
  background: '#fff',
  padding: '12px',
  borderRadius: '12px',
  marginTop: '15px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
};

const itemImg = {
  width: '65px',
  height: '65px',
  borderRadius: '8px',
  objectFit: 'cover'
};

const qtyControls = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const smallCircleBtn = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  border: '1px solid #ddd',
  background: '#fff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer'
};

const deleteBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  marginLeft: '5px'
};

const summaryBar = {
  position: 'fixed',
  bottom: 0,
  maxWidth: '600px',
  width: '100%',
  background: '#fff',
  padding: '20px',
  borderTopLeftRadius: '24px',
  borderTopRightRadius: '24px',
  boxShadow: '0 -5px 20px rgba(0,0,0,0.05)',
  boxSizing: 'border-box'
};

const checkoutBtn = {
  width: '100%',
  padding: '16px',
  background: '#222',
  color: '#ffd700',
  border: 'none',
  borderRadius: '12px',
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const mainBtn = {
  padding: '12px 30px',
  background: '#222',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: 20
};

export default Cart;