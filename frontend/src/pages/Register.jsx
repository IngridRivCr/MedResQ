//Formulario de creación de cuenta nueva e inicia el expediente del usuario

//Librerías
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../services/api";
import "../styles/app.css"; 

export default function Register() {
  const navigate = useNavigate();

  //Captura los datos iniciales del usuario
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  //Es el proceso de la creación de la cuenta para que se registre el usuario de manera rápida
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert("Usuario registrado correctamente");
        navigate("/login"); 
      } else {
        alert("Error al registrar el usuario");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Error en el servidor al intentar registrar");
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", padding: "2rem" }}>
      {/* Flecha para volver al Login */}
      <div 
        className="back-arrow" 
        onClick={() => navigate(-1)}
        style={{ cursor: "pointer", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "2rem" }}
      >
        &lt; Back
      </div>

      <div className="container" style={{ maxWidth: "450px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", fontWeight: "500" }}>Sign Up</h1>
        
        <form className="form" onSubmit={handleSignUp}>
          <div className="input-group" style={{ marginBottom: "1.5rem", textAlign: "left" }}>
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required //El required es esencial para el cumplimiento de las normas de seguridad
              style={{ width: "100%", padding: "0.8rem 1.5rem", borderRadius: "20px", border: "1px solid #ccc" }}
            />
          </div>
          
          <div className="input-group" style={{ marginBottom: "1.5rem", textAlign: "left" }}>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.8rem 1.5rem", borderRadius: "20px", border: "1px solid #ccc" }}
            />
          </div>
          
          <div className="input-group" style={{ marginBottom: "1.5rem", textAlign: "left" }}>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.8rem 1.5rem", borderRadius: "20px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "2rem 0", fontSize: "0.9rem", textAlign: "left" }}>
            <input type="checkbox" id="terms" required style={{ width: "18px", height: "18px" }} />
            <label htmlFor="terms">I agree to the healthcare Terms of Service and Privacy Policy</label>
          </div>

          <button type="submit" className="primary-btn" style={{ width: "100%" }}>
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: "2rem", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: "bold", color: "#0b0e2d", textDecoration: "none" }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}