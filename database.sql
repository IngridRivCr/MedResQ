-- MedResQ - Esquema de base de datos
-- Reconstruido a partir de las consultas existentes en backend/server.js
-- Compatible con MySQL 8+ (Aiven for MySQL)

-- Tabla: users
-- Cuenta de acceso del usuario
CREATE TABLE IF NOT EXISTS users (
  user_id       INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(190) NOT NULL,
  password      VARCHAR(255) NOT NULL,   -- se guardará el hash (bcrypt), no texto plano
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;
 
-- Tabla: user_personal_info
-- Información personal (pestaña "Personal Information")

CREATE TABLE IF NOT EXISTS user_personal_info (
  user_id           INT PRIMARY KEY,
  nickname          VARCHAR(100),
  phone_number      VARCHAR(30),
  address           VARCHAR(255),
  birth_date        DATE,
  age               INT,
  gender            VARCHAR(30),
  marital_status    VARCHAR(50),
  emergency_contact VARCHAR(255),
  CONSTRAINT fk_personal_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
 
-- Tabla: user_medical_info
-- Información médica (pestaña "Medical Information")
CREATE TABLE IF NOT EXISTS user_medical_info (
  user_id             INT PRIMARY KEY,
  blood_type          VARCHAR(5),
  allergies            TEXT,
  organ_donor_status   VARCHAR(50),
  health_care_clinic   VARCHAR(150),
  insurance_number     VARCHAR(100),
  weight               DECIMAL(5,2),
  height               DECIMAL(4,2),
  sleep                VARCHAR(50),
  symptom_tracking     TEXT,
  reminders            TEXT,
  physical_activity    VARCHAR(100),
  CONSTRAINT fk_medical_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
 
-- Tabla: user_extra_info
-- Información extra (pestaña "Extra Information")
CREATE TABLE IF NOT EXISTS user_extra_info (
  user_id                               INT PRIMARY KEY,
  current_medications                   TEXT,
  medications_exact_dosages             TEXT,
  medical_conditions_chronic_diseases   TEXT,
  additional_medical_conditions         TEXT,
  history_surgeries_procedures          TEXT,
  special_medical_instructions          TEXT,
  lifestyle_information                 VARCHAR(255),
  recent_test_study_results             TEXT,
  relevant_notes                        TEXT,
  personal_notes                        VARCHAR(255),
  CONSTRAINT fk_extra_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
 
-- Tabla: emergency_contacts
-- Lista de contactos de emergencia 
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  name        VARCHAR(150) NOT NULL,
  phone       VARCHAR(30) NOT NULL,
  relation    VARCHAR(50),
  CONSTRAINT fk_contacts_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE,
  INDEX idx_contacts_user (user_id)
) ENGINE=InnoDB;
 
-- NOTA: en la Etapa 8/9 (implementación del QR) se agregará una tabla
-- adicional (p. ej. qr_sharing_settings) para controlar qué campos
-- autoriza el usuario a mostrar en /public-profile/:id. No se crea
-- todavía para no adelantar esa etapa.
 