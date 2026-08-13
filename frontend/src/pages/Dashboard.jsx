//Pantalla central
//Contiene la vista inicial de los expedientes médicos en 3 pestañas interactivas y el Chatbot

//Librerías
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../services/api";
import "../styles/app.css";

//Imagen de chatbot
import imgRobot from "../assets/robot.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("Usuario");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  //Estado de la barra de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  //Estructura de los estados para los formularios
  const [personalInfo, setPersonalInfo] = useState({
    phone_number: "", address: "", birth_date: "", age: "", gender: "", marital_status: "", emergency_contact: ""
  });
  const [medicalInfo, setMedicalInfo] = useState({
    blood_type: "", allergies: "", organ_donor_status: "", health_care_clinic: "", insurance_number: "", weight: "", height: "", sleep: "", symptom_tracking: "", reminders: "", physical_activity: ""
  });
  const [extraInfo, setExtraInfo] = useState({
    current_medications: "", medications_exact_dosages: "", medical_conditions_chronic_diseases: "", additional_medical_conditions: "", history_surgeries_procedures: "", special_medical_instructions: "", lifestyle_information: "", recent_test_study_results: "", relevant_notes: "", personal_notes: ""
  });

//Verifica si hay un usuario logeado en la memoria del navegador
  useEffect(() => {
    //Recupera la sesion del usuario de forma segura
    const session = localStorage.getItem("user");
    let currentUserId = null;

    if (session) {
      try {
        const user = JSON.parse(session);
        currentUserId = user.user_id || user.id;
        setUserId(currentUserId);
        setUserName(user.name || "Usuario");
      } catch (e) {
        console.error("Error al procesar la sesion del usuario:", e);
      }
    }

    //Si no hay una sesión, redirige al login
    if (!currentUserId) {
      console.warn("No se detectó sesion activa.");
      navigate("/login");
      return;
    }

    //Carga la información del expediente desde el backend
    fetch(`${API_URL}/api/user/dashboard-complete/${currentUserId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          //Formatea fecha
          const formattedDate = d.birth_date ? d.birth_date.split("T")[0] : "";
          //Si el valor es NULL en la BD, se le va a asignar un string vacio
          setPersonalInfo({
            phone_number: d.phone_number || "",
            address: d.address || "",
            birth_date: formattedDate,
            age: d.age || "",
            gender: d.gender || "",
            marital_status: d.marital_status || "",
            emergency_contact: d.emergency_contact || ""
          });

          setMedicalInfo({
            blood_type: d.blood_type || "",
            allergies: d.allergies || "",
            organ_donor_status: d.organ_donor_status || "",
            health_care_clinic: d.health_care_clinic || "",
            insurance_number: d.insurance_number || "",
            weight: d.weight || "",
            height: d.height || "",
            sleep: d.sleep || "",
            symptom_tracking: d.symptom_tracking || "",
            reminders: d.reminders || "",
            physical_activity: d.physical_activity || ""
          });

          setExtraInfo({
            current_medications: d.current_medications || "",
            medications_exact_dosages: d.medications_exact_dosages || "",
            medical_conditions_chronic_diseases: d.medical_conditions_chronic_diseases || "",
            additional_medical_conditions: d.additional_medical_conditions || "",
            history_surgeries_procedures: d.history_surgeries_procedures || "",
            special_medical_instructions: d.special_medical_instructions || "",
            lifestyle_information: d.lifestyle_information || "",
            recent_test_study_results: d.recent_test_study_results || "",
            relevant_notes: d.relevant_notes || "",
            personal_notes: d.personal_notes || ""
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al conectar con el servidor backend:", err);
        setLoading(false);
      });
  }, [navigate]);

  //Recorre toos los campos del expediente en tiempo real mientras el usuario escribe en la barra de búsqueda
  const matchesSearch = (value) => {
    if (!value) return false;
    return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
  };

  const hasPersonalMatch = 
    matchesSearch(personalInfo.phone_number) || 
    matchesSearch(personalInfo.address) || 
    matchesSearch(personalInfo.birth_date) || 
    matchesSearch(personalInfo.age) || 
    matchesSearch(personalInfo.gender) || 
    matchesSearch(personalInfo.marital_status) || 
    matchesSearch(personalInfo.emergency_contact);

  const hasMedicalMatch = 
    matchesSearch(medicalInfo.blood_type) || 
    matchesSearch(medicalInfo.allergies) || 
    matchesSearch(medicalInfo.organ_donor_status) || 
    matchesSearch(medicalInfo.health_care_clinic) || 
    matchesSearch(medicalInfo.insurance_number) || 
    matchesSearch(medicalInfo.weight) || 
    matchesSearch(medicalInfo.height) || 
    matchesSearch(medicalInfo.sleep) || 
    matchesSearch(medicalInfo.symptom_tracking) || 
    matchesSearch(medicalInfo.reminders) || 
    matchesSearch(medicalInfo.physical_activity);

  const hasExtraMatch = 
    matchesSearch(extraInfo.current_medications) || 
    matchesSearch(extraInfo.medications_exact_dosages) || 
    matchesSearch(extraInfo.medical_conditions_chronic_diseases) || 
    matchesSearch(extraInfo.additional_medical_conditions) || 
    matchesSearch(extraInfo.history_surgeries_procedures) || 
    matchesSearch(extraInfo.special_medical_instructions) || 
    matchesSearch(extraInfo.lifestyle_information) || 
    matchesSearch(extraInfo.recent_test_study_results) || 
    matchesSearch(extraInfo.relevant_notes) || 
    matchesSearch(extraInfo.personal_notes);

  useEffect(() => {
    if (!searchTerm) return;
    if (hasPersonalMatch) {
      setActiveTab("personal");
    } else if (hasMedicalMatch) {
      setActiveTab("medical");
    } else if (hasExtraMatch) {
      setActiveTab("extra");
    }
  }, [searchTerm]);

  //Empaqueta toda la info e los formularios y la envía al servidor para actualizar la DB
  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!personalInfo.phone_number || !personalInfo.address || !personalInfo.birth_date) {
      alert("Error: Telefono, Direccion y Fecha de Nacimiento son campos obligatorios.");
      setActiveTab("personal");
      return;
    }

    if (!userId) {
      setMessage("Error: No se puede guardar la informacion porque no hay una sesion de usuario valida.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/dashboard-save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ userId, personalInfo, medicalInfo, extraInfo })
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Medical record successfully updated");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setMessage("Error del servidor: " + data.error);
      }
    } catch (err) {
      setMessage("Error de red: No se pudo conectar con el servidor backend.");
    }
  };

  if (loading) {
    return <div style={{ padding: "50px", textAlign: "center", fontSize: "18px", color: "#2c3e50" }}>Cargando Panel MedResQ...</div>;
  }

  //Genera una inicial del usuario para el "avatar"
  const userInitial = userName ? userName.trim().charAt(0).toUpperCase() : "U";

  //Se añade un estilo para los campos que coinciden con la búsqueda en la barra de búsqueda
  const getFieldStyle = (matches) => ({
    backgroundColor: matches && searchTerm ? "#fffbeb" : "transparent",
    border: matches && searchTerm ? "1px solid #ffc869" : "1px solid transparent",
    borderRadius: "6px",
    padding: "5px",
    transition: "all 0.2s"
  });

  return (
    <div className="dashboard" style={{ fontFamily: "'Segoe UI', Roboto, sans-serif", padding: "20px" }}>
      
      {/* Header que muestra el avatar y la bienvenia */}
      <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          
          <div style={{
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            backgroundColor: "#161b46",
            color: "#ffffff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "22px",
            fontWeight: "700",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            userSelect: "none"
          }}>
            {userInitial}
          </div>

          <div>
            <h2>Welcome {userName}!</h2>
            <p>How is it going today?</p>
          </div>
        </div>

        <button 
          onClick={() => navigate("/profile")}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            padding: "10px 20px",
            borderRadius: "20px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            whiteSpace: "nowrap",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255, 255, 255, 0.25)"}
          onMouseOut={(e) => e.target.style.backgroundColor = "rgba(255, 255, 255, 0.15)"}
        >
            Profile
        </button>
      </div>

      <input 
        className="search" 
        placeholder="Search information..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px" }} 
      />

      <h3>Health Information</h3>

      {/* Pestañas del menú que divide las secciones */}
      <div className="cards" style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
        <div 
          className="card" 
          onClick={() => setActiveTab("personal")} 
          style={{ ...styles.cardTab, borderBottom: activeTab === "personal" ? "4px solid #b2bdff" : "4px solid transparent", fontWeight: activeTab === "personal" ? "bold" : "normal" }}
        >
          Personal Information
        </div>
        <div 
          className="card" 
          onClick={() => setActiveTab("medical")} 
          style={{ ...styles.cardTab, borderBottom: activeTab === "medical" ? "4px solid #b2bdff" : "4px solid transparent", fontWeight: activeTab === "medical" ? "bold" : "normal" }}
        >
          Medical Information
        </div>
        <div 
          className="card" 
          onClick={() => setActiveTab("extra")} 
          style={{ ...styles.cardTab, borderBottom: activeTab === "extra" ? "4px solid #b2bdff" : "4px solid transparent", fontWeight: activeTab === "extra" ? "bold" : "normal" }}
        >
          Extra Information
        </div>
      </div>

      {/* Personalización e los mensajes de notificación */}
      {message && (
        <div style={{ padding: "15px", marginBottom: "25px", borderRadius: "6px", fontWeight: "500", backgroundColor: message.includes("exito") ? "#d4edda" : "#f8d7da", color: message.includes("exito") ? "#14722a" : "#83101b", border: `1px solid ${message.includes("exito") ? "#c3e6cb" : "#f5c6cb"}` }}>
          {message}
        </div>
      )}

      {/* Formulario donde se despliegan los campos */}
      <form onSubmit={handleSave} style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #eef2f5", marginBottom: "30px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
          
          {/* Pestaña: Info personal */}
          {activeTab === "personal" && (
            <>
              <div style={getFieldStyle(matchesSearch(personalInfo.phone_number))}><label style={styles.label}>Phone number *</label><input type="text" required value={personalInfo.phone_number} onChange={(e) => setPersonalInfo({ ...personalInfo, phone_number: e.target.value })} style={styles.input} /></div>
              <div style={getFieldStyle(matchesSearch(personalInfo.address))}><label style={styles.label}>Address *</label><input type="text" required value={personalInfo.address} onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })} style={styles.input} /></div>
              <div style={getFieldStyle(matchesSearch(personalInfo.birth_date))}><label style={styles.label}>Birth of date *</label><input type="date" required value={personalInfo.birth_date} onChange={(e) => setPersonalInfo({ ...personalInfo, birth_date: e.target.value })} style={styles.input} /></div>
              <div style={getFieldStyle(matchesSearch(personalInfo.age))}><label style={styles.label}>Age (Years)</label><input type="number" value={personalInfo.age} onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })} style={styles.input} /></div>
              <div style={getFieldStyle(matchesSearch(personalInfo.gender))}><label style={styles.label}>Gender</label><input type="text" value={personalInfo.gender} onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })} style={styles.input} /></div>
              <div style={getFieldStyle(matchesSearch(personalInfo.marital_status))}><label style={styles.label}>Marital Situation</label><input type="text" value={personalInfo.marital_status} onChange={(e) => setPersonalInfo({ ...personalInfo, marital_status: e.target.value })} style={styles.input} /></div>
              <div style={{ gridColumn: "1 / -1", ...getFieldStyle(matchesSearch(personalInfo.emergency_contact)) }}><label style={styles.label}>Emergency Contacts (Name and Relationship)</label><input type="text" value={personalInfo.emergency_contact} onChange={(e) => setPersonalInfo({ ...personalInfo, emergency_contact: e.target.value })} style={styles.input} /></div>
            </>
          )}

          {/* Pestaña: Info médica */}
          {activeTab === "medical" && (
            <>
              <div style={getFieldStyle(matchesSearch(medicalInfo.blood_type))}><label style={styles.label}>Blood Type</label><input type="text" value={medicalInfo.blood_type} onChange={(e) => setMedicalInfo({ ...medicalInfo, blood_type: e.target.value })} style={styles.input} placeholder="Ej. O+" /></div>
              <div style={getFieldStyle(matchesSearch(medicalInfo.organ_donor_status))}><label style={styles.label}>Organ Donor</label><input type="text" value={medicalInfo.organ_donor_status} onChange={(e) => setMedicalInfo({ ...medicalInfo, organ_donor_status: e.target.value })} style={styles.input} /></div>
              <div style={getFieldStyle(matchesSearch(medicalInfo.health_care_clinic))}><label style={styles.label}>Healthcare Clinic</label><input type="text" value={medicalInfo.health_care_clinic} onChange={(e) => setMedicalInfo({ ...medicalInfo, health_care_clinic: e.target.value })} style={styles.input} /></div>
              <div style={getFieldStyle(matchesSearch(medicalInfo.insurance_number))}><label style={styles.label}>Insurance Number</label><input type="text" value={medicalInfo.insurance_number} onChange={(e) => setMedicalInfo({ ...medicalInfo, insurance_number: e.target.value })} style={styles.input} /></div>
              <div style={getFieldStyle(matchesSearch(medicalInfo.weight))}><label style={styles.label}>Weight (kg)</label><input type="number" step="0.1" value={medicalInfo.weight} onChange={(e) => setMedicalInfo({ ...medicalInfo, weight: e.target.value })} style={styles.input} /></div>
              <div style={getFieldStyle(matchesSearch(medicalInfo.height))}><label style={styles.label}>Height (m)</label><input type="number" step="0.01" value={medicalInfo.height} onChange={(e) => setMedicalInfo({ ...medicalInfo, height: e.target.value })} style={styles.input} /></div>
              <div style={{ gridColumn: "1 / -1", ...getFieldStyle(matchesSearch(medicalInfo.allergies)) }}><label style={styles.label}>Known Allergies</label><textarea value={medicalInfo.allergies} onChange={(e) => setMedicalInfo({ ...medicalInfo, allergies: e.target.value })} style={styles.textarea} /></div>
              <div style={getFieldStyle(matchesSearch(medicalInfo.sleep))}><label style={styles.label}>Dream Hours</label><input type="text" value={medicalInfo.sleep} onChange={(e) => setMedicalInfo({ ...medicalInfo, sleep: e.target.value })} style={styles.input} /></div>
              <div style={getFieldStyle(matchesSearch(medicalInfo.physical_activity))}><label style={styles.label}>Weekly Physical Activity</label><input type="text" value={medicalInfo.physical_activity} onChange={(e) => setMedicalInfo({ ...medicalInfo, physical_activity: e.target.value })} style={styles.input} /></div>
              <div style={{ gridColumn: "1 / -1", ...getFieldStyle(matchesSearch(medicalInfo.symptom_tracking)) }}><label style={styles.label}>Symptom Tracking</label><textarea value={medicalInfo.symptom_tracking} onChange={(e) => setMedicalInfo({ ...medicalInfo, symptom_tracking: e.target.value })} style={styles.textarea} /></div>
            </>
          )}

          {/* Pestaña: Info extra */}
          {activeTab === "extra" && (
            <>
              <div style={{ gridColumn: "1 / -1", ...getFieldStyle(matchesSearch(extraInfo.medications_exact_dosages)) }}><label style={styles.label}>Medications exact dosages</label><textarea value={extraInfo.medications_exact_dosages} onChange={(e) => setExtraInfo({ ...extraInfo, medications_exact_dosages: e.target.value })} style={styles.textarea} /></div>
              <div style={{ gridColumn: "1 / -1", ...getFieldStyle(matchesSearch(extraInfo.medical_conditions_chronic_diseases)) }}><label style={styles.label}>Medical conditions</label><textarea value={extraInfo.medical_conditions_chronic_diseases} onChange={(e) => setExtraInfo({ ...extraInfo, medical_conditions_chronic_diseases: e.target.value })} style={styles.textarea} /></div>
              <div style={{ gridColumn: "1 / -1", ...getFieldStyle(matchesSearch(extraInfo.history_surgeries_procedures)) }}><label style={styles.label}>History of Surgeries and Procedures</label><textarea value={extraInfo.history_surgeries_procedures} onChange={(e) => setExtraInfo({ ...extraInfo, history_surgeries_procedures: e.target.value })} style={styles.textarea} /></div>
              <div style={{ gridColumn: "1 / -1", ...getFieldStyle(matchesSearch(extraInfo.special_medical_instructions)) }}><label style={styles.label}>Special Medical Instructions</label><textarea value={extraInfo.special_medical_instructions} onChange={(e) => setExtraInfo({ ...extraInfo, special_medical_instructions: e.target.value })} style={styles.textarea} /></div>
              <div style={{ gridColumn: "1 / -1", ...getFieldStyle(matchesSearch(extraInfo.recent_test_study_results)) }}><label style={styles.label}>Results of Studies</label><textarea value={extraInfo.recent_test_study_results} onChange={(e) => setExtraInfo({ ...extraInfo, recent_test_study_results: e.target.value })} style={styles.textarea} /></div>
              <div style={getFieldStyle(matchesSearch(extraInfo.lifestyle_information))}><label style={styles.label}>Healthcare Style</label><input type="text" value={extraInfo.lifestyle_information} onChange={(e) => setExtraInfo({ ...extraInfo, lifestyle_information: e.target.value })} style={styles.input} /></div>
              <div style={getFieldStyle(matchesSearch(extraInfo.personal_notes))}><label style={styles.label}>Observations</label><input type="text" value={extraInfo.personal_notes} onChange={(e) => setExtraInfo({ ...extraInfo, personal_notes: e.target.value })} style={styles.input} /></div>
            </>
          )}

        </div>

        <button type="submit" style={styles.submitBtn}>
          Save all the information
        </button>
      </form>

      {/* Tarjeta de MI QR, ubicada antes del Chatbot como se pidió */}
      <div style={styles.qrCard}>
        <h3 style={styles.qrCardTitle}>MI QR</h3>
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`${window.location.origin}/public-profile/${userId}`)}`}
          alt="Mi código QR"
          width={140}
          height={140}
          style={styles.qrCardImage}
        />
        <button
          type="button"
          onClick={() => navigate("/my-qr-code")}
          style={styles.qrCardBtn}
        >
          Ver / Descargar / Compartir
        </button>
      </div>

      {/* Chatbot con la imagen, el área en donde aparecer la respuesta y texto donde el usuario escribe*/}
      <div className="chatbot">
        <div className="chatbot-left">
          <img 
            src={imgRobot} 
            alt="AI Robot" 
            className="chatbot-robot-img" 
          />
          <h4 className="chatbot-title">MedResQ AI Assistant</h4>
        </div>
        
        <div className="chatbot-right">
          {/* Texto de respuesta */}
          <div className="chatbot-response-box">
            <p id="ai-response">
              Hello, ¿How can I help you?
            </p>
          </div>

          {/* Botón y vista para enviar el texto */}
          <div className="chatbot-input-group">
            <input 
              type="text" 
              placeholder="Send a message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button 
              className="primary-btn"
              onClick={async () => {
                if (!message) return;
                const responseEl = document.getElementById("ai-response");
                if (responseEl) responseEl.innerText = "Pensando...";
                try {
                  const res = await fetch(`${API_URL}/api/chatbot`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, prompt: message })
                  });
                  const data = await res.json();
                  if (responseEl) responseEl.innerText = data.response || "Error al obtener respuesta.";
                } catch (err) {
                  if (responseEl) responseEl.innerText = "Error de conexión con la IA.";
                }
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

const styles = {
  cardTab: { padding: "15px 20px", cursor: "pointer", transition: "all 0.2s", borderRadius: "4px" },
  label: { display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600", color: "#34495e" },
  input: { width: "100%", padding: "11px", border: "1px solid #cccccc", borderRadius: "6px", boxSizing: "border-box", fontSize: "14px" },
  textarea: { width: "100%", padding: "11px", border: "1px solid #cccccc", borderRadius: "6px", boxSizing: "border-box", fontSize: "14px", height: "90px", resize: "vertical", fontFamily: "inherit" },
  submitBtn: { display: "block", width: "100%", padding: "15px", backgroundColor: "#0c0d32", color: "#ffffff", fontSize: "16px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 4px 10px rgba(0, 123, 255, 0.2)" },
  qrCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", backgroundColor: "#0c0d32", borderRadius: "10px", padding: "25px", margin: "20px 0", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)" },
  qrCardTitle: { color: "#ffffff", fontSize: "18px", fontWeight: "bold", margin: 0, letterSpacing: "1px" },
  qrCardImage: { backgroundColor: "#ffffff", padding: "10px", borderRadius: "10px" },
  qrCardBtn: { padding: "10px 24px", backgroundColor: "#ffffff", color: "#0c0d32", fontSize: "14px", border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: "bold" }
};