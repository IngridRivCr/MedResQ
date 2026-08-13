//Entrada al sistema

//Librerías
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../services/api";
import "../styles/app.css";

export default function Login() {
  const navigate = useNavigate();

  //Por medio del form se agrupan el email y la contraseña
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  //Actualiza el estado cada que el usuario teclea algo
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  //Es el puente de comunicación con el servidor para verificar el acceso
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      //Envía un POST
      //Guarda la info del usuario
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user)); 
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error(error);
      alert("Error en el servidor: Asegúrate de que node server.js esté corriendo en el puerto 3001.");
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", padding: "2rem" }}>
      <div 
        className="back-arrow" 
        onClick={() => navigate("/")}
        style={{ cursor: "pointer", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "2rem" }}
      >
        &lt; Back
      </div>

      <div className="container" style={{ maxWidth: "450px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", fontWeight: "500" }}>Sign In</h1>

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group" style={{ marginBottom: "1.5rem" }}>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.8rem 1.5rem", borderRadius: "20px", border: "1px solid #ccc", backgroundColor: "#f1f2f4" }}
            />
          </div>

          <div className="input-group" style={{ marginBottom: "1.5rem" }}>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.8rem 1.5rem", borderRadius: "20px", border: "1px solid #ccc", backgroundColor: "#f1f2f4" }}
            />
          </div>

          <button type="submit" className="primary-btn" style={{ width: "100%", marginTop: "1rem" }}>
            Sign In
          </button>
        </form>

        <p style={{ marginTop: "2rem", fontSize: "0.9rem" }}>
          ¿Don't have an account?{" "}
          <Link to="/register" style={{ fontWeight: "bold", color: "#0b0e2d", textDecoration: "none" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}