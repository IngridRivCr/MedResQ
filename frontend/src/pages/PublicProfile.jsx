import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../services/api";

export default function PublicProfile() {
  const { id } = useParams();
  const [medicalData, setMedicalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Se arma dinámicamente para que funcione igual en localhost que en la red local (para escanear desde el celular)
    fetch(`${API_URL}/api/public-profile/${id}`, {
      headers: {
        "ngrok-skip-browser-warning": "true"
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el perfil");
        return res.json();
      })
      .then((data) => {
        setMedicalData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar perfil:", err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "#0b0e2d", fontWeight: "bold" }}>
        Loading Emergency Profile...
      </div>
    );
  }

  if (error || !medicalData) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "20px", textAlign: "center" }}>
        <h2 style={{ color: "#8b1e1e" }}>Profile Not Found</h2>
        <p style={{ color: "#666" }}>The medical record you are trying to access does not exist or has been disabled.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', Roboto, Helvetica, sans-serif",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      display: "flex",
      boxSizing: "border-box",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px"
    }}>
      <div style={{ width: "100%", maxWidth: "450px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {/* LOGO */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px", marginBottom: "20px" }}>
          <h2 style={{ letterSpacing: "4px", color: "#0b0e2d", fontWeight: "900", margin: 0, fontSize: "28px" }}>MED</h2>
          <div style={{ width: "35px", height: "35px", border: "3px solid #0b0e2d", position: "relative", margin: "5px 0" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "19px", height: "5px", backgroundColor: "#0b0e2d" }}></div>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "5px", height: "19px", backgroundColor: "#0b0e2d" }}></div>
          </div>
          <h2 style={{ letterSpacing: "4px", color: "#0b0e2d", fontWeight: "900", margin: 0, fontSize: "28px" }}>RESQ</h2>
        </div>

        <h3 style={{ color: "#8b1e1e", fontSize: "20px", fontWeight: "bold", margin: "0 0 5px 0" }}>
          Emergency Medical Profile
        </h3>
        <p style={{ fontSize: "11px", color: "#666", margin: "0 0 25px 0", textAlign: "center" }}>
          Information authorized by the user solely for medical personnel.
        </p>

        {/* Avatar con inicial del paciente, igual que en Profile.jsx */}
        <div style={{
          width: "110px",
          height: "110px",
          borderRadius: "50%",
          backgroundColor: "#0b0e2d",
          border: "4px solid #0b0e2d",
          marginBottom: "15px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <span style={{ color: "#ffffff", fontSize: "42px", fontWeight: "bold" }}>
            {medicalData.name ? medicalData.name.trim().charAt(0).toUpperCase() : "U"}
          </span>
        </div>

        {/* Nombre */}
        <h2 style={{ fontSize: "21px", fontWeight: "bold", color: "#0b0e2d", margin: "0 0 12px 0", textAlign: "center" }}>
          {medicalData.name}
        </h2>

        {/* Fecha de Nacimiento */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "25px" }}>
          <span style={{ fontSize: "12px", color: "#555", fontWeight: "500" }}>Birthdate:</span>
          <span style={{
            backgroundColor: "#0b0e2d",
            color: "#ffffff",
            padding: "5px 14px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold"
          }}>
            {formatDate(medicalData.birth_date)}
          </span>
        </div>

        {/* Tipo de Sangre */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <div style={{ fontSize: "11px", color: "#666", textTransform: "uppercase", fontWeight: "600", letterSpacing: "1px" }}>Blood Type</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#8b1e1e", marginTop: "4px" }}>
            {medicalData.blood_type || "Unknown"}
          </div>
        </div>

        {/* Tarjetas de Información Médica */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "15px", padding: "0 10px", boxSizing: "border-box" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#444", marginLeft: "10px" }}>Allergies:</label>
            <div style={cardStyle}>{medicalData.allergies || "None"}</div>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#444", marginLeft: "10px" }}>Medical Conditions:</label>
            <div style={cardStyle}>{medicalData.medical_conditions_chronic_diseases || "None"}</div>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#444", marginLeft: "10px" }}>Current Medication:</label>
            <div style={{ ...cardStyle, whiteSpace: "pre-line" }}>{medicalData.current_medications || "None"}</div>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#444", marginLeft: "10px" }}>Notes:</label>
            <div style={cardStyle}>{medicalData.notes || "None"}</div>
          </div>
        </div>

        {/* Contactos de Emergencia */}
        <h3 style={{ color: "#8b1e1e", fontSize: "18px", fontWeight: "bold", marginTop: "35px", marginBottom: "15px" }}>
          Emergency Contacts:
        </h3>

        {medicalData.contacts && medicalData.contacts.length > 0 ? (
          medicalData.contacts.map((contact, index) => (
            <div key={index} style={{ width: "100%", padding: "0 10px", boxSizing: "border-box", marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "13px", color: "#444", fontWeight: "bold", marginBottom: "6px", alignSelf: "flex-start", marginLeft: "12px" }}>
                Contact {index + 1}
              </div>
              <div style={{ ...cardStyle, width: "100%", fontSize: "13px", lineHeight: "1.6" }}>
                <strong>Contact Name:</strong> {contact.contact_name}<br />
                <strong>Relationship:</strong> {contact.relationship}<br />
                <strong>Number:</strong> {contact.phone}
              </div>
              
              <a 
                href={`tel:${contact.phone}`}
                style={{
                  backgroundColor: "#2aa62c",
                  color: "#ffffff",
                  textDecoration: "none",
                  padding: "10px 30px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  marginTop: "12px",
                  boxShadow: "0 4px 10px rgba(42, 166, 44, 0.2)",
                  display: "inline-block",
                  textAlign: "center"
                }}
              >
                Call Number
              </a>
            </div>
          ))
        ) : (
          <p style={{ fontSize: "13px", color: "$666" }}>No emergency contacts registered.</p>
        )}

        <div style={{ height: "40px" }}></div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#e0e0e0",
  borderRadius: "15px",
  padding: "12px 20px",
  fontSize: "14px",
  color: "#333333",
  marginTop: "4px",
  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)"
};