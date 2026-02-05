import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Header from './components/Header'; // <-- Add this import
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import CreateCategory from './pages/CreateCategory';
import AddItem from './pages/AddItem';
import SearchEditItem from './pages/SearchEditItem';
import ItemDetail from './pages/ItemDetail';
import Cart from './pages/Cart';
import OrderContact from './pages/OrderContact';
import ManageContacts from './pages/ManageContacts';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate replace to="/admin-login" />;
};

function App() {
  return (
    <Router>
      {/* <Header />  */}
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/order" element={<OrderContact />} />
          <Route path="/admin-panel" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/admin/create-category" element={
            <ProtectedRoute>
              <CreateCategory />
            </ProtectedRoute>
          } />
          <Route path="/admin/add-item" element={
            <ProtectedRoute>
              <AddItem />
            </ProtectedRoute>
          } />
          <Route path="/admin/search-edit" element={
            <ProtectedRoute>
              <SearchEditItem />
            </ProtectedRoute>
          } />
          <Route path="/admin/manage-contacts" element={
            <ProtectedRoute>
              <ManageContacts />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;