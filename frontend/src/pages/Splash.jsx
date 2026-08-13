//Landing page de bienvenida 

//Librerías
import { useNavigate } from "react-router-dom";
import "../styles/app.css";
import medresq_img1 from "../assets/medresq_img1.jpg"; 
import medresq_img2 from "../assets/medresq_img2.jpg"; 
import logoLightMode from "../assets/MEDRESQ_LM.png"; 

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", color: "#000000", fontFamily: "'Poppins', sans-serif" }}>
      
      {/* Tipografía Poppins */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');`}
      </style>

      {/* Barra de navegación */}
      <header 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "1rem 4rem", 
          position: "sticky",
          top: 0,
          backgroundColor: "#ffffff",
          zIndex: 1000,
          borderBottom: "1px solid #f0f0f0"
        }}
      >
        {/* Nombre de MedResQ en la esquina superior izquierda */}
        <div 
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }} 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        >
          <span style={{ fontWeight: "700", fontSize: "1.6rem", color: "#0b0e2d", letterSpacing: "-0.5px" }}>
            MedResQ
          </span>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: "2rem", backgroundColor: "#f1f2f4", padding: "0.4rem 1.5rem", borderRadius: "25px" }}>
          <a href="#functions" style={{ textDecoration: "none", color: "#000000", fontSize: "0.9rem", fontWeight: "600" }}>Functions</a>
          <a href="#benefits" style={{ textDecoration: "none", color: "#000000", fontSize: "0.9rem", fontWeight: "600" }}>Key benefits</a>
          <a href="#how-it-works" style={{ textDecoration: "none", color: "#000000", fontSize: "0.9rem", fontWeight: "600" }}>How it works</a>
          <a href="#about" style={{ textDecoration: "none", color: "#000000", fontSize: "0.9rem", fontWeight: "600" }}>About Us</a>
        </nav>

        {/* Botón que redirige al portal */}
        <button 
          onClick={() => navigate("/portal")} 
          className="primary-btn"
          style={{ padding: "0.6rem 1.6rem", fontSize: "0.9rem", borderRadius: "20px", fontWeight: "600", fontFamily: "'Poppins', sans-serif" }}
        >
          Start with us!
        </button>
      </header>

      {/* Contenido principal */}
      <main style={{ width: "100%" }}>
        
        {/* Vista principal */}
        <section style={{ textAlign: "center", padding: "5rem 2rem 2rem 2rem" }}>
          <h1 style={{ fontSize: "3.8rem", fontWeight: "500", color: "#000000", marginBottom: "3rem", letterSpacing: "-1px" }}>
            It’s not only an application, It’s a real solution.
          </h1>
          
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto", maxWidth: "800px" }}>
            <div style={{ backgroundColor: "#f8f9fa", padding: "2rem", borderRadius: "24px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "280px" }}>
              <img 
                src={logoLightMode} 
                alt="MedResQ Big Logo" 
                style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
        </section>

        {/* Sección: What's MedResQ */}
        <section id="functions" style={{ padding: "6rem 4rem 4rem 4rem", maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "3.2rem", fontWeight: "500", marginBottom: "1.5rem" }}>What's MedResQ</h2>
          <p style={{ color: "#666666", fontSize: "1.1rem", lineHeight: "1.6", maxWidth: "1000px", marginBottom: "3rem" }}>
            MedResQ helps you access essential medical information quickly and securely, making emergency response faster and more efficient for patients.
          </p>
          
          {/* Imagen 1 */}
          <div style={{ width: "100%", height: "450px", backgroundColor: "#e2e8f0", borderRadius: "32px", overflow: "hidden" }}>
            <img 
              src={medresq_img1} 
              alt="Medical info presentation" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </section>

        {/* Sección: Why choose MedResQ? */}
        <section id="benefits" style={{ padding: "6rem 4rem", backgroundColor: "#ffffff", textAlign: "center" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "3.5rem", fontWeight: "500", marginBottom: "1.5rem" }}>Why Choose MedResQ?</h2>
            <p style={{ color: "#666666", fontSize: "1.1rem", maxWidth: "800px", margin: "0 auto 4rem auto", lineHeight: "1.6" }}>
              You need a platform you can trust when every second matters. MedResQ was designed to simplify access to medical information, improve emergency response and provide a secure, user-friendly experience for patients and healthcare professionals.
            </p>

            {/* Tabla-Cuadrícula de los beneficios */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2.5rem", textAlign: "left", marginBottom: "6rem" }}>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "0.5rem", color: "#0b0e2d" }}>Digital Medical Records</h3>
                <p style={{ color: "#666", fontSize: "0.95rem" }}>Store your medical records in a single application where you can easily access it.</p>
              </div>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "0.5rem", color: "#0b0e2d" }}>Secure Medical Records</h3>
                <p style={{ color: "#666", fontSize: "0.95rem" }}>Protect all your personal information from end to end.</p>
              </div>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "0.5rem", color: "#0b0e2d" }}>Access with QR code</h3>
                <p style={{ color: "#666", fontSize: "0.95rem" }}>Immediate access to essential medical data in critical situations without needing to unlock the device.</p>
              </div>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "0.5rem", color: "#0b0e2d" }}>AI Chatbot</h3>
                <p style={{ color: "#666", fontSize: "0.95rem" }}>Consult and access medical information through interaction in natural language quickly and easily.</p>
              </div>
            </div>

            {/* Listado de características de MedResQ */}
            <div style={{ border: "1px solid #e2e8f0", borderRadius: "24px", padding: "2rem", textAlign: "left" }}>
              <div style={{ textAlign: "center", fontWeight: "700", fontSize: "1.3rem", marginBottom: "2rem" }}>MedResQ Features</div>
              {[
                "Instant access to medical records",
                "Emergency contact management",
                "Secure data storage",
                "Patient profile management",
                "Fast and intuitive interface",
                "Easy registration and login",
                "Privacy-focused security"
              ].map((text, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 0", borderTop: idx > 0 ? "1px solid #f0f0f0" : "none", fontSize: "1rem" }}>
                  <span style={{ color: "#000", fontWeight: "bold" }}>✓</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección: How it works */}
        <section id="how-it-works" style={{ padding: "6rem 4rem", maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "3.5rem", fontWeight: "500", marginBottom: "4rem" }}>How MedResQ Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem" }}>
            <div>
              <div style={{ fontSize: "4.5rem", fontWeight: "300", color: "#0b0e2d", marginBottom: "1.5rem" }}>01</div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "0.8rem" }}>Create your account</h3>
              <p style={{ color: "#666", lineHeight: "1.5" }}>Sign up in just a few minutes and create your personal medical profile.</p>
            </div>
            <div>
              <div style={{ fontSize: "4.5rem", fontWeight: "300", color: "#0b0e2d", marginBottom: "1.5rem" }}>02</div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "0.8rem" }}>Complete your medical information</h3>
              <p style={{ color: "#666", lineHeight: "1.5" }}>Add your medical information such as allergies, medications, medical conditions, blood type and emergency contacts.</p>
            </div>
            <div>
              <div style={{ fontSize: "4.5rem", fontWeight: "300", color: "#0b0e2d", marginBottom: "1.5rem" }}>03</div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "0.8rem" }}>Be ready for any emergency</h3>
              <p style={{ color: "#666", lineHeight: "1.5" }}>Access your information anytime and help healthcare professionals provide faster, more effective care.</p>
            </div>
          </div>
        </section>

        {/* Imagen 2 */}
        <section style={{ padding: "0 4rem 4rem 4rem", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ width: "100%", height: "450px", backgroundColor: "#e2e8f0", borderRadius: "32px", overflow: "hidden" }}>
            <img 
              src={medresq_img2} 
              alt="Medical platform interface showcase" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </section>

        {/* Sección: About us */}
        <section id="about" style={{ padding: "6rem 4rem", backgroundColor: "#ffffff", textAlign: "center" }}>
          <div style={{ maxWidth: "850px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "3.5rem", fontWeight: "500", marginBottom: "2rem" }}>About us</h2>
            <p style={{ color: "#333333", fontSize: "1.05rem", lineHeight: "1.8" }}>
              MedResQ is a web platform developed by RIC with the mission of improving access to essential medical information during emergency situations.
            </p>
            <p style={{ color: "#333333", fontSize: "1.05rem", lineHeight: "1.8", marginTop: "1rem" }}>
              Our goal is to help patients and healthcare professionals by providing a secure, intuitive, and reliable platform where important medical information can be accessed quickly when every second counts.
            </p>
          </div>
        </section>

      </main>

      <footer style={{ backgroundColor: "#0b0e2d", color: "#ffffff", textAlign: "center", padding: "2rem", fontSize: "0.9rem" }}>
        © 2026 MedResQ. All rights reserved.
      </footer>
    </div>
  );
}