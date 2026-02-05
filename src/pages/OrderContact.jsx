import React, { useEffect, useState } from "react";
import axios from "axios";
import { Phone, MessageCircle, Clock, UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderContact = () => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/foods/contacts")
      .then((res) => setContacts(res.data.contacts || []));
  }, []);

  return (
    <div style={container}>
      {/* Visual Header */}
      <div style={heroSection}>
        <UtensilsCrossed size={40} color="#ffd700" />
        <h2 style={{ margin: "10px 0", fontSize: "28px" }}>Hungry?</h2>
        <p style={{ color: "#ffd700", fontWeight: "bold", fontSize: "18px" }}>
          Order Your Delicious Thali Now!
        </p>
      </div>

      <div style={contentBox}>
        <div style={infoRow}>
          <Clock size={18} color="#e67e22" />
          <span style={{ marginLeft: 8, fontSize: "14px", color: "#666" }}>
            Freshly prepared & delivered hot
          </span>
        </div>

        <h3 style={sectionTitle}>Direct Calling Numbers</h3>
        
        {contacts.length === 0 ? (
          <p style={{ color: "#888" }}>No contact numbers available right now.</p>
        ) : (
          <div style={buttonList}>
            {contacts.map((contact) => (
              <a
                key={contact._id}
                href={`tel:${contact.number}`}
                style={callButton}
              >
                <Phone size={20} style={{ marginRight: 12 }} />
                Call {contact.number}
              </a>
            ))}
          </div>
        )}

        <div style={divider}>OR</div>

        {/* WhatsApp Option for convenience */}
        <a 
          href="https://wa.me/919560607589" 
          target="_blank" 
          rel="noreferrer" 
          style={whatsappButton}
        >
          <MessageCircle size={20} style={{ marginRight: 12 }} />
          Chat on WhatsApp
        </a>

        <button onClick={() => navigate("/")} style={backMenuBtn}>
          View Full Menu
        </button>

        <p style={footerText}>
          📍 Located at Shri Shyam Bhojnalaya <br />
          Pure. Fresh. Tasty.
        </p>
      </div>
    </div>
  );
};

// --- STYLES ---

const container = {
  maxWidth: "450px",
  margin: "40px auto",
  padding: "0 20px",
  fontFamily: "'Segoe UI', Roboto, sans-serif",
};

const heroSection = {
  background: "#222",
  padding: "40px 20px",
  borderRadius: "20px 20px 0 0",
  textAlign: "center",
  color: "#fff",
};

const contentBox = {
  background: "#fff",
  padding: "30px 24px",
  borderRadius: "0 0 20px 20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  textAlign: "center",
};

const infoRow = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "25px",
  padding: "8px",
  background: "#fff9e6",
  borderRadius: "8px",
};

const sectionTitle = {
  fontSize: "16px",
  color: "#444",
  marginBottom: "15px",
  textAlign: "left",
  borderLeft: "4px solid #ffd700",
  paddingLeft: "10px",
};

const buttonList = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const callButton = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#222",
  color: "#ffd700",
  textDecoration: "none",
  padding: "16px",
  borderRadius: "12px",
  fontWeight: "bold",
  fontSize: "18px",
  transition: "transform 0.2s",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
};

const whatsappButton = {
  ...callButton,
  backgroundColor: "#25D366",
  color: "#fff",
  boxShadow: "0 4px 10px rgba(37, 211, 102, 0.2)",
};

const divider = {
  margin: "25px 0",
  color: "#ccc",
  fontSize: "14px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const backMenuBtn = {
  marginTop: "20px",
  background: "none",
  border: "1px solid #222",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  color: "#222",
  width: "100%",
};

const footerText = {
  marginTop: "30px",
  color: "#aaa",
  fontSize: "12px",
  lineHeight: "1.6",
};

export default OrderContact;