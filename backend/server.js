//Es el intermediario entre lo que el usuario hace en la pantalla y la info q está guaraa en la DB

//Librerías
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";
import Groq from "groq-sdk";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

//Cliente de Groq para el chatbot (reemplaza a Ollama, que no puede desplegarse)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

//La conexión a la base de datos (ahora en la nube, Aiven) vive en db.js
//db.js ya se conecta e imprime el mensaje de éxito/error al arrancar el servidor

//Middleware de autenticación: exige un token válido y que el usuario solo
//pueda acceder/modificar SU PROPIA información (corrige incidencia INC-04)
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ success: false, message: "Sesión requerida. Inicia sesión de nuevo." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Sesión inválida o expirada. Inicia sesión de nuevo." });
    }
    req.tokenUserId = String(decoded.user_id);
    next();
  });
}

//Verifica que el userId de la URL/body coincida con el dueño del token
function verifyOwnership(req, res, next) {
  const requestedId = String(req.params.userId || req.body.userId || "");
  if (requestedId !== req.tokenUserId) {
    return res.status(403).json({ success: false, message: "No tienes permiso para acceder a la información de otro usuario." });
  }
  next();
}

//Endpoints 

//Inicio de Sesión (Sign In)
//Valida al usuario para entrar al sistema
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Todos los campos son requeridos." });
  }

  const sql = "SELECT user_id, name, email, password FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Error en Login:", err);
      return res.status(500).json({ success: false, error: err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "El correo electrónico no está registrado." });
    }

    const user = results[0];

    const passwordCorrecta = await bcrypt.compare(password, user.password);
    if (!passwordCorrecta) {
      return res.status(401).json({ success: false, message: "Contraseña incorrecta." });
    }

    //Genera el token de sesión (válido 7 días)
    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Bienvenido de nuevo",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email
      }
    });
  });
});

//Registro de Usuario (Sign Up)
//Crea usuarios nuevos y el expediente inicial
app.post("/register", async (req, res) => {
  const name = req.body.name || req.body.username; 
  const { email, password } = req.body;

  console.log("Datos recibidos en el backend:", { name, email });

  if (!name || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Todos los campos son requeridos. Asegúrate de enviar name/username, email y password." 
    });
  }

  //Hashea la contraseña antes de guardarla (nunca en texto plano)
  const hashedPassword = await bcrypt.hash(password, 10);

  const sqlInsert = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sqlInsert, [name, email, hashedPassword], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ success: false, message: "Este correo electrónico ya está registrado." });
      }
      console.error("Error en Registro:", err);
      return res.status(500).json({ success: false, error: err.message });
    }

    const newUserId = result.insertId;

    const sqlPersonal = "INSERT INTO user_personal_info (user_id, phone_number, address, birth_date) VALUES (?, '', '', '2000-01-01')";
    const sqlMedical = "INSERT INTO user_medical_info (user_id) VALUES (?)";
    const sqlExtra = "INSERT INTO user_extra_info (user_id) VALUES (?)";

    db.query(sqlPersonal, [newUserId], (errPersonal) => {
      if (errPersonal) {
        console.error("Error al inicializar Info Personal:", errPersonal);
        return res.status(500).json({ success: false, error: "Error al crear perfil personal básico." });
      }

      db.query(sqlMedical, [newUserId], (errMedical) => {
        if (errMedical) {
          console.error("Error al inicializar Info Médica:", errMedical);
          return res.status(500).json({ success: false, error: "Error al crear perfil médico básico." });
        }

        db.query(sqlExtra, [newUserId], (errExtra) => {
          if (errExtra) {
            console.error("Error al inicializar Info Extra:", errExtra);
            return res.status(500).json({ success: false, error: "Error al crear perfil extra básico." });
          }

          res.status(201).json({
            success: true,
            message: "Usuario registrado y perfiles inicializados con éxito",
            user: { user_id: newUserId, name, email }
          });
        });
      });
    });
  });
});

//Carga del expediente 
//Muestra toda la info médica del usuario al entrar al perfil
app.get("/api/user/dashboard-complete/:userId", verifyToken, verifyOwnership, (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      u.user_id, u.name, u.email,
      p.age, p.gender, p.marital_status, p.phone_number, p.address, p.birth_date, p.emergency_contact, p.nickname,
      m.blood_type, m.allergies, m.organ_donor_status, m.health_care_clinic, m.insurance_number, m.weight, m.height, m.sleep, m.symptom_tracking, m.reminders, m.physical_activity,
      e.current_medications, e.medications_exact_dosages, e.medical_conditions_chronic_diseases, e.additional_medical_conditions, e.history_surgeries_procedures, e.special_medical_instructions, e.lifestyle_information, e.recent_test_study_results, e.relevant_notes, e.personal_notes
    FROM users u
    LEFT JOIN user_personal_info p ON u.user_id = p.user_id
    LEFT JOIN user_medical_info m ON u.user_id = m.user_id
    LEFT JOIN user_extra_info e ON u.user_id = e.user_id
    WHERE u.user_id = ?;
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error en GET dashboard-complete:", err);
      return res.status(500).json({ success: false, error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    res.status(200).json({ success: true, data: results[0] });
  });
});

//Actualiza los datos cuando el usuario guarda los cambios en su perfil
app.post("/api/user/dashboard-save", verifyToken, verifyOwnership, (req, res) => {
  const { userId, personalInfo, medicalInfo, extraInfo } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "El ID de usuario es requerido" });
  }

  const sqlPersonal = `
    INSERT INTO user_personal_info (user_id, phone_number, address, birth_date, age, gender, marital_status, emergency_contact)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      phone_number = VALUES(phone_number), address = VALUES(address), birth_date = VALUES(birth_date),
      age = VALUES(age), gender = VALUES(gender), marital_status = VALUES(marital_status), emergency_contact = VALUES(emergency_contact);
  `;

  const sqlMedical = `
    INSERT INTO user_medical_info (user_id, blood_type, allergies, organ_donor_status, health_care_clinic, insurance_number, weight, height, sleep, symptom_tracking, reminders, physical_activity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      blood_type = VALUES(blood_type), allergies = VALUES(allergies), organ_donor_status = VALUES(organ_donor_status),
      health_care_clinic = VALUES(health_care_clinic), insurance_number = VALUES(insurance_number), weight = VALUES(weight),
      height = VALUES(height), sleep = VALUES(sleep), symptom_tracking = VALUES(symptom_tracking), reminders = VALUES(reminders), physical_activity = VALUES(physical_activity);
  `;

  const sqlExtra = `
    INSERT INTO user_extra_info (user_id, current_medications, medications_exact_dosages, medical_conditions_chronic_diseases, additional_medical_conditions, history_surgeries_procedures, special_medical_instructions, lifestyle_information, recent_test_study_results, relevant_notes, personal_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      current_medications = VALUES(current_medications), medications_exact_dosages = VALUES(medications_exact_dosages),
      medical_conditions_chronic_diseases = VALUES(medical_conditions_chronic_diseases), additional_medical_conditions = VALUES(additional_medical_conditions),
      history_surgeries_procedures = VALUES(history_surgeries_procedures), special_medical_instructions = VALUES(special_medical_instructions),
      lifestyle_information = VALUES(lifestyle_information), recent_test_study_results = VALUES(recent_test_study_results), relevant_notes = VALUES(relevant_notes), personal_notes = VALUES(personal_notes);
  `;

  db.query(sqlPersonal, [userId, personalInfo.phone_number, personalInfo.address, personalInfo.birth_date, personalInfo.age || null, personalInfo.gender || null, personalInfo.marital_status || null, personalInfo.emergency_contact || null], (err) => {
    if (err) return res.status(500).json({ success: false, error: "Error al guardar Info Personal: " + err.message });

    db.query(sqlMedical, [userId, medicalInfo.blood_type || null, medicalInfo.allergies || null, medicalInfo.organ_donor_status || null, medicalInfo.health_care_clinic || null, medicalInfo.insurance_number || null, medicalInfo.weight || null, medicalInfo.height || null, medicalInfo.sleep || null, medicalInfo.symptom_tracking || null, medicalInfo.reminders || null, medicalInfo.physical_activity || null], (err) => {
      if (err) return res.status(500).json({ success: false, error: "Error al guardar Info Médica: " + err.message });

      db.query(sqlExtra, [userId, extraInfo.current_medications || null, extraInfo.medications_exact_dosages || null, extraInfo.medical_conditions_chronic_diseases || null, extraInfo.additional_medical_conditions || null, extraInfo.history_surgeries_procedures || null, extraInfo.special_medical_instructions || null, extraInfo.lifestyle_information || null, extraInfo.recent_test_study_results || null, extraInfo.relevant_notes || null, extraInfo.personal_notes || null], (err) => {
        if (err) return res.status(500).json({ success: false, error: "Error al guardar Info Extra: " + err.message });

        res.status(200).json({ success: true, message: "Expediente unificado guardado en MedResQ con éxito" });
      });
    });
  });
});

//Emergency contacts

//Mantiene una lista de contactos de manera actualizada
app.get("/api/user/emergency-contacts/:userId", verifyToken, verifyOwnership, (req, res) => {
  const { userId } = req.params;
  const sql = "SELECT id, name, phone, relation FROM emergency_contacts WHERE user_id = ?";
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error al obtener contactos desde la tabla:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, contacts: results });
  });
});

//Guarda la lista de los contactos sincronizada con la tabla de MySQL
app.post("/api/user/emergency-contacts-save", verifyToken, verifyOwnership, (req, res) => {
  const { userId, contacts } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "ID de usuario requerido" });
  }

  //Limpia los registros asociados al usuario para evitar duplicaciones
  db.query("DELETE FROM emergency_contacts WHERE user_id = ?", [userId], (deleteErr) => {
    if (deleteErr) {
      console.error("Error al limpiar contactos antiguos:", deleteErr);
      return res.status(500).json({ success: false, error: deleteErr.message });
    }
    if (!contacts || contacts.length === 0) {
      return res.status(200).json({ success: true, message: "Contactos actualizados con éxito (lista vacía)" });
    }

    //Estructura la matriz para la combinación múltiple simultánea de SQL
    const sqlInsert = "INSERT INTO emergency_contacts (user_id, name, phone, relation) VALUES ?";
    const valuesMatrix = contacts.map(c => [userId, c.name, c.phone, c.relation]);

    db.query(sqlInsert, [valuesMatrix], (insertErr) => {
      if (insertErr) {
        console.error("ERROR CRÍTICO EN LA BASE DE DATOS (INSERT):", insertErr);
        return res.status(500).json({ success: false, error: "Error en la base de datos: " + insertErr.message });
      }
      
      console.log(`Contactos guardados exitosamente para el usuario ${userId}`);
      res.status(200).json({ success: true, message: "Contactos de emergencia guardados correctamente en la tabla" });
    });
  });
});

//Guarda y actualiza la información del perfil el usuario
app.post("/api/user/update-profile-extended", verifyToken, verifyOwnership, (req, res) => {
  const { userId, fullName, age, gender, city } = req.body; 

  if (!userId) {
    return res.status(400).json({ success: false, message: "ID de usuario requerido" });
  }

  const sqlPersonal = `
    INSERT INTO user_personal_info (user_id, nickname, age, address, phone_number, birth_date)
    VALUES (?, ?, ?, ?, '', '2000-01-01')
    ON DUPLICATE KEY UPDATE nickname = VALUES(nickname), age = VALUES(age), address = VALUES(address);
  `;
  
  db.query(sqlPersonal, [userId, fullName, age || null, city], (err1) => {
    if (err1) {
      console.error("Error actualizando user_personal_info:", err1);
      return res.status(500).json({ success: false, error: err1.message });
    }

    const sqlMedical = `
      INSERT INTO user_medical_info (user_id, blood_type)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE blood_type = VALUES(blood_type);
    `;

    db.query(sqlMedical, [userId, gender], (err2) => {
      if (err2) {
        console.error("Error actualizando el tipo de sangre en user_medical_info:", err2);
        return res.status(500).json({ success: false, error: err2.message });
      }
      
      res.status(200).json({ success: true, message: "Perfil extendido médico actualizado con éxito" });
    });
  });
});

//Perfil público (lo que se muestra al escanear el QR)
//Antes este endpoint no existía, por eso el QR no llevaba a ningún lado
app.get("/api/public-profile/:id", (req, res) => {
  const { id } = req.params;

  const sqlProfile = `
    SELECT
      u.name,
      p.birth_date,
      m.blood_type,
      m.allergies,
      e.medical_conditions_chronic_diseases,
      e.current_medications,
      e.relevant_notes
    FROM users u
    LEFT JOIN user_personal_info p ON u.user_id = p.user_id
    LEFT JOIN user_medical_info m ON u.user_id = m.user_id
    LEFT JOIN user_extra_info e ON u.user_id = e.user_id
    WHERE u.user_id = ?;
  `;

  db.query(sqlProfile, [id], (err, profileResults) => {
    if (err) {
      console.error("Error en GET public-profile:", err);
      return res.status(500).json({ error: err.message });
    }

    if (profileResults.length === 0) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }

    const profile = profileResults[0];

    //Los contactos de emergencia se piden aparte y se renombran los campos
    //para que coincidan con lo que ya espera PublicProfile.jsx
    const sqlContacts = "SELECT name, phone, relation FROM emergency_contacts WHERE user_id = ?";
    db.query(sqlContacts, [id], (errContacts, contactResults) => {
      if (errContacts) {
        console.error("Error al obtener contactos del perfil público:", errContacts);
        return res.status(500).json({ error: errContacts.message });
      }

      const contacts = contactResults.map((c) => ({
        contact_name: c.name,
        phone: c.phone,
        relationship: c.relation
      }));

      res.status(200).json({
        name: profile.name,
        birth_date: profile.birth_date,
        blood_type: profile.blood_type,
        allergies: profile.allergies,
        medical_conditions_chronic_diseases: profile.medical_conditions_chronic_diseases,
        current_medications: profile.current_medications,
        notes: profile.relevant_notes,
        contacts
      });
    });
  });
});

//Chatbot de la IA
//Antes usaba Ollama corriendo en localhost (no funciona una vez desplegado); ahora usa Groq
app.post("/api/chatbot", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "TU IDENTIDAD: Eres el Chatbot del sistema MedResQ, el asistente médico oficial del sistema. NUNCA menciones que eres una IA, un modelo de lenguaje o Llama/Groq. Si te preguntan quién eres, responde que eres el asistente virtual de MedResQ. Tu tono debe ser médico, profesional, breve y directo. IMPORTANTE: NO eres médico. Tu única función es orientar al usuario sobre procesos de triaje. Siempre aclara que no sustituyes una consulta médica y que en caso de emergencia debe buscar ayuda profesional inmediata. Sé breve, profesional y directo."
        },
        { role: "user", content: prompt }
      ]
    });

    const respuestaFinal = response.choices[0].message.content;
    res.json({ success: true, response: respuestaFinal });

  } catch (error) {
    console.error("Error al conectar con Groq:", error);
    res.status(500).json({ success: false, error: "Servidor de IA no disponible" });
  }
});

//Mantiene el servidor activo cuando ek navegaor le envíe cualquier petición
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});