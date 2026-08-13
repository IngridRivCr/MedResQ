//Gestiona el perfil del usuario. Permite al usuario modificar los datos
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../services/api";

export default function EditProfile() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  //Estados para los campos que se editan
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");

  //Aquí se guarda TODO lo que viene de la DB para no perderlo
  //Actualiza los datos al guardar el expdiente sin necesidad de reescribir los campos
  const [completeData, setCompleteData] = useState({});

  //Obtiene los datos actuales del usuario y los "rellena" para que el usuario sepa qué info tiene registrada
  useEffect(() => {
    const session = localStorage.getItem("user");
    if (session) {
      try {
        const user = JSON.parse(session);
        const currentUserId = user.user_id || user.id;
        setUserId(currentUserId);
        setUserName(user.name || "");
        setEmail(user.email || "");

        if (currentUserId) {
          fetch(`${API_URL}/api/user/dashboard-complete/${currentUserId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.success && res.data) {
                const d = res.data;
                setCompleteData(d); // Guarda el respaldo de todo el registro de la BD
                setAddress(d.address || "");
                setBirthDate(d.birth_date ? d.birth_date.split("T")[0] : "");
              }
              setLoading(false);
            })
            .catch((err) => {
              console.error("Error al conectar con el servidor:", err);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error("Error al cargar sesión:", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
      navigate("/login");
    }
  }, [navigate]);

  //Guardado de cambios
  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!userId) {
      alert("No valid session found.");
      return;
    }

    try {
      //Actualiza el nombre en el localStorage para que se refleje
      const session = localStorage.getItem("user");
      if (session) {
        const user = JSON.parse(session);
        user.name = userName;
        localStorage.setItem("user", JSON.stringify(user));
      }

      //Envia al backend el "respaldo"
      const response = await fetch(`${API_URL}/api/user/dashboard-save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          userId,
          personalInfo: {
            phone_number: completeData.phone_number || "",
            age: completeData.age || "",
            gender: completeData.gender || "",
            marital_status: completeData.marital_status || "",
            emergency_contact: completeData.emergency_contact || "",
            address: address,
            birth_date: birthDate
          },
          medicalInfo: {
            blood_type: completeData.blood_type || "",
            allergies: completeData.allergies || "",
            organ_donor_status: completeData.organ_donor_status || "",
            health_care_clinic: completeData.health_care_clinic || "",
            insurance_number: completeData.insurance_number || "",
            weight: completeData.weight || "",
            height: completeData.height || "",
            sleep: completeData.sleep || "",
            symptom_tracking: completeData.symptom_tracking || "",
            reminders: completeData.reminders || "",
            physical_activity: completeData.physical_activity || ""
          },
          extraInfo: {
            current_medications: completeData.current_medications || "",
            medications_exact_dosages: completeData.medications_exact_dosages || "",
            medical_conditions_chronic_diseases: completeData.medical_conditions_chronic_diseases || "",
            additional_medical_conditions: completeData.additional_medical_conditions || "",
            history_surgeries_procedures: completeData.history_surgeries_procedures || "",
            special_medical_instructions: completeData.special_medical_instructions || "",
            lifestyle_information: completeData.lifestyle_information || "",
            recent_test_study_results: completeData.recent_test_study_results || "",
            relevant_notes: completeData.relevant_notes || "",
            personal_notes: completeData.personal_notes || ""
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Profile updated successfully!");
        
        //Actualiza el respaldo con los nuevos datos ya modificados
        setCompleteData(prev => ({ ...prev, address, birth_date: birthDate }));

        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setMessage(""), 4000);
      } else {
        alert("Error saving data on backend: " + data.error);
      }
    } catch (err) {
      console.error("Error de red:", err);
      alert("Network error: Could not save changes.");
    }
  };

  if (loading) {
    return <div style={{ padding: "50px", textAlign: "center", fontSize: "18px", color: "#0b0e2d" }}>Loading Profile Data...</div>;
  }

  return (
    <div style={styles.pageBackground}>
      <div style={styles.cardContainer}>
        
        <div onClick={() => navigate("/profile")} style={styles.backButton}>
          &lt;
        </div>

        <h2 style={styles.title}>Edit Profile</h2>

        {message && <div style={styles.successAlert}>{message}</div>}

        <form onSubmit={handleSave} style={{ width: "100%" }}>
          <div style={styles.formGrid}>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                disabled 
                style={{ ...styles.input, backgroundColor: "#f0f2f5", cursor: "not-allowed" }} 
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Birth of Date</label>
              <input 
                type="date" 
                value={birthDate} 
                onChange={(e) => setBirthDate(e.target.value)} 
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Address</label>
              <input 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                style={styles.input}
              />
            </div>

          </div>

          <button type="submit" style={styles.submitBtn}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageBackground: {
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    backgroundColor: "#f4f6f9",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    boxSizing: "border-box"
  },
  cardContainer: {
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
    marginBottom: "30px",
    marginTop: "10px"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    width: "100%",
    marginBottom: "10px"
  },
  inputGroup: {
    width: "100%"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#34495e"
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #cccccc",
    borderRadius: "8px",
    boxSizing: "border-box",
    fontSize: "15px",
    outline: "none"
  },
  submitBtn: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#0b0e2d",
    color: "#ffffff",
    fontSize: "16px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "25px",
    transition: "background-color 0.2s"
  },
  successAlert: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#d4edda",
    color: "#155724",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
    fontWeight: "500"
  }
};