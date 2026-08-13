//Módulo para añadir, ver y eliminar los contactos de emergencia que se encuentran sincronizados con la base de datos

//Librerías
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../services/api";

export default function EmergencyContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");

  //Busca en la base de datos si el usuario ya tiene contactos guardados
  const loadContacts = (id) => {
    fetch(`${API_URL}/api/user/emergency-contacts/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setContacts(resData.contacts);
        }
      })
      .catch((err) => console.error("Error al cargar contactos:", err));
  };

  //"Recupera" el ID del usuario desde la sesión
  useEffect(() => {
    const session = localStorage.getItem("user");
    if (session) {
      const user = JSON.parse(session);
      setUserId(user.user_id);
      loadContacts(user.user_id); //Hace una petición GET al servidor
    }
  }, []);

  //Toma los datos y los añade a "Contactos"
  const handleAddContact = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Please fill out Name and Phone Number.");
      return;
    }
    const newContact = { id: Date.now(), name, phone, relation };
    setContacts([...contacts, newContact]);
    setName("");
    setPhone("");
    setRelation("");
  };

  //Filtra la lista eliminando el contacto q se selecciona
  const handleRemoveContact = (id) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  //Toma la lista de contactos y la envía al back por un POST
  const handleSave = async () => {
    if (!userId) return;
    try {
      const cleanContacts = contacts.map(({ name, phone, relation }) => ({
        name,
        phone,
        relation
      }));

      const response = await fetch(`${API_URL}/api/user/emergency-contacts-save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ userId, contacts: cleanContacts })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage("Contacts saved successfully!");
        loadContacts(userId);
        setTimeout(() => setMessage(""), 3000);
      } else {
        alert("Error saving contacts: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.cardContainer}>
        
        {/* Botón regresar */}
        <div onClick={() => navigate("/profile")} style={styles.backButton}>
          &lt;
        </div>

        <h1 style={styles.title}>
          Emergency Contacts
        </h1>
        <p style={styles.subtitle}>
          Add individuals to contact in case of emergency.
        </p>
        
        {message && (
          <div style={styles.alertSuccess}>
            {message}
          </div>
        )}

        {/* Lista de contactos */}
        <div style={styles.contactsListContainer}>
          {contacts.length === 0 ? (
            <p style={{ textAlign: "center", color: "#999", fontSize: "14px" }}>No contacts added yet.</p>
          ) : (
            contacts.map((c) => (
              <div key={c.id} style={styles.contactItem}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={styles.avatarPlaceholder}>
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", color: "#0b0e2d", fontSize: "15px" }}>{c.name}</div>
                    <div style={{ fontSize: "13px", color: "#666", marginTop: "2px" }}>
                      {c.phone} {c.relation && `• ${c.relation}`}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveContact(c.id)} 
                  style={styles.removeButton}
                >
                  Remove🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* Formulario para agregar contactos */}
        <form onSubmit={handleAddContact} style={styles.dashedForm}>
          <div style={styles.formGrid}>
            <div style={{ gridColumn: "1 / -1" }}>
              <input 
                type="text" 
                placeholder="Contact Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                style={styles.inputField} 
              />
            </div>
            <div>
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                style={styles.inputField} 
              />
            </div>
            <div>
              <input 
                type="text" 
                placeholder="Relationship" 
                value={relation} 
                onChange={(e) => setRelation(e.target.value)} 
                style={styles.inputField} 
              />
            </div>
          </div>
          <button type="submit" style={styles.addToListBtn}>
            + Add to List 📝
          </button>
        </form>

        {/* Botón de guardar contactos */}
        <button onClick={handleSave} style={styles.saveAllBtn}>
          Save All Contacts 👥
        </button>
      </div>
    </div>
  );
}

//Estilos
const styles = {
  pageBackground: {
    fontFamily: "'Segoe UI', Roboto, Helvetica, sans-serif",
    backgroundColor: "#f4f6f9",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    boxSizing: "border-box"
  },
  cardContainer: {
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: "600px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    padding: "40px",
    boxSizing: "border-box",
    position: "relative"
  },
  backButton: {
    position: "absolute",
    top: "30px",
    left: "35px",
    fontSize: "24px",
    color: "#0b0e2d",
    cursor: "pointer",
    userSelect: "none",
    fontWeight: "400",
    fontFamily: "monospace, sans-serif"
  },
  title: {
    fontSize: "26px",
    fontWeight: "600",
    color: "#0b0e2d",
    marginBottom: "6px",
    marginTop: "20px"
  },
  subtitle: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "25px"
  },
  alertSuccess: {
    backgroundColor: "#e6f9ed",
    color: "#1e7e34",
    padding: "12px",
    borderRadius: "10px",
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "500"
  },
  contactsListContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "25px",
    maxHeight: "220px",
    overflowY: "auto",
    paddingRight: "5px"
  },
  contactItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f6f8",
    padding: "14px 18px",
    borderRadius: "12px"
  },
  avatarPlaceholder: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#e2e5eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px"
  },
  removeButton: {
    backgroundColor: "transparent",
    color: "#ff4d4d",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "opacity 0.2s"
  },
  dashedForm: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "#fafafa",
    padding: "20px",
    borderRadius: "12px",
    border: "1px dashed #ccc",
    marginBottom: "25px"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px"
  },
  inputField: {
    width: "100%",
    padding: "12px",
    boxSizing: "border-box",
    border: "1px solid #cccccc",
    borderRadius: "8px",
    fontSize: "14px"
  },
  addToListBtn: {
    backgroundColor: "#161b46",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "4px"
  },
  saveAllBtn: {
    width: "100%",
    backgroundColor: "#0b0e2d",
    color: "#ffffff",
    border: "none",
    padding: "15px 24px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(11, 14, 45, 0.15)"
  }
};