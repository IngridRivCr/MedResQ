//Pantalla que le indica al usuario si debe iniciar sesión o registrarse

//Librerías
import { useNavigate } from "react-router-dom";
import logoLightMode from "../assets/MEDRESQ_LM.png"; 

export default function Portal() {
  const navigate = useNavigate();

  return (
    <div 
      style={{ 
        minHeight: "100vh", 
        width: "100vw", 
        backgroundColor: "#ffffff", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center", 
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
        boxSizing: "border-box"
      }}
    >
      <div style={{ maxWidth: "600px", width: "100%", textAlign: "center" }}>
        
        <div style={{ width: "100%", height: "260px", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "3rem" }}>
          <img 
            src={logoLightMode} 
            alt="MedResQ Logo" 
            style={{ 
              maxHeight: "100%", 
              maxWidth: "100%", 
              objectFit: "contain" 
            }} 
          />
        </div>

        {/* Mensaje de bienvenida */}
        <h1 style={{ fontSize: "2.8rem", fontWeight: "400", color: "#000000", marginBottom: "3.5rem", letterSpacing: "-0.5px" }}>
          Let’s get started!
        </h1>

        {/* Personalización de los botones grandes */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%", alignItems: "center" }}>
          
          {/* Botón Sign In */}
          <button 
            onClick={() => navigate("/login")}
            style={{ 
              width: "80%", 
              maxWidth: "400px",
              padding: "1.2rem", 
              fontSize: "1.1rem", 
              fontWeight: "600", 
              color: "#ffffff", 
              backgroundColor: "#0b0e2d", 
              border: "none", 
              borderRadius: "50px", 
              cursor: "pointer",
              transition: "background-color 0.2s",
              boxShadow: "0 4px 12px rgba(11, 14, 45, 0.15)"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#161b46"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#0b0e2d"}
          >
            Sign In
          </button>

          {/* Botón Sign Up */}
          <button 
            onClick={() => navigate("/register")}
            style={{ 
              width: "80%", 
              maxWidth: "400px",
              padding: "1.2rem", 
              fontSize: "1.1rem", 
              fontWeight: "600", 
              color: "#0b0e2d", 
              backgroundColor: "#ffffff", 
              border: "1px solid #0b0e2d", 
              borderRadius: "50px", 
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#f8f9fa"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#ffffff"}
          >
            Sign Up
          </button>

        </div>
      </div>
    </div>
  );
}