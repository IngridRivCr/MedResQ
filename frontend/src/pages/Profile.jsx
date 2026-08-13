//Menú de configuración del usuario

//Librerías
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Usuario");
  const [loading, setLoading] = useState(true);

  //Identifica quién está usando la web
  useEffect(() => {
    const session = localStorage.getItem("user"); 
    if (session) {
      try {
        const user = JSON.parse(session);
        setUserName(user.name || "Usuario");
      } catch (e) {
        console.error("Error al procesar la sesión:", e);
      }
    }
    loading && setLoading(false);
  }, [loading]);

  if (loading) {
    return <div style={{ padding: "50px", textAlign: "center", fontSize: "18px", color: "#0b0e2d" }}>Cargando Perfil...</div>;
  }

  const userInitial = userName ? userName.trim().charAt(0).toUpperCase() : "U";

  //Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("user"); // Borra los datos de la sesión actual
    localStorage.removeItem("token"); // Borra el token de sesión
    navigate("/Login.jsx"); // Redirige al inicio de sesión
  };

  //Estilo de los botones
  const baseButtonStyle = {
    width: "100%",
    backgroundColor: "#0b0e2d",
    color: "#ffffff",
    border: "none",
    padding: "16px 28px",
    fontSize: "16px",
    fontWeight: "500",
    borderRadius: "12px", 
    cursor: "pointer",
    textAlign: "left", 
    transition: "background-color 0.15s ease, transform 0.1s ease",
    boxSizing: "border-box"
  };

  const handleMouseOver = (e) => {
    e.currentTarget.style.backgroundColor = "#0b0e2d"; 
    e.currentTarget.style.transform = "translateX(4px)"; 
  };

  const handleMouseOut = (e) => {
    e.currentTarget.style.backgroundColor = e.currentTarget.dataset.logout === "true" ? "#0b0e2d" : "#0b0e2d"; 
    e.currentTarget.style.transform = "translateX(0px)";
  };

  const handleMouseDown = (e) => {
    e.currentTarget.style.opacity = "0.8"; 
  };

  const handleMouseUp = (e) => {
    e.currentTarget.style.opacity = "1";
  };

  return (
    <div style={{ 
      fontFamily: "'Segoe UI', Roboto, Helvetica, sans-serif", 
      backgroundColor: "#f4f6f9", 
      minHeight: "100vh", 
      display: "flex", 
      justifyContent: "center",
      alignItems: "center", 
      padding: "40px 20px",
      boxSizing: "border-box"
    }}>

      <div style={{
        width: "100%",
        maxWidth: "600px",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "40px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)", 
        boxSizing: "border-box",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        
        {/* Botón regresar */}
        <div 
          onClick={() => navigate("/dashboard")}
          style={{
            position: "absolute",
            top: "30px",
            left: "35px",
            fontSize: "24px",
            color: "#0b0e2d",
            cursor: "pointer",
            userSelect: "none",
            fontWeight: "400", 
            fontFamily: "monospace, sans-serif" 
          }}
        >
          &lt;
        </div>

        {/* Contenedor del avatar */}
        <div style={{
          width: "110px",
          height: "110px",
          borderRadius: "50%",
          backgroundColor: "#0b0e2d",
          color: "#ffffff",
          marginBottom: "15px",
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "44px",
          fontWeight: "600",
          boxShadow: "0 4px 12px rgba(11, 14, 45, 0.15)",
          userSelect: "none"
        }}>
          {userInitial}
        </div>

        {/* Nombre del user */}
        <h1 style={{
          fontSize: "26px",
          fontWeight: "600",
          color: "#0b0e2d",
          margin: "0 0 30px 0",
          textAlign: "center"
        }}>
          {userName}
        </h1>

        {/* Botones del menú*/}
        <div style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }}>
          
          {/* Redirecciona a la pantalla de contactos de emergencia */}
          <button 
            onClick={() => navigate("/emergency-contacts")} 
            style={baseButtonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            Emergency Contacts
          </button>

          {/* Redirecciona a la pantalla de editar perfil */}
          <button 
            onClick={() => navigate("/edit-profile")} 
            style={baseButtonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            Edit Profile
          </button>

          {/* QR Code */}
          <button 
            onClick={() => navigate("/my-qr-code")} 
            style={baseButtonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            My QR Code
          </button>

          <button 
            onClick={() => navigate("/terms-and-conditions")} 
            style={baseButtonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            Terms and Conditions
          </button>

          <button 
            onClick={() => navigate("/privacy-policy")} 
            style={baseButtonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            Privacy Policy
          </button>

          {/* Botón de Cerrar Sesión */}
          <button 
            data-logout="true"
            onClick={handleLogout} 
            style={{
              ...baseButtonStyle,
              backgroundColor: "#0b0e2d" 
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#0b0e2d";
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseOut={handleMouseOut}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            Log Out
          </button>

        </div>
      </div>

    </div>
  );
}