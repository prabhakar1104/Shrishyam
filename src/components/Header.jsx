// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import { useCart } from '../CartContext';

// const Dashboard = () => {
//   const [foods, setFoods] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [activeCategory, setActiveCategory] = useState('All');
//   const [loading, setLoading] = useState(true);
//   const [addMsg, setAddMsg] = useState('');
  
//   // 📱 Mobile Detection
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   const { cart, addToCart, removeFromCart } = useCart();
//   const navigate = useNavigate();
//   const API_BASE_URL = "http://localhost:5000"; 

//   // Handle Resize
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Fetch Data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const foodRes = await axios.get(`${API_BASE_URL}/api/foods`);
//         const catRes = await axios.get(`${API_BASE_URL}/api/foods/categories`);
//         setFoods(foodRes.data);
//         setCategories(catRes.data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Backend Error", err);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Toast Message Timer
//   useEffect(() => {
//     if (addMsg) {
//       const timer = setTimeout(() => setAddMsg(''), 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [addMsg]);

//   const filteredFoods = activeCategory === 'All' 
//     ? foods 
//     : foods.filter(item => item.category?.name === activeCategory);

//   const isInCart = (id) => cart.some(item => item._id === id);

//   if (loading) return <div style={loaderStyle}>Loading Shri Shyam Bhojnalaya...</div>;

//   return (
//     <div style={containerStyle}>
      
//       {/* --- YOUR CUSTOM HEADER (Responsive Version) --- */}
//       <header style={headerStyle(isMobile)}>
//         <div style={headerContent(isMobile)}>
          
//           {/* Identity Section */}
//           <div style={{ textAlign: isMobile ? 'center' : 'left', marginBottom: isMobile ? '15px' : '0' }}>
//             <h1 style={{ margin: 0, fontSize: isMobile ? '24px' : '32px', letterSpacing: 1, fontFamily: 'serif' }}>
//               Shri Shyam Bhojnalaya
//             </h1>
//             <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#ffd700', marginTop: 4 }}>
//               Contact: <a href="tel:+919999999999" style={linkStyle}>+91-9999999999</a> 
//               {!isMobile && <span> | </span>}
//               <br style={{ display: isMobile ? 'block' : 'none' }} />
//                Email: <a href="mailto:info@shrishyam.com" style={linkStyle}>info@shrishyam.com</a>
//             </div>
//           </div>

//           {/* Navigation Section */}
//           <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
//             <Link to="/" style={navLink}>Home</Link>
            
//             <Link to="/cart" style={{ ...navLink, position: 'relative' }}>
//               Cart
//               {cart.length > 0 && (
//                 <span style={cartBadge}>{cart.length}</span>
//               )}
//             </Link>
            
//             <Link to="/admin-login" style={navLink}>Admin</Link>
//           </nav>

//         </div>
//       </header>

//       {/* --- TOAST SUCCESS MESSAGE --- */}
//       {addMsg && <div style={toastStyle}>{addMsg}</div>}

//       {/* --- CATEGORY PILLS --- */}
//       <div style={categoryContainer}>
//         <button 
//           onClick={() => setActiveCategory('All')}
//           style={catButtonStyle(activeCategory === 'All', isMobile)}
//         >
//           All
//         </button>
//         {categories.map(cat => (
//           <button 
//             key={cat._id} 
//             onClick={() => setActiveCategory(cat.name)}
//             style={catButtonStyle(activeCategory === cat.name, isMobile)}
//           >
//             {cat.name}
//           </button>
//         ))}
//       </div>

//       {/* --- DUAL COLUMN FOOD GRID --- */}
//       <main style={{
//         ...gridStyle,
//         gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
//         gap: isMobile ? '10px' : '30px',
//         padding: isMobile ? '0 10px 80px' : '0 20px 100px'
//       }}>
//         {filteredFoods.map(item => (
//           <div key={item._id} style={cardStyle}>
            
//             {/* Image Area */}
//             <div onClick={() => navigate(`/item/${item._id}`)} style={{ position: 'relative', cursor: 'pointer' }}>
//               <img 
//                 src={item.image.startsWith('http') ? item.image : `${API_BASE_URL}/${item.image}`} 
//                 alt={item.name}
//                 onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Shyam+Bhojnalaya'; }}
//                 style={{
//                   width: '100%',
//                   height: isMobile ? '130px' : '200px',
//                   objectFit: 'cover'
//                 }} 
//               />
//               <div style={isMobile ? mobilePriceBadge : desktopPriceBadge}>
//                 ₹{item.price}
//               </div>
//             </div>

//             {/* Content Area */}
//             <div style={{ padding: isMobile ? '10px' : '15px', display: 'flex', flexDirection: 'column', flex: 1 }}>
//               <h3 style={{ 
//                 margin: '0 0 5px 0', 
//                 fontSize: isMobile ? '0.95rem' : '1.2rem',
//                 whiteSpace: 'nowrap', 
//                 overflow: 'hidden', 
//                 textOverflow: 'ellipsis' 
//               }}>
//                 {item.name}
//               </h3>

//               {!isMobile && <p style={{ fontSize: '0.85rem', color: '#666' }}>{item.description}</p>}

//               <div style={{ marginTop: 'auto' }}>
//                 {isInCart(item._id) ? (
//                   <button onClick={() => removeFromCart(item._id)} style={removeBtnStyle(isMobile)}>
//                     Remove
//                   </button>
//                 ) : (
//                   <button onClick={() => {
//                     addToCart(item);
//                     setAddMsg('Added to Thali!');
//                   }} style={addBtnStyle(isMobile)}>
//                     Add
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </main>

//       <footer style={{ textAlign: 'center', padding: '20px', fontSize: '12px', color: '#888' }}>
//         © 2026 Shri Shyam Bhojnalaya
//       </footer>
//     </div>
//   );
// };

// // --- STYLES ---

// const containerStyle = {
//   backgroundColor: '#f8f9fa',
//   minHeight: '100vh',
//   fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
// };

// const headerStyle = (isMobile) => ({
//   background: '#222',
//   color: '#fff',
//   padding: isMobile ? '15px 0' : '18px 0',
//   marginBottom: 30,
//   boxShadow: '0 2px 8px #eee',
//   position: 'sticky',
//   top: 0,
//   zIndex: 1000
// });

// const headerContent = (isMobile) => ({
//   maxWidth: 1200,
//   margin: '0 auto',
//   display: 'flex',
//   flexDirection: isMobile ? 'column' : 'row', // STACKS CONTENT ON MOBILE
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   padding: '0 24px'
// });

// const linkStyle = { color: '#ffd700', textDecoration: 'underline' };

// const navLink = {
//   color: '#fff',
//   textDecoration: 'none',
//   fontWeight: 'bold',
//   fontSize: 16,
//   transition: 'color 0.2s'
// };

// const cartBadge = {
//   position: 'absolute',
//   top: '-10px',
//   right: '-15px',
//   background: '#ffd700',
//   color: '#222',
//   borderRadius: '50%',
//   padding: '2px 6px',
//   fontSize: '10px',
//   fontWeight: 'bold'
// };

// const categoryContainer = { display: 'flex', gap: '8px', overflowX: 'auto', padding: '0 15px 15px', scrollbarWidth: 'none', justifyContent: 'center' };

// const catButtonStyle = (isActive, isMobile) => ({
//   padding: isMobile ? '6px 14px' : '8px 20px',
//   borderRadius: '4px', // Squared off for "Bhojnalaya" feel
//   border: isActive ? '1px solid #222' : '1px solid #ccc',
//   backgroundColor: isActive ? '#222' : '#fff',
//   color: isActive ? '#ffd700' : '#444',
//   fontSize: isMobile ? '13px' : '15px',
//   fontWeight: 'bold',
//   whiteSpace: 'nowrap',
//   cursor: 'pointer'
// });

// const gridStyle = { maxWidth: '1200px', margin: '0 auto', display: 'grid' };

// const cardStyle = {
//   backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden',
//   boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', border: '1px solid #eee'
// };

// const desktopPriceBadge = { position: 'absolute', bottom: '10px', right: '10px', background: '#222', color: '#ffd700', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' };
// const mobilePriceBadge = { ...desktopPriceBadge, bottom: '5px', right: '5px', padding: '2px 6px', fontSize: '12px' };

// const addBtnStyle = (isMobile) => ({
//   width: '100%', padding: isMobile ? '6px' : '10px', background: '#ffd700', color: '#222',
//   border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: isMobile ? '12px' : '14px', cursor: 'pointer', marginTop: '5px'
// });
// const removeBtnStyle = (isMobile) => ({ ...addBtnStyle(isMobile), background: '#ff4757', color: 'white' });

// const toastStyle = { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: '#222', color: '#ffd700', padding: '10px 20px', borderRadius: '4px', fontSize: '14px', zIndex: 999 };
// const loaderStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontWeight: 'bold', color: '#222' };

// export default Dashboard;